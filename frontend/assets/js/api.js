const API_BASE = '';

function getToken() {
  return localStorage.getItem('sgv_token');
}

function getEmpresa() {
  const raw = localStorage.getItem('sgv_empresa');
  return raw ? JSON.parse(raw) : null;
}

function setSession(token, empresa) {
  localStorage.setItem('sgv_token', token);
  localStorage.setItem('sgv_empresa', JSON.stringify(empresa));
}

function clearSession() {
  localStorage.removeItem('sgv_token');
  localStorage.removeItem('sgv_empresa');
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function redirectIfAuth() {
  if (getToken()) {
    window.location.href = 'dashboard.html';
    return true;
  }
  return false;
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.erro || 'Erro inesperado na requisição.';
    throw new Error(message);
  }

  return data;
}

function formatCurrency(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function showAlert(message, type = 'danger', containerId = 'alert-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const normalizedType = type === 'error' ? 'danger' : type;

  const styles = {
    danger: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
      icon: `<svg class="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
      btn: 'text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200',
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
      icon: `<svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
      btn: 'text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
      icon: `<svg class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
      btn: 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200',
    },
    info: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200',
      icon: `<svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
      btn: 'text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200',
    },
  };

  const current = styles[normalizedType] || styles.danger;

  container.innerHTML = `
    <div class="fade-in flex items-center justify-between p-4 rounded-xl border ${current.bg} shadow-sm transition-all duration-300" role="alert">
      <div class="flex items-center gap-3">
        ${current.icon}
        <span class="text-sm font-medium leading-relaxed">${message}</span>
      </div>
      <button type="button" class="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${current.btn}" onclick="this.parentElement.remove()" aria-label="Fechar">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}

function updateNavbarAuth() {
  const empresa = getEmpresa();
  const authNav = document.getElementById('auth-nav');
  const mobileMenu = document.getElementById('mobile-menu');
  const isDashboard = window.location.pathname.endsWith('dashboard.html') || window.location.pathname.endsWith('dashboard');

  if (empresa && getToken()) {
    if (authNav) {
      authNav.innerHTML = `
        <span class="hidden lg:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
          ${empresa.nome}
        </span>
        <a href="index.html" class="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Home</a>
        <a href="dashboard.html" class="${isDashboard ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors'}">Painel</a>
        <a href="about.html" class="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">About Us</a>
        <button id="btn-logout" class="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all">
          Sair
        </button>
      `;
      document.getElementById('btn-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }

    if (mobileMenu) {
      mobileMenu.innerHTML = `
        <div class="px-4 py-2 border-b border-slate-200 dark:border-slate-800 mb-2">
          <p class="text-xs text-slate-500 dark:text-slate-400">Conectado como</p>
          <p class="text-sm font-bold text-slate-900 dark:text-slate-100">${empresa.nome}</p>
        </div>
        <a href="index.html" class="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Home</a>
        <a href="dashboard.html" class="block px-4 py-2 ${isDashboard ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800'} rounded-lg transition-colors">Painel</a>
        <a href="about.html" class="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors">About Us</a>
        <button id="btn-logout-mobile" class="w-full text-left block px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold rounded-lg transition-colors">
          Sair
        </button>
      `;
      document.getElementById('btn-logout-mobile')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', updateNavbarAuth);
