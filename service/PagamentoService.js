const PagamentoDao = require('../dao/PagamentoDao');

class PagamentoService {
  static async obterPorReserva(reservaId) {
    return PagamentoDao.findByReserva(reservaId);
  }

  static async criar(data) {
    return PagamentoDao.create(data);
  }
}

module.exports = PagamentoService;
