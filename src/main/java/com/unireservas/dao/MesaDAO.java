package com.unireservas.dao;

import com.unireservas.model.Mesa;
import com.unireservas.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MesaDAO {
    public List<Mesa> listarPorRestaurante(int restauranteId) throws SQLException {
        List<Mesa> mesas = new ArrayList<>();
        String sql = "SELECT id_mesa, restaurante_id, capacidade, localizacao FROM MESA WHERE restaurante_id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, restauranteId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                mesas.add(new Mesa(
                        rs.getInt("id_mesa"),
                        rs.getInt("restaurante_id"),
                        rs.getInt("capacidade"),
                        rs.getString("localizacao")));
            }
        }
        return mesas;
    }

    public Mesa buscarPorId(int id) throws SQLException {
        String sql = "SELECT id_mesa, restaurante_id, capacidade, localizacao FROM MESA WHERE id_mesa=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Mesa(
                        rs.getInt("id_mesa"),
                        rs.getInt("restaurante_id"),
                        rs.getInt("capacidade"),
                        rs.getString("localizacao"));
            }
        }
        return null;
    }

    public void inserir(Mesa mesa) throws SQLException {
        String sql = "INSERT INTO MESA (restaurante_id, capacidade, localizacao) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, mesa.getRestauranteId());
            stmt.setInt(2, mesa.getCapacidade());
            stmt.setString(3, mesa.getLocalizacao());
            stmt.executeUpdate();
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                mesa.setId(rs.getInt(1));
            }
        }
    }

    public void atualizar(Mesa mesa) throws SQLException {
        String sql = "UPDATE MESA SET restaurante_id=?, capacidade=?, localizacao=? WHERE id_mesa=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, mesa.getRestauranteId());
            stmt.setInt(2, mesa.getCapacidade());
            stmt.setString(3, mesa.getLocalizacao());
            stmt.setInt(4, mesa.getId());
            stmt.executeUpdate();
        }
    }

    public void deletar(int id) throws SQLException {
        String sql = "DELETE FROM MESA WHERE id_mesa=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }
}
