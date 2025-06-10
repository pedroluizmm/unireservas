const pagamentoDAO = require('../dao/PagamentoDAO');

class PagamentoService {
  async listar() {
    return pagamentoDAO.listar();
  }
}

module.exports = new PagamentoService();
