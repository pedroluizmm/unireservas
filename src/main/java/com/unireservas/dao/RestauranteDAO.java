package com.unireservas.dao;

import com.unireservas.model.HorarioRestaurante;
import com.unireservas.model.Restaurante;
import com.unireservas.util.DBConnection;

import java.sql.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class RestauranteDAO {
    public List<Restaurante> listarTodos() throws SQLException {
        List<Restaurante> restaurantes = new ArrayList<>();
        String sql = "SELECT id_restaurante, nome, endereco FROM RESTAURANTE";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                restaurantes.add(new Restaurante(
                        rs.getInt("id_restaurante"),
                        rs.getString("nome"),
                        rs.getString("endereco")));
            }
        }
        return restaurantes;
    }

    public Restaurante buscarPorId(int id) throws SQLException {
        String sql = "SELECT id_restaurante, nome, endereco FROM RESTAURANTE WHERE id_restaurante=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Restaurante(
                        rs.getInt("id_restaurante"),
                        rs.getString("nome"),
                        rs.getString("endereco"));
            }
        }
        return null;
    }

    public void inserir(Restaurante restaurante) throws SQLException {
        String sql = "INSERT INTO RESTAURANTE (nome, endereco) VALUES (?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, restaurante.getNome());
            stmt.setString(2, restaurante.getEndereco());
            stmt.executeUpdate();
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                restaurante.setId(rs.getInt(1));
            }
        }
    }

    public void atualizar(Restaurante restaurante) throws SQLException {
        String sql = "UPDATE RESTAURANTE SET nome=?, endereco=? WHERE id_restaurante=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, restaurante.getNome());
            stmt.setString(2, restaurante.getEndereco());
            stmt.setInt(3, restaurante.getId());
            stmt.executeUpdate();
        }
    }

    public void deletar(int id) throws SQLException {
        String sql = "DELETE FROM RESTAURANTE WHERE id_restaurante=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    // HORARIO_RESTAURANTE methods
    public List<HorarioRestaurante> listarHorarios(int restauranteId) throws SQLException {
        List<HorarioRestaurante> horarios = new ArrayList<>();
        String sql = "SELECT id_horario, restaurante_id, horario FROM HORARIO_RESTAURANTE WHERE restaurante_id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, restauranteId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                horarios.add(new HorarioRestaurante(
                        rs.getInt("id_horario"),
                        rs.getInt("restaurante_id"),
                        rs.getTime("horario").toLocalTime()));
            }
        }
        return horarios;
    }

    public void inserirHorario(HorarioRestaurante horario) throws SQLException {
        String sql = "INSERT INTO HORARIO_RESTAURANTE (restaurante_id, horario) VALUES (?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, horario.getRestauranteId());
            stmt.setTime(2, Time.valueOf(horario.getHorario()));
            stmt.executeUpdate();
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                horario.setId(rs.getInt(1));
            }
        }
    }

    public void deletarHorario(int horarioId) throws SQLException {
        String sql = "DELETE FROM HORARIO_RESTAURANTE WHERE id_horario=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, horarioId);
            stmt.executeUpdate();
        }
    }
}
