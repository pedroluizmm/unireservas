const db = require('../config/db');

class HorarioRestauranteDao {
  static async findByRestaurante(restauranteId) {
    const [rows] = await db.query('SELECT * FROM HORARIO_RESTAURANTE WHERE restaurante_id=?', [restauranteId]);
    return rows;
  }

  static async create(restauranteId, horario) {
    const [result] = await db.query('INSERT INTO HORARIO_RESTAURANTE (restaurante_id, horario) VALUES (?, ?)', [restauranteId, horario]);
    return { id: result.insertId, restauranteId, horario };
  }

  static async deleteByRestaurante(restauranteId) {
    await db.query('DELETE FROM HORARIO_RESTAURANTE WHERE restaurante_id=?', [restauranteId]);
  }
}

module.exports = HorarioRestauranteDao;
