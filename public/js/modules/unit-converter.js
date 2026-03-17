const UNITS = {
  length: {
    label: 'Length',
    units: { mm:1, cm:10, m:1000, km:1e6, inch:25.4, foot:304.8, yard:914.4, mile:1609344 },
    labels: { mm:'Millimeter (mm)', cm:'Centimeter (cm)', m:'Meter (m)', km:'Kilometer (km)', inch:'Inch (in)', foot:'Foot (ft)', yard:'Yard (yd)', mile:'Mile (mi)' }
  },
  weight: {
    label: 'Weight / Mass',
    units: { mg:1, g:1000, kg:1e6, ton:1e9, oz:28349.5, lb:453592, stone:6350293 },
    labels: { mg:'Milligram (mg)', g:'Gram (g)', kg:'Kilogram (kg)', ton:'Metric ton (t)', oz:'Ounce (oz)', lb:'Pound (lb)', stone:'Stone (st)' }
  },
  temperature: {
    label: 'Temperature',
    units: null, // special
    labels: { c:'Celsius (°C)', f:'Fahrenheit (°F)', k:'Kelvin (K)' }
  },
  area: {
    label: 'Area',
    units: { mm2:1, cm2:100, m2:1e6, km2:1e12, ha:1e10, acre:4046856422, ft2:92903, in2:645.16 },
    labels: { mm2:'mm²', cm2:'cm²', m2:'m²', km2:'km²', ha:'Hectare (ha)', acre:'Acre', ft2:'Foot² (ft²)', in2:'Inch² (in²)' }
  },
  volume: {
    label: 'Volume',
    units: { ml:1, l:1000, m3:1e6, gal_us:3785.41, gal_uk:4546.09, fl_oz:29.5735, cup:236.588, tsp:4.92892, tbsp:14.7868 },
    labels: { ml:'Milliliter (ml)', l:'Liter (l)', m3:'Cubic meter (m³)', gal_us:'US Gallon', gal_uk:'UK Gallon', fl_oz:'Fl. oz', cup:'Cup', tsp:'Teaspoon', tbsp:'Tablespoon' }
  },
  speed: {
    label: 'Speed',
    units: { mps:1, kph:0.27778, mph:0.44704, knot:0.51444, fps:0.30480 },
    labels: { mps:'m/s', kph:'km/h', mph:'mph', knot:'Knot', fps:'ft/s' }
  },
  data: {
    label: 'Data Storage',
    units: { bit:1, byte:8, kb:8e3, mb:8e6, gb:8e9, tb:8e12, kib:8192, mib:8388608, gib:8589934592, tib:8796093022208 },
    labels: { bit:'Bit', byte:'Byte', kb:'Kilobyte (KB)', mb:'Megabyte (MB)', gb:'Gigabyte (GB)', tb:'Terabyte (TB)', kib:'Kibibyte (KiB)', mib:'Mebibyte (MiB)', gib:'Gibibyte (GiB)', tib:'Tebibyte (TiB)' }
  },
};

function convertTemp(val, from, to) {
  let celsius;
  if (from === 'c') celsius = val;
  else if (from === 'f') celsius = (val - 32) * 5/9;
  else celsius = val - 273.15;
  if (to === 'c') return celsius;
  if (to === 'f') return celsius * 9/5 + 32;
  return celsius + 273.15;
}

function convert(val, from, to, cat) {
  if (cat === 'temperature') return convertTemp(val, from, to);
  const units = UNITS[cat].units;
  return (val * units[from]) / units[to];
}

function fmt(n) {
  if (Math.abs(n) >= 1e10 || (Math.abs(n) < 1e-4 && n !== 0)) return n.toExponential(6);
  return parseFloat(n.toPrecision(10)).toString();
}

document.addEventListener('DOMContentLoaded', () => {
  const catSelect = document.getElementById('catSelect');
  const fromSelect = document.getElementById('fromSelect');
  const toSelect = document.getElementById('toSelect');
  const inputVal = document.getElementById('inputVal');
  const outputVal = document.getElementById('outputVal');
  const swapBtn = document.getElementById('btnSwap');

  function populateUnits() {
    const cat = catSelect.value;
    const labels = UNITS[cat].labels;
    [fromSelect, toSelect].forEach((sel, i) => {
      const prev = sel.value;
      sel.innerHTML = '';
      Object.entries(labels).forEach(([k, v]) => {
        const opt = document.createElement('option');
        opt.value = k; opt.textContent = v;
        sel.appendChild(opt);
      });
      if ([...sel.options].some(o => o.value === prev)) sel.value = prev;
      else sel.selectedIndex = i === 1 ? 1 : 0;
    });
    doConvert();
  }

  function doConvert() {
    const val = parseFloat(inputVal.value);
    if (isNaN(val)) { outputVal.value = ''; return; }
    const cat = catSelect.value;
    const from = fromSelect.value;
    const to = toSelect.value;
    try {
      outputVal.value = fmt(convert(val, from, to, cat));
    } catch(e) { outputVal.value = ''; }
  }

  catSelect.addEventListener('change', populateUnits);
  fromSelect.addEventListener('change', doConvert);
  toSelect.addEventListener('change', doConvert);
  inputVal.addEventListener('input', doConvert);

  swapBtn.addEventListener('click', () => {
    const tmp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tmp;
    const tmpVal = inputVal.value;
    inputVal.value = outputVal.value;
    doConvert();
  });

  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!outputVal.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(outputVal.value);
    showToast(I18N.copied || 'Copied!');
  });

  populateUnits();
});
