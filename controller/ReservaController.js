const express = require('express');
const router = express.Router();
const ReservaService = require('../service/ReservaService');
const PagamentoService = require('../service/PagamentoService');

router.post('/verificar-disponibilidade', async (req, res) => {
  try {
    const { restauranteId, horario, numPessoas, localizacao } = req.body;
    const mesa = await ReservaService.buscarMesaDisponivel(restauranteId, horario, numPessoas, localizacao);
    if (mesa) res.json(mesa); else res.status(404).json({ message: 'Nao ha mesa disponivel' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/criar-reserva', async (req, res) => {
  try {
    const reserva = await ReservaService.criarReserva(req.body);
    res.status(201).json(reserva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/processar-pagamento', async (req, res) => {
  try {
    const pagamento = await ReservaService.processarPagamentoReserva(req.params.id, req.body.metodo, req.body.numeroCartao);
    res.json(pagamento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const reservas = await require('../dao/ReservaDao').findAll();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/pagamento', async (req, res) => {
  try {
    const pag = await PagamentoService.obterPorReserva(req.params.id);
    if (pag) res.json(pag); else res.status(404).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
