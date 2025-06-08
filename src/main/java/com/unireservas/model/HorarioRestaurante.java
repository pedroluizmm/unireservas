package com.unireservas.model;

import java.time.LocalTime;

public class HorarioRestaurante {
    private int id;
    private int restauranteId;
    private LocalTime horario;

    public HorarioRestaurante() {}

    public HorarioRestaurante(int id, int restauranteId, LocalTime horario) {
        this.id = id;
        this.restauranteId = restauranteId;
        this.horario = horario;
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

    public LocalTime getHorario() {
        return horario;
    }

    public void setHorario(LocalTime horario) {
        this.horario = horario;
    }
}
