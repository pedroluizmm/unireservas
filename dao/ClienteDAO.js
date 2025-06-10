const { query, pool } = require('../config/database');

class ClienteDAO {
  async listar() {
    return query('SELECT * FROM CLIENTE');
  }

  async listarDisponiveis() {
    return query(`SELECT * FROM CLIENTE WHERE id_cliente NOT IN (SELECT cliente_id FROM RESERVA)`);
  }

  async inserir({ nome, telefone, email }) {
    const [result] = await pool.execute('INSERT INTO CLIENTE (nome, telefone, email) VALUES (?, ?, ?)', [nome, telefone, email]);
    return { id_cliente: result.insertId, nome, telefone, email };
  }

  async atualizar(id, { nome, telefone, email }) {
    await query('UPDATE CLIENTE SET nome = ?, telefone = ?, email = ? WHERE id_cliente = ?', [nome, telefone, email, id]);
    return { id_cliente: id, nome, telefone, email };
  }

  async remover(id) {
    await query('DELETE FROM CLIENTE WHERE id_cliente = ?', [id]);
  }
}

module.exports = new ClienteDAO();
