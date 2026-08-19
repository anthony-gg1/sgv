/**
 * SGV - Gerenciador de Tema (Dark Mode / Light Mode)
 * Suporte a Tailwind CSS com estratégia 'class' e persistência no localStorage.
 */

(function () {
  const THEME_KEY = 'sgv_theme';

  // Configuração do Tailwind CDN para garantir darkMode: 'class'
  if (typeof window !== 'undefined') {
    window.tailwind = window.tailwind || {};
    window.tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            slate: {
              750: '#293548',
              850: '#172033',
              950: '#0b1120',
            },
          },
        },
      },
    };
  }

  /**
   * Obtém o tema atual salvo ou a preferência do sistema operacional
   * @returns {'dark' | 'light'}
   */
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Aplica o tema ao documento HTML e atualiza os ícones do alternador
   * @param {'dark' | 'light'} theme 
   */
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Atualiza ícones dos botões de alternância
    updateThemeToggleIcons(isDark);

    // Emite evento customizado para componentes reativos (ex: Chart.js)
    window.dispatchEvent(new CustomEvent('sgv:theme-changed', { detail: { theme, isDark } }));
  }

  /**
   * Alterna entre os temas 'dark' e 'light' e persiste no localStorage
   */
  function toggleTheme() {
    const currentIsDark = document.documentElement.classList.contains('dark');
    const newTheme = currentIsDark ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  }

  /**
   * Atualiza a renderização dos ícones (Sol / Lua) em todos os botões de toggle
   * @param {boolean} isDark 
   */
  function updateThemeToggleIcons(isDark) {
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach((btn) => {
      btn.setAttribute('aria-label', isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro');
      btn.setAttribute('title', isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro');
      
      const sunIcon = btn.querySelector('.theme-icon-sun');
      const moonIcon = btn.querySelector('.theme-icon-moon');
      
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      }
    });
  }

  // Executa imediatamente para evitar FOUC
  const initialTheme = getPreferredTheme();
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  function setup() {
    const isDark = document.documentElement.classList.contains('dark');
    updateThemeToggleIcons(isDark);

    // Escuta mudanças de preferência no sistema operacional caso o usuário não tenha fixado
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Event delegation para garantir que cliques em botões de alternância sempre funcionem
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (btn) {
      e.preventDefault();
      toggleTheme();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

  // Expõe no objeto global para uso programático
  window.SGVTheme = {
    get: getPreferredTheme,
    set: (theme) => {
      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
    },
    toggle: toggleTheme,
    isDark: () => document.documentElement.classList.contains('dark'),
  };
})();
