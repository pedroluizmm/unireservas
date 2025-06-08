const ReservaDao = require('../dao/ReservaDao');
const MesaDao = require('../dao/MesaDao');
const PagamentoDao = require('../dao/PagamentoDao');

class ReservaService {
  static async buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao) {
    const mesas = await MesaDao.findByRestaurante(restauranteId);
    for (const mesa of mesas) {
      if (mesa.capacidade >= numPessoas &&
          (!localizacao || mesa.localizacao === localizacao)) {
        // Check if there is already reservation at same horario
        const [rows] = await require('../config/db').query(
          'SELECT COUNT(*) as total FROM RESERVA WHERE mesa_id=? AND horario=?',
          [mesa.id_mesa || mesa.id, horario]
        );
        if (rows[0].total === 0) {
          return mesa;
        }
      }
    }
    return null;
  }

  static calcularValorBase(numPessoas) {
    const precoPorPessoa = 50; // regra simples
    return precoPorPessoa * numPessoas;
  }

  static async criarReserva(dados) {
    const mesa = await this.buscarMesaDisponivel(dados.restauranteId, dados.horario, dados.numPessoas, dados.preferenciaLocalizacao);
    if (!mesa) {
      throw new Error('Mesa nao disponivel');
    }
    const valorTotal = this.calcularValorBase(dados.numPessoas);
    const reserva = await ReservaDao.create({
      restauranteId: dados.restauranteId,
      mesaId: mesa.id || mesa.id_mesa,
      clienteId: dados.clienteId,
      dataHora: new Date(),
      horario: dados.horario,
      numPessoas: dados.numPessoas,
      preferenciaLocalizacao: dados.preferenciaLocalizacao,
      valorTotal,
      statusPagamento: 'PENDENTE'
    });
    return reserva;
  }

  static async processarPagamentoReserva(reservaId, metodo, numeroCartao) {
    const reserva = await ReservaDao.findById(reservaId);
    if (!reserva) throw new Error('Reserva nao encontrada');
    let status = 'REPROVADO';
    if (numeroCartao && numeroCartao.startsWith('4')) {
      status = 'APROVADO';
    }
    const pagamento = await PagamentoDao.create({
      reservaId: reservaId,
      valor: reserva.valor_total,
      metodo,
      status,
      dataProcessamento: new Date()
    });
    await ReservaDao.updateStatus(reservaId, status);
    return pagamento;
  }

  static async cancelarReserva(reservaId) {
    await ReservaDao.updateStatus(reservaId, 'CANCELADA');
  }
}

module.exports = ReservaService;
