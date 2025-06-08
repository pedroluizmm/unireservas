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
- `POST /api/clientes` `{ nome, telefone, email }`
- `PUT /api/clientes/:id` `{ nome, telefone, email }`
- `DELETE /api/clientes/:id`

### Restaurantes
- `GET /api/restaurantes`
- `POST /api/restaurantes` `{ nome, endereco, horarios: ["12:00", "18:00"] }`
- `PUT /api/restaurantes/:id` `{ nome, endereco, horarios }`
- `DELETE /api/restaurantes/:id`
- `GET /api/horarios?restauranteId=1`

### Reservas
- `POST /api/verificar-disponibilidade` `{ restauranteId, horario, numPessoas, localizacao }`
- `POST /api/criar-reserva` `{ clienteId, restauranteId, horario, numPessoas, localizacao, valorTotal, cartaoNumero }`
- `GET /api/reservas`
- `GET /api/pagamentos`

### Exemplo de Pagamento
O pagamento é simulado. Cartões que começam com `4` são aprovados; qualquer outro número resulta em falha e a transação é revertida.

## Observações
- Utilize o arquivo `.env.example` apenas como modelo. Não suba credenciais reais para o repositório.
- O esquema do banco deve conter as tabelas e chaves estrangeiras apresentadas no enunciado para que as rotas funcionem corretamente.

