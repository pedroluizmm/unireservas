# unireservas
# UniReservas Backend

Este projeto implementa uma API simples em **Node.js** que se conecta ao **MySQL** usando `mysql2/promise` e o framework `express`. Toda a lógica de rotas está concentrada em um único arquivo `server.js` para facilitar a compreensão e manutenção.

## Configuração

1. Copie o arquivo `.env.example` para `.env` (opcional) ou defina as variáveis de ambiente manualmente.
2. Ajuste as credenciais de acesso ao banco de dados e a porta da aplicação.

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=unireservas
PORT=3000
```

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

A aplicação iniciará na porta definida na variável `PORT` e exibirá `Servidor rodando na porta ...`.

## Rotas

### Clientes
- `GET /api/clientes`
- `GET /api/clientes-disponiveis`
- `POST /api/clientes` `{ nome, telefone, email }`
- `PUT /api/clientes/:id` `{ nome, telefone, email }`
- `DELETE /api/clientes/:id`

### Restaurantes
- `GET /api/restaurantes`
- `POST /api/restaurantes` `{ nome, endereco, horarios: ["12:00", "18:00"] }`
- `PUT /api/restaurantes/:id` `{ nome, endereco, horarios }`
- `DELETE /api/restaurantes/:id`
- `GET /api/horarios?restauranteId=1`

### Mesas
- `GET /api/mesas` ou `GET /api/mesas?restauranteId=1`
- `POST /api/mesas` `{ restauranteId, capacidade, localizacao }`
- `PUT /api/mesas/:id` `{ capacidade, localizacao }`
- `DELETE /api/mesas/:id`

### Reservas
- `POST /api/verificar-disponibilidade` `{ restauranteId, horario, numPessoas, localizacao?, mesaId? }`
- `POST /api/criar-reserva` `{ clienteId, restauranteId, horario, numPessoas, localizacao?, valorTotal, cartaoNumero, mesaId? }`
- `GET /api/reservas`
- `PUT /api/reservas/:id` `{ horario?, numPessoas?, preferenciaLocalizacao?, statusPagamento? }`
- `DELETE /api/reservas/:id`
- `GET /api/pagamentos`
- `POST /api/pagamentos` `{ reservaId, valor, metodo?, status? }`
- `PUT /api/pagamentos/:id` `{ reservaId?, valor?, metodo?, status? }`
- `DELETE /api/pagamentos/:id`

### Exemplo de Pagamento
O pagamento é simulado. Cartões que começam com `4` são aprovados; qualquer outro número resulta em falha e a transação é revertida.

## Observações
As variáveis de ambiente são carregadas do arquivo `.env` caso exista. Utilize o arquivo `.env.example` apenas como modelo e não suba credenciais reais para o repositório.
O esquema do banco deve conter as tabelas e chaves estrangeiras apresentadas no enunciado para que as rotas funcionem corretamente.