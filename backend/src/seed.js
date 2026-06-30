require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/database');

async function seed() {
  const email = 'demo@sgv.com';
  const senha = 'demo123';

  const [existente] = await pool.query('SELECT id FROM empresa WHERE email = ?', [email]);

  if (existente.length) {
    console.log('Conta demo já existe — seed ignorado.');
    return;
  }

  const hash = await bcrypt.hash(senha, 10);

  const [empresaResult] = await pool.query(
    'INSERT INTO empresa (nome, email, senha) VALUES (?, ?, ?)',
    ['Empresa Demo SGV', email, hash]
  );

  const empresaId = empresaResult.insertId;

  const produtos = [
    ['Refrigerante', 'Coca-Cola 2L', 12.5, 8.0],
    ['Hambúrguer', 'Artesanal', 25.0, 14.0],
    ['Pizza', 'Calabresa', 30.0, 18.0],
    ['Batata Frita', 'Porção média', 15.0, 6.0],
    ['Suco Natural', 'Laranja', 10.0, 4.0],
  ];

  for (const [nome, descricao, venda, custo] of produtos) {
    await pool.query(
      'INSERT INTO produto (id_empresa, nome, descricao, preco_venda, preco_custo) VALUES (?, ?, ?, ?, ?)',
      [empresaId, nome, descricao, venda, custo]
    );
  }

  const [prodRows] = await pool.query('SELECT id, preco_venda, preco_custo FROM produto WHERE id_empresa = ?', [
    empresaId,
  ]);

  const hoje = new Date();
  const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 15);
  const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 10);

  const vendasDemo = [
    [prodRows[0].id, 5, mesPassado],
    [prodRows[1].id, 3, mesPassado],
    [prodRows[2].id, 2, mesPassado],
    [prodRows[0].id, 8, mesAtual],
    [prodRows[3].id, 6, mesAtual],
    [prodRows[4].id, 10, mesAtual],
    [prodRows[2].id, 4, mesAtual],
  ];

  for (const [idProduto, qtd, data] of vendasDemo) {
    const prod = prodRows.find((p) => p.id === idProduto);
    await pool.query(
      `INSERT INTO venda (id_empresa, id_produto, quantidade, valor_unitario, custo_unitario, data_venda)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [empresaId, idProduto, qtd, prod.preco_venda, prod.preco_custo, data.toISOString().slice(0, 10)]
    );
  }

  console.log('Seed concluído!');
  console.log('  E-mail: demo@sgv.com');
  console.log('  Senha:  demo123');
}

seed()
  .catch(console.error)
  .finally(() => pool.end());
