function csvToJson(csv, delimiter, hasHeader, pretty) {
  const lines = csv.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) return '[]';
  const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parseRow = (line) => {
    const result = [], re = new RegExp(`(?:^|${delimiter === '\t' ? '\\t' : escapeRegex(delimiter)})("(?:[^"]|"")*"|[^${delimiter === '\t' ? '\\t' : escapeRegex(delimiter)}]*)`, 'g');
    let m;
    while ((m = re.exec(line)) !== null) {
      let val = m[1] ?? '';
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1,-1).replace(/""/g,'"');
      result.push(val);
    }
    return result;
  };
  if (hasHeader) {
    const headers = parseRow(lines[0]);
    const rows = lines.slice(1).map(l => {
      const vals = parseRow(l);
      const obj = {};
      headers.forEach((h, i) => obj[h] = vals[i] ?? '');
      return obj;
    });
    return JSON.stringify(rows, null, pretty ? 2 : 0);
  } else {
    return JSON.stringify(lines.map(l => parseRow(l)), null, pretty ? 2 : 0);
  }
}
function jsonToCsv(jsonStr, delimiter) {
  let data;
  try { data = JSON.parse(jsonStr); } catch(e) { throw new Error('Invalid JSON: ' + e.message); }
  if (!Array.isArray(data) || !data.length) throw new Error('JSON must be a non-empty array');
  const d = delimiter === '\\t' ? '\t' : delimiter;
  const escapeCell = v => {
    const s = String(v ?? '');
    return (s.includes(d) || s.includes('"') || s.includes('\n')) ? '"' + s.replace(/"/g,'""') + '"' : s;
  };
  if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
    const keys = Object.keys(data[0]);
    const header = keys.map(escapeCell).join(d);
    const rows = data.map(row => keys.map(k => escapeCell(row[k])).join(d));
    return [header, ...rows].join('\n');
  } else {
    return data.map(row => (Array.isArray(row) ? row : [row]).map(escapeCell).join(d)).join('\n');
  }
}
function convert() {
  const input = document.getElementById('inputText').value.trim();
  const mode = document.getElementById('modeSelect').value;
  let delimiter = document.getElementById('delimiterSelect').value;
  const pretty = document.getElementById('prettyPrint').checked;
  const hasHeader = document.getElementById('includeHeader').checked;
  const errEl = document.getElementById('errorMsg');
  const outputEl = document.getElementById('outputText');
  errEl.classList.add('hidden');
  if (!input) { outputEl.value = ''; return; }
  try {
    if (mode === 'csv2json') {
      outputEl.value = csvToJson(input, delimiter, hasHeader, pretty);
    } else {
      outputEl.value = jsonToCsv(input, delimiter);
    }
  } catch(e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
    outputEl.value = '';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  ['inputText','modeSelect','delimiterSelect','prettyPrint','includeHeader'].forEach(id => {
    document.getElementById(id).addEventListener('change', convert);
    if (['inputText'].includes(id)) document.getElementById(id).addEventListener('input', convert);
  });
  document.getElementById('btnConvert').addEventListener('click', convert);
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    document.getElementById('errorMsg').classList.add('hidden');
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast(I18N.nothingToCopy, 'error');
    copyToClipboard(val);
    showToast(I18N.copied);
  });
});
