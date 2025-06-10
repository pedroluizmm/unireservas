const express = require('express');
const router = express.Router();
const reservaService = require('../service/ReservaService');

router.get('/', async (req, res) => {
  try {
    const data = await reservaService.listar();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar reservas' });
  }
});

router.post('/verificar-disponibilidade', async (req, res) => {
  try {
    const result = await reservaService.verificarDisponibilidade(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.post('/criar-reserva', async (req, res) => {
  try {
    const result = await reservaService.criarReserva(req.body);
    if (result.sucesso) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar reserva' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const reserva = await reservaService.atualizar(req.params.id, req.body);
    res.json(reserva);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await reservaService.remover(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover reserva' });
  }
});

module.exports = router;
