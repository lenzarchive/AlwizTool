async function checkOG() {
  const url = document.getElementById('urlInput').value.trim();
  const btn = document.getElementById('checkBtn');
  if (!url) return showToast(I18N.noUrl || 'Enter a URL first', 'error');

  ['loadingState', 'resultState', 'errorState'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('loadingState').classList.remove('hidden');
  btn.disabled = true;

  try {
    const res = await fetch('/api/opengraph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('resultState').classList.remove('hidden');

    const d = data.data;
    document.getElementById('ogTitle').textContent = d.title || '-';
    document.getElementById('ogDesc').textContent = d.description || '-';
    document.getElementById('ogSiteName').textContent = d.siteName || '';

    const ogImg = document.getElementById('ogImage');
    const ogNoImg = document.getElementById('ogNoImage');
    if (d.image) {
      ogImg.src = d.image;
      ogImg.classList.remove('hidden');
      ogNoImg.classList.add('hidden');
    } else {
      ogImg.classList.add('hidden');
      ogNoImg.classList.remove('hidden');
    }

    document.getElementById('twTitle').textContent = d.twitterTitle || d.title || '-';
    document.getElementById('twDesc').textContent = d.twitterDescription || d.description || '-';
    document.getElementById('twCard').textContent = d.twitterCard ? i18nOg.cardType + ': ' + d.twitterCard : '';

    const twImg = document.getElementById('twImage');
    const twNoImg = document.getElementById('twNoImage');
    const twImgSrc = d.twitterImage || d.image;
    if (twImgSrc) {
      twImg.src = twImgSrc;
      twImg.classList.remove('hidden');
      twNoImg.classList.add('hidden');
    } else {
      twImg.classList.add('hidden');
      twNoImg.classList.remove('hidden');
    }

    const metas = [
      ['og:title', d.title], ['og:description', d.description], ['og:image', d.image],
      ['og:type', d.type], ['og:site_name', d.siteName], ['twitter:card', d.twitterCard],
      ['twitter:title', d.twitterTitle], ['twitter:image', d.twitterImage],
      ['canonical', d.canonical], ['theme-color', d.themeColor],
    ];
    document.getElementById('metaList').innerHTML = metas.map(([key, val]) => `
      <div class="flex gap-2 ${val ? '' : 'opacity-40'}">
        <span class="font-mono text-xs text-slate-400 shrink-0 w-36">${key}</span>
        <span class="text-xs text-slate-700 dark:text-slate-300 break-all">${val || '—'}</span>
      </div>
    `).join('');
  } catch (e) {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
    document.getElementById('errorMsg').textContent = e.message;
  } finally {
    btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('checkBtn').addEventListener('click', checkOG);
  document.getElementById('urlInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkOG();
  });
});
