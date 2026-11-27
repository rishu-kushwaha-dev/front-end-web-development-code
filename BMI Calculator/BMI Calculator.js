const form = document.getElementById('bmiForm');
const result = document.getElementById('result');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const weight = parseFloat(document.getElementById('weight').value);
  const heightCm = parseFloat(document.getElementById('height').value);
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  let category = '';
  let cls = '';
  if (bmi < 18.5) { category = 'Underweight'; cls = 'underweight'; }
  else if (bmi < 25) { category = 'Normal'; cls = 'normal'; }
  else { category = 'Overweight'; cls = 'overweight'; }
  result.hidden = false;
  result.innerHTML = `<div class="bmi ${cls}">${bmi.toFixed(1)}</div><div class="category ${cls}">${category}</div>`;
});
