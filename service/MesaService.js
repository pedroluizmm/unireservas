const MesaDao = require('../dao/MesaDao');

class MesaService {
  static async listar(restauranteId) {
    return MesaDao.findByRestaurante(restauranteId);
  }

  static async obter(id) {
    return MesaDao.findById(id);
  }

  static async criar(data) {
    return MesaDao.create(data);
  }

  static async atualizar(id, data) {
    return MesaDao.update(id, data);
  }

  static async remover(id) {
    return MesaDao.delete(id);
  }
}

module.exports = MesaService;
