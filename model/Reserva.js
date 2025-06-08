class Reserva {
  constructor(id, restauranteId, mesaId, clienteId, dataHora, horario, numPessoas, preferenciaLocalizacao, valorTotal, statusPagamento) {
    this.id = id;
    this.restauranteId = restauranteId;
    this.mesaId = mesaId;
    this.clienteId = clienteId;
    this.dataHora = dataHora;
    this.horario = horario;
    this.numPessoas = numPessoas;
    this.preferenciaLocalizacao = preferenciaLocalizacao;
    this.valorTotal = valorTotal;
    this.statusPagamento = statusPagamento;
  }
}
module.exports = Reserva;
