const express = require('express');
const router = express.Router();
const mesaService = require('../service/MesaService');

router.get('/', async (req, res) => {
  try {
    const data = await mesaService.listar(req.query.restauranteId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar mesas' });
  }
});

router.post('/', async (req, res) => {
  try {
    const mesa = await mesaService.criar(req.body);
    res.status(201).json(mesa);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const mesa = await mesaService.atualizar(req.params.id, req.body);
    res.json(mesa);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await mesaService.remover(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover mesa' });
  }
});

module.exports = router;
