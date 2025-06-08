# UniReservas Backend

Este projeto implementa o backend da aplicação de reservas de restaurantes em **Node.js**. Ele foi organizado em camadas (model, dao, service, controller) para facilitar a manutenção e evolução do código.

## Arquitetura

- **config**: configuração da conexão com o MySQL (`config/db.js`).
- **model**: classes simples que representam as entidades do sistema.
- **dao**: acesso ao banco de dados usando `mysql2` e consultas parametrizadas.
- **service**: regras de negócio e orquestração das DAOs.
- **controller**: rotas HTTP utilizando Express.

```
index.js       -> ponto de entrada do servidor
.env.example   -> exemplo de variáveis de ambiente para conexão
```

## Configuração

1. Copie o arquivo `.env.example` para `.env` e preencha com as informações do seu banco MySQL.
2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor:

```bash
npm start
```

## APIs Principais

### Clientes

- `GET /clientes` – lista clientes
- `POST /clientes` – cria cliente
- `PUT /clientes/:id` – atualiza cliente
- `DELETE /clientes/:id` – remove cliente

### Restaurantes

- `GET /restaurantes` – lista restaurantes
- `POST /restaurantes` – cria restaurante (com horarios)
- `GET /restaurantes/:id/horarios` – lista horários de um restaurante
- `GET /restaurantes/:id/mesas` – lista mesas de um restaurante

### Reservas e Pagamentos

- `POST /reservas/verificar-disponibilidade` – verifica disponibilidade de mesa
- `POST /reservas/criar-reserva` – cria reserva
- `POST /reservas/:id/processar-pagamento` – processa pagamento
- `GET /reservas` – lista reservas
- `GET /reservas/:id/pagamento` – obtém pagamento de uma reserva

## Exemplo de Requisição

```bash
curl -X POST http://localhost:3000/reservas/verificar-disponibilidade \
  -H 'Content-Type: application/json' \
  -d '{"restauranteId":1,"horario":"19:00","numPessoas":2}'
```

## Manutenção

O código foi estruturado em módulos pequenos e independentes, permitindo expansão e testes unitários simples. Utilize as DAOs para acesso ao banco e as Services para regras de negócio antes de expor nas Controllers.

