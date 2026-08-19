let chartLucros = null;
let chartComparativo = null;
let cachedLucros = null;
let cachedComparativo = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const empresa = getEmpresa();
  const empresaEl = document.getElementById('empresa-nome');
  if (empresaEl) {
    empresaEl.textContent = empresa?.nome || 'Empresa';
  }

  await carregarDashboard();

  document.getElementById('form-produto')?.addEventListener('submit', salvarProduto);
  document.getElementById('form-venda')?.addEventListener('submit', registrarVenda);
  document.getElementById('btn-cancelar-edicao')?.addEventListener('click', limparFormProduto);

  // Escuta alteração de tema para redesenhar gráficos com a paleta correta
  window.addEventListener('sgv:theme-changed', () => {
    if (cachedLucros && cachedComparativo) {
      renderGraficos(cachedLucros, cachedComparativo);
    }
  });
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

    cachedLucros = lucros;
    cachedComparativo = comparativo;

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
  const statProdutos = document.getElementById('stat-produtos');
  const statVendas = document.getElementById('stat-vendas');
  const statLucro = document.getElementById('stat-lucro');
  const statVariacao = document.getElementById('stat-variacao');
  const cardVariacao = document.getElementById('stat-variacao-card');

  if (statProdutos) statProdutos.textContent = resumo.total_produtos;
  if (statVendas) statVendas.textContent = resumo.total_vendas;
  if (statLucro) statLucro.textContent = formatCurrency(resumo.lucro_total);

  const variacao = comparativo.variacao_lucro_percentual;
  const sinal = variacao >= 0 ? '+' : '';
  if (statVariacao) {
    statVariacao.textContent = `${sinal}${variacao}%`;
    if (variacao >= 0) {
      statVariacao.className = 'text-3xl font-bold text-emerald-600 dark:text-emerald-400';
    } else {
      statVariacao.className = 'text-3xl font-bold text-rose-600 dark:text-rose-400';
    }
  }

  const elMesAtual = document.getElementById('mes-atual-lucro');
  const elMesAnterior = document.getElementById('mes-anterior-lucro');
  const elConsolidado = document.getElementById('lucro-consolidado');

  if (elMesAtual) elMesAtual.textContent = formatCurrency(comparativo.mes_atual.lucro);
  if (elMesAnterior) elMesAnterior.textContent = formatCurrency(comparativo.mes_anterior.lucro);
  if (elConsolidado) elConsolidado.textContent = formatCurrency(lucros.lucro_consolidado);
}

