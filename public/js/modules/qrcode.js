let qrController;
async function generateQR() {
  const text = document.getElementById('inputText').value.trim();
  const size = parseInt(document.getElementById('sizeInput').value) || 300;
  const format = document.getElementById('formatSelect').value;
  const placeholder = document.getElementById('qrPlaceholder');
  const resultEl = document.getElementById('qrResult');
  if (!text) return showToast('Enter some text first', 'error');
  if (qrController) qrController.abort();
  qrController = new AbortController();
  placeholder.classList.add('hidden');
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = '<svg class="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>';
  try {
    const res = await fetch('/api/qrcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, size, format }),
      signal: qrController.signal
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    if (format === 'svg') {
      resultEl.innerHTML = data.data;
      const svg = resultEl.querySelector('svg');
      if (svg) { svg.style.maxWidth = '100%'; svg.style.height = 'auto'; }
    } else {
      resultEl.innerHTML = `<img src="${data.data}" alt="QR Code" style="max-width:${size}px;width:100%;height:auto;" class="rounded-lg">`;
    }
    resultEl.dataset.dataUrl = data.data;
    resultEl.dataset.format = format;
  } catch (e) {
    if (e.name !== 'AbortError') resultEl.innerHTML = '<span class="text-red-500 text-sm">' + e.message + '</span>';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnGenerate').addEventListener('click', generateQR);
  document.getElementById('inputText').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateQR(); }
  });
  document.getElementById('btnCopyImg').addEventListener('click', async () => {
    const r = document.getElementById('qrResult');
    if (!r.dataset.dataUrl) return showToast((I18N && I18N.pngOnly) || 'Generate first', 'error');
    if (r.dataset.format === 'svg') return showToast((I18N && I18N.pngOnly) || 'Only PNG can be copied', 'error');
    try {
      const res = await fetch(r.dataset.dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast((I18N && I18N.copied) || 'Copied!');
    } catch(e) {
      showToast('Copy failed — try downloading instead', 'error');
    }
  });
  document.getElementById('btnDownload').addEventListener('click', () => {
    const r = document.getElementById('qrResult');
    if (!r.dataset.dataUrl) return showToast('Generate first', 'error');
    const fmt = r.dataset.format || 'png';
    if (fmt === 'svg') {
      const blob = new Blob([r.innerHTML], { type: 'image/svg+xml' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'qrcode.svg';
      a.click();
    } else {
      const a = document.createElement('a');
      a.href = r.dataset.dataUrl;
      a.download = 'qrcode.png';
      a.click();
    }
  });
});
