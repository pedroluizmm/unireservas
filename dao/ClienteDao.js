const db = require('../config/db');

class ClienteDao {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM CLIENTE');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM CLIENTE WHERE id_cliente = ?', [id]);
    return rows[0];
  }

  static async create(cliente) {
    const [result] = await db.query('INSERT INTO CLIENTE (nome, telefone, email) VALUES (?, ?, ?)', [cliente.nome, cliente.telefone, cliente.email]);
    return { id: result.insertId, ...cliente };
  }

  static async update(id, cliente) {
    await db.query('UPDATE CLIENTE SET nome=?, telefone=?, email=? WHERE id_cliente=?', [cliente.nome, cliente.telefone, cliente.email, id]);
  }

  static async delete(id) {
    await db.query('DELETE FROM CLIENTE WHERE id_cliente=?', [id]);
  }
}

module.exports = ClienteDao;
