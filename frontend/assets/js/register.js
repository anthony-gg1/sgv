document.addEventListener('DOMContentLoaded', () => {
  if (redirectIfAuth()) return;

  const form = document.getElementById('form-register');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmar').value;

    if (senha !== confirmar) {
      showAlert('As senhas não coincidem.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha }),
      });

      setSession(data.token, data.empresa);
      window.location.href = 'dashboard.html';
    } catch (err) {
      showAlert(err.message);
      btn.disabled = false;
    }
  });
});
