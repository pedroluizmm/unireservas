const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const clienteController = require('./controller/clienteController');
const restauranteController = require('./controller/restauranteController');
const mesaController = require('./controller/mesaController');
const reservaController = require('./controller/reservaController');
const pagamentoController = require('./controller/pagamentoController');

const clienteService = require('./service/ClienteService');
const restauranteService = require('./service/RestauranteService');

app.use('/api/clientes', clienteController);
app.use('/api/restaurantes', restauranteController);
app.use('/api/mesas', mesaController);
app.use('/api/reservas', reservaController);
app.use('/api/pagamentos', pagamentoController);

app.get('/api/clientes-disponiveis', async (req, res) => {
  try {
    const data = await clienteService.listarDisponiveis();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar clientes disponíveis' });
  }
});

app.get('/api/horarios', async (req, res) => {
  try {
    const data = await restauranteService.listarHorarios(req.query.restauranteId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
