const db = require('../config/db');

class MesaDao {
  static async findByRestaurante(restauranteId) {
    const [rows] = await db.query('SELECT * FROM MESA WHERE restaurante_id=?', [restauranteId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM MESA WHERE id_mesa=?', [id]);
    return rows[0];
  }

  static async create(mesa) {
    const [result] = await db.query('INSERT INTO MESA (restaurante_id, capacidade, localizacao) VALUES (?, ?, ?)', [mesa.restauranteId, mesa.capacidade, mesa.localizacao]);
    return { id: result.insertId, ...mesa };
  }

  static async update(id, mesa) {
    await db.query('UPDATE MESA SET restaurante_id=?, capacidade=?, localizacao=? WHERE id_mesa=?', [mesa.restauranteId, mesa.capacidade, mesa.localizacao, id]);
  }

  static async delete(id) {
    await db.query('DELETE FROM MESA WHERE id_mesa=?', [id]);
  }
}

module.exports = MesaDao;
