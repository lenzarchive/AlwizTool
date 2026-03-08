var lastQrData = null;
var lastQrFormat = 'png';

async function generateQR() {
  var text = document.getElementById('qrInput').value.trim();
  var size = document.getElementById('qrSize').value;
  var format = document.getElementById('qrFormat').value;
  var btn = document.getElementById('btnGenerate');
  if (!text) return showToast('—', 'error');

  ['qrPlaceholder', 'qrResult', 'errorQR'].forEach(function(id) {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('loadingQR').classList.remove('hidden');
  btn.disabled = true;

  try {
    var res = await fetch('/api/qrcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, size: size, format: format })
    });
    var data = await res.json();
    if (!data.success) throw new Error(data.error);

    lastQrData = data.data;
    lastQrFormat = data.format;

    document.getElementById('loadingQR').classList.add('hidden');
    document.getElementById('qrResult').classList.remove('hidden');

    if (data.format === 'svg') {
      document.getElementById('qrImage').classList.add('hidden');
      var svgContainer = document.getElementById('qrSvgContainer');
      svgContainer.classList.remove('hidden');
      svgContainer.innerHTML = data.data;
    } else {
      document.getElementById('qrSvgContainer').classList.add('hidden');
      var img = document.getElementById('qrImage');
      img.src = data.data;
      img.classList.remove('hidden');
    }
  } catch (e) {
    document.getElementById('loadingQR').classList.add('hidden');
    var errEl = document.getElementById('errorQR');
    errEl.classList.remove('hidden');
    errEl.textContent = i18nQr.error + ': ' + e.message;
  } finally {
    btn.disabled = false;
  }
}

function downloadQR() {
  if (!lastQrData) return showToast('—', 'error');
  var a = document.createElement('a');
  if (lastQrFormat === 'svg') {
    var blob = new Blob([lastQrData], { type: 'image/svg+xml' });
    a.href = URL.createObjectURL(blob);
    a.download = 'qrcode.svg';
  } else {
    a.href = lastQrData;
    a.download = 'qrcode.png';
  }
  a.click();
}

function copyQR() {
  if (!lastQrData || lastQrFormat !== 'png') return showToast(i18nQr.pngOnly, 'error');
  fetch(lastQrData)
    .then(function(r) { return r.blob(); })
    .then(function(blob) {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast(i18nQr.copied);
    })
    .catch(function() { showToast('—', 'error'); });
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnGenerate').addEventListener('click', generateQR);
  document.getElementById('btnDownload').addEventListener('click', downloadQR);
  document.getElementById('btnCopyQR').addEventListener('click', copyQR);
  document.getElementById('qrInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateQR(); }
  });
});
