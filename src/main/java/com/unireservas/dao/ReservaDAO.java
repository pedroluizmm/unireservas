package com.unireservas.dao;

import com.unireservas.model.Reserva;
import com.unireservas.util.DBConnection;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ReservaDAO {
    public List<Reserva> listarTodas() throws SQLException {
        List<Reserva> reservas = new ArrayList<>();
        String sql = "SELECT * FROM RESERVA";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                reservas.add(map(rs));
            }
        }
        return reservas;
    }

    public Reserva buscarPorId(int id) throws SQLException {
        String sql = "SELECT * FROM RESERVA WHERE id_reserva=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return map(rs);
            }
        }
        return null;
    }

    public void inserir(Reserva r) throws SQLException {
        String sql = "INSERT INTO RESERVA (restaurante_id, mesa_id, cliente_id, data_hora, horario, num_pessoas, preferencia_localizacao, valor_total, status_pagamento) VALUES (?,?,?,?,?,?,?,?,?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, r.getRestauranteId());
            stmt.setInt(2, r.getMesaId());
            stmt.setInt(3, r.getClienteId());
            stmt.setTimestamp(4, Timestamp.valueOf(r.getDataHora()));
            stmt.setString(5, r.getHorario());
            stmt.setInt(6, r.getNumPessoas());
            stmt.setString(7, r.getPreferenciaLocalizacao());
            stmt.setDouble(8, r.getValorTotal());
            stmt.setString(9, r.getStatusPagamento());
            stmt.executeUpdate();
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                r.setId(rs.getInt(1));
            }
        }
    }

    public void atualizarStatus(int id, String status) throws SQLException {
        String sql = "UPDATE RESERVA SET status_pagamento=? WHERE id_reserva=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, id);
            stmt.executeUpdate();
        }
    }

    private Reserva map(ResultSet rs) throws SQLException {
        return new Reserva(
                rs.getInt("id_reserva"),
                rs.getInt("restaurante_id"),
                rs.getInt("mesa_id"),
                rs.getInt("cliente_id"),
                rs.getTimestamp("data_hora").toLocalDateTime(),
                rs.getString("horario"),
                rs.getInt("num_pessoas"),
                rs.getString("preferencia_localizacao"),
                rs.getDouble("valor_total"),
                rs.getString("status_pagamento")
        );
    }
}
