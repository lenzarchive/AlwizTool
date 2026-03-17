// Pure JS SHA-1 — no crypto.subtle needed, works on HTTP and HTTPS
function sha1(msgBytes) {
  let h0=0x67452301, h1=0xEFCDAB89, h2=0x98BADCFE, h3=0x10325476, h4=0xC3D2E1F0;
  const ml = msgBytes.length * 8;
  const msg = [...msgBytes, 0x80];
  while (msg.length % 64 !== 56) msg.push(0);
  for (let i = 7; i >= 0; i--) msg.push((ml / Math.pow(256, i)) & 0xFF);
  for (let i = 0; i < msg.length; i += 64) {
    const w = new Array(80);
    for (let j = 0; j < 16; j++) {
      w[j] = (msg[i+j*4]<<24)|(msg[i+j*4+1]<<16)|(msg[i+j*4+2]<<8)|msg[i+j*4+3];
    }
    for (let j = 16; j < 80; j++) {
      const x = w[j-3]^w[j-8]^w[j-14]^w[j-16];
      w[j] = (x<<1)|(x>>>31);
    }
    let a=h0, b=h1, c=h2, d=h3, e=h4;
    for (let j = 0; j < 80; j++) {
      let f, k;
      if      (j<20){f=(b&c)|((~b)&d); k=0x5A827999;}
      else if (j<40){f=b^c^d;          k=0x6ED9EBA1;}
      else if (j<60){f=(b&c)|(b&d)|(c&d); k=0x8F1BBCDC;}
      else          {f=b^c^d;          k=0xCA62C1D6;}
      const temp = (((a<<5)|(a>>>27))+f+e+k+w[j])>>>0;
      e=d; d=c; c=(b<<30)|(b>>>2); b=a; a=temp;
    }
    h0=(h0+a)>>>0; h1=(h1+b)>>>0; h2=(h2+c)>>>0; h3=(h3+d)>>>0; h4=(h4+e)>>>0;
  }
  const result = [];
  for (const h of [h0,h1,h2,h3,h4]) {
    result.push((h>>>24)&0xFF,(h>>>16)&0xFF,(h>>>8)&0xFF,h&0xFF);
  }
  return result;
}

function hmacSha1(keyBytes, msgBytes) {
  const blockSize = 64;
  let key = [...keyBytes];
  if (key.length > blockSize) key = sha1(key);
  while (key.length < blockSize) key.push(0);
  const opad = key.map(b => b ^ 0x5C);
  const ipad = key.map(b => b ^ 0x36);
  return sha1([...opad, ...sha1([...ipad, ...msgBytes])]);
}

// RFC 4648 Base32 decode — collects all bits first, then slices into bytes
// avoids the leftover-bit bug from the accumulator approach
function base32Decode(base32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const s = base32.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  let bitStr = '';
  for (const ch of s) {
    const idx = alphabet.indexOf(ch);
    if (idx === -1) throw new Error('Invalid base32 character: ' + ch);
    bitStr += idx.toString(2).padStart(5, '0');
  }
  const output = [];
  for (let i = 0; i + 8 <= bitStr.length; i += 8) {
    output.push(parseInt(bitStr.slice(i, i + 8), 2));
  }
  return output;
}

function generateTOTP(secret, timeStep, digits, time) {
  const keyBytes = base32Decode(secret);
  const counter = Math.floor(time / timeStep);
  // Build 8-byte big-endian counter (hi word always 0 for practical timestamps)
  const cb = [
    0, 0, 0, 0,
    (counter >>> 24) & 0xFF,
    (counter >>> 16) & 0xFF,
    (counter >>> 8)  & 0xFF,
     counter         & 0xFF
  ];
  const hmac = hmacSha1(keyBytes, cb);
  const offset = hmac[hmac.length - 1] & 0x0F;
  const code = (((hmac[offset] & 0x7F) << 24 | hmac[offset+1] << 16 | hmac[offset+2] << 8 | hmac[offset+3]) >>> 0) % Math.pow(10, digits);
  return code.toString().padStart(digits, '0');
}

let timer;
function updateDisplay(secret, digits, period) {
  const now = Math.floor(Date.now() / 1000);
  const remaining = period - (now % period);
  const progressEl = document.getElementById('progressBar');
  const remainEl = document.getElementById('remainTime');
  if (progressEl) progressEl.style.width = ((remaining / period) * 100) + '%';
  if (remainEl) remainEl.textContent = remaining + 's';
  if (progressEl) {
    progressEl.className = 'h-full rounded-full transition-all duration-1000 ' +
      (remaining <= 5 ? 'bg-red-500' : remaining <= 10 ? 'bg-amber-400' : 'bg-green-500');
  }
  try {
    const code = generateTOTP(secret, period, parseInt(digits), now);
    const codeEl = document.getElementById('totpCode');
    if (codeEl) {
      const half = Math.floor(code.length / 2);
      codeEl.textContent = code.slice(0, half) + ' ' + code.slice(half);
    }
  } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  const secretInput = document.getElementById('secretInput');
  const digitsSelect = document.getElementById('digitsSelect');
  const periodSelect = document.getElementById('periodSelect');
  const btnGenerate = document.getElementById('btnGenerate');
  const resultBox = document.getElementById('resultBox');
  const btnCopy = document.getElementById('btnCopy');
  const btnRandSecret = document.getElementById('btnRandSecret');

  btnRandSecret.addEventListener('click', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let s = '';
    for (let i = 0; i < 32; i++) s += chars[Math.floor(Math.random() * chars.length)];
    secretInput.value = s;
  });

  btnGenerate.addEventListener('click', () => {
    const secret = secretInput.value.trim();
    if (!secret) return showToast(I18N.errNoSecret || 'Enter a secret key', 'error');
    try { base32Decode(secret); } catch(e) {
      return showToast((I18N.errInvalid || 'Invalid base32') + ': ' + e.message, 'error');
    }
    clearInterval(timer);
    resultBox.classList.remove('hidden');
    const digits = digitsSelect.value;
    const period = parseInt(periodSelect.value);
    updateDisplay(secret, digits, period);
    timer = setInterval(() => updateDisplay(secret, digits, period), 1000);
  });

  btnCopy.addEventListener('click', () => {
    const code = document.getElementById('totpCode').textContent.replace(/\s/g, '');
    if (!code) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(code);
    showToast(I18N.copied || 'Copied!');
  });
});
