package com.unireservas.controller;

import com.unireservas.dao.PagamentoDAO;
import com.unireservas.model.Pagamento;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class PagamentoServlet extends HttpServlet {
    private final PagamentoDAO dao = new PagamentoDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        try {
            List<Pagamento> pagamentos = dao.listarTodos();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < pagamentos.size(); i++) {
                Pagamento p = pagamentos.get(i);
                sb.append(String.format("{\"id\":%d,\"reservaId\":%d,\"status\":\"%s\"}",
                        p.getId(), p.getReservaId(), p.getStatus()));
                if (i < pagamentos.size() - 1) sb.append(',');
            }
            sb.append(']');
            resp.getWriter().print(sb.toString());
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }
}
