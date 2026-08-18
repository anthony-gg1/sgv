let chartLucros = null;
let chartComparativo = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const empresa = getEmpresa();
  document.getElementById('empresa-nome').textContent = empresa?.nome || 'Empresa';

  await carregarDashboard();

  document.getElementById('form-produto').addEventListener('submit', salvarProduto);
  document.getElementById('form-venda').addEventListener('submit', registrarVenda);
  document.getElementById('btn-cancelar-edicao').addEventListener('click', limparFormProduto);
});

async function carregarDashboard() {
  try {
    const [resumo, lucros, comparativo, produtos, vendas] = await Promise.all([
      apiRequest('/api/relatorios/resumo'),
      apiRequest('/api/relatorios/lucros-por-produto'),
      apiRequest('/api/relatorios/comparativo-mensal'),
      apiRequest('/api/produtos'),
      apiRequest('/api/vendas'),
    ]);

    renderResumo(resumo, lucros, comparativo);
    renderTabelaProdutos(produtos.produtos);
    renderSelectProdutos(produtos.produtos);
    renderTabelaVendas(vendas.vendas);
    renderGraficos(lucros, comparativo);
  } catch (err) {
    showAlert(err.message);
  }
}

function renderResumo(resumo, lucros, comparativo) {
  document.getElementById('stat-produtos').textContent = resumo.total_produtos;
  document.getElementById('stat-vendas').textContent = resumo.total_vendas;
  document.getElementById('stat-lucro').textContent = formatCurrency(resumo.lucro_total);

  const variacao = comparativo.variacao_lucro_percentual;
  const cardVariacao = document.getElementById('stat-variacao-card');
  const sinal = variacao >= 0 ? '+' : '';
  document.getElementById('stat-variacao').textContent = `${sinal}${variacao}%`;

  cardVariacao.classList.toggle('positive', variacao >= 0);
  cardVariacao.classList.toggle('negative', variacao < 0);

  document.getElementById('mes-atual-lucro').textContent = formatCurrency(comparativo.mes_atual.lucro);
  document.getElementById('mes-anterior-lucro').textContent = formatCurrency(comparativo.mes_anterior.lucro);
  document.getElementById('lucro-consolidado').textContent = formatCurrency(lucros.lucro_consolidado);
}

function renderTabelaProdutos(produtos) {
  const tbody = document.getElementById('tabela-produtos');
  if (!produtos.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum produto cadastrado.</td></tr>';
    return;
  }

  tbody.innerHTML = produtos
    .map(
      (p) => `
    <tr>
      <td>${p.nome}</td>
      <td>${p.descricao || '—'}</td>
      <td>${formatCurrency(p.preco_venda)}</td>
      <td>${formatCurrency(p.preco_custo)}</td>
      <td>${formatCurrency(p.lucro_unitario)}</td>
      <td class="table-actions">
        <button class="btn btn-sm btn-outline-secondary me-1" data-edit="${p.id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger" data-delete="${p.id}">Excluir</button>
      </td>
    </tr>`
    )
    .join('');

  tbody.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => editarProduto(btn.dataset.edit, produtos));
  });

  tbody.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => excluirProduto(btn.dataset.delete));
  });
}

function renderSelectProdutos(produtos) {
  const select = document.getElementById('venda-produto');
  select.innerHTML =
    '<option value="">Selecione um produto</option>' +
    produtos.map((p) => `<option value="${p.id}">${p.nome} — ${formatCurrency(p.preco_venda)}</option>`).join('');
}

function renderTabelaVendas(vendas) {
  const tbody = document.getElementById('tabela-vendas');
  if (!vendas.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma venda registrada.</td></tr>';
    return;
  }

  tbody.innerHTML = vendas
    .map(
      (v) => `
    <tr>
      <td>${v.data_venda.split('T')[0].split('-').reverse().join('/')}</td>
      <td>${v.produto_nome}</td>
      <td>${v.quantidade}</td>
      <td>${formatCurrency(v.receita)}</td>
      <td class="text-success fw-semibold">${formatCurrency(v.lucro)}</td>
      <td class="table-actions">
        <button class="btn btn-sm btn-outline-danger" data-delete-venda="${v.id}">Excluir</button>
      </td>
    </tr>`
    )
    .join('');

  tbody.querySelectorAll('[data-delete-venda]').forEach((btn) => {
    btn.addEventListener('click', () => excluirVenda(btn.dataset.deleteVenda));
  });
}

