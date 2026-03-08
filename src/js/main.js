const Toast = {
  show(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const colors = {
      success: 'text-success',
      error: 'text-error',
      info: 'text-accent',
      warning: 'text-warning',
    };
    const icons = {
      success: '<polyline points="20 6 9 17 4 12"></polyline>',
      error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
      info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
      warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
    };
    const toast = document.createElement('div');
    toast.className = `toast pointer-events-auto ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icons[type] || icons.info}</svg>
      <span class="text-primary">${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },
};

window.Toast = Toast;

function copyToClipboard(text, message = 'Disalin!') {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    Toast.show(message, 'success');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    Toast.show(message, 'success');
  });
}

window.copyToClipboard = copyToClipboard;

function initSearch() {
  const searchInput = document.getElementById('global-search');
  const searchResults = document.getElementById('search-results');
  const mobileSearch = document.getElementById('mobile-search');
  if (!searchInput || !searchResults) return;

  const toolsData = window.__TOOLS__ || [];

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) { searchResults.classList.add('hidden'); return; }
    const matches = toolsData.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.toLowerCase().includes(q)
    ).slice(0, 6);
    if (!matches.length) {
      searchResults.innerHTML = '<div class="px-3 py-4 text-sm text-muted text-center">Tidak ada hasil</div>';
    } else {
      searchResults.innerHTML = matches.map(t => `
        <a href="${t.route}" class="flex items-center gap-3 px-3 py-2.5 hover:bg-surface transition-colors">
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-primary truncate">${t.name}</div>
            <div class="text-xs text-muted truncate">${t.description}</div>
          </div>
          <svg class="w-3.5 h-3.5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </a>
      `).join('');
    }
    searchResults.classList.remove('hidden');
  }

  searchInput.addEventListener('input', e => renderResults(e.target.value));
  if (mobileSearch) mobileSearch.addEventListener('input', e => renderResults(e.target.value));

  document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add('hidden');
    }
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initMobileMenu();
});
