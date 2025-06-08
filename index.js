const express = require('express');
const dotenv = require('dotenv');
const clienteController = require('./controller/ClienteController');
const restauranteController = require('./controller/RestauranteController');
const reservaController = require('./controller/ReservaController');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/clientes', clienteController);
app.use('/restaurantes', restauranteController);
app.use('/reservas', reservaController);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
