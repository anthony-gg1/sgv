const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { formatarVenda } = require('../utils/helpers');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT v.id, v.id_produto, p.nome AS produto_nome, v.quantidade,
              v.valor_unitario, v.custo_unitario, v.data_venda, v.created_at
       FROM venda v
       INNER JOIN produto p ON p.id = v.id_produto
       WHERE v.id_empresa = ?
       ORDER BY v.data_venda DESC, v.id DESC`,
      [req.empresa.id]
    );

    const vendas = rows.map(formatarVenda);
    const lucroTotal = Number(
      vendas.reduce((acc, v) => acc + v.lucro, 0).toFixed(2)
    );

    res.json({ vendas, lucro_total: lucroTotal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar vendas.' });
  }
});

router.post('/', async (req, res) => {
  const { id_produto, quantidade, data_venda } = req.body;
  const qtd = Number(quantidade);

  if (!id_produto || !qtd || qtd <= 0) {
    return res.status(400).json({
      erro: 'Produto e quantidade (maior que zero) são obrigatórios.',
    });
  }

  const dataVenda = data_venda || new Date().toISOString().slice(0, 10);

  try {
    const [produtos] = await pool.query(
      'SELECT id, preco_venda, preco_custo FROM produto WHERE id = ? AND id_empresa = ?',
      [id_produto, req.empresa.id]
    );

    if (!produtos.length) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    const produto = produtos[0];

    const [resultado] = await pool.query(
      `INSERT INTO venda (id_empresa, id_produto, quantidade, valor_unitario, custo_unitario, data_venda)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.empresa.id,
        id_produto,
        qtd,
        produto.preco_venda,
        produto.preco_custo,
        dataVenda,
      ]
    );

    const [rows] = await pool.query(
      `SELECT v.id, v.id_produto, p.nome AS produto_nome, v.quantidade,
              v.valor_unitario, v.custo_unitario, v.data_venda, v.created_at
       FROM venda v
       INNER JOIN produto p ON p.id = v.id_produto
       WHERE v.id = ?`,
      [resultado.insertId]
    );

    res.status(201).json({
      mensagem: 'Venda registrada com sucesso.',
      venda: formatarVenda(rows[0]),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao registrar venda.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query(
      'DELETE FROM venda WHERE id = ? AND id_empresa = ?',
      [id, req.empresa.id]
    );

    if (!resultado.affectedRows) {
      return res.status(404).json({ erro: 'Venda não encontrada.' });
    }

    res.json({ mensagem: 'Venda removida com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover venda.' });
  }
});

module.exports = router;
