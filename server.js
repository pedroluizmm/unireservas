// server.js

const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // carregue variáveis de .env

const app = express();
app.use(express.json());
// Serve arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// cria pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// helper para consultas simples
async function query(sql, params = []) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}

// validações básicas
function validaEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}
function validaTelefone(telefone) {
  return /^\d{8,}$/.test(telefone);
}
function validaLocalizacao(loc) {
  return ['interna', 'externa'].includes(String(loc).toLowerCase());
}

// =========================
// CRUD Cliente
// =========================

app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await query('SELECT * FROM CLIENTE');
    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar clientes' });
  }
});

app.post('/api/clientes', async (req, res) => {
  const { nome, telefone, email } = req.body;
  if (!nome || !telefone || !email) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }
  if (!validaEmail(email) || !validaTelefone(telefone)) {
    return res.status(400).json({ message: 'Formato inválido para telefone ou e-mail' });
  }
  try {
    const result = await query(
      'INSERT INTO CLIENTE (nome, telefone, email) VALUES (?, ?, ?)',
      [nome, telefone, email]
    );
    res.status(201).json({
      id_cliente: result.insertId,
      nome,
      telefone,
      email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar cliente' });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
  const { nome, telefone, email } = req.body;
  const id = req.params.id;
  if (!nome || !telefone || !email) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }
  if (!validaEmail(email) || !validaTelefone(telefone)) {
    return res.status(400).json({ message: 'Formato inválido para telefone ou e-mail' });
  }
  try {
    await query(
      'UPDATE CLIENTE SET nome = ?, telefone = ?, email = ? WHERE id_cliente = ?',
      [nome, telefone, email, id]
    );
    res.json({
      id_cliente: id,
      nome,
      telefone,
      email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar cliente' });
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await query('DELETE FROM CLIENTE WHERE id_cliente = ?', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover cliente' });
  }
});

// =========================
// CRUD Restaurante
// =========================

app.get('/api/restaurantes', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM RESTAURANTE');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar restaurantes' });
  }
});

app.post('/api/restaurantes', async (req, res) => {
  const { nome, endereco, horarios } = req.body;
  if (!nome || !endereco) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.execute(
      'INSERT INTO RESTAURANTE (nome, endereco) VALUES (?, ?)',
      [nome, endereco]
    );
    const id_restaurante = r.insertId;
    if (Array.isArray(horarios)) {
      for (const h of horarios) {
        await conn.execute(
          'INSERT INTO HORARIO_RESTAURANTE (restaurante_id, horario) VALUES (?, ?)',
          [id_restaurante, h]
        );
      }
    }
    await conn.commit();
    res.status(201).json({ id_restaurante, nome, endereco });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar restaurante' });
  } finally {
    conn.release();
  }
});

app.put('/api/restaurantes/:id', async (req, res) => {
  const { nome, endereco, horarios } = req.body;
  const id_restaurante = req.params.id;
  if (!nome || !endereco) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      'UPDATE RESTAURANTE SET nome = ?, endereco = ? WHERE id_restaurante = ?',
      [nome, endereco, id_restaurante]
    );
    await conn.execute(
      'DELETE FROM HORARIO_RESTAURANTE WHERE restaurante_id = ?',
      [id_restaurante]
    );
    if (Array.isArray(horarios)) {
      for (const h of horarios) {
        await conn.execute(
          'INSERT INTO HORARIO_RESTAURANTE (restaurante_id, horario) VALUES (?, ?)',
          [id_restaurante, h]
        );
      }
    }
    await conn.commit();
    res.json({ id_restaurante, nome, endereco });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar restaurante' });
  } finally {
    conn.release();
  }
});

