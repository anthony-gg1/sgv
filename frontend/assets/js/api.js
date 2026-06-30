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
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function showAlert(message, type = 'danger', containerId = 'alert-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
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
  if (!authNav) return;

  if (empresa && getToken()) {
    authNav.innerHTML = `
      <li class="nav-item">
        <span class="nav-link text-white-50">${empresa.nome}</span>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="dashboard.html">Painel</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" id="btn-logout">Sair</a>
      </li>
    `;
    document.getElementById('btn-logout')?.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

document.addEventListener('DOMContentLoaded', updateNavbarAuth);
