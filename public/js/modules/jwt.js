function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}
function decodeJWT(token) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error((I18N && I18N.invalidToken) || 'Invalid JWT format');
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  return { header, payload, signature: parts[2] };
}
function renderDecode() {
  const token = document.getElementById('jwtInput').value.trim();
  const errEl = document.getElementById('errorMsg');
  const results = document.getElementById('results');
  errEl.classList.add('hidden');
  results.classList.add('hidden');
  try {
    const { header, payload } = decodeJWT(token);
    document.getElementById('headerJson').textContent = JSON.stringify(header, null, 2);
    document.getElementById('payloadJson').textContent = JSON.stringify(payload, null, 2);
    const bar = document.getElementById('tokenInfoBar');
    bar.innerHTML = '';
    const now = Math.floor(Date.now() / 1000);
    const addInfo = (label, value, highlight) => {
      const div = document.createElement('div');
      div.className = 'flex flex-col gap-0.5';
      const labelEl = document.createElement('span');
      labelEl.className = 'text-xs text-slate-400 uppercase tracking-wide';
      labelEl.textContent = label;
      const valEl = document.createElement('span');
      valEl.className = 'text-sm font-medium ' + (highlight ? highlight : 'text-slate-700 dark:text-slate-300');
      valEl.textContent = value;
      div.append(labelEl, valEl);
      bar.appendChild(div);
    };
    if (header.alg) addInfo(I18N.algorithm || 'Algorithm', header.alg, 'text-indigo-600 dark:text-indigo-400 font-mono');
    if (payload.iat) addInfo(I18N.issued || 'Issued At', new Date(payload.iat * 1000).toLocaleString());
    if (payload.exp) {
      const isExpired = now > payload.exp;
      addInfo(
        I18N.expires || 'Expires At',
        new Date(payload.exp * 1000).toLocaleString() + (isExpired ? ' — ' + (I18N.expired || 'Expired') : ''),
        isExpired ? 'text-red-500' : 'text-green-600 dark:text-green-400'
      );
    }
    if (payload.sub) addInfo('sub', payload.sub);
    if (payload.iss) addInfo('iss', payload.iss);
    results.classList.remove('hidden');
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnDecode').addEventListener('click', renderDecode);
  document.getElementById('jwtInput').addEventListener('paste', () => setTimeout(renderDecode, 50));
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('jwtInput').value = '';
    document.getElementById('results').classList.add('hidden');
    document.getElementById('errorMsg').classList.add('hidden');
  });
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.copy);
      if (!el) return;
      copyToClipboard(el.textContent);
      showToast((I18N && I18N.copied) || 'Copied!');
    });
  });
});
