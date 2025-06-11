const { query, pool } = require('../config/database');

class PagamentoDAO {
  async listar() {
    return query('SELECT * FROM PAGAMENTO');
  }

  async inserir({ reservaId, valor, metodo, status }) {
    const [result] = await pool.execute(
      'INSERT INTO PAGAMENTO (reserva_id, valor, metodo, status, data_processamento) VALUES (?, ?, ?, ?, NOW())',
      [reservaId, valor, metodo, status]
    );
    return { id_pagamento: result.insertId, reservaId, valor, metodo, status };
  }

  async atualizar(id, { reservaId, valor, metodo, status }) {
    await query(
      `UPDATE PAGAMENTO
         SET reserva_id = COALESCE(?, reserva_id),
             valor = COALESCE(?, valor),
             metodo = COALESCE(?, metodo),
             status = COALESCE(?, status)
       WHERE id_pagamento = ?`,
      [reservaId, valor, metodo, status, id]
    );
    return { id_pagamento: id, reservaId, valor, metodo, status };
  }

  async remover(id) {
    await query('DELETE FROM PAGAMENTO WHERE id_pagamento = ?', [id]);
  }
}

module.exports = new PagamentoDAO();
