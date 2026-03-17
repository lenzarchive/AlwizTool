const DIRECTIVES = [
  { key: 'defaultSrc', name: "default-src", desc: "Fallback for all fetch directives" },
  { key: 'scriptSrc', name: "script-src", desc: "JavaScript sources" },
  { key: 'styleSrc', name: "style-src", desc: "CSS sources" },
  { key: 'imgSrc', name: "img-src", desc: "Image sources" },
  { key: 'fontSrc', name: "font-src", desc: "Font sources" },
  { key: 'connectSrc', name: "connect-src", desc: "XHR, WebSocket, fetch" },
  { key: 'mediaSrc', name: "media-src", desc: "Audio and video" },
  { key: 'objectSrc', name: "object-src", desc: "Plugin content (Flash, etc.)" },
  { key: 'frameSrc', name: "frame-src", desc: "iframe sources" },
  { key: 'workerSrc', name: "worker-src", desc: "Web workers" },
  { key: 'formAction', name: "form-action", desc: "Form submission targets" },
  { key: 'frameAncestors', name: "frame-ancestors", desc: "Who can embed this page" },
  { key: 'baseUri', name: "base-uri", desc: "Allowed base URLs" },
];

const PRESETS = {
  none: "'none'",
  self: "'self'",
  unsafeInline: "'unsafe-inline'",
  unsafeEval: "'unsafe-eval'",
  any: "*",
  data: "data:",
  blob: "blob:",
  cdn: "'self' https://cdnjs.cloudflare.com",
};

function buildCSP() {
  const parts = [];
  DIRECTIVES.forEach(dir => {
    const inputs = document.querySelectorAll('.dir-input[data-key="' + dir.key + '"]');
    const vals = [];
    inputs.forEach(inp => {
      if (inp.type === 'checkbox' && inp.checked) vals.push(inp.value);
      if (inp.type === 'text' && inp.value.trim()) vals.push(inp.value.trim());
    });
    if (vals.length) parts.push(dir.name + ' ' + vals.join(' '));
  });
  // Extra toggles
  if (document.getElementById('upgradeInsecure').checked) parts.push('upgrade-insecure-requests');
  if (document.getElementById('blockMixed').checked) parts.push('block-all-mixed-content');
  return parts.join('; ');
}

document.addEventListener('DOMContentLoaded', () => {
  function update() {
    const csp = buildCSP();
    document.getElementById('outputText').value = csp;
    document.getElementById('headerOutput').value = csp ? 'Content-Security-Policy: ' + csp : '';
  }

  document.querySelectorAll('.dir-input').forEach(el => el.addEventListener('change', update));
  document.querySelectorAll('.dir-input[type="text"]').forEach(el => el.addEventListener('input', update));
  document.getElementById('upgradeInsecure').addEventListener('change', update);
  document.getElementById('blockMixed').addEventListener('change', update);

  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('headerOutput').value;
    if (!val) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(val);
    showToast(I18N.copied || 'Copied!');
  });
  document.getElementById('btnCopyValue').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(val);
    showToast(I18N.copied || 'Copied!');
  });
  document.getElementById('btnReset').addEventListener('click', () => {
    document.querySelectorAll('.dir-input').forEach(el => {
      if (el.type === 'checkbox') el.checked = false;
      if (el.type === 'text') el.value = '';
    });
    document.getElementById('upgradeInsecure').checked = false;
    document.getElementById('blockMixed').checked = false;
    update();
  });
  document.getElementById('btnPresetStrict').addEventListener('click', () => {
    document.querySelectorAll('.dir-input').forEach(el => { if (el.type === 'checkbox') el.checked = false; });
    const check = (key, val) => {
      const el = document.querySelector('.dir-input[data-key="' + key + '"][value="' + val + '"]');
      if (el) el.checked = true;
    };
    check('defaultSrc', "'none'");
    check('scriptSrc', "'self'");
    check('styleSrc', "'self'");
    check('imgSrc', "'self'");
    check('fontSrc', "'self'");
    check('connectSrc', "'self'");
    check('formAction', "'self'");
    check('frameAncestors', "'none'");
    document.getElementById('upgradeInsecure').checked = true;
    update();
  });
});
