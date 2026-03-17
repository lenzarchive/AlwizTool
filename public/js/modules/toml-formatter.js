// Minimal TOML parser/stringifier
const TOML = (() => {
  function parse(str) {
    const result = {};
    let current = result;
    let currentPath = [];
    const lines = str.split('\n');
    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      // Table header
      const tableMatch = line.match(/^\[([^\[\]]+)\]$/);
      if (tableMatch) {
        currentPath = tableMatch[1].split('.').map(s => s.trim());
        current = result;
        for (const key of currentPath) {
          if (!current[key]) current[key] = {};
          current = current[key];
        }
        continue;
      }
      // Key = value
      const eqIdx = line.indexOf('=');
      if (eqIdx < 0) continue;
      const key = line.slice(0, eqIdx).trim();
      const rawVal = line.slice(eqIdx + 1).trim();
      current[key] = parseValue(rawVal);
    }
    return result;
  }

  function parseValue(v) {
    if (v === 'true') return true;
    if (v === 'false') return false;
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      return v.slice(1, -1);
    if (v.startsWith('[') && v.endsWith(']')) {
      const inner = v.slice(1, -1).trim();
      if (!inner) return [];
      return inner.split(',').map(s => parseValue(s.trim()));
    }
    const n = Number(v);
    if (!isNaN(n) && v !== '') return n;
    return v;
  }

  function stringify(obj, path) {
    let out = '';
    const simple = {};
    const nested = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) nested[k] = v;
      else simple[k] = v;
    }
    for (const [k, v] of Object.entries(simple)) {
      if (typeof v === 'string') out += k + ' = "' + v + '"\n';
      else if (Array.isArray(v)) out += k + ' = [' + v.map(i => typeof i === 'string' ? '"'+i+'"' : i).join(', ') + ']\n';
      else out += k + ' = ' + v + '\n';
    }
    for (const [k, v] of Object.entries(nested)) {
      const newPath = path ? path + '.' + k : k;
      out += '\n[' + newPath + ']\n';
      out += stringify(v, newPath);
    }
    return out;
  }

  return { parse, stringify };
})();

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('inputText');
  const output = document.getElementById('outputText');
  const statusMsg = document.getElementById('statusMsg');

  function setStatus(msg, type) {
    statusMsg.className = 'text-xs font-medium flex items-center gap-1.5';
    if (type === 'success') {
      statusMsg.innerHTML = '<svg class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span class="text-green-600 dark:text-green-400">' + msg + '</span>';
    } else {
      statusMsg.innerHTML = '<svg class="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg><span class="text-red-600 dark:text-red-400">' + msg + '</span>';
    }
  }

  document.getElementById('btnFormat').addEventListener('click', () => {
    try {
      const parsed = TOML.parse(input.value);
      output.value = TOML.stringify(parsed);
      setStatus(I18N.validMsg || 'Valid TOML', 'success');
    } catch(e) { setStatus((I18N.invalidMsg || 'Invalid TOML') + ': ' + e.message, 'error'); }
  });

  document.getElementById('btnToJson').addEventListener('click', () => {
    try {
      const parsed = TOML.parse(input.value);
      output.value = JSON.stringify(parsed, null, 2);
      setStatus(I18N.convertedJson || 'Converted to JSON', 'success');
    } catch(e) { setStatus((I18N.invalidMsg || 'Invalid TOML') + ': ' + e.message, 'error'); }
  });

  document.getElementById('btnFromJson').addEventListener('click', () => {
    try {
      const parsed = JSON.parse(input.value);
      output.value = TOML.stringify(parsed);
      setStatus(I18N.convertedToml || 'Converted to TOML', 'success');
    } catch(e) { setStatus((I18N.invalidJson || 'Invalid JSON') + ': ' + e.message, 'error'); }
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    input.value = ''; output.value = ''; statusMsg.innerHTML = '';
  });

  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!output.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(output.value);
    showToast(I18N.copied || 'Copied!');
  });
});