function renderTabelaProdutos(produtos) {
  const tbody = document.getElementById('tabela-produtos');
  if (!tbody) return;

  if (!produtos || !produtos.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
          <div class="flex flex-col items-center justify-center gap-2">
            <svg class="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <span class="text-sm font-medium">Nenhum produto cadastrado até o momento.</span>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = produtos
    .map(
      (p) => `
    <tr class="hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition-colors">
      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">
        ${p.nome}
      </td>
      <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate" title="${p.descricao || ''}">
        ${p.descricao || '<span class="text-slate-400 dark:text-slate-600">—</span>'}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">
        ${formatCurrency(p.preco_venda)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
        ${formatCurrency(p.preco_custo)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
          ${formatCurrency(p.lucro_unitario)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <div class="flex items-center justify-center gap-2">
          <button 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 transition-all active:scale-95 shadow-sm" 
            data-edit="${p.id}"
            title="Editar produto"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            Editar
          </button>
          <button 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 transition-all active:scale-95 shadow-sm" 
            data-delete="${p.id}"
            title="Excluir produto"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Excluir
          </button>
        </div>
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
  if (!select) return;

  select.innerHTML =
    '<option value="">Selecione um produto</option>' +
    produtos.map((p) => `<option value="${p.id}">${p.nome} — ${formatCurrency(p.preco_venda)}</option>`).join('');
}

function renderTabelaVendas(vendas) {
  const tbody = document.getElementById('tabela-vendas');
  if (!tbody) return;

  if (!vendas || !vendas.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
          <div class="flex flex-col items-center justify-center gap-2">
            <svg class="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <span class="text-sm font-medium">Nenhuma venda registrada ainda.</span>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = vendas
    .map((v) => {
      const dataFormatada = v.data_venda ? v.data_venda.split('T')[0].split('-').reverse().join('/') : '—';
      return `
    <tr class="hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition-colors">
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
          <svg class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          ${dataFormatada}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">
        ${v.produto_nome}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          ${v.quantidade} un
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">
        ${formatCurrency(v.receita)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <span class="font-bold text-emerald-600 dark:text-emerald-400">
          ${formatCurrency(v.lucro)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <button 
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 transition-all active:scale-95 shadow-sm" 
          data-delete-venda="${v.id}"
          title="Excluir venda"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Excluir
        </button>
      </td>
    </tr>`;
    })
    .join('');

  tbody.querySelectorAll('[data-delete-venda]').forEach((btn) => {
    btn.addEventListener('click', () => excluirVenda(btn.dataset.deleteVenda));
  });
}

function renderGraficos(lucros, comparativo) {
  const ctxLucros = document.getElementById('chart-lucros');
  const ctxComp = document.getElementById('chart-comparativo');
  if (!ctxLucros || !ctxComp) return;

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

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
          backgroundColor: isDark ? '#6366f1' : '#4f46e5',
          hoverBackgroundColor: isDark ? '#818cf8' : '#4338ca',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#0f172a',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) => ` Lucro: ${formatCurrency(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { family: 'inherit', size: 12 } },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColor,
            font: { family: 'inherit', size: 12 },
            callback: (val) => `R$ ${val}`,
          },
          grid: { color: gridColor },
        },
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
          backgroundColor: isDark ? '#818cf8' : '#4f46e5',
          borderRadius: 6,
        },
        {
          label: 'Receita (R$)',
          data: [comparativo.mes_anterior.receita, comparativo.mes_atual.receita],
          backgroundColor: isDark ? '#334155' : '#cbd5e1',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { family: 'inherit', size: 12 },
            usePointStyle: true,
            boxWidth: 8,
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#0f172a',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) => ` ${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { family: 'inherit', size: 12 } },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColor,
            font: { family: 'inherit', size: 12 },
            callback: (val) => `R$ ${val}`,
          },
          grid: { color: gridColor },
        },
      },
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
  document.getElementById('produto-descricao').value = produto.descricao || '';
  document.getElementById('produto-venda').value = produto.preco_venda;
  document.getElementById('produto-custo').value = produto.preco_custo;
  
  const btnCancelar = document.getElementById('btn-cancelar-edicao');
  if (btnCancelar) btnCancelar.classList.remove('hidden');

  const titleEl = document.getElementById('form-produto-title');
  if (titleEl) titleEl.textContent = 'Editar Produto';

  // Scroll suave até o formulário caso esteja no mobile
  document.getElementById('form-produto')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function limparFormProduto() {
  document.getElementById('form-produto')?.reset();
  document.getElementById('produto-id').value = '';
  
  const btnCancelar = document.getElementById('btn-cancelar-edicao');
  if (btnCancelar) btnCancelar.classList.add('hidden');

  const titleEl = document.getElementById('form-produto-title');
  if (titleEl) titleEl.textContent = 'Cadastrar Produto';
}

async function excluirProduto(id) {
  if (!confirm('Deseja realmente excluir este produto?')) return;

  try {
    await apiRequest(`/api/produtos/${id}`, { method: 'DELETE' });
    showAlert('Produto removido com sucesso.', 'success');
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
  if (!confirm('Deseja realmente excluir esta venda?')) return;

  try {
    await apiRequest(`/api/vendas/${id}`, { method: 'DELETE' });
    showAlert('Venda removida com sucesso.', 'success');
    await carregarDashboard();
  } catch (err) {
    showAlert(err.message);
  }
}
