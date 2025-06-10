const { query } = require('../config/database');

class PagamentoDAO {
  async listar() {
    return query('SELECT * FROM PAGAMENTO');
  }
}

module.exports = new PagamentoDAO();
