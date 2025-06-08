package com.unireservas.dao;

import com.unireservas.model.Pagamento;
import com.unireservas.util.DBConnection;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PagamentoDAO {
    public List<Pagamento> listarTodos() throws SQLException {
        List<Pagamento> pagamentos = new ArrayList<>();
        String sql = "SELECT * FROM PAGAMENTO";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                pagamentos.add(map(rs));
            }
        }
        return pagamentos;
    }

    public Pagamento buscarPorId(int id) throws SQLException {
        String sql = "SELECT * FROM PAGAMENTO WHERE id_pagamento=?";
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

    public void inserir(Pagamento p) throws SQLException {
        String sql = "INSERT INTO PAGAMENTO (reserva_id, valor, metodo, status, data_processamento) VALUES (?,?,?,?,?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, p.getReservaId());
            stmt.setDouble(2, p.getValor());
            stmt.setString(3, p.getMetodo());
            stmt.setString(4, p.getStatus());
            stmt.setTimestamp(5, Timestamp.valueOf(p.getDataProcessamento()));
            stmt.executeUpdate();
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                p.setId(rs.getInt(1));
            }
        }
    }

    public void atualizarStatus(int id, String status) throws SQLException {
        String sql = "UPDATE PAGAMENTO SET status=? WHERE id_pagamento=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, id);
            stmt.executeUpdate();
        }
    }

    private Pagamento map(ResultSet rs) throws SQLException {
        return new Pagamento(
                rs.getInt("id_pagamento"),
                rs.getInt("reserva_id"),
                rs.getDouble("valor"),
                rs.getString("metodo"),
                rs.getString("status"),
                rs.getTimestamp("data_processamento").toLocalDateTime()
        );
    }
}
