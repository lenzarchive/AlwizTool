function getIndent(size) {
  return size === 'tab' ? '\t' : ' '.repeat(parseInt(size));
}
function formatXml(xml, indent) {
  let depth = 0;
  const ind = getIndent(indent);
  return xml
    .replace(/>\s*</g, '><')
    .replace(/(<\/?[^>]+>)/g, (match) => {
      let result = '';
      if (match.startsWith('</')) {
        depth = Math.max(0, depth - 1);
        result = '\n' + ind.repeat(depth) + match;
      } else if (match.endsWith('/>') || match.startsWith('<?') || match.startsWith('<!')) {
        result = '\n' + ind.repeat(depth) + match;
      } else {
        result = '\n' + ind.repeat(depth) + match;
        depth++;
      }
      return result;
    }).trim();
}
function minifyXml(xml) {
  return xml.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
}
function validateXml(xml) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const err = doc.querySelector('parsererror');
    if (err) throw new Error(err.textContent.split('\n')[0]);
    return { valid: true, tags: doc.querySelectorAll('*').length };
  } catch(e) {
    return { valid: false, error: e.message };
  }
}
function updateOutput(content) {
  document.getElementById('outputText').value = content;
  const v = validateXml(content);
  const msg = document.getElementById('statusMsg');
  const stats = document.getElementById('statsBar');
  if (v.valid) {
    msg.innerHTML = '<svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span class="text-emerald-500">' + I18N.valid + '</span>';
    stats.classList.remove('hidden');
    document.getElementById('statChars').textContent = content.length + ' ' + I18N.chars;
    document.getElementById('statTags').textContent = v.tags + ' ' + I18N.tags;
  } else {
    msg.innerHTML = '<span class="text-rose-500">' + I18N.invalid + ': ' + v.error + '</span>';
    stats.classList.add('hidden');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnFormat').addEventListener('click', () => {
    const xml = document.getElementById('inputText').value.trim();
    if (!xml) return;
    const indent = document.getElementById('indentSelect').value;
    updateOutput(formatXml(xml, indent));
  });
  document.getElementById('btnMinify').addEventListener('click', () => {
    const xml = document.getElementById('inputText').value.trim();
    if (!xml) return;
    updateOutput(minifyXml(xml));
  });
  document.getElementById('btnValidate').addEventListener('click', () => {
    const xml = document.getElementById('inputText').value.trim();
    if (!xml) return;
    document.getElementById('outputText').value = xml;
    const v = validateXml(xml);
    const msg = document.getElementById('statusMsg');
    if (v.valid) {
      msg.innerHTML = '<span class="text-emerald-500">' + I18N.valid + '</span>';
    } else {
      msg.innerHTML = '<span class="text-rose-500">' + I18N.invalid + ': ' + v.error + '</span>';
    }
  });
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    document.getElementById('statusMsg').innerHTML = '';
    document.getElementById('statsBar').classList.add('hidden');
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast(I18N.nothingToCopy, 'error');
    copyToClipboard(val);
    showToast(I18N.copied);
  });
});
