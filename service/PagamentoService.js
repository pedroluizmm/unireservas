const pagamentoDAO = require('../dao/PagamentoDAO');

class PagamentoService {
  async listar() {
    return pagamentoDAO.listar();
  }

  async criar(data) {
    const { reservaId, valor, metodo = 'CARTAO', status = 'PENDENTE' } = data;
    if (!reservaId || valor == null) throw new Error('Dados incompletos');
    return pagamentoDAO.inserir({ reservaId, valor, metodo, status });
  }

  async atualizar(id, data) {
    const { reservaId, valor, metodo, status } = data;
    if (reservaId == null && valor == null && !metodo && !status) {
      throw new Error('Nada para atualizar');
    }
    return pagamentoDAO.atualizar(id, { reservaId, valor, metodo, status });
  }

  async remover(id) {
    await pagamentoDAO.remover(id);
  }
}

module.exports = new PagamentoService();
