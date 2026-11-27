const ROWS = 6, COLS = 8;
const icons = ['🍎', '🍌', '🍇', '🍓', '🍒', '🥝', '🍑', '🍍'];
let grid = [], sel = null;
function newGame() {
    const pairs = []; for (let i = 0; i < icons.length; i++) for (let j = 0; j < 4; j++) pairs.push(icons[i]);
    shuffle(pairs);
    grid = []; let k = 0;
    for (let r = 0; r < ROWS; r++) { grid[r] = []; for (let c = 0; c < COLS; c++) grid[r][c] = pairs[k++]; }
    sel = null; render(); document.getElementById('msg').textContent = '';
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function render() {
    const g = document.getElementById('grid'); g.style.gridTemplateColumns = `repeat(${COLS},44px)`; g.innerHTML = '';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const d = document.createElement('div'); d.className = 'cell'; d.textContent = grid[r][c] || '';
        d.dataset.r = r; d.dataset.c = c;
        if (sel && sel.r === r && sel.c === c) d.classList.add('sel');
        d.onclick = () => click(r, c);
        g.appendChild(d);
    }
}
function click(r, c) {
    if (!grid[r][c]) return;
    if (!sel) { sel = { r, c }; render(); return; }
    if (sel.r === r && sel.c === c) { sel = null; render(); return; }
    if (grid[sel.r][sel.c] !== grid[r][c]) { sel = { r, c }; render(); return; }
    if (canConnect(sel.r, sel.c, r, c)) { grid[sel.r][sel.c] = null; grid[r][c] = null; sel = null; render(); checkWin(); }
    else { sel = { r, c }; render(); }
}
function canConnect(r1, c1, r2, c2) {
    if (r1 === r2) { if (clearRow(r1, c1, c2)) return true; }
    if (c1 === c2) { if (clearCol(c1, r1, r2)) return true; }
    if (clearRow(r1, c1, c2) && clearCol(c2, r1, r2)) return true;
    if (clearCol(c1, r1, r2) && clearRow(r2, c1, c2)) return true;
    return false;
}
function clearRow(r, c1, c2) {
    let ok = true;
    for (let c = Math.min(c1, c2) + 1; c < Math.max(c1, c2); c++) if (grid[r][c]) ok = false;
    return ok;
}
function clearCol(c, r1, r2) {
    let ok = true;
    for (let r = Math.min(r1, r2) + 1; r < Math.max(r1, r2); r++) if (grid[r][c]) ok = false;
    return ok;
}
function checkWin() { if (grid.flat().every(x => !x)) document.getElementById('msg').textContent = 'You Win!'; }
newGame();
