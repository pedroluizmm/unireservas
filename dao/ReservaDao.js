const db = require('../config/db');

class ReservaDao {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM RESERVA');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM RESERVA WHERE id_reserva=?', [id]);
    return rows[0];
  }

  static async create(reserva) {
    const [result] = await db.query(
      'INSERT INTO RESERVA (restaurante_id, mesa_id, cliente_id, data_hora, horario, num_pessoas, preferencia_localizacao, valor_total, status_pagamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [reserva.restauranteId, reserva.mesaId, reserva.clienteId, reserva.dataHora, reserva.horario, reserva.numPessoas, reserva.preferenciaLocalizacao, reserva.valorTotal, reserva.statusPagamento]
    );
    return { id: result.insertId, ...reserva };
  }

  static async updateStatus(id, status) {
    await db.query('UPDATE RESERVA SET status_pagamento=? WHERE id_reserva=?', [status, id]);
  }

  static async delete(id) {
    await db.query('DELETE FROM RESERVA WHERE id_reserva=?', [id]);
  }
}

module.exports = ReservaDao;
