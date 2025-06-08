const ClienteDao = require('../dao/ClienteDao');

class ClienteService {
  static async listar() {
    return ClienteDao.findAll();
  }

  static async obter(id) {
    return ClienteDao.findById(id);
  }

  static async criar(data) {
    return ClienteDao.create(data);
  }

  static async atualizar(id, data) {
    return ClienteDao.update(id, data);
  }

  static async remover(id) {
    return ClienteDao.delete(id);
  }
}

module.exports = ClienteService;
