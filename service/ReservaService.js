const reservaDAO = require('../dao/ReservaDAO');
const { pool } = require('../config/database');

function validaLocalizacao(loc) {
  return ['interna', 'externa'].includes(String(loc).toLowerCase());
}

class ReservaService {
  async listar() {
    return reservaDAO.listar();
  }

  async verificarDisponibilidade({ restauranteId, horario, numPessoas, localizacao, mesaId }) {
    if (!restauranteId || !horario || numPessoas == null) {
      throw new Error('Dados incompletos');
    }
    const conn = await pool.getConnection();
    try {
      if (mesaId) {
        const ok = await reservaDAO.verificarMesaDisponivel(mesaId, restauranteId, horario, numPessoas, conn);
        return { disponivel: ok, mesaId: ok ? mesaId : null };
      }
      if (!localizacao) throw new Error('localizacao é obrigatória');
      if (!validaLocalizacao(localizacao)) throw new Error('Localização inválida');
      const mId = await reservaDAO.buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao, conn);
      return { disponivel: !!mId, mesaId: mId };
    } finally {
      conn.release();
    }
  }

  async criarReserva({ clienteId, restauranteId, horario, numPessoas, localizacao, valorTotal, cartaoNumero, mesaId }) {
    if (!clienteId || !restauranteId || !horario || numPessoas == null || valorTotal == null) {
      throw new Error('Dados incompletos');
    }
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [resExist] = await conn.execute('SELECT 1 FROM RESERVA WHERE cliente_id = ? LIMIT 1', [clienteId]);
      if (resExist.length) {
        await conn.rollback();
        return { sucesso: false, mensagem: 'Cliente já possui reserva' };
      }
      let mesa = mesaId;
      if (mesa) {
        const disponivel = await reservaDAO.verificarMesaDisponivel(mesa, restauranteId, horario, numPessoas, conn);
        if (!disponivel) {
          await conn.rollback();
          return { sucesso: false, mensagem: 'Mesa indisponível' };
        }
        const [locRow] = await conn.execute('SELECT localizacao FROM MESA WHERE id_mesa = ?', [mesa]);
        localizacao = locRow[0].localizacao;
      } else {
        if (!localizacao) throw new Error('Localização obrigatória');
        if (!validaLocalizacao(localizacao)) throw new Error('Localização inválida');
        mesa = await reservaDAO.buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao, conn);
        if (!mesa) {
          await conn.rollback();
          return { sucesso: false, mensagem: 'Mesa indisponível' };
        }
      }
      const reservaId = await reservaDAO.inserirReserva({ restauranteId, mesaId: mesa, clienteId, horario, numPessoas, localizacao, valorTotal }, conn);
      const statusPag = cartaoNumero.startsWith('4') ? 'APROVADO' : 'FALHA';
      await reservaDAO.inserirPagamento(reservaId, valorTotal, statusPag, conn);
      const novoStatus = statusPag === 'APROVADO' ? 'PAGO' : 'FALHA';
      await reservaDAO.atualizarStatus(reservaId, novoStatus, conn);
      if (statusPag === 'FALHA') {
        await conn.rollback();
        return { sucesso: false, mensagem: 'Pagamento recusado' };
      }
      await conn.commit();
      return { sucesso: true, mesaId: mesa };
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
