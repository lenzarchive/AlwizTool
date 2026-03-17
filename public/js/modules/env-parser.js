document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const tableBody = document.getElementById('tableBody');
  const outputText = document.getElementById('outputText');
  const exportFormat = document.getElementById('exportFormat');
  let pairs = [];

  function parseEnv(text) {
    const result = [];
    const lines = text.split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx < 0) continue;
      let key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result.push({ key, val, comment: '' });
    }
    return result;
  }

  function renderTable() {
    tableBody.innerHTML = '';
    pairs.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50';
      tr.innerHTML = `
        <td class="px-3 py-2"><input class="input-field text-xs py-1 w-full font-mono" value="${escHtml(p.key)}" data-i="${i}" data-field="key"></td>
        <td class="px-3 py-2"><input class="input-field text-xs py-1 w-full font-mono" value="${escHtml(p.val)}" data-i="${i}" data-field="val"></td>
        <td class="px-3 py-2 text-center">
          <button class="text-red-400 hover:text-red-600 text-xs" data-del="${i}">✕</button>
        </td>`;
      tableBody.appendChild(tr);
    });
    tableBody.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', e => {
        const idx = parseInt(e.target.dataset.i);
        const field = e.target.dataset.field;
        pairs[idx][field] = e.target.value;
      });
    });
    tableBody.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', e => {
        pairs.splice(parseInt(e.target.dataset.del), 1);
        renderTable();
      });
    });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function exportEnv() {
    const fmt = exportFormat.value;
    if (fmt === 'env') {
      outputText.value = pairs.map(p => p.key + '=' + (p.val.includes(' ') ? '"'+p.val+'"' : p.val)).join('\n');
    } else if (fmt === 'json') {
      const obj = {};
      pairs.forEach(p => { obj[p.key] = p.val; });
      outputText.value = JSON.stringify(obj, null, 2);
    } else if (fmt === 'yaml') {
      outputText.value = pairs.map(p => p.key + ': "' + p.val.replace(/"/g,'\\"') + '"').join('\n');
    } else if (fmt === 'docker') {
      outputText.value = pairs.map(p => '-e ' + p.key + '=' + (p.val.includes(' ') ? '"'+p.val+'"' : p.val)).join(' \\\n');
    }
  }

  document.getElementById('btnParse').addEventListener('click', () => {
    pairs = parseEnv(inputText.value);
    renderTable();
    document.getElementById('tableSection').classList.remove('hidden');
  });

  document.getElementById('btnAddRow').addEventListener('click', () => {
    pairs.push({ key: 'NEW_KEY', val: '' });
    renderTable();
    document.getElementById('tableSection').classList.remove('hidden');
  });

  document.getElementById('btnExport').addEventListener('click', exportEnv);

  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!outputText.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(outputText.value);
    showToast(I18N.copied || 'Copied!');
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    inputText.value = ''; outputText.value = ''; pairs = [];
    tableBody.innerHTML = '';
    document.getElementById('tableSection').classList.add('hidden');
  });
});
