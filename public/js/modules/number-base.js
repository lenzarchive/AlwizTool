const BASES = { dec: 10, bin: 2, oct: 8, hex: 16 };

function convert() {
  const raw   = document.getElementById('inputText').value.trim();
  const base  = parseInt(document.getElementById('baseSelect').value);
  const errEl = document.getElementById('errorMsg');

  ['dec','bin','oct','hex'].forEach(id => {
    document.getElementById('result-' + id).value = '';
  });

  if (!raw) { errEl.classList.add('hidden'); return; }

  const n = parseInt(raw, base);
  if (isNaN(n)) {
    errEl.classList.remove('hidden');
    return;
  }
  errEl.classList.add('hidden');

  document.getElementById('result-dec').value = n.toString(10);
  document.getElementById('result-bin').value = n.toString(2);
  document.getElementById('result-oct').value = n.toString(8);
  document.getElementById('result-hex').value = n.toString(16).toUpperCase();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('input', convert);
  document.getElementById('baseSelect').addEventListener('change', convert);

  document.querySelectorAll('.copy-result-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = document.getElementById(btn.dataset.id).value;
      if (!val || val === '—') return showToast(I18N.nothingToCopy, 'error');
      copyToClipboard(val);
      showToast(I18N.copied);
    });
  });
});
