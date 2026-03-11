async function checkOG() {
  const url = document.getElementById('urlInput').value.trim();
  const errEl  = document.getElementById('errorMsg');
  const errTxt = document.getElementById('errorText');
  const loading = document.getElementById('loadingState');
  const results = document.getElementById('results');
  errEl.classList.add('hidden');
  results.classList.add('hidden');
  if (!url) {
    errTxt.textContent = 'Please enter a URL first.';
    errEl.classList.remove('hidden');
    return;
  }
  loading.classList.remove('hidden');
  document.getElementById('btnCheck').disabled = true;
  try {
    const res = await fetch('/api/opengraph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const json = await res.json();
    loading.classList.add('hidden');
    document.getElementById('btnCheck').disabled = false;
    if (!json.success) {
      errTxt.textContent = json.error || 'Failed to fetch page.';
      errEl.classList.remove('hidden');
      return;
    }
    const d = json.data;
    results.classList.remove('hidden');
    renderImageSlot('ogImage', d.image);
    document.getElementById('ogSite').textContent  = d.siteName || extractDomain(d.canonical || url);
    document.getElementById('ogTitle').textContent = d.title || '(no title)';
    document.getElementById('ogDesc').textContent  = d.description || '';
    renderImageSlot('twImage', d.twitterImage || d.image);
    document.getElementById('twCard').textContent  = d.twitterCard ? ((I18N.cardType || 'Card') + ': ' + d.twitterCard) : (d.twitterSite ? '@' + d.twitterSite : '');
    document.getElementById('twTitle').textContent = d.twitterTitle  || d.title || '(no title)';
    document.getElementById('twDesc').textContent  = d.twitterDescription || d.description || '';
    const infoBar = document.getElementById('infoBar');
    const infos = [];
    if (d.charset)     infos.push(['Charset', d.charset]);
    if (d.type)        infos.push(['OG Type', d.type]);
    if (d.imageWidth && d.imageHeight) infos.push(['Image Size', d.imageWidth + '×' + d.imageHeight]);
    if (d.favicon)     infos.push(['Favicon', `<img src="${escH(d.favicon)}" class="inline w-4 h-4 mr-1 rounded align-middle"><span class="align-middle break-all">${escH(d.favicon)}</span>`]);
    infoBar.innerHTML = infos.map(([k, v]) =>
      `<span class="flex items-start gap-1.5 text-slate-500 dark:text-slate-400 min-w-0">
        <span class="font-medium text-slate-700 dark:text-slate-300 shrink-0">${k}:</span>
        <span class="font-mono break-all min-w-0">${v}</span>
      </span>`
    ).join('');
    infoBar.classList.toggle('hidden', infos.length === 0);
    const metas = [
      ['og:title',              d.title],
      ['og:description',        d.description],
      ['og:image',              d.image],
      ['og:image:width',        d.imageWidth],
      ['og:image:height',       d.imageHeight],
      ['og:type',               d.type],
      ['og:site_name',          d.siteName],
      ['og:url',                d.canonical],
      ['twitter:card',          d.twitterCard],
      ['twitter:site',          d.twitterSite],
      ['twitter:title',         d.twitterTitle],
      ['twitter:description',   d.twitterDescription],
      ['twitter:image',         d.twitterImage],
      ['theme-color',           d.themeColor],
      ['charset',               d.charset],
      ['favicon',               d.favicon],
    ].filter(([, v]) => v != null && v !== '');
    const copyBtn = document.getElementById('btnCopyMeta');
    copyBtn.classList.toggle('hidden', metas.length === 0);
    document.getElementById('metaTable').innerHTML = metas.map(([key, val]) =>
      `<div class="py-2 group border-b border-slate-100 dark:border-slate-800 last:border-0">
        <div class="flex items-center justify-between gap-2 mb-0.5">
          <span class="font-mono text-xs text-indigo-500 dark:text-indigo-400 shrink-0">${escH(key)}</span>
          <button class="copy-btn shrink-0 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            onclick="copyToClipboard('${escAttr(String(val))}'); showToast('${escAttr(I18N.copied || 'Copied!')}')"
          >${I18N.copied ? I18N.copied.replace('!','') : 'Copy'}</button>
        </div>
        <span class="text-xs text-slate-700 dark:text-slate-300 break-all block w-full">${escH(String(val))}</span>
      </div>`
    ).join('');
    copyBtn.onclick = () => {
      const obj = Object.fromEntries(metas);
      copyToClipboard(JSON.stringify(obj, null, 2));
      showToast(I18N.copied || 'Copied!');
    };
  } catch (e) {
    loading.classList.add('hidden');
    document.getElementById('btnCheck').disabled = false;
    errTxt.textContent = 'Network error: ' + e.message;
    errEl.classList.remove('hidden');
  }
}
function renderImageSlot(id, imgUrl) {
  const el = document.getElementById(id);
  if (imgUrl) {
    el.innerHTML = `<img src="${escH(imgUrl)}" class="w-full h-full object-cover"
      onerror="this.parentElement.innerHTML='<span class=\\'text-slate-400 text-xs\\'>${escH(I18N.noImage || 'No Image')}</span>'"
    >`;
  } else {
    el.innerHTML = `<span class="text-slate-400 text-xs">${I18N.noImage || 'No Image'}</span>`;
  }
}
function extractDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}
function escH(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) {
  return String(s).replace(/'/g,"\\'").replace(/\n/g,' ');
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnCheck').addEventListener('click', checkOG);
  document.getElementById('urlInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkOG();
  });
});
