-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 15/05/2026 às 15:21
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sistema_vendas`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `nome`, `telefone`, `email`) VALUES
(1, 'João Silva', '99999-1111', 'joao@gmail.com'),
(2, 'Maria Souza', '99999-2222', 'maria@gmail.com'),
(3, 'Carlos Lima', '99999-3333', 'carlos@gmail.com'),
(4, 'Ana Beatriz', '99999-4444', 'ana@gmail.com'),
(5, 'Pedro Henrique', '99999-5555', 'pedro@gmail.com');

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedor`
--

CREATE TABLE `fornecedor` (
  `id_fornecedor` int(11) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fornecedor`
--

INSERT INTO `fornecedor` (`id_fornecedor`, `nome`, `telefone`, `email`) VALUES
(1, 'Distribuidora Brasil', '3333-4444', 'contato@db.com');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) DEFAULT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_fornecedor` int(11) DEFAULT NULL,
  `item_pedido` varchar(100) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `data_pedido` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `valor_total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pedido`
--

INSERT INTO `pedido` (`id_pedido`, `id_cliente`, `id_fornecedor`, `item_pedido`, `quantidade`, `data_pedido`, `status`, `valor_total`) VALUES
(1, 1, 1, 'Refrigerante', 2, '2026-05-14', 'Pago', 25.00),
(2, 2, 1, 'Hamburguer', 1, '2026-05-14', 'Pago', 25.00),
(3, 3, 1, 'Pizza', 3, '2026-05-14', 'Enviado', 90.00),
(4, 4, 1, 'Batata Frita', 2, '2026-05-14', 'Pago', 30.00),
(5, 5, 1, 'Suco Natural', 4, '2026-05-14', 'Cancelado', 40.00);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `id_produto` int(11) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  `estoque` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`id_produto`, `nome`, `descricao`, `preco`, `estoque`) VALUES
(1, 'Refrigerante', 'Coca-Cola 2L', 12.50, 30),
(2, 'Hamburguer', 'Hamburguer Artesanal', 25.00, 15),
(3, 'Pizza', 'Pizza Calabresa', 30.00, 20),
(4, 'Batata Frita', 'Porção Média', 15.00, 25),
(5, 'Suco Natural', 'Suco de Laranja', 10.00, 18);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
