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

router.post('/', async (req, res) => {
  try {
    const pagamento = await pagamentoService.criar(req.body);
    res.status(201).json(pagamento);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const pagamento = await pagamentoService.atualizar(req.params.id, req.body);
    res.json(pagamento);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pagamentoService.remover(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover pagamento' });
  }
});

module.exports = router;
