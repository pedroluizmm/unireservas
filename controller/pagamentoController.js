const express = require('express');
const router = express.Router();
const pagamentoService = require('../service/PagamentoService');

router.get('/', async (req, res) => {
  try {
    const data = await pagamentoService.listar();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar pagamentos' });
  }
});

module.exports = router;
