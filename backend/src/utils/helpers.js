function calcularLucro(valorUnitario, custoUnitario, quantidade) {
  return Number(((valorUnitario - custoUnitario) * quantidade).toFixed(2));
}

function formatarProduto(row) {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao || '',
    preco_venda: Number(row.preco_venda),
    preco_custo: Number(row.preco_custo),
    lucro_unitario: Number((row.preco_venda - row.preco_custo).toFixed(2)),
    created_at: row.created_at,
  };
}

function formatarVenda(row) {
  const lucro = calcularLucro(row.valor_unitario, row.custo_unitario, row.quantidade);
  return {
    id: row.id,
    id_produto: row.id_produto,
    produto_nome: row.produto_nome,
    quantidade: row.quantidade,
    valor_unitario: Number(row.valor_unitario),
    custo_unitario: Number(row.custo_unitario),
    receita: Number((row.valor_unitario * row.quantidade).toFixed(2)),
    lucro,
    data_venda: row.data_venda,
    created_at: row.created_at,
  };
}

module.exports = {
  calcularLucro,
  formatarProduto,
  formatarVenda,
};
