const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { formatarProduto } = require('../utils/helpers');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nome, descricao, preco_venda, preco_custo, created_at
       FROM produto
       WHERE id_empresa = ?
       ORDER BY nome ASC`,
      [req.empresa.id]
    );

    res.json({ produtos: rows.map(formatarProduto) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar produtos.' });
  }
});

router.post('/', async (req, res) => {
  const { nome, descricao, preco_venda, preco_custo } = req.body;

  if (!nome?.trim()) {
    return res.status(400).json({ erro: 'Nome do produto é obrigatório.' });
  }

  const venda = Number(preco_venda);
  const custo = Number(preco_custo);

  if (Number.isNaN(venda) || Number.isNaN(custo) || venda < 0 || custo < 0) {
    return res.status(400).json({ erro: 'Preços devem ser números válidos e positivos.' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO produto (id_empresa, nome, descricao, preco_venda, preco_custo)
       VALUES (?, ?, ?, ?, ?)`,
      [req.empresa.id, nome.trim(), (descricao || '').trim(), venda, custo]
    );

    const [rows] = await pool.query(
      'SELECT id, nome, descricao, preco_venda, preco_custo, created_at FROM produto WHERE id = ?',
      [resultado.insertId]
    );

    res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso.',
      produto: formatarProduto(rows[0]),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco_venda, preco_custo } = req.body;

  if (!nome?.trim()) {
    return res.status(400).json({ erro: 'Nome do produto é obrigatório.' });
  }

  const venda = Number(preco_venda);
  const custo = Number(preco_custo);

  if (Number.isNaN(venda) || Number.isNaN(custo) || venda < 0 || custo < 0) {
    return res.status(400).json({ erro: 'Preços devem ser números válidos e positivos.' });
  }

  try {
    const [resultado] = await pool.query(
      `UPDATE produto
       SET nome = ?, descricao = ?, preco_venda = ?, preco_custo = ?
       WHERE id = ? AND id_empresa = ?`,
      [nome.trim(), (descricao || '').trim(), venda, custo, id, req.empresa.id]
    );

    if (!resultado.affectedRows) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    const [rows] = await pool.query(
      'SELECT id, nome, descricao, preco_venda, preco_custo, created_at FROM produto WHERE id = ?',
      [id]
    );

    res.json({
      mensagem: 'Produto atualizado com sucesso.',
      produto: formatarProduto(rows[0]),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar produto.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query(
      'DELETE FROM produto WHERE id = ? AND id_empresa = ?',
      [id, req.empresa.id]
    );

    if (!resultado.affectedRows) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    res.json({ mensagem: 'Produto removido com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover produto.' });
  }
});

module.exports = router;
