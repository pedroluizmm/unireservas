const mesaDAO = require('../dao/MesaDAO');

function validaLocalizacao(loc) {
  return ['interna', 'externa'].includes(String(loc).toLowerCase());
}

class MesaService {
  async listar(restauranteId) {
    if (restauranteId === undefined) {
      // sem restauranteId - retorna todas as mesas (usado na tela de admin)
      return mesaDAO.listar();
    }
    if (restauranteId === null || restauranteId === '') {
      // restauranteId informado mas vazio ou nulo -> sem registros
      return [];
    }
    return mesaDAO.listar(restauranteId);
  }

  async criar({ restauranteId, capacidade, localizacao }) {
    if (!restauranteId || capacidade == null || !localizacao) {
      throw new Error('Dados incompletos');
    }
    if (!validaLocalizacao(localizacao)) throw new Error('Localização inválida');
    return mesaDAO.inserir(restauranteId, capacidade, localizacao);
  }

  async atualizar(id, { capacidade, localizacao }) {
    if (capacidade == null || !localizacao) throw new Error('Dados incompletos');
    if (!validaLocalizacao(localizacao)) throw new Error('Localização inválida');
    return mesaDAO.atualizar(id, capacidade, localizacao);
  }

  async remover(id) {
    await mesaDAO.remover(id);
  }
}

module.exports = new MesaService();
