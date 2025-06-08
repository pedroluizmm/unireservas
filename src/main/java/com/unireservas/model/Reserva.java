package com.unireservas.model;

import java.time.LocalDateTime;

public class Reserva {
    private int id;
    private int restauranteId;
    private int mesaId;
    private int clienteId;
    private LocalDateTime dataHora;
    private String horario;
    private int numPessoas;
    private String preferenciaLocalizacao;
    private double valorTotal;
    private String statusPagamento;

    public Reserva() {}

    public Reserva(int id, int restauranteId, int mesaId, int clienteId,
                   LocalDateTime dataHora, String horario, int numPessoas,
                   String preferenciaLocalizacao, double valorTotal,
                   String statusPagamento) {
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRestauranteId() {
        return restauranteId;
    }

    public void setRestauranteId(int restauranteId) {
        this.restauranteId = restauranteId;
    }

    public int getMesaId() {
        return mesaId;
    }

    public void setMesaId(int mesaId) {
        this.mesaId = mesaId;
    }

    public int getClienteId() {
        return clienteId;
    }

    public void setClienteId(int clienteId) {
        this.clienteId = clienteId;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public int getNumPessoas() {
        return numPessoas;
    }

    public void setNumPessoas(int numPessoas) {
        this.numPessoas = numPessoas;
    }

    public String getPreferenciaLocalizacao() {
        return preferenciaLocalizacao;
    }

    public void setPreferenciaLocalizacao(String preferenciaLocalizacao) {
        this.preferenciaLocalizacao = preferenciaLocalizacao;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getStatusPagamento() {
        return statusPagamento;
    }

    public void setStatusPagamento(String statusPagamento) {
        this.statusPagamento = statusPagamento;
    }
}
