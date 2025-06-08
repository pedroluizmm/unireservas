const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.example' });

const app = express();
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

// CRUD Clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM CLIENTE', []);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar clientes' });
  }
});

app.post('/api/clientes', async (req, res) => {
  const { nome, telefone, email } = req.body;
  try {
    const result = await query(
      'INSERT INTO CLIENTE (nome, telefone, email) VALUES (?, ?, ?)',
      [nome, telefone, email]
    );
    res.json({ id: result.insertId, nome, telefone, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar cliente' });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
  const { nome, telefone, email } = req.body;
  const id = req.params.id;
  try {
    await query(
      'UPDATE CLIENTE SET nome = ?, telefone = ?, email = ? WHERE id_cliente = ?',
      [nome, telefone, email, id]
    );
    res.json({ id, nome, telefone, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar cliente' });
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await query('DELETE FROM CLIENTE WHERE id_cliente = ?', [id]);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover cliente' });
  }
});

// CRUD Restaurantes
app.get('/api/restaurantes', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM RESTAURANTE', []);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar restaurantes' });
  }
});

app.post('/api/restaurantes', async (req, res) => {
  const { nome, endereco, horarios } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      'INSERT INTO RESTAURANTE (nome, endereco) VALUES (?, ?)',
      [nome, endereco]
    );
    const restauranteId = result.insertId;
    if (Array.isArray(horarios)) {
      for (const h of horarios) {
        await connection.execute(
          'INSERT INTO HORARIO_RESTAURANTE (restaurante_id, horario) VALUES (?, ?)',
          [restauranteId, h]
        );
      }
    }
    await connection.commit();
    res.json({ id: restauranteId, nome, endereco });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar restaurante' });
  } finally {
    connection.release();
  }
});

app.put('/api/restaurantes/:id', async (req, res) => {
  const { nome, endereco, horarios } = req.body;
  const id = req.params.id;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      'UPDATE RESTAURANTE SET nome = ?, endereco = ? WHERE id_restaurante = ?',
      [nome, endereco, id]
    );
    await connection.execute('DELETE FROM HORARIO_RESTAURANTE WHERE restaurante_id = ?', [id]);
    if (Array.isArray(horarios)) {
      for (const h of horarios) {
        await connection.execute(
          'INSERT INTO HORARIO_RESTAURANTE (restaurante_id, horario) VALUES (?, ?)',
          [id, h]
        );
      }
    }
    await connection.commit();
    res.json({ id, nome, endereco });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar restaurante' });
  } finally {
    connection.release();
  }
});

app.delete('/api/restaurantes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await query('DELETE FROM RESTAURANTE WHERE id_restaurante = ?', [id]);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover restaurante' });
  }
});

// Get horarios
app.get('/api/horarios', async (req, res) => {
  const { restauranteId } = req.query;
  try {
    const rows = await query('SELECT * FROM HORARIO_RESTAURANTE WHERE restaurante_id = ?', [restauranteId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar horários' });
  }
});

async function buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao, connection) {
  const params = [restauranteId, numPessoas, localizacao, localizacao, restauranteId, horario];
  const [rows] = await connection.execute(
    `SELECT id_mesa FROM MESA m
     WHERE m.restaurante_id = ?
       AND m.capacidade >= ?
       AND (? IS NULL OR m.localizacao = ?)
       AND m.id_mesa NOT IN (
         SELECT mesa_id FROM RESERVA
         WHERE restaurante_id = ? AND horario = ? AND status_pagamento IN ('PAGO','PENDENTE')
       )
     ORDER BY m.capacidade LIMIT 1`,
    params
  );
  return rows.length ? rows[0].id_mesa : null;
}

app.post('/api/verificar-disponibilidade', async (req, res) => {
  const { restauranteId, horario, numPessoas, localizacao } = req.body;
  const connection = await pool.getConnection();
  try {
    const mesaId = await buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao, connection);
    res.json({ disponivel: !!mesaId, mesaId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao verificar disponibilidade' });
  } finally {
    connection.release();
  }
});

app.post('/api/criar-reserva', async (req, res) => {
  const { clienteId, restauranteId, horario, numPessoas, localizacao, valorTotal, cartaoNumero } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const mesaId = await buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao, connection);
    if (!mesaId) {
      await connection.rollback();
      return res.json({ sucesso: false, mensagem: 'Mesa indisponível' });
    }

    const [resReserva] = await connection.execute(
      `INSERT INTO RESERVA (restaurante_id, mesa_id, cliente_id, data_hora, horario, num_pessoas, preferencia_localizacao, valor_total, status_pagamento)
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, 'PENDENTE')`,
      [restauranteId, mesaId, clienteId, horario, numPessoas, localizacao, valorTotal]
    );
    const reservaId = resReserva.insertId;

    const pagamentoStatus = cartaoNumero && cartaoNumero.startsWith('4') ? 'APROVADO' : 'FALHA';

    await connection.execute(
      `INSERT INTO PAGAMENTO (reserva_id, valor, metodo, status, data_processamento)
       VALUES (?, ?, 'CARTAO', ?, NOW())`,
      [reservaId, valorTotal, pagamentoStatus]
    );

    const novoStatus = pagamentoStatus === 'APROVADO' ? 'PAGO' : 'FALHA';
    await connection.execute('UPDATE RESERVA SET status_pagamento = ? WHERE id_reserva = ?', [novoStatus, reservaId]);

    if (pagamentoStatus === 'FALHA') {
      await connection.rollback();
      return res.json({ sucesso: false, mensagem: 'Pagamento recusado' });
    }

    await connection.commit();
    res.json({ sucesso: true, mesaId });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar reserva' });
  } finally {
    connection.release();
  }
});

app.get('/api/reservas', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM RESERVA', []);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar reservas' });
  }
});

app.get('/api/pagamentos', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM PAGAMENTO', []);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar pagamentos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

