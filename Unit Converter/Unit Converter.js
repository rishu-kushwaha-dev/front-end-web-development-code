const units = {
    length: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.34, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 },
    weight: { Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Pound: 0.453592, Ounce: 0.0283495, Ton: 1000 },
    temperature: { Celsius: 'C', Fahrenheit: 'F', Kelvin: 'K' },
    data: { Byte: 1, Kilobyte: 1024, Megabyte: 1024 * 1024, Gigabyte: 1024 * 1024 * 1024, Terabyte: 1024 * 1024 * 1024 * 1024 },
    speed: { "m/s": 1, "km/h": 1 / 3.6, "mph": 0.44704, Knot: 0.514444 }
};

const fromVal = document.getElementById('fromVal');
const toVal = document.getElementById('toVal');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const swapBtn = document.getElementById('swap');
let currentCat = 'length';

function populate(cat) {
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    Object.keys(units[cat]).forEach(u => {
        fromUnit.add(new Option(u, u));
        toUnit.add(new Option(u, u));
    });
    const keys = Object.keys(units[cat]);
    toUnit.value = keys[1] || keys[0];
    convert();
}

function convert() {
    const v = parseFloat(fromVal.value);
    if (isNaN(v)) { toVal.value = ''; return; }
    if (currentCat === 'temperature') {
        const f = fromUnit.value, t = toUnit.value;
        let c;
        if (f === 'Celsius') c = v;
        else if (f === 'Fahrenheit') c = (v - 32) * 5 / 9;
        else c = v - 273.15;
        let res;
        if (t === 'Celsius') res = c;
        else if (t === 'Fahrenheit') res = c * 9 / 5 + 32;
        else res = c + 273.15;
        toVal.value = +res.toFixed(6);
        return;
    }
    const from = units[currentCat][fromUnit.value];
    const to = units[currentCat][toUnit.value];
    toVal.value = +(v * from / to).toFixed(6);
}

fromVal.addEventListener('input', convert);
fromUnit.addEventListener('change', convert);
toUnit.addEventListener('change', convert);

document.querySelectorAll('.tabs button').forEach(b => {
    b.addEventListener('click', () => {
        document.querySelector('.tabs button.active').classList.remove('active');
        b.classList.add('active');
        currentCat = b.dataset.cat;
        populate(currentCat);
    });
});

swapBtn.addEventListener('click', () => {
    const fu = fromUnit.value, tu = toUnit.value;
    fromUnit.value = tu; toUnit.value = fu;
    // also swap values
    const fv = fromVal.value, tv = toVal.value;
    fromVal.value = tv; toVal.value = fv;
    convert();
});

populate(currentCat);