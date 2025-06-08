const RestauranteDao = require('../dao/RestauranteDao');
const HorarioRestauranteDao = require('../dao/HorarioRestauranteDao');

class RestauranteService {
  static async listar() {
    return RestauranteDao.findAll();
  }

  static async obter(id) {
    const restaurante = await RestauranteDao.findById(id);
    if (restaurante) {
      restaurante.horarios = await HorarioRestauranteDao.findByRestaurante(id);
    }
    return restaurante;
  }

  static async criar(data) {
    const res = await RestauranteDao.create({ nome: data.nome, endereco: data.endereco });
    if (data.horarios && data.horarios.length) {
      for (const h of data.horarios) {
        await HorarioRestauranteDao.create(res.id, h);
      }
    }
    return res;
  }

  static async atualizar(id, data) {
    await RestauranteDao.update(id, { nome: data.nome, endereco: data.endereco });
    if (data.horarios) {
      await HorarioRestauranteDao.deleteByRestaurante(id);
      for (const h of data.horarios) {
        await HorarioRestauranteDao.create(id, h);
      }
    }
  }

  static async remover(id) {
    await HorarioRestauranteDao.deleteByRestaurante(id);
    await RestauranteDao.delete(id);
  }
}

module.exports = RestauranteService;
