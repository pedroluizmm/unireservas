package com.unireservas.service;

import com.unireservas.dao.MesaDAO;
import com.unireservas.dao.PagamentoDAO;
import com.unireservas.dao.ReservaDAO;
import com.unireservas.model.Mesa;
import com.unireservas.model.Pagamento;
import com.unireservas.model.Reserva;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

public class ReservaService {

    private final ReservaDAO reservaDAO = new ReservaDAO();
    private final MesaDAO mesaDAO = new MesaDAO();
    private final PagamentoDAO pagamentoDAO = new PagamentoDAO();

    public Mesa buscarMesaDisponivel(int restauranteId, int numPessoas, String localizacao) throws SQLException {
        List<Mesa> mesas = mesaDAO.listarPorRestaurante(restauranteId);
        for (Mesa mesa : mesas) {
            if (mesa.getCapacidade() >= numPessoas &&
                mesa.getLocalizacao().equalsIgnoreCase(localizacao)) {
                return mesa;
            }
        }
        return null;
    }

    public Reserva criarReserva(Reserva reserva) throws SQLException {
        reservaDAO.inserir(reserva);
        return reserva;
    }

    public Pagamento processarPagamentoReserva(Reserva reserva, String cartao) throws SQLException {
        Pagamento pagamento = new Pagamento();
        pagamento.setReservaId(reserva.getId());
        pagamento.setValor(reserva.getValorTotal());
        pagamento.setMetodo("cartao");
        pagamento.setDataProcessamento(LocalDateTime.now());
        if (cartao.startsWith("4")) {
            pagamento.setStatus("aprovado");
            reservaDAO.atualizarStatus(reserva.getId(), "pago");
        } else {
            pagamento.setStatus("recusado");
            reservaDAO.atualizarStatus(reserva.getId(), "recusado");
        }
        pagamentoDAO.inserir(pagamento);
        return pagamento;
    }

    public void cancelarReserva(int reservaId) throws SQLException {
        reservaDAO.atualizarStatus(reservaId, "cancelada");
    }
}
