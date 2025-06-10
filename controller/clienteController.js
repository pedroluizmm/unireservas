const express = require('express');
const router = express.Router();
const clienteService = require('../service/ClienteService');

router.get('/', async (req, res) => {
  try {
    const data = await clienteService.listar();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar clientes' });
  }
});

router.get('/disponiveis', async (req, res) => {
  try {
    const data = await clienteService.listarDisponiveis();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar clientes disponíveis' });
  }
});

router.post('/', async (req, res) => {
  try {
    const cliente = await clienteService.criar(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const cliente = await clienteService.atualizar(req.params.id, req.body);
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await clienteService.remover(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover cliente' });
  }
});

module.exports = router;
