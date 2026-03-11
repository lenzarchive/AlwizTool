function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);
  const result = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i-1] === b[j-1]) { result.unshift({type:'same', val:a[i-1]}); i--; j--; }
    else if (dp[i-1][j] >= dp[i][j-1]) { result.unshift({type:'removed', val:a[i-1]}); i--; }
    else { result.unshift({type:'added', val:b[j-1]}); j--; }
  }
  while (i > 0) result.unshift({type:'removed', val:a[--i]});
  while (j > 0) result.unshift({type:'added',   val:b[--j]});
  return result;
}
function diff() {
  const orig = document.getElementById('originalText').value;
  const mod  = document.getElementById('modifiedText').value;
  const a = orig.split('\n'), b = mod.split('\n');
  const changes = lcs(a, b);
  let added = 0, removed = 0;
  const html = changes.map((c, i) => {
    const lineNum = String(i+1).padStart(4,' ');
    const text = c.val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    if (c.type === 'added')   { added++;   return `<span class="diff-added">+ ${text}</span>`; }
    if (c.type === 'removed') { removed++; return `<span class="diff-removed">- ${text}</span>`; }
    return `<span class="diff-same">  ${text}</span>`;
  }).join('');
  const resultEl = document.getElementById('diffResult');
  const statsEl = document.getElementById('diffStats');
  if (!added && !removed) {
    resultEl.innerHTML = '<p class="text-slate-400 text-center py-8">' + I18N.noChanges + '</p>';
    statsEl.classList.add('hidden');
    return;
  }
  resultEl.innerHTML = html || '<p class="text-slate-400 text-center py-8">' + I18N.noChanges + '</p>';
  statsEl.classList.remove('hidden');
  document.getElementById('statAdded').textContent   = '+' + added   + ' ' + I18N.addedLabel;
  document.getElementById('statRemoved').textContent = '-' + removed + ' ' + I18N.removedLabel;
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnCompare').addEventListener('click', diff);
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('originalText').value = '';
    document.getElementById('modifiedText').value = '';
    document.getElementById('diffResult').innerHTML = '<p class="text-slate-400 text-center py-8">' + I18N.noChanges + '</p>';
    document.getElementById('diffStats').classList.add('hidden');
  });
  document.getElementById('originalText').addEventListener('input', diff);
  document.getElementById('modifiedText').addEventListener('input', diff);
});
