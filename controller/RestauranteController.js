const express = require('express');
const router = express.Router();
const RestauranteService = require('../service/RestauranteService');
const MesaService = require('../service/MesaService');

router.get('/', async (req, res) => {
  try {
    const restaurantes = await RestauranteService.listar();
    res.json(restaurantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const restaurante = await RestauranteService.obter(req.params.id);
    if (restaurante) res.json(restaurante); else res.status(404).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const novo = await RestauranteService.criar(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await RestauranteService.atualizar(req.params.id, req.body);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await RestauranteService.remover(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/horarios', async (req, res) => {
  try {
    const restaurante = await RestauranteService.obter(req.params.id);
    if (!restaurante) return res.status(404).end();
    res.json(restaurante.horarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/mesas', async (req, res) => {
  try {
    const mesas = await MesaService.listar(req.params.id);
    res.json(mesas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
