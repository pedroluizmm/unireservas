const express = require('express');
const router = express.Router();
const ClienteService = require('../service/ClienteService');

router.get('/', async (req, res) => {
  try {
    const clientes = await ClienteService.listar();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cliente = await ClienteService.obter(req.params.id);
    if (cliente) res.json(cliente); else res.status(404).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const novo = await ClienteService.criar(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await ClienteService.atualizar(req.params.id, req.body);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await ClienteService.remover(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
