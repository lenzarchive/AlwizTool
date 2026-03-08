const HIGHLIGHT_COLORS = [
  'bg-yellow-200 dark:bg-yellow-700/60',
  'bg-green-200 dark:bg-green-700/60',
  'bg-blue-200 dark:bg-blue-700/60',
  'bg-pink-200 dark:bg-pink-700/60',
  'bg-orange-200 dark:bg-orange-700/60',
];

function getFlags() {
  return document.getElementById('regexFlagsInput').value;
}

function syncCheckboxes(flags) {
  document.querySelectorAll('.flag-check').forEach(cb => {
    cb.checked = flags.includes(cb.dataset.flag);
  });
}

function runRegex() {
  const pattern = document.getElementById('regexPattern').value;
  const flags = getFlags();
  const testStr = document.getElementById('testString').value;
  const errEl = document.getElementById('regexError');
  const countEl = document.getElementById('matchCount');
  const highlightEl = document.getElementById('highlightedText');
  const matchList = document.getElementById('matchList');
  const noMatchMsg = document.getElementById('noMatchMsg');

  errEl.classList.add('hidden');
  highlightEl.innerHTML = escapeHtml(testStr);
  countEl.textContent = '';
  matchList.innerHTML = '';
  noMatchMsg.classList.add('hidden');

  if (!pattern) return;

  let regex;
  try {
    regex = new RegExp(pattern, flags);
  } catch (e) {
    errEl.textContent = ((I18N && I18N.invalidRegex) || 'Invalid regex') + ': ' + e.message;
    errEl.classList.remove('hidden');
    return;
  }

  const matches = [...testStr.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];

  countEl.textContent = matches.length + ' ' + (matches.length === 1
    ? ((I18N && I18N.matchCount) || 'match')
    : ((I18N && I18N.matchCountPlural) || 'matches'));

  if (matches.length === 0) {
    noMatchMsg.classList.remove('hidden');
    return;
  }

  // Highlighted text
  let highlighted = '';
  let lastIdx = 0;
  matches.forEach((m, i) => {
    const color = HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length];
    highlighted += escapeHtml(testStr.slice(lastIdx, m.index));
    highlighted += `<mark class="rounded px-0.5 ${color} text-inherit">${escapeHtml(m[0])}</mark>`;
    lastIdx = m.index + m[0].length;
  });
  highlighted += escapeHtml(testStr.slice(lastIdx));
  highlightEl.innerHTML = highlighted;

  // Match list with groups
  matches.forEach((m, i) => {
    const div = document.createElement('div');
    div.className = 'p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1';
    const header = document.createElement('div');
    header.className = 'flex items-center gap-2';
    header.innerHTML = `<span class="font-mono font-semibold text-indigo-600 dark:text-indigo-400">Match ${i + 1}</span><span class="text-slate-400">index ${m.index}–${m.index + m[0].length}</span>`;
    const fullMatch = document.createElement('div');
    fullMatch.className = 'font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 break-all';
    fullMatch.textContent = m[0] || '(empty match)';
    div.append(header, fullMatch);
    if (m.length > 1) {
      const groups = m.slice(1);
      groups.forEach((g, gi) => {
        if (g === undefined) return;
        const gEl = document.createElement('div');
        gEl.className = 'text-slate-500 dark:text-slate-400 pl-2 border-l-2 border-indigo-200 dark:border-indigo-800';
        gEl.innerHTML = `<span class="text-xs font-medium mr-1">Group ${gi + 1}:</span><span class="font-mono">${escapeHtml(g)}</span>`;
        div.appendChild(gEl);
      });
    }
    matchList.appendChild(div);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.addEventListener('DOMContentLoaded', () => {
  const patternInput = document.getElementById('regexPattern');
  const flagsInput = document.getElementById('regexFlagsInput');
  const testInput = document.getElementById('testString');

  patternInput.addEventListener('input', runRegex);
  flagsInput.addEventListener('input', () => { syncCheckboxes(flagsInput.value); runRegex(); });
  testInput.addEventListener('input', runRegex);

  document.querySelectorAll('.flag-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const active = [...document.querySelectorAll('.flag-check:checked')].map(c => c.dataset.flag).join('');
      flagsInput.value = active;
      runRegex();
    });
  });
});
