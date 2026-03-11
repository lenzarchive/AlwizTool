function calcPermissions() {
  let numeric = 0;
  const bits = { owner: 0, group: 0, others: 0 };
  document.querySelectorAll('.perm-bit').forEach(cb => {
    if (cb.checked) {
      bits[cb.dataset.role] += parseInt(cb.dataset.bit);
    }
  });
  document.querySelectorAll('.special-bit').forEach(cb => {
    if (cb.checked) numeric += parseInt(cb.dataset.bit);
  });
  numeric += bits.owner * 64 + bits.group * 8 + bits.others;
  const octal = numeric.toString(8).padStart(3, '0');
  document.getElementById('numericInput').value = octal;
  const sym = (b, suid, sgid, sticky) => {
    const r = b & 4 ? 'r' : '-';
    const w = b & 2 ? 'w' : '-';
    let x = b & 1 ? 'x' : '-';
    if (suid) x = b & 1 ? 's' : 'S';
    if (sgid) x = b & 1 ? 's' : 'S';
    if (sticky) x = b & 1 ? 't' : 'T';
    return r + w + x;
  };
  const setuid = document.querySelector('.special-bit[data-bit="2048"]').checked;
  const setgid = document.querySelector('.special-bit[data-bit="1024"]').checked;
  const sticky = document.querySelector('.special-bit[data-bit="512"]').checked;
  const symbolic = sym(bits.owner, setuid, false, false) + sym(bits.group, false, setgid, false) + sym(bits.others, false, false, sticky);
  document.getElementById('symbolicInput').value = symbolic;
  document.getElementById('chmodCommand').textContent = 'chmod ' + octal + ' filename';
  ['owner','group','others'].forEach(role => {
    const b = bits[role];
    const el = { r: document.getElementById('vis-'+role+'-r'), w: document.getElementById('vis-'+role+'-w'), x: document.getElementById('vis-'+role+'-x') };
    const set = (el, bit, letter) => {
      if (!el) return;
      const on = (b & bit) !== 0;
      el.textContent = on ? letter : '-';
      el.className = 'py-1.5 rounded font-bold text-center ' + (on ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600');
    };
    set(el.r, 4, 'r'); set(el.w, 2, 'w'); set(el.x, 1, 'x');
  });
}
function applyNumeric(val) {
  let n = parseInt(val, 8);
  if (isNaN(n) || n < 0 || n > 7777) return;
  const special = Math.floor(n / 0o1000);
  n = n % 0o1000;
  const o = Math.floor(n / 64), g = Math.floor((n % 64) / 8), oth = n % 8;
  document.querySelectorAll('.perm-bit').forEach(cb => {
    const role = cb.dataset.role, bit = parseInt(cb.dataset.bit);
    const map = { owner: o, group: g, others: oth };
    cb.checked = (map[role] & bit) !== 0;
  });
  document.querySelector('.special-bit[data-bit="2048"]').checked = (special & 4) !== 0;
  document.querySelector('.special-bit[data-bit="1024"]').checked = (special & 2) !== 0;
  document.querySelector('.special-bit[data-bit="512"]').checked  = (special & 1) !== 0;
  calcPermissions();
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.perm-bit, .special-bit').forEach(cb => {
    cb.addEventListener('change', calcPermissions);
  });
  document.getElementById('numericInput').addEventListener('input', function() {
    applyNumeric(this.value);
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    const cmd = document.getElementById('chmodCommand').textContent;
    copyToClipboard(cmd);
    showToast(I18N.copied);
  });
  applyNumeric('644');
});
