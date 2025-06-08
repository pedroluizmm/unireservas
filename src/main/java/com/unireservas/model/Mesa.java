package com.unireservas.model;

public class Mesa {
    private int id;
    private int restauranteId;
    private int capacidade;
    private String localizacao;

    public Mesa() {}

    public Mesa(int id, int restauranteId, int capacidade, String localizacao) {
        this.id = id;
        this.restauranteId = restauranteId;
        this.capacidade = capacidade;
        this.localizacao = localizacao;
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

    public int getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(int capacidade) {
        this.capacidade = capacidade;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}
