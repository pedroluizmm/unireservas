const express = require('express');
const router = express.Router();
const restauranteService = require('../service/RestauranteService');

router.get('/', async (req, res) => {
  try {
    const data = await restauranteService.listar();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar restaurantes' });
  }
});

router.post('/', async (req, res) => {
  try {
    const restaurante = await restauranteService.criar(req.body);
    res.status(201).json(restaurante);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const restaurante = await restauranteService.atualizar(req.params.id, req.body);
    res.json(restaurante);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await restauranteService.remover(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover restaurante' });
  }
});

router.get('/horarios', async (req, res) => {
  try {
    const data = await restauranteService.listarHorarios(req.query.restauranteId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
