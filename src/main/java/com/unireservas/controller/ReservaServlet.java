package com.unireservas.controller;

import com.unireservas.dao.ReservaDAO;
import com.unireservas.model.Reserva;
import com.unireservas.service.ReservaService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

public class ReservaServlet extends HttpServlet {
    private final ReservaDAO dao = new ReservaDAO();
    private final ReservaService service = new ReservaService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        try {
            List<Reserva> reservas = dao.listarTodas();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < reservas.size(); i++) {
                Reserva r = reservas.get(i);
                sb.append(String.format("{\"id\":%d,\"mesaId\":%d,\"clienteId\":%d,\"status\":\"%s\"}",
                        r.getId(), r.getMesaId(), r.getClienteId(), r.getStatusPagamento()));
                if (i < reservas.size() - 1) sb.append(',');
            }
            sb.append(']');
            resp.getWriter().print(sb.toString());
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            int restauranteId = Integer.parseInt(req.getParameter("restaurante_id"));
            int mesaId = Integer.parseInt(req.getParameter("mesa_id"));
            int clienteId = Integer.parseInt(req.getParameter("cliente_id"));
            String horario = req.getParameter("horario");
            int numPessoas = Integer.parseInt(req.getParameter("num_pessoas"));
            String preferencia = req.getParameter("preferencia_localizacao");
            double valor = Double.parseDouble(req.getParameter("valor_total"));

            Reserva r = new Reserva();
            r.setRestauranteId(restauranteId);
            r.setMesaId(mesaId);
            r.setClienteId(clienteId);
            r.setHorario(horario);
            r.setNumPessoas(numPessoas);
            r.setPreferenciaLocalizacao(preferencia);
            r.setDataHora(LocalDateTime.now());
            r.setValorTotal(valor);
            r.setStatusPagamento("pendente");
            service.criarReserva(r);

            String cartao = req.getParameter("cartao");
            service.processarPagamentoReserva(r, cartao);

            resp.setStatus(201);
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }
}
