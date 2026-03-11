let hashCtrl;
async function generateHashes() {
  const text = document.getElementById('inputText').value;
  const hmacKey = document.getElementById('hmacKey').value;
  const algos = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];
  if (!text) {
    algos.forEach(a => { document.getElementById('hash-' + a).value = ''; });
    return;
  }
  if (hashCtrl) hashCtrl.abort();
  hashCtrl = new AbortController();
  try {
    const body = { text };
    if (hmacKey) body.hmacKey = hmacKey;
    const res = await fetch('/api/hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: hashCtrl.signal
    });
    const data = await res.json();
    if (data.success) {
      algos.forEach(a => {
        document.getElementById('hash-' + a).value = data.data[a] || '—';
      });
    }
  } catch (e) {
    if (e.name !== 'AbortError') console.error(e);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  let hashDebounce;
  const debouncedHash = () => { clearTimeout(hashDebounce); hashDebounce = setTimeout(generateHashes, 400); };
  document.getElementById('btnGenerate').addEventListener('click', generateHashes);
  document.getElementById('inputText').addEventListener('input', debouncedHash);
  document.getElementById('hmacKey').addEventListener('input', debouncedHash);
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('hmacKey').value = '';
    ['md5','sha1','sha256','sha384','sha512'].forEach(a => {
      document.getElementById('hash-' + a).value = '';
    });
  });
  document.querySelectorAll('.copy-hash-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = document.getElementById('hash-' + btn.dataset.algo).value;
      if (!val || val === '—') return showToast((I18N && I18N.nothingToCopy) || 'Nothing to copy', 'error');
      copyToClipboard(val);
      showToast((I18N && I18N.copied) || 'Copied!');
    });
  });
  document.getElementById('btnCopyAll').addEventListener('click', () => {
    const lines = ['md5','sha1','sha256','sha384','sha512']
      .map(a => a.toUpperCase() + ': ' + (document.getElementById('hash-' + a).value || ''))
      .filter(l => !l.endsWith(': ') && !l.endsWith('—'));
    if (!lines.length) return showToast((I18N && I18N.generateFirst) || 'Generate first', 'error');
    copyToClipboard(lines.join('\n'));
    showToast((I18N && I18N.copied) || 'Copied!');
  });
});
