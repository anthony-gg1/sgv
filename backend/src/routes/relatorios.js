const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/lucros-por-produto', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.nome,
              COALESCE(SUM(v.quantidade), 0) AS quantidade_vendida,
              COALESCE(SUM((v.valor_unitario - v.custo_unitario) * v.quantidade), 0) AS lucro_total,
              COALESCE(SUM(v.valor_unitario * v.quantidade), 0) AS receita_total
       FROM produto p
       LEFT JOIN venda v ON v.id_produto = p.id AND v.id_empresa = p.id_empresa
       WHERE p.id_empresa = ?
       GROUP BY p.id, p.nome
       ORDER BY lucro_total DESC`,
      [req.empresa.id]
    );

    const dados = rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      quantidade_vendida: Number(row.quantidade_vendida),
      lucro_total: Number(Number(row.lucro_total).toFixed(2)),
      receita_total: Number(Number(row.receita_total).toFixed(2)),
    }));

    const lucroConsolidado = Number(
      dados.reduce((acc, item) => acc + item.lucro_total, 0).toFixed(2)
    );

    res.json({ produtos: dados, lucro_consolidado: lucroConsolidado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar relatório de lucros.' });
  }
});

router.get('/comparativo-mensal', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         YEAR(v.data_venda) AS ano,
         MONTH(v.data_venda) AS mes,
         SUM(v.valor_unitario * v.quantidade) AS receita,
         SUM((v.valor_unitario - v.custo_unitario) * v.quantidade) AS lucro,
         SUM(v.quantidade) AS quantidade
       FROM venda v
       WHERE v.id_empresa = ?
         AND v.data_venda >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
       GROUP BY ano, mes
       ORDER BY ano DESC, mes DESC
       LIMIT 2`,
      [req.empresa.id]
    );

    const agora = new Date();
    const mesAtual = agora.getMonth() + 1;
    const anoAtual = agora.getFullYear();

    let mesAnterior = mesAtual - 1;
    let anoAnterior = anoAtual;
    if (mesAnterior === 0) {
      mesAnterior = 12;
      anoAnterior -= 1;
    }

    const vazio = { receita: 0, lucro: 0, quantidade: 0 };

    const atual = rows.find((r) => Number(r.mes) === mesAtual && Number(r.ano) === anoAtual) || vazio;
    const anterior =
      rows.find((r) => Number(r.mes) === mesAnterior && Number(r.ano) === anoAnterior) || vazio;

    const formatar = (row) => ({
      receita: Number(Number(row.receita || 0).toFixed(2)),
      lucro: Number(Number(row.lucro || 0).toFixed(2)),
      quantidade: Number(row.quantidade || 0),
    });

    const mesAtualFmt = formatar(atual);
    const mesAnteriorFmt = formatar(anterior);

    const variacaoLucro =
      mesAnteriorFmt.lucro === 0
        ? mesAtualFmt.lucro > 0
          ? 100
          : 0
        : Number(
            (
              ((mesAtualFmt.lucro - mesAnteriorFmt.lucro) / mesAnteriorFmt.lucro) *
              100
            ).toFixed(1)
          );

    res.json({
      mes_atual: {
        mes: mesAtual,
        ano: anoAtual,
        ...mesAtualFmt,
      },
      mes_anterior: {
        mes: mesAnterior,
        ano: anoAnterior,
        ...mesAnteriorFmt,
      },
      variacao_lucro_percentual: variacaoLucro,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar comparativo mensal.' });
  }
});

router.get('/resumo', async (req, res) => {
  try {
    const [totais] = await pool.query(
      `SELECT
         COUNT(*) AS total_vendas,
         COALESCE(SUM((valor_unitario - custo_unitario) * quantidade), 0) AS lucro_total,
         COALESCE(SUM(valor_unitario * quantidade), 0) AS receita_total
       FROM venda
       WHERE id_empresa = ?`,
      [req.empresa.id]
    );

    const [produtos] = await pool.query(
      'SELECT COUNT(*) AS total FROM produto WHERE id_empresa = ?',
      [req.empresa.id]
    );

    res.json({
      total_produtos: Number(produtos[0].total),
      total_vendas: Number(totais[0].total_vendas),
      lucro_total: Number(Number(totais[0].lucro_total).toFixed(2)),
      receita_total: Number(Number(totais[0].receita_total).toFixed(2)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar resumo.' });
  }
});

module.exports = router;
