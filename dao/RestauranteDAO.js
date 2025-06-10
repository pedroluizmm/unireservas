const { query, pool } = require('../config/database');

class RestauranteDAO {
  async listar() {
    return query('SELECT * FROM RESTAURANTE');
  }

  async inserir(nome, endereco) {
    const [result] = await pool.execute('INSERT INTO RESTAURANTE (nome, endereco) VALUES (?, ?)', [nome, endereco]);
    return result.insertId;
  }

  async atualizar(id, nome, endereco) {
    await query('UPDATE RESTAURANTE SET nome = ?, endereco = ? WHERE id_restaurante = ?', [nome, endereco, id]);
  }

  async remover(id) {
    await query('DELETE FROM RESTAURANTE WHERE id_restaurante = ?', [id]);
  }

  async inserirHorario(id, horario) {
    await query('INSERT INTO HORARIO_RESTAURANTE (restaurante_id, horario) VALUES (?, ?)', [id, horario]);
  }

  async apagarHorarios(id) {
    await query('DELETE FROM HORARIO_RESTAURANTE WHERE restaurante_id = ?', [id]);
  }

  async listarHorarios(id) {
    return query('SELECT * FROM HORARIO_RESTAURANTE WHERE restaurante_id = ?', [id]);
  }
}

module.exports = new RestauranteDAO();