function renderGraficos(lucros, comparativo) {
  const ctxLucros = document.getElementById('chart-lucros');
  const ctxComp = document.getElementById('chart-comparativo');

  if (chartLucros) chartLucros.destroy();
  if (chartComparativo) chartComparativo.destroy();

  chartLucros = new Chart(ctxLucros, {
    type: 'bar',
    data: {
      labels: lucros.produtos.map((p) => p.nome),
      datasets: [
        {
          label: 'Lucro (R$)',
          data: lucros.produtos.map((p) => p.lucro_total),
          backgroundColor: '#495057',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const labelAnterior = `${meses[comparativo.mes_anterior.mes - 1]}/${comparativo.mes_anterior.ano}`;
  const labelAtual = `${meses[comparativo.mes_atual.mes - 1]}/${comparativo.mes_atual.ano}`;

  chartComparativo = new Chart(ctxComp, {
    type: 'bar',
    data: {
      labels: [labelAnterior, labelAtual],
      datasets: [
        {
          label: 'Lucro (R$)',
          data: [comparativo.mes_anterior.lucro, comparativo.mes_atual.lucro],
          backgroundColor: ['#adb5bd', '#212529'],
          borderRadius: 6,
        },
        {
          label: 'Receita (R$)',
          data: [comparativo.mes_anterior.receita, comparativo.mes_atual.receita],
          backgroundColor: ['#dee2e6', '#495057'],
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } },
    },
  });
}

async function salvarProduto(e) {
  e.preventDefault();

  const id = document.getElementById('produto-id').value;
  const payload = {
    nome: document.getElementById('produto-nome').value.trim(),
    descricao: document.getElementById('produto-descricao').value.trim(),
    preco_venda: document.getElementById('produto-venda').value,
    preco_custo: document.getElementById('produto-custo').value,
  };

  try {
    if (id) {
      await apiRequest(`/api/produtos/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showAlert('Produto atualizado com sucesso.', 'success');
    } else {
      await apiRequest('/api/produtos', { method: 'POST', body: JSON.stringify(payload) });
      showAlert('Produto cadastrado com sucesso.', 'success');
    }

    limparFormProduto();
    await carregarDashboard();
  } catch (err) {
    showAlert(err.message);
  }
}

function editarProduto(id, produtos) {
  const produto = produtos.find((p) => String(p.id) === String(id));
  if (!produto) return;

  document.getElementById('produto-id').value = produto.id;
  document.getElementById('produto-nome').value = produto.nome;
  document.getElementById('produto-descricao').value = produto.descricao;
  document.getElementById('produto-venda').value = produto.preco_venda;
  document.getElementById('produto-custo').value = produto.preco_custo;
  document.getElementById('btn-cancelar-edicao').classList.remove('d-none');
  document.getElementById('form-produto-title').textContent = 'Editar produto';
}

function limparFormProduto() {
  document.getElementById('form-produto').reset();
  document.getElementById('produto-id').value = '';
  document.getElementById('btn-cancelar-edicao').classList.add('d-none');
  document.getElementById('form-produto-title').textContent = 'Cadastrar produto';
}

async function excluirProduto(id) {
  if (!confirm('Deseja excluir este produto?')) return;

  try {
    await apiRequest(`/api/produtos/${id}`, { method: 'DELETE' });
    showAlert('Produto removido.', 'success');
    await carregarDashboard();
  } catch (err) {
    showAlert(err.message);
  }
}

async function registrarVenda(e) {
  e.preventDefault();

  const payload = {
    id_produto: document.getElementById('venda-produto').value,
    quantidade: document.getElementById('venda-quantidade').value,
    data_venda: document.getElementById('venda-data').value,
  };

  try {
    await apiRequest('/api/vendas', { method: 'POST', body: JSON.stringify(payload) });
    showAlert('Venda registrada com sucesso.', 'success');
    e.target.reset();
    document.getElementById('venda-data').value = new Date().toISOString().slice(0, 10);
    await carregarDashboard();
  } catch (err) {
    showAlert(err.message);
  }
}

async function excluirVenda(id) {
  if (!confirm('Deseja excluir esta venda?')) return;

  try {
    await apiRequest(`/api/vendas/${id}`, { method: 'DELETE' });
    showAlert('Venda removida.', 'success');
    await carregarDashboard();
  } catch (err) {
    showAlert(err.message);
  }
}
