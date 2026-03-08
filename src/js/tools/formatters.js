document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('json-formatter')) {
    const inputEl = document.getElementById('json-input');
    const outputEl = document.getElementById('json-output');
    const statusEl = document.getElementById('json-status');
    const infoEl = document.getElementById('json-info');

    function setStatus(msg, ok) {
      if (!statusEl) return;
      statusEl.classList.remove('hidden');
      statusEl.textContent = msg;
      statusEl.className = `text-xs rounded-lg p-2.5 border ${ok ? 'text-success bg-success/10 border-success/20' : 'text-error bg-error/10 border-error/20'}`;
    }

    function parseJSON() {
      const raw = inputEl.value.trim();
      if (!raw) throw new Error('Input kosong');
      return JSON.parse(raw);
    }

    document.getElementById('btn-format')?.addEventListener('click', () => {
      try {
        const parsed = parseJSON();
        const formatted = JSON.stringify(parsed, null, 2);
        outputEl.value = formatted;
        setStatus('✓ JSON valid & berhasil diformat', true);
        if (infoEl) {
          infoEl.classList.remove('hidden');
          infoEl.textContent = `${formatted.length.toLocaleString()} chars`;
        }
      } catch (e) {
        outputEl.value = '';
        setStatus(`✗ ${e.message}`, false);
      }
    });

    document.getElementById('btn-minify')?.addEventListener('click', () => {
      try {
        const parsed = parseJSON();
        const minified = JSON.stringify(parsed);
        outputEl.value = minified;
        setStatus('✓ JSON berhasil diminify', true);
        if (infoEl) {
          infoEl.classList.remove('hidden');
          infoEl.textContent = `${minified.length.toLocaleString()} chars`;
        }
      } catch (e) {
        outputEl.value = '';
        setStatus(`✗ ${e.message}`, false);
      }
    });

    document.getElementById('btn-validate')?.addEventListener('click', () => {
      try {
        const parsed = parseJSON();
        const keys = Object.keys(parsed);
        setStatus(`✓ JSON valid — ${keys.length} top-level key(s)`, true);
      } catch (e) {
        setStatus(`✗ ${e.message}`, false);
      }
    });

    document.getElementById('btn-copy')?.addEventListener('click', () => {
      if (!outputEl.value) { Toast.show('Tidak ada output', 'warning'); return; }
      copyToClipboard(outputEl.value);
    });

    document.getElementById('btn-clear')?.addEventListener('click', () => {
      inputEl.value = '';
      outputEl.value = '';
      statusEl?.classList.add('hidden');
      infoEl?.classList.add('hidden');
    });
  }

  if (path.includes('jwt-decoder')) {
    const inputEl = document.getElementById('jwt-input');
    const headerEl = document.getElementById('jwt-header');
    const payloadEl = document.getElementById('jwt-payload');
    const signatureEl = document.getElementById('jwt-signature');
    const errorEl = document.getElementById('jwt-error');
    const expiryEl = document.getElementById('jwt-expiry');

    function b64urlDecode(str) {
      const padded = str.replace(/-/g, '+').replace(/_/g, '/');
      const pad = padded.length % 4;
      return atob(padded + '==='.slice(0, pad === 0 ? 0 : 4 - pad));
    }

    function decodeJWT(token) {
      const parts = token.trim().split('.');
      if (parts.length !== 3) throw new Error('Format JWT tidak valid. JWT harus memiliki 3 bagian (header.payload.signature)');
      try {
        const header = JSON.parse(b64urlDecode(parts[0]));
        const payload = JSON.parse(b64urlDecode(parts[1]));
        return { header, payload, signature: parts[2] };
      } catch {
        throw new Error('Gagal mendecode JWT. Pastikan token valid.');
      }
    }

    function timeAgo(ts) {
      const diff = Date.now() / 1000 - ts;
      if (diff < 0) return `dalam ${Math.abs(Math.round(diff / 60))} menit`;
      if (diff < 60) return `${Math.round(diff)} detik lalu`;
      if (diff < 3600) return `${Math.round(diff / 60)} menit lalu`;
      return `${Math.round(diff / 3600)} jam lalu`;
    }

    document.getElementById('btn-decode')?.addEventListener('click', () => {
      const token = inputEl.value.trim();
      errorEl?.classList.add('hidden');
      if (!token) { Toast.show('Paste JWT token dulu', 'warning'); return; }
      try {
        const { header, payload, signature } = decodeJWT(token);
        headerEl.textContent = JSON.stringify(header, null, 2);
        payloadEl.textContent = JSON.stringify(payload, null, 2);
        if (signatureEl) signatureEl.textContent = signature;
        if (expiryEl && payload.exp) {
          const expired = Date.now() / 1000 > payload.exp;
          expiryEl.textContent = expired ? `✗ Expired (${timeAgo(payload.exp)})` : `✓ Valid (exp: ${timeAgo(payload.exp)})`;
          expiryEl.className = `text-xs font-medium ${expired ? 'text-error' : 'text-success'}`;
        }
      } catch (e) {
        if (errorEl) {
          errorEl.textContent = e.message;
          errorEl.classList.remove('hidden');
        }
      }
    });
  }

  if (path.includes('regex')) {
    const patternEl = document.getElementById('regex-pattern');
    const flagsEl = document.getElementById('regex-flags');
    const testEl = document.getElementById('regex-test');
    const matchList = document.getElementById('match-list');
    const matchCount = document.getElementById('match-count');
    const errorEl = document.getElementById('regex-error');

    function runRegex() {
      const pattern = patternEl?.value;
      const flags = flagsEl?.value;
      const testStr = testEl?.value;
      if (!pattern || !testStr) {
        if (matchList) matchList.innerHTML = '<div class="text-xs text-muted">Matches akan muncul di sini...</div>';
        if (matchCount) matchCount.textContent = '';
        return;
      }
      errorEl?.classList.add('hidden');
      try {
        const regex = new RegExp(pattern, flags || 'g');
        const matches = [];
        let m;
        const hasGlobal = regex.flags.includes('g');
        if (hasGlobal) {
          while ((m = regex.exec(testStr)) !== null) {
            matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
            if (m[0].length === 0) regex.lastIndex++;
          }
        } else {
          m = regex.exec(testStr);
          if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
        }
        if (matchCount) matchCount.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
        if (matchList) {
          if (!matches.length) {
            matchList.innerHTML = '<div class="text-xs text-muted">Tidak ada match</div>';
          } else {
            matchList.innerHTML = matches.map((m, i) => `
              <div class="p-2 bg-surface border border-border rounded-lg">
                <div class="flex items-center gap-2 mb-1">
                  <span class="badge tag-formatters text-[10px]">#${i + 1}</span>
                  <span class="text-xs text-muted">index: ${m.index}</span>
                </div>
                <code class="text-sm text-accent font-mono break-all">${escapeHtml(m.match)}</code>
                ${m.groups.length ? `<div class="mt-1 text-xs text-secondary">Groups: ${m.groups.map(g => `<code class="text-warning">${escapeHtml(g || '')}</code>`).join(', ')}</div>` : ''}
              </div>
            `).join('');
          }
        }
      } catch (e) {
        if (errorEl) {
          errorEl.textContent = `Regex error: ${e.message}`;
          errorEl.classList.remove('hidden');
        }
        if (matchList) matchList.innerHTML = '';
        if (matchCount) matchCount.textContent = '';
      }
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    patternEl?.addEventListener('input', runRegex);
    flagsEl?.addEventListener('input', runRegex);
    testEl?.addEventListener('input', runRegex);
  }
});
