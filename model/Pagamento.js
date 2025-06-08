class Pagamento {
  constructor(id, reservaId, valor, metodo, status, dataProcessamento) {
    this.id = id;
    this.reservaId = reservaId;
    this.valor = valor;
    this.metodo = metodo;
    this.status = status;
    this.dataProcessamento = dataProcessamento;
  }
}
module.exports = Pagamento;
