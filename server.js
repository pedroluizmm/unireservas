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

app.use('/api/clientes', clienteController);
app.use('/api/restaurantes', restauranteController);
app.use('/api/mesas', mesaController);
app.use('/api/reservas', reservaController);
app.use('/api/pagamentos', pagamentoController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
