const db = require('../config/db');

class RestauranteDao {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM RESTAURANTE');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM RESTAURANTE WHERE id_restaurante=?', [id]);
    return rows[0];
  }

  static async create(restaurante) {
    const [result] = await db.query('INSERT INTO RESTAURANTE (nome, endereco) VALUES (?, ?)', [restaurante.nome, restaurante.endereco]);
    return { id: result.insertId, ...restaurante };
  }

  static async update(id, restaurante) {
    await db.query('UPDATE RESTAURANTE SET nome=?, endereco=? WHERE id_restaurante=?', [restaurante.nome, restaurante.endereco, id]);
  }

  static async delete(id) {
    await db.query('DELETE FROM RESTAURANTE WHERE id_restaurante=?', [id]);
  }
}

module.exports = RestauranteDao;
