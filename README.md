# SGV — Sistema de Gerenciamento de Vendas

Aplicação web full-stack para empresas gerenciarem produtos, registrar vendas, calcular lucros e visualizar relatórios gráficos com comparativo mensal.

## Funcionalidades

- Cadastro e login de empresas (JWT)
- CRUD de produtos (preço de venda e custo)
- Registro de vendas com cálculo automático de lucro
- Lucro total consolidado
- Gráficos de lucro por produto (Chart.js)
- Comparativo de vendas/lucro: mês atual vs. mês anterior

## Estrutura do projeto

```
sgv/
├── backend/          # API Node.js + Express
├── frontend/         # Interface Bootstrap 5
└── Database/SQL/     # Schema MySQL/MariaDB
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://www.mysql.com/) ou [MariaDB](https://mariadb.org/) (XAMPP, WAMP, etc.)

## Instalação

### 1. Banco de dados

Importe o schema no phpMyAdmin ou via terminal:

```bash
mysql -u root -p < Database/SQL/sistema_vendas.sql
```

### 2. Backend

```bash
cd backend
copy .env.example .env
npm install
npm start
```

Edite o arquivo `.env` com suas credenciais do banco:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=sistema_vendas
JWT_SECRET=sua_chave_secreta
SEED_DEMO=true
```

### 3. Acessar

Com o servidor rodando, abra:

**http://localhost:3000**

## Conta de demonstração

Ao iniciar com `SEED_DEMO=true`, uma conta demo é criada automaticamente:

| Campo  | Valor          |
|--------|----------------|
| E-mail | demo@sgv.com   |
| Senha  | demo123        |

## API REST

| Método | Rota                              | Descrição                    |
|--------|-----------------------------------|------------------------------|
| POST   | `/api/auth/register`              | Cadastro de empresa          |
| POST   | `/api/auth/login`                 | Login                        |
| GET    | `/api/produtos`                   | Listar produtos              |
| POST   | `/api/produtos`                   | Criar produto                |
| PUT    | `/api/produtos/:id`               | Atualizar produto            |
| DELETE | `/api/produtos/:id`               | Remover produto              |
| GET    | `/api/vendas`                     | Listar vendas + lucro total  |
| POST   | `/api/vendas`                     | Registrar venda              |
| GET    | `/api/relatorios/lucros-por-produto` | Lucros por produto        |
| GET    | `/api/relatorios/comparativo-mensal` | Comparativo mensal        |
| GET    | `/api/relatorios/resumo`          | Resumo geral                 |

## Tecnologias

**Front-end:** HTML5, Bootstrap 5, JavaScript, Chart.js

**Back-end:** Node.js, Express, MySQL2, bcryptjs, jsonwebtoken

**Banco:** MySQL / MariaDB

## Licença

Consulte o arquivo [LICENSE](LICENSE).
