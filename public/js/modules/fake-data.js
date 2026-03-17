const FAKE = {
  firstNames: ['Alice','Bob','Charlie','Diana','Evan','Fiona','George','Hannah','Ivan','Julia','Kevin','Laura','Mike','Nina','Oscar','Paula','Quinn','Rachel','Sam','Tina','Uma','Victor','Wendy','Xander','Yara','Zoe','Budi','Siti','Andi','Dewi','Eko','Fitri','Hendra','Indah','Joko','Kartika'],
  lastNames: ['Smith','Johnson','Williams','Brown','Jones','Miller','Davis','Wilson','Anderson','Taylor','Thomas','Moore','Jackson','Martin','Lee','Harris','Clark','Lewis','Young','Walker','Santoso','Wijaya','Susanto','Rahayu','Pratama','Kusuma','Sari','Utama','Putra','Putri'],
  domains: ['gmail.com','yahoo.com','outlook.com','hotmail.com','example.com','mail.com','protonmail.com'],
  streets: ['Main St','Oak Ave','Maple Dr','Cedar Ln','Pine Rd','Elm St','Park Blvd','Lake Dr','Jl. Sudirman','Jl. Thamrin','Jl. Gatot Subroto','Jl. HR Rasuna Said'],
  cities: ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','Jakarta','Surabaya','Bandung','Medan','Semarang','Makassar','Yogyakarta'],
  countries: ['Indonesia','United States','United Kingdom','Australia','Canada','Germany','Japan','Singapore','Malaysia'],
  companies: ['Tech Corp','Data Inc','Cloud Solutions','Nexus Labs','Pixel Works','Nova Systems','Apex Digital','PT Maju Bersama','PT Teknologi Nusantara','CV Karya Digital'],
  tlds: ['.com','.net','.org','.io','.dev','.id','.co.id'],
  jobTitles: ['Software Engineer','Product Manager','UI/UX Designer','Data Analyst','DevOps Engineer','Frontend Developer','Backend Developer','Full Stack Developer','QA Engineer','Project Manager','Marketing Manager','Sales Executive'],
};

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pad(n, len) { return n.toString().padStart(len, '0'); }

const GENERATORS = {
  fullName: () => rand(FAKE.firstNames) + ' ' + rand(FAKE.lastNames),
  firstName: () => rand(FAKE.firstNames),
  lastName: () => rand(FAKE.lastNames),
  email: () => {
    const fn = rand(FAKE.firstNames).toLowerCase();
    const ln = rand(FAKE.lastNames).toLowerCase();
    return fn + '.' + ln + randInt(1,99) + '@' + rand(FAKE.domains);
  },
  phone: () => {
    const prefixes = ['0812','0813','0851','0852','0878','0857','0881','081','082','085'];
    return rand(prefixes) + randInt(10000000,99999999);
  },
  address: () => randInt(1,999) + ' ' + rand(FAKE.streets) + ', ' + rand(FAKE.cities),
  city: () => rand(FAKE.cities),
  country: () => rand(FAKE.countries),
  company: () => rand(FAKE.companies),
  jobTitle: () => rand(FAKE.jobTitles),
  username: () => {
    const fn = rand(FAKE.firstNames).toLowerCase();
    return fn + randInt(10,9999);
  },
  password: () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let p = '';
    for (let i = 0; i < 12; i++) p += chars[randInt(0, chars.length-1)];
    return p;
  },
  uuid: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0;
      return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
  },
  ipv4: () => randInt(1,254)+'.'+randInt(0,255)+'.'+randInt(0,255)+'.'+randInt(1,254),
  date: () => {
    const d = new Date(randInt(1990,2010), randInt(0,11), randInt(1,28));
    return d.getFullYear() + '-' + pad(d.getMonth()+1,2) + '-' + pad(d.getDate(),2);
  },
  url: () => 'https://' + rand(FAKE.firstNames).toLowerCase() + rand(FAKE.tlds),
  color: () => '#' + Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0'),
  number: () => randInt(1000, 999999).toString(),
  price: () => '$' + (randInt(100,99999)/100).toFixed(2),
  paragraph: () => {
    const words = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','labore','et','dolore','magna','aliqua','ut','enim','ad','minim','veniam','quis','nostrud','exercitation'];
    let s = '';
    const wc = randInt(20,50);
    for (let i = 0; i < wc; i++) s += (i===0 ? '' : ' ') + rand(words);
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const fieldsContainer = document.getElementById('fieldsContainer');
  const outputText = document.getElementById('outputText');
  const countInput = document.getElementById('countInput');
  const formatSelect = document.getElementById('formatSelect');

  function getSelectedFields() {
    return [...document.querySelectorAll('.field-check:checked')].map(el => el.value);
  }

  function generate() {
    const fields = getSelectedFields();
    if (!fields.length) return showToast(I18N.errNoFields || 'Select at least one field', 'error');
    const count = Math.max(1, Math.min(50, parseInt(countInput.value)||5));
    const fmt = formatSelect.value;
    const rows = [];
    for (let i = 0; i < count; i++) {
      const row = {};
      fields.forEach(f => { row[f] = GENERATORS[f](); });
      rows.push(row);
    }
    if (fmt === 'json') {
      outputText.value = JSON.stringify(rows, null, 2);
    } else if (fmt === 'csv') {
      const header = fields.join(',');
      const lines = rows.map(r => fields.map(f => '"' + r[f].replace(/"/g,'""') + '"').join(','));
      outputText.value = [header, ...lines].join('\n');
    } else {
      outputText.value = rows.map(r => fields.map(f => f + ': ' + r[f]).join(' | ')).join('\n');
    }
  }

  document.getElementById('btnGenerate').addEventListener('click', generate);
  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!outputText.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(outputText.value);
    showToast(I18N.copied || 'Copied!');
  });
  document.getElementById('btnClear').addEventListener('click', () => { outputText.value = ''; });
  document.getElementById('btnSelectAll').addEventListener('click', () => {
    document.querySelectorAll('.field-check').forEach(el => el.checked = true);
  });
  document.getElementById('btnSelectNone').addEventListener('click', () => {
    document.querySelectorAll('.field-check').forEach(el => el.checked = false);
  });
});
