const reservaDAO = require('../dao/ReservaDAO');
const { pool } = require('../config/database');

function validaLocalizacao(loc) {
  return ['interna', 'externa'].includes(String(loc).toLowerCase());
}

class ReservaService {
  async listar() {
    return reservaDAO.listar();
  }

  async verificarDisponibilidade({ restauranteId, horario, numPessoas, localizacao }) {
    if (!restauranteId || !horario || numPessoas == null || !localizacao) {
      throw new Error('Dados incompletos');
    }
    if (!validaLocalizacao(localizacao)) throw new Error('Localização inválida');
    const conn = await pool.getConnection();
    try {
      const mesaId = await reservaDAO.buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao, conn);
      return { disponivel: !!mesaId, mesaId };
    } finally {
      conn.release();
    }
  }

  async criarReserva({ clienteId, restauranteId, horario, numPessoas, localizacao, valorTotal, cartaoNumero }) {
    if (!clienteId || !restauranteId || !horario || numPessoas == null || valorTotal == null) {
      throw new Error('Dados incompletos');
    }
    if (!validaLocalizacao(localizacao)) throw new Error('Localização inválida');
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [resExist] = await conn.execute('SELECT 1 FROM RESERVA WHERE cliente_id = ? LIMIT 1', [clienteId]);
      if (resExist.length) {
        await conn.rollback();
        return { sucesso: false, mensagem: 'Cliente já possui reserva' };
      }
      const mesaId = await reservaDAO.buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao, conn);
      if (!mesaId) {
        await conn.rollback();
        return { sucesso: false, mensagem: 'Mesa indisponível' };
      }
      const reservaId = await reservaDAO.inserirReserva({ restauranteId, mesaId, clienteId, horario, numPessoas, localizacao, valorTotal }, conn);
      const statusPag = cartaoNumero.startsWith('4') ? 'APROVADO' : 'FALHA';
      await reservaDAO.inserirPagamento(reservaId, valorTotal, statusPag, conn);
      const novoStatus = statusPag === 'APROVADO' ? 'PAGO' : 'FALHA';
      await reservaDAO.atualizarStatus(reservaId, novoStatus, conn);
      if (statusPag === 'FALHA') {
        await conn.rollback();
        return { sucesso: false, mensagem: 'Pagamento recusado' };
      }
      await conn.commit();
      return { sucesso: true, mesaId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async atualizar(id, data) {
    const { horario, numPessoas, preferencia_localizacao, status_pagamento } = data;
    if (!horario && numPessoas == null && !preferencia_localizacao && !status_pagamento) {
      throw new Error('Nada para atualizar');
    }
    await pool.execute(
      `UPDATE RESERVA
         SET horario = COALESCE(?, horario),
             num_pessoas = COALESCE(?, num_pessoas),
             preferencia_localizacao = COALESCE(?, preferencia_localizacao),
             status_pagamento = COALESCE(?, status_pagamento)
       WHERE id_reserva = ?`,
      [horario, numPessoas, preferencia_localizacao, status_pagamento, id]
    );
    return { id_reserva: id, horario, numPessoas, preferencia_localizacao, status_pagamento };
  }

  async remover(id) {
    await reservaDAO.remover(id);
  }
}

module.exports = new ReservaService();
