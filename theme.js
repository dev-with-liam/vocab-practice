// Apply the saved appearance before the page content renders.
(() => {
  const preference = window.matchMedia('(prefers-color-scheme: light)');
  function savedTheme() {
    try { return localStorage.getItem('vocab-theme'); } catch { return null; }
  }
  function applyTheme(value) {
    const theme = value === 'light' || value === 'dark'
      ? value : preference.matches ? 'light' : 'dark';
    document.body.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelectorAll('.theme-button').forEach(button => {
      const selected = button.dataset.theme === theme;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  applyTheme(savedTheme());
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(savedTheme());
    document.querySelectorAll('.theme-button').forEach(button => {
      button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        applyTheme(theme);
        try { localStorage.setItem('vocab-theme', theme); } catch {}
      });
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === 'vocab-theme' || event.key === null) applyTheme(savedTheme());
  });
  preference.addEventListener('change', () => {
    if (!['light', 'dark'].includes(savedTheme())) applyTheme(null);
  });
})();
