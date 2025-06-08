const db = require('../config/db');

class PagamentoDao {
  static async findByReserva(reservaId) {
    const [rows] = await db.query('SELECT * FROM PAGAMENTO WHERE reserva_id=?', [reservaId]);
    return rows[0];
  }

  static async create(pagamento) {
    const [result] = await db.query(
      'INSERT INTO PAGAMENTO (reserva_id, valor, metodo, status, data_processamento) VALUES (?, ?, ?, ?, ?)',
      [pagamento.reservaId, pagamento.valor, pagamento.metodo, pagamento.status, pagamento.dataProcessamento]
    );
    return { id: result.insertId, ...pagamento };
  }
}

module.exports = PagamentoDao;
