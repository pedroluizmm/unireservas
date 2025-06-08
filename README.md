# UniReservas Backend

Este projeto implementa o backend em **Java** para gerenciamento de reservas em restaurantes.

## Arquitetura

O código está organizado nos seguintes pacotes:

- **model**: entidades do domínio (Cliente, Restaurante, Mesa, HorarioRestaurante, Reserva, Pagamento).
- **dao**: acesso ao banco de dados via JDBC para cada entidade.
- **service**: regras de negócio (validação de disponibilidade, criação de reservas e processamento de pagamentos).
- **controller**: servlets HTTP que expõem as APIs de CRUD e reserva.
- **util**: utilitários como a classe de conexão `DBConnection`.

O projeto utiliza Gradle e depende apenas do **MySQL Connector/J** e da API de Servlets.

## Configuração do `.env`

Copie o arquivo `.env.example` para `.env` e defina as variáveis de conexão com o MySQL:

```
DB_URL=jdbc:mysql://localhost:3306/unireservas
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

## Compilação e Execução

1. Instale o Java 21 e o Gradle 8.
2. Execute `gradle build` para compilar o projeto.
3. O artefato gerado em `build/libs` pode ser implantado em um servidor de aplicação compatível com Jakarta Servlet 6 (por exemplo, Tomcat).

## APIs Disponíveis

### Clientes `/clientes`

- `GET /clientes` – lista todos os clientes.
- `POST /clientes` – cria um cliente (`nome`, `telefone`, `email`).
- `PUT /clientes` – atualiza um cliente (`id`, `nome`, `telefone`, `email`).
- `DELETE /clientes?id=1` – remove um cliente.

### Restaurantes `/restaurantes`

- `GET /restaurantes` – lista restaurantes.
- `POST /restaurantes` – cria restaurante (`nome`, `endereco`, `horarios[]=HH:mm`).
- `PUT /restaurantes` – atualiza restaurante (`id`, `nome`, `endereco`).
- `DELETE /restaurantes?id=1` – remove restaurante.

### Mesas `/mesas`

- `GET /mesas?restaurante_id=1` – lista mesas do restaurante.
- `POST /mesas` – cria mesa (`restaurante_id`, `capacidade`, `localizacao`).
- `PUT /mesas` – atualiza mesa (`id`, `restaurante_id`, `capacidade`, `localizacao`).
- `DELETE /mesas?id=1` – remove mesa.

### Disponibilidade `/verificar-disponibilidade`

Consulta se há mesa disponível para determinado restaurante.
Parâmetros: `restaurante_id`, `num_pessoas`, `localizacao`.

### Reservas `/reservas`

- `GET /reservas` – lista reservas.
- `POST /reservas` – cria reserva e processa pagamento.
  Parâmetros: `restaurante_id`, `mesa_id`, `cliente_id`, `horario`, `num_pessoas`,
  `preferencia_localizacao`, `valor_total`, `cartao`.

### Pagamentos `/pagamentos`

- `GET /pagamentos` – lista todos os pagamentos.

## Regras de Negócio

- **Disponibilidade**: uma mesa é considerada disponível se sua capacidade atende o número de pessoas e a localização solicitada.
- **Processamento de Pagamento**: cartões iniciados com `4` são aprovados; caso contrário o pagamento é recusado.
- **Status da Reserva**: atualizado para `pago`, `recusado` ou `cancelada` conforme o processamento do pagamento ou cancelamento.

---

Manter o schema do banco de dados conforme o DER fornecido. Todas as operações utilizam **JDBC** com tratamento de exceções para garantir integridade.
