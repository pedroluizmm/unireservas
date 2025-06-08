package com.unireservas.controller;

import com.unireservas.dao.MesaDAO;
import com.unireservas.model.Mesa;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class MesaServlet extends HttpServlet {
    private final MesaDAO dao = new MesaDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int restauranteId = Integer.parseInt(req.getParameter("restaurante_id"));
        try {
            List<Mesa> mesas = dao.listarPorRestaurante(restauranteId);
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < mesas.size(); i++) {
                Mesa m = mesas.get(i);
                sb.append(String.format("{\"id\":%d,\"capacidade\":%d,\"localizacao\":\"%s\"}",
                        m.getId(), m.getCapacidade(), m.getLocalizacao()));
                if (i < mesas.size() - 1) sb.append(',');
            }
            sb.append(']');
            resp.getWriter().print(sb.toString());
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Mesa m = new Mesa();
        m.setRestauranteId(Integer.parseInt(req.getParameter("restaurante_id")));
        m.setCapacidade(Integer.parseInt(req.getParameter("capacidade")));
        m.setLocalizacao(req.getParameter("localizacao"));
        try {
            dao.inserir(m);
            resp.setStatus(201);
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Mesa m = new Mesa();
        m.setId(Integer.parseInt(req.getParameter("id")));
        m.setRestauranteId(Integer.parseInt(req.getParameter("restaurante_id")));
        m.setCapacidade(Integer.parseInt(req.getParameter("capacidade")));
        m.setLocalizacao(req.getParameter("localizacao"));
        try {
            dao.atualizar(m);
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int id = Integer.parseInt(req.getParameter("id"));
        try {
            dao.deletar(id);
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }
}
