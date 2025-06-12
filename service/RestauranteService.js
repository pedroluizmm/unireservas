const restauranteDAO = require('../dao/RestauranteDAO');
const { pool } = require('../config/database');

class RestauranteService {
  async listar() {
    return restauranteDAO.listar();
  }

  async criar({ nome, endereco, horarios }) {
    if (!nome || !endereco) throw new Error('Dados incompletos');
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const id = await restauranteDAO.inserir(nome, endereco);
      if (Array.isArray(horarios)) {
        for (const h of horarios) {
          await restauranteDAO.inserirHorario(id, h);
        }
      }
      await conn.commit();
      return { id_restaurante: id, nome, endereco };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async atualizar(id, { nome, endereco, horarios }) {
    if (!nome || !endereco) throw new Error('Dados incompletos');
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await restauranteDAO.atualizar(id, nome, endereco);
      await restauranteDAO.apagarHorarios(id);
      if (Array.isArray(horarios)) {
        for (const h of horarios) {
          await restauranteDAO.inserirHorario(id, h);
        }
      }
      await conn.commit();
      return { id_restaurante: id, nome, endereco };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async remover(id) {
    await restauranteDAO.remover(id);
  }

  async listarHorarios(restauranteId) {
    if (!restauranteId) throw new Error('restauranteId é obrigatório');
    return restauranteDAO.listarHorarios(restauranteId);
  }
}

module.exports = new RestauranteService();
