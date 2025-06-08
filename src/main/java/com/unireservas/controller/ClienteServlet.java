package com.unireservas.controller;

import com.unireservas.dao.ClienteDAO;
import com.unireservas.model.Cliente;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

public class ClienteServlet extends HttpServlet {
    private final ClienteDAO dao = new ClienteDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        try (PrintWriter out = resp.getWriter()) {
            List<Cliente> clientes = dao.listarTodos();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < clientes.size(); i++) {
                Cliente c = clientes.get(i);
                sb.append(String.format("{\"id\":%d,\"nome\":\"%s\",\"telefone\":\"%s\",\"email\":\"%s\"}",
                        c.getId(), c.getNome(), c.getTelefone(), c.getEmail()));
                if (i < clientes.size() - 1) sb.append(',');
            }
            sb.append(']');
            out.print(sb.toString());
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Cliente c = new Cliente();
        c.setNome(req.getParameter("nome"));
        c.setTelefone(req.getParameter("telefone"));
        c.setEmail(req.getParameter("email"));
        try {
            dao.inserir(c);
            resp.setStatus(201);
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Cliente c = new Cliente();
        c.setId(Integer.parseInt(req.getParameter("id")));
        c.setNome(req.getParameter("nome"));
        c.setTelefone(req.getParameter("telefone"));
        c.setEmail(req.getParameter("email"));
        try {
            dao.atualizar(c);
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
