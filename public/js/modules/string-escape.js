const escapers = {
  js: {
    escape: s => s.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"')
                  .replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\t/g,'\\t')
                  .replace(/\0/g,'\\0').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029'),
    unescape: s => { try { return Function('"use strict"; return ' + JSON.stringify(s).replace(/^"|"$/g,'').split('').reduce((acc,c,i,a) => acc, s) } catch(e) { return s; } }
  },
  json: {
    escape: s => JSON.stringify(s).slice(1,-1),
    unescape: s => { try { return JSON.parse('"' + s + '"'); } catch(e) { return s; } }
  },
  html: {
    escape: s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'),
    unescape: s => s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
  },
  sql: {
    escape: s => s.replace(/'/g,"''").replace(/\\/g,'\\\\').replace(/\x00/g,'\\0').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\x1a/g,'\\Z'),
    unescape: s => s.replace(/''/g,"'").replace(/\\\\/g,'\\')
  },
  regex: {
    escape: s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    unescape: s => s.replace(/\\([.*+?^${}()|[\]\\])/g, '$1')
  },
  csv: {
    escape: s => {
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    },
    unescape: s => {
      if (s.startsWith('"') && s.endsWith('"')) {
        return s.slice(1,-1).replace(/""/g,'"');
      }
      return s;
    }
  }
};

function convert() {
  const input = document.getElementById('inputText').value;
  const mode  = document.getElementById('modeSelect').value;
  const type  = document.getElementById('typeSelect').value;
  const fn = escapers[type];
  if (!fn) return;
  try {
    document.getElementById('outputText').value = mode === 'escape' ? fn.escape(input) : fn.unescape(input);
  } catch(e) {
    document.getElementById('outputText').value = 'Error: ' + e.message;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('input', convert);
  document.getElementById('modeSelect').addEventListener('change', convert);
  document.getElementById('typeSelect').addEventListener('change', convert);
  document.getElementById('btnConvert').addEventListener('click', convert);
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
  });
  document.getElementById('btnSwap').addEventListener('click', () => {
    const i = document.getElementById('inputText');
    const o = document.getElementById('outputText');
    [i.value, o.value] = [o.value, i.value];
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast(I18N.nothingToCopy, 'error');
    copyToClipboard(val);
    showToast(I18N.copied);
  });
});
