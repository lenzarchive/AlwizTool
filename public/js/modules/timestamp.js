function updateCurrent() {
  const now = Date.now();
  document.getElementById('currentSec').textContent = Math.floor(now / 1000);
  document.getElementById('currentMs').textContent = now;
  document.getElementById('currentISO').textContent = new Date(now).toISOString();
}
function convertTS() {
  const ts = document.getElementById('tsInput').value.trim();
  if (!ts) return showToast((I18N && I18N.invalidTs) || 'Invalid timestamp', 'error');
  const num = parseInt(ts);
  if (isNaN(num)) return showToast((I18N && I18N.invalidTs) || 'Invalid timestamp', 'error');
  let ms;
  const manualUnit = document.querySelector('input[name="tsUnit"]:checked');
  if (manualUnit) {
    ms = manualUnit.value === 'ms' ? num : num * 1000;
  } else if (num >= 1e12 && num <= 1e13) {
    ms = num;
  } else {
    ms = num * 1000;
  }
  const date = new Date(ms);
  if (isNaN(date.getTime())) return showToast((I18N && I18N.invalidTs) || 'Invalid timestamp', 'error');
  document.getElementById('ts-UTC').textContent = date.toUTCString();
  document.getElementById('ts-Local').textContent = date.toLocaleString();
  document.getElementById('ts-ISO8601').textContent = date.toISOString();
  document.getElementById('ts-RFC2822').textContent = date.toString();
  document.getElementById('tsResult').classList.remove('hidden');
}
document.addEventListener('DOMContentLoaded', () => {
  updateCurrent();
  setInterval(updateCurrent, 100);
  const now = new Date();
  now.setSeconds(0, 0);
  document.getElementById('dateInput').value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  document.getElementById('btnConvertTS').addEventListener('click', convertTS);
  document.getElementById('tsInput').addEventListener('keydown', e => { if (e.key === 'Enter') convertTS(); });
  document.getElementById('btnUseNow').addEventListener('click', () => {
    document.getElementById('tsInput').value = Math.floor(Date.now() / 1000);
    convertTS();
  });
  document.getElementById('btnConvertDate').addEventListener('click', () => {
    const val = document.getElementById('dateInput').value;
    if (!val) return showToast((I18N && I18N.pickDate) || 'Pick a date first', 'error');
    const date = new Date(val);
    document.getElementById('date-seconds').textContent = Math.floor(date.getTime() / 1000);
    document.getElementById('date-ms').textContent = date.getTime();
    document.getElementById('dateResult').classList.remove('hidden');
  });
  document.querySelectorAll('.copy-ts-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.target);
      if (!el || !el.textContent) return;
      copyToClipboard(el.textContent);
      showToast((I18N && I18N.copied) || 'Copied!');
    });
  });
});
