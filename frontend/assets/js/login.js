document.addEventListener('DOMContentLoaded', () => {
  if (redirectIfAuth()) return;

  const form = document.getElementById('form-login');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      });

      setSession(data.token, data.empresa);
      window.location.href = 'dashboard.html';
    } catch (err) {
      showAlert(err.message);
      btn.disabled = false;
    }
  });
});
