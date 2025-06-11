const { query, pool } = require('../config/database');

class MesaDAO {
  async listar(restauranteId) {
    if (restauranteId === undefined) {
      // sem filtro: retorna todas as mesas
      return query('SELECT * FROM MESA');
    }
    if (restauranteId === null || restauranteId === '') {
      // parametro informado mas vazio -> nenhum resultado
      return [];
    }
    return query('SELECT * FROM MESA WHERE restaurante_id = ?', [restauranteId]);
  }

  async inserir(restauranteId, capacidade, localizacao) {
    const [result] = await pool.execute('INSERT INTO MESA (restaurante_id, capacidade, localizacao) VALUES (?, ?, ?)', [restauranteId, capacidade, localizacao]);
    return { id_mesa: result.insertId, restauranteId, capacidade, localizacao };
  }

  async atualizar(id, capacidade, localizacao) {
    await query('UPDATE MESA SET capacidade = ?, localizacao = ? WHERE id_mesa = ?', [capacidade, localizacao, id]);
    return { id_mesa: id, capacidade, localizacao };
  }

  async remover(id) {
    await query('DELETE FROM MESA WHERE id_mesa = ?', [id]);
  }
}

module.exports = new MesaDAO();
