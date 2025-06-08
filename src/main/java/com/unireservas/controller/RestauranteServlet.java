package com.unireservas.controller;

import com.unireservas.dao.RestauranteDAO;
import com.unireservas.model.HorarioRestaurante;
import com.unireservas.model.Restaurante;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.time.LocalTime;
import java.util.List;

public class RestauranteServlet extends HttpServlet {
    private final RestauranteDAO dao = new RestauranteDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idParam = req.getParameter("id");
        resp.setContentType("application/json");
        try (PrintWriter out = resp.getWriter()) {
            if (idParam == null) {
                List<Restaurante> restaurantes = dao.listarTodos();
                StringBuilder sb = new StringBuilder("[");
                for (int i = 0; i < restaurantes.size(); i++) {
                    Restaurante r = restaurantes.get(i);
                    sb.append(String.format("{\"id\":%d,\"nome\":\"%s\",\"endereco\":\"%s\"}",
                            r.getId(), r.getNome(), r.getEndereco()));
                    if (i < restaurantes.size() - 1) sb.append(',');
                }
                sb.append(']');
                out.print(sb.toString());
            } else {
                int id = Integer.parseInt(idParam);
                Restaurante r = dao.buscarPorId(id);
                if (r != null) {
                    out.print(String.format("{\"id\":%d,\"nome\":\"%s\",\"endereco\":\"%s\"}",
                            r.getId(), r.getNome(), r.getEndereco()));
                } else {
                    resp.sendError(404, "Restaurante nao encontrado");
                }
            }
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Restaurante r = new Restaurante();
        r.setNome(req.getParameter("nome"));
        r.setEndereco(req.getParameter("endereco"));
        try {
            dao.inserir(r);
            String[] horarios = req.getParameterValues("horarios");
            if (horarios != null) {
                for (String h : horarios) {
                    dao.inserirHorario(new HorarioRestaurante(0, r.getId(), LocalTime.parse(h)));
                }
            }
            resp.setStatus(201);
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Restaurante r = new Restaurante();
        r.setId(Integer.parseInt(req.getParameter("id")));
        r.setNome(req.getParameter("nome"));
        r.setEndereco(req.getParameter("endereco"));
        try {
            dao.atualizar(r);
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
