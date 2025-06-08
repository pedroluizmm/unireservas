package com.unireservas.model;

import java.time.LocalDateTime;

public class Pagamento {
    private int id;
    private int reservaId;
    private double valor;
    private String metodo;
    private String status;
    private LocalDateTime dataProcessamento;

    public Pagamento() {}

    public Pagamento(int id, int reservaId, double valor, String metodo,
                     String status, LocalDateTime dataProcessamento) {
        this.id = id;
        this.reservaId = reservaId;
        this.valor = valor;
        this.metodo = metodo;
        this.status = status;
        this.dataProcessamento = dataProcessamento;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getReservaId() { return reservaId; }
    public void setReservaId(int reservaId) { this.reservaId = reservaId; }
    public double getValor() { return valor; }
    public void setValor(double valor) { this.valor = valor; }
    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getDataProcessamento() { return dataProcessamento; }
    public void setDataProcessamento(LocalDateTime dataProcessamento) {
        this.dataProcessamento = dataProcessamento;
    }
}
