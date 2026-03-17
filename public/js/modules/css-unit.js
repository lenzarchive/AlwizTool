document.addEventListener('DOMContentLoaded', () => {
  const baseFontInput = document.getElementById('baseFontSize');
  const viewportWInput = document.getElementById('viewportW');
  const viewportHInput = document.getElementById('viewportH');
  const pxInput = document.getElementById('pxInput');
  const remInput = document.getElementById('remInput');
  const emInput = document.getElementById('emInput');
  const vwInput = document.getElementById('vwInput');
  const vhInput = document.getElementById('vhInput');
  const ptInput = document.getElementById('ptInput');
  const pcInput = document.getElementById('pcInput');

  let updating = false;
  function getBase() { return parseFloat(baseFontInput.value) || 16; }
  function getVW() { return parseFloat(viewportWInput.value) || 1440; }
  function getVH() { return parseFloat(viewportHInput.value) || 900; }

  function updateAll(srcId, pxVal) {
    if (updating) return;
    updating = true;
    const base = getBase();
    const vw = getVW();
    const vh = getVH();
    const px = pxVal;
    if (srcId !== 'px') pxInput.value = round(px);
    if (srcId !== 'rem') remInput.value = round(px / base);
    if (srcId !== 'em') emInput.value = round(px / base);
    if (srcId !== 'vw') vwInput.value = round((px / vw) * 100);
    if (srcId !== 'vh') vhInput.value = round((px / vh) * 100);
    if (srcId !== 'pt') ptInput.value = round(px * 0.75);
    if (srcId !== 'pc') pcInput.value = round(px / 16);
    updating = false;
  }

  function round(n) { return Math.round(n * 10000) / 10000; }

  function fromPx(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) updateAll('px', v);
  }
  function fromRem(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) updateAll('rem', v * getBase());
  }
  function fromEm(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) updateAll('em', v * getBase());
  }
  function fromVW(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) updateAll('vw', (v / 100) * getVW());
  }
  function fromVH(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) updateAll('vh', (v / 100) * getVH());
  }
  function fromPt(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) updateAll('pt', v / 0.75);
  }
  function fromPc(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) updateAll('pc', v * 16);
  }

  pxInput.addEventListener('input', fromPx);
  remInput.addEventListener('input', fromRem);
  emInput.addEventListener('input', fromEm);
  vwInput.addEventListener('input', fromVW);
  vhInput.addEventListener('input', fromVH);
  ptInput.addEventListener('input', fromPt);
  pcInput.addEventListener('input', fromPc);

  baseFontInput.addEventListener('input', () => {
    const px = parseFloat(pxInput.value);
    if (!isNaN(px)) updateAll('px', px);
  });
  viewportWInput.addEventListener('input', () => {
    const px = parseFloat(pxInput.value);
    if (!isNaN(px)) updateAll('px', px);
  });
  viewportHInput.addEventListener('input', () => {
    const px = parseFloat(pxInput.value);
    if (!isNaN(px)) updateAll('px', px);
  });

  // Initial
  updateAll('px', 16);
});
