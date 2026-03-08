async function computeHash(text, algorithm) {
  const res = await fetch('/api/hash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, algorithm }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Hash gagal');
  }
  return res.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('hash-input');
  const algoEl = document.getElementById('hash-algorithm');
  const resultEl = document.getElementById('hash-result');
  const resultLabel = document.getElementById('result-label');
  const lengthBadge = document.getElementById('hash-length-badge');
  const singleResult = document.getElementById('single-result');
  const allResults = document.getElementById('all-results');
  const hmacToggle = document.getElementById('hmac-toggle');
  const hmacSection = document.getElementById('hmac-key-section');

  hmacToggle?.addEventListener('change', () => {
    hmacSection?.classList.toggle('hidden', !hmacToggle.checked);
  });

  document.getElementById('btn-hash')?.addEventListener('click', async () => {
    const text = inputEl.value;
    const algo = algoEl.value;
    if (!text) { Toast.show('Input tidak boleh kosong', 'warning'); return; }
    singleResult?.classList.remove('hidden');
    allResults?.classList.add('hidden');
    resultEl.innerHTML = '<span class="text-muted">Computing...</span>';
    try {
      const data = await computeHash(text, algo);
      resultEl.textContent = data.hash;
      if (resultLabel) resultLabel.textContent = `${algo.toUpperCase()} Hash`;
      if (lengthBadge) lengthBadge.textContent = `${data.length} chars`;
    } catch (e) {
      Toast.show(e.message, 'error');
      resultEl.innerHTML = `<span class="text-error">${e.message}</span>`;
    }
  });

  document.getElementById('btn-hash-all')?.addEventListener('click', async () => {
    const text = inputEl.value;
    if (!text) { Toast.show('Input tidak boleh kosong', 'warning'); return; }
    singleResult?.classList.add('hidden');
    allResults?.classList.remove('hidden');
    const algos = ['md5', 'sha1', 'sha256', 'sha512', 'sha3-256', 'sha3-512'];
    await Promise.all(algos.map(async algo => {
      const el = document.getElementById(`result-${algo}`);
      if (!el) return;
      el.textContent = 'Computing...';
      el.className = 'font-mono text-xs text-muted break-all';
      try {
        const data = await computeHash(text, algo);
        el.textContent = data.hash;
        el.className = 'font-mono text-xs text-accent break-all';
      } catch {
        el.textContent = 'Error';
        el.className = 'font-mono text-xs text-error break-all';
      }
    }));
  });

  document.getElementById('btn-copy-hash')?.addEventListener('click', () => {
    const text = resultEl.textContent;
    if (!text || text === 'Hash akan muncul di sini...') { Toast.show('Tidak ada hash', 'warning'); return; }
    copyToClipboard(text);
  });

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (target && target.textContent !== '-') copyToClipboard(target.textContent);
    });
  });
});
