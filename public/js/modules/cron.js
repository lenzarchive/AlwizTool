const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function parseCronField(field, min, max) {
  if (field === '*') return null; 
  const values = new Set();
  for (const part of field.split(',')) {
    if (part.includes('/')) {
      const [range, step] = part.split('/');
      const [start, end] = range === '*' ? [min, max] : range.split('-').map(Number);
      for (let i = (start||min); i <= (end||max); i += parseInt(step)) values.add(i);
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) values.add(i);
    } else {
      values.add(parseInt(part));
    }
  }
  return [...values].filter(v => v >= min && v <= max).sort((a,b)=>a-b);
}
function describeCron(expr) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  const [min, hr, dom, mon, dow] = parts;
  let desc = 'Runs ';
  if (min === '*' && hr === '*') desc += 'every minute';
  else if (min.startsWith('*/') && hr.startsWith('*/')) desc += 'every ' + min.slice(2) + ' minute(s) of every ' + hr.slice(2) + ' hour(s)';
  else if (min.startsWith('*/')) desc += 'every ' + min.slice(2) + ' minute(s)';
  else if (hr === '*') desc += 'at minute ' + min + ' of every hour';
  else {
    const m = min === '*' ? 0 : parseInt(min);
    const h = parseInt(hr);
    const pad = n => String(n).padStart(2,'0');
    desc += 'at ' + pad(h) + ':' + pad(m);
  }
  if (dow !== '*') {
    const days = parseCronField(dow, 0, 7);
    const names = days.map(d => DAYS_SHORT[d % 7]);
    desc += ' on ' + names.join(', ');
  }
  if (mon !== '*') {
    const months = parseCronField(mon, 1, 12);
    const names = months.map(m => MONTHS_SHORT[m-1]);
    desc += ' in ' + names.join(', ');
  }
  if (dom !== '*') {
    const days = parseCronField(dom, 1, 31);
    desc += ' on day ' + days.join(', ') + ' of the month';
  }
  return desc;
}
function getNextRuns(expr, count = 5) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  const [minF, hrF, domF, monF, dowF] = parts;
  const mins   = parseCronField(minF, 0, 59);
  const hrs    = parseCronField(hrF,  0, 23);
  const doms   = parseCronField(domF, 1, 31);
  const mons   = parseCronField(monF, 1, 12);
  const dows   = parseCronField(dowF, 0, 7);
  const runs = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  let safety = 0;
  while (runs.length < count && safety++ < 527040) {
    const ok_mon = !mons || mons.includes(d.getMonth() + 1);
    const ok_dom = !doms || doms.includes(d.getDate());
    const ok_dow = !dows || dows.includes(d.getDay()) || (dows.includes(7) && d.getDay() === 0);
    const ok_hr  = !hrs  || hrs.includes(d.getHours());
    const ok_min = !mins || mins.includes(d.getMinutes());
    if (ok_mon && ok_dom && ok_dow && ok_hr && ok_min) {
      runs.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return runs;
}
function update() {
  const expr = document.getElementById('cronInput').value.trim();
  const errEl = document.getElementById('errorMsg');
  const descEl = document.getElementById('humanDesc');
  const runsEl = document.getElementById('nextRuns');
  errEl.classList.add('hidden');
  const desc = describeCron(expr);
  if (!desc) {
    errEl.textContent = I18N.invalidExpr;
    errEl.classList.remove('hidden');
    descEl.textContent = '';
    runsEl.innerHTML = '';
    return;
  }
  descEl.textContent = desc;
  const runs = getNextRuns(expr);
  if (!runs || !runs.length) { runsEl.innerHTML = '<div class="text-sm text-slate-500 dark:text-slate-400">No runs found within 1 year</div>'; return; }
  runsEl.innerHTML = runs.map((d, i) => {
    const formatted = d.toLocaleString('en-US', {
      weekday:'short', year:'numeric', month:'short', day:'numeric',
      hour:'2-digit', minute:'2-digit'
    });
    return `<div class="flex items-center gap-3 text-sm py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span class="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0">${i+1}</span>
      <span class="font-mono text-slate-700 dark:text-slate-300">${formatted}</span>
    </div>`;
  }).join('');
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cronInput').addEventListener('input', update);
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('cronInput').value = btn.dataset.expr;
      update();
    });
  });
  update();
});
