let solution = [], puzzle = [];
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function solve(b) {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (!b[r][c]) {
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const n of nums) { if (valid(b, r, c, n)) { b[r][c] = n; if (solve(b)) return true; b[r][c] = 0; } }
    return false;
  }
  return true;
}
function valid(b, r, c, n) {
  for (let i = 0; i < 9; i++) if (b[r][i] === n || b[i][c] === n) return false;
  const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (b[br + i][bc + j] === n) return false;
  return true;
}
function newGame() {
  solution = Array.from({ length: 9 }, () => Array(9).fill(0)); solve(solution);
  puzzle = solution.map(r => r.slice());
  let removed = 0;
  while (removed < 40) {
    const r = Math.floor(Math.random() * 9), c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) { puzzle[r][c] = 0; removed++; }
  }
  render();
  document.getElementById('msg').textContent = '';
}
function render() {
  const t = document.getElementById('grid'); t.innerHTML = '';
  for (let r = 0; r < 9; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < 9; c++) {
      const td = document.createElement('td');
      if (puzzle[r][c] !== 0) { td.textContent = puzzle[r][c]; td.style.color = '#94a3b8'; }
      else {
        const inp = document.createElement('input'); inp.maxLength = 1;
        inp.oninput = () => { const v = +inp.value; if (v >= 1 && v <= 9) puzzle[r][c] = v; else { inp.value = ''; puzzle[r][c] = 0; } };
        td.appendChild(inp);
      }
      tr.appendChild(td);
    }
    t.appendChild(tr);
  }
}
function check() {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (puzzle[r][c] !== solution[r][c]) return false;
  return true;
}
newGame();