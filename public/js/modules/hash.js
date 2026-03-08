async function generateHash() {
  const text = document.getElementById('inputText').value;
  const loading = document.getElementById('loadingIndicator');
  if (!text.trim()) return showToast(I18N.noText || 'Enter text first', 'error');
  loading.classList.remove('hidden');
  try {
    const res = await fetch('/api/hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    ['md5', 'sha1', 'sha256', 'sha384', 'sha512'].forEach(a => {
      document.getElementById('hash-' + a).value = data.data[a] || '';
    });
  } catch (e) {
    showToast('Error: ' + e.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnGenerate').addEventListener('click', generateHash);
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    ['md5', 'sha1', 'sha256', 'sha384', 'sha512'].forEach(a => {
      document.getElementById('hash-' + a).value = '';
    });
  });
  document.querySelectorAll('.copy-hash-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = document.getElementById('hash-' + btn.dataset.algo).value;
      if (!val) return showToast(I18N.noHash || 'No hash yet', 'error');
      copyToClipboard(val);
      showToast(btn.dataset.algo.toUpperCase() + ' ' + (I18N.copied || 'Copied!'));
    });
  });
  document.getElementById('inputText').addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') generateHash();
  });
});
