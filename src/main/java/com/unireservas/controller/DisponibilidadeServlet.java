package com.unireservas.controller;

import com.unireservas.service.ReservaService;
import com.unireservas.model.Mesa;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

public class DisponibilidadeServlet extends HttpServlet {
    private final ReservaService service = new ReservaService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int restauranteId = Integer.parseInt(req.getParameter("restaurante_id"));
        int numPessoas = Integer.parseInt(req.getParameter("num_pessoas"));
        String localizacao = req.getParameter("localizacao");
        try {
            Mesa mesa = service.buscarMesaDisponivel(restauranteId, numPessoas, localizacao);
            if (mesa != null) {
                resp.getWriter().print("{\"disponivel\":true,\"mesaId\":" + mesa.getId() + "}");
            } else {
                resp.getWriter().print("{\"disponivel\":false}");
            }
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }
}
