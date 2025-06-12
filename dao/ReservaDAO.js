const { pool, query } = require('../config/database');

class ReservaDAO {
  async listar() {
    return query('SELECT * FROM RESERVA');
  }

  async remover(id) {
    await query('DELETE FROM RESERVA WHERE id_reserva = ?', [id]);
  }

  async inserirReserva(data, conn) {
    const { restauranteId, mesaId, clienteId, horario, numPessoas, localizacao, valorTotal } = data;
    const [r] = await conn.execute(
      `INSERT INTO RESERVA (restaurante_id, mesa_id, cliente_id, data_hora, horario,
          num_pessoas, preferencia_localizacao, valor_total, status_pagamento)
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, 'PENDENTE')`,
      [restauranteId, mesaId, clienteId, horario, numPessoas, localizacao, valorTotal]
    );
    return r.insertId;
  }

  async inserirPagamento(reservaId, valor, status, conn) {
    await conn.execute(
      `INSERT INTO PAGAMENTO (reserva_id, valor, metodo, status, data_processamento)
       VALUES (?, ?, 'CARTAO', ?, NOW())`,
      [reservaId, valor, status]
    );
  }

  async atualizarStatus(reservaId, status, conn) {
    await conn.execute('UPDATE RESERVA SET status_pagamento = ? WHERE id_reserva = ?', [status, reservaId]);
  }

  async buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao, conn) {
    const [rows] = await conn.execute(
      `SELECT m.id_mesa FROM MESA m
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

  async verificarMesaDisponivel(mesaId, restauranteId, horario, numPessoas, conn) {
    const [rows] = await conn.execute(
      `SELECT 1
         FROM MESA m
        WHERE m.id_mesa = ?
          AND m.restaurante_id = ?
          AND m.capacidade >= ?
          AND m.id_mesa NOT IN (
            SELECT mesa_id FROM RESERVA
             WHERE restaurante_id = ? AND horario = ? AND status_pagamento = 'PAGO'
          )`,
      [mesaId, restauranteId, numPessoas, restauranteId, horario]
    );
    return rows.length > 0;
  }
}

module.exports = new ReservaDAO();
