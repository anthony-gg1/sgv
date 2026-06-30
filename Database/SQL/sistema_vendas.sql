-- SGV — Sistema de Gerenciamento de Vendas
-- Schema principal (MariaDB / MySQL)

CREATE DATABASE IF NOT EXISTS sistema_vendas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE sistema_vendas;

DROP TABLE IF EXISTS venda;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS empresa;

CREATE TABLE empresa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE produto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_empresa INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255) DEFAULT '',
  preco_venda DECIMAL(10, 2) NOT NULL,
  preco_custo DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_produto_empresa FOREIGN KEY (id_empresa)
    REFERENCES empresa (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE venda (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_empresa INT NOT NULL,
  id_produto INT NOT NULL,
  quantidade INT NOT NULL CHECK (quantidade > 0),
  valor_unitario DECIMAL(10, 2) NOT NULL,
  custo_unitario DECIMAL(10, 2) NOT NULL,
  data_venda DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_venda_empresa FOREIGN KEY (id_empresa)
    REFERENCES empresa (id) ON DELETE CASCADE,
  CONSTRAINT fk_venda_produto FOREIGN KEY (id_produto)
    REFERENCES produto (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dados de demonstração (senha: demo123 — hash bcrypt gerado pelo seed do backend)
-- Execute o backend uma vez com SEED_DEMO=true para popular a conta demo.