app.delete('/api/restaurantes/:id', async (req, res) => {
  const id_restaurante = req.params.id;
  try {
    await query('DELETE FROM RESTAURANTE WHERE id_restaurante = ?', [id_restaurante]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover restaurante' });
  }
});

// =========================
// CRUD Mesa
// =========================

app.get('/api/mesas', async (req, res) => {
  const { restauranteId } = req.query;
  const sql = restauranteId
    ? 'SELECT * FROM MESA WHERE restaurante_id = ?'
    : 'SELECT * FROM MESA';
  const params = restauranteId ? [restauranteId] : [];
  try {
    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar mesas' });
  }
});

app.post('/api/mesas', async (req, res) => {
  const { restauranteId, capacidade, localizacao } = req.body;
  if (!restauranteId || capacidade == null || !localizacao) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }
  if (!validaLocalizacao(localizacao)) {
    return res.status(400).json({ message: 'Localização inválida' });
  }
  try {
    const result = await query(
      'INSERT INTO MESA (restaurante_id, capacidade, localizacao) VALUES (?, ?, ?)',
      [restauranteId, capacidade, localizacao]
    );
    res.status(201).json({
      id_mesa: result.insertId,
      restauranteId,
      capacidade,
      localizacao
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar mesa' });
  }
});

app.put('/api/mesas/:id', async (req, res) => {
  const { capacidade, localizacao } = req.body;
  const id_mesa = req.params.id;
  if (capacidade == null || !localizacao) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }
  if (!validaLocalizacao(localizacao)) {
    return res.status(400).json({ message: 'Localização inválida' });
  }
  try {
    await query(
      'UPDATE MESA SET capacidade = ?, localizacao = ? WHERE id_mesa = ?',
      [capacidade, localizacao, id_mesa]
    );
    res.json({ id_mesa, capacidade, localizacao });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar mesa' });
  }
});

app.delete('/api/mesas/:id', async (req, res) => {
  const id_mesa = req.params.id;
  try {
    await query('DELETE FROM MESA WHERE id_mesa = ?', [id_mesa]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover mesa' });
  }
});

// =========================
// Horários de Restaurante
// =========================

app.get('/api/horarios', async (req, res) => {
  const { restauranteId } = req.query;
  if (!restauranteId) {
    return res.status(400).json({ message: 'restauranteId é obrigatório' });
  }
  try {
    const rows = await query(
      'SELECT * FROM HORARIO_RESTAURANTE WHERE restaurante_id = ?',
      [restauranteId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar horários' });
  }
});

// reutilitário para disponibilidade
async function buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao, conn) {
  const [rows] = await conn.execute(
    `SELECT m.id_mesa
     FROM MESA m
     WHERE m.restaurante_id = ?
       AND m.capacidade >= ?
       AND m.localizacao = ?
       AND m.id_mesa NOT IN (
         SELECT mesa_id FROM RESERVA
         WHERE restaurante_id = ? AND horario = ? AND status_pagamento = 'PAGO'
       )
     ORDER BY m.capacidade
     LIMIT 1`,
    [restauranteId, numPessoas, localizacao, restauranteId, horario]
  );
  return rows.length ? rows[0].id_mesa : null;
}

// =========================
// Verificar Disponibilidade
// =========================

app.post('/api/verificar-disponibilidade', async (req, res) => {
  const { restauranteId, horario, numPessoas, localizacao } = req.body;
  if (!restauranteId || !horario || numPessoas == null || !localizacao) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }
  if (!validaLocalizacao(localizacao)) {
    return res.status(400).json({ message: 'Localização inválida' });
  }
  const conn = await pool.getConnection();
  try {
    const mesaId = await buscarMesaDisponivel(
      restauranteId, horario, numPessoas, localizacao, conn
    );
    res.json({ disponivel: !!mesaId, mesaId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao verificar disponibilidade' });
  } finally {
    conn.release();
  }
});

// =========================
// Criar Reserva + Pagamento
// =========================

app.post('/api/criar-reserva', async (req, res) => {
  const { clienteId, restauranteId, horario, numPessoas, localizacao, valorTotal, cartaoNumero } = req.body;
  if (!clienteId || !restauranteId || !horario || numPessoas == null || valorTotal == null) {
    return res.status(400).json({ sucesso: false, mensagem: 'Dados incompletos' });
  }
  if (!validaLocalizacao(localizacao)) {
    return res.status(400).json({ sucesso: false, mensagem: 'Localização inválida' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const mesaId = await buscarMesaDisponivel(
      restauranteId, horario, numPessoas, localizacao, conn
    );
    if (!mesaId) {
      await conn.rollback();
      return res.status(400).json({ sucesso: false, mensagem: 'Mesa indisponível' });
    }

    const [r] = await conn.execute(
      `INSERT INTO RESERVA
         (restaurante_id, mesa_id, cliente_id, data_hora, horario,
          num_pessoas, preferencia_localizacao, valor_total, status_pagamento)
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, 'PENDENTE')`,
      [restauranteId, mesaId, clienteId, horario, numPessoas, localizacao, valorTotal]
    );
    const reservaId = r.insertId;

    const statusPag = cartaoNumero.startsWith('4') ? 'APROVADO' : 'FALHA';
    await conn.execute(
      `INSERT INTO PAGAMENTO
         (reserva_id, valor, metodo, status, data_processamento)
       VALUES (?, ?, 'CARTAO', ?, NOW())`,
      [reservaId, valorTotal, statusPag]
    );

    const novoStatus = statusPag === 'APROVADO' ? 'PAGO' : 'FALHA';
    await conn.execute(
      'UPDATE RESERVA SET status_pagamento = ? WHERE id_reserva = ?',
      [novoStatus, reservaId]
    );

    if (statusPag === 'FALHA') {
      await conn.rollback();
      return res.status(402).json({ sucesso: false, mensagem: 'Pagamento recusado' });
    }

    await conn.commit();
    res.status(201).json({ sucesso: true, mesaId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar reserva' });
  } finally {
    conn.release();
  }
});

// =========================
// CRUD Reserva
// =========================

app.get('/api/reservas', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM RESERVA');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar reservas' });
  }
});

app.put('/api/reservas/:id', async (req, res) => {
  const { horario, numPessoas, preferencia_localizacao, status_pagamento } = req.body;
  const id_reserva = req.params.id;
  if (!horario && numPessoas == null && !preferencia_localizacao && !status_pagamento) {
    return res.status(400).json({ message: 'Nada para atualizar' });
  }
  try {
    await query(
      `UPDATE RESERVA
         SET horario = COALESCE(?, horario),
             num_pessoas = COALESCE(?, num_pessoas),
             preferencia_localizacao = COALESCE(?, preferencia_localizacao),
             status_pagamento = COALESCE(?, status_pagamento)
       WHERE id_reserva = ?`,
      [horario, numPessoas, preferencia_localizacao, status_pagamento, id_reserva]
    );
    res.json({
      id_reserva,
      horario,
      numPessoas,
      preferencia_localizacao,
      status_pagamento
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar reserva' });
  }
});

app.delete('/api/reservas/:id', async (req, res) => {
  const id_reserva = req.params.id;
  try {
    await query('DELETE FROM RESERVA WHERE id_reserva = ?', [id_reserva]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover reserva' });
  }
});

// =========================
// Listar Pagamentos
// =========================

app.get('/api/pagamentos', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM PAGAMENTO');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar pagamentos' });
  }
});

// =========================
// Inicialização do servidor
// =========================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
