const clienteDAO = require('../dao/ClienteDAO');

function validaEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function validaTelefone(telefone) {
  return /^\d{8,}$/.test(telefone);
}

class ClienteService {
  async listar() {
    return clienteDAO.listar();
  }

  async listarDisponiveis() {
    return clienteDAO.listarDisponiveis();
  }

  async criar(data) {
    const { nome, telefone, email } = data;
    if (!nome || !telefone || !email) {
      throw new Error('Dados incompletos');
    }
    if (!validaEmail(email) || !validaTelefone(telefone)) {
      throw new Error('Formato inválido para telefone ou email');
    }
    return clienteDAO.inserir({ nome, telefone, email });
  }

  async atualizar(id, data) {
    const { nome, telefone, email } = data;
    if (!nome || !telefone || !email) {
      throw new Error('Dados incompletos');
    }
    if (!validaEmail(email) || !validaTelefone(telefone)) {
      throw new Error('Formato inválido para telefone ou email');
    }
    return clienteDAO.atualizar(id, { nome, telefone, email });
  }

  async remover(id) {
    await clienteDAO.remover(id);
  }
}

module.exports = new ClienteService();
