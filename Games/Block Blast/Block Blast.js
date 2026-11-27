const SIZE = 8, CELL = 40;
const boardCanvas = document.getElementById('board');
boardCanvas.width = SIZE * CELL; boardCanvas.height = SIZE * CELL;
const bctx = boardCanvas.getContext('2d');
const tray = document.getElementById('tray');

let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
let pieces = [], score = 0, best = +localStorage.getItem('bb_best') || 0;
let drag = null; // {pieceIdx, x,y}

const SHAPES = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
];

function randomPiece() { const s = SHAPES[Math.floor(Math.random() * SHAPES.length)]; return s.map(r => r.slice()); }

function newPieces() { pieces = [randomPiece(), randomPiece(), randomPiece()]; renderTray(); }

function drawBoard() {
  bctx.fillStyle = '#1e293b'; bctx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (board[r][c]) { bctx.fillStyle = board[r][c]; bctx.fillRect(c * CELL + 2, r * CELL + 2, CELL - 4, CELL - 4); }
    else { bctx.strokeStyle = '#334155'; bctx.strokeRect(c * CELL + 2, r * CELL + 2, CELL - 4, CELL - 4); }
  }
}

function renderTray() {
  tray.innerHTML = '';
  pieces.forEach((p, idx) => {
    const c = document.createElement('canvas');
    const rows = p.length, cols = p[0].length;
    c.width = cols * 24; c.height = rows * 24;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#60a5fa';
    p.forEach((row, r) => row.forEach((v, cc) => { if (v) ctx.fillRect(cc * 24 + 2, r * 24 + 2, 20, 20); }));
    const wrap = document.createElement('div'); wrap.className = 'piece'; wrap.appendChild(c);
    wrap.dataset.idx = idx;
    wrap.addEventListener('mousedown', e => startDrag(idx, e));
    wrap.addEventListener('touchstart', e => { e.preventDefault(); startDrag(idx, e.touches[0]); });
    tray.appendChild(wrap);
  });
}

function startDrag(idx, e) {
  if (!pieces[idx]) return;
  drag = { idx, x: e.clientX, y: e.clientY };
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', onDrop);
  document.addEventListener('touchmove', onDragTouch, { passive: false });
  document.addEventListener('touchend', onDrop);
}

function onDrag(e) { if (drag) { drag.x = e.clientX; drag.y = e.clientY; preview(); } }
function onDragTouch(e) { e.preventDefault(); if (drag) { drag.x = e.touches[0].clientX; drag.y = e.touches[0].clientY; preview(); } }

function preview() {
  drawBoard();
  if (!drag) return;
  const p = pieces[drag.idx];
  const rect = boardCanvas.getBoundingClientRect();
  const cx = drag.x - rect.left, cy = drag.y - rect.top;
  const cc = Math.floor(cx / CELL), cr = Math.floor(cy / CELL);
  const offC = Math.floor(p[0].length / 2), offR = Math.floor(p.length / 2);
  const gc = cc - offC, gr = cr - offR;
  // draw ghost
  bctx.globalAlpha = 0.5;
  bctx.fillStyle = '#93c5fd';
  p.forEach((row, r) => row.forEach((v, c) => {
    if (v) {
      const x = (gc + c) * CELL, y = (gr + r) * CELL;
      if (x >= 0 && y >= 0 && x + CELL <= boardCanvas.width && y + CELL <= boardCanvas.height) bctx.fillRect(x + 2, y + 2, CELL - 4, CELL - 4);
    }
  }));
  bctx.globalAlpha = 1;
}

function canPlace(p, gr, gc) {
  for (let r = 0; r < p.length; r++) for (let c = 0; c < p[r].length; c++) {
    if (!p[r][c]) continue;
    const rr = gr + r, cc = gc + c;
    if (rr < 0 || cc < 0 || rr >= SIZE || cc >= SIZE) return false;
    if (board[rr][cc]) return false;
  }
  return true;
}

function place(p, gr, gc) {
  p.forEach((row, r) => row.forEach((v, c) => { if (v) board[gr + r][gc + c] = '#60a5fa'; }));
}

function clearLines() {
  let rows = [], cols = [];
  for (let r = 0; r < SIZE; r++) if (board[r].every(x => x)) rows.push(r);
  for (let c = 0; c < SIZE; c++) if (board.every(row => row[c])) cols.push(c);
  const n = rows.length + cols.length;
  rows.forEach(r => board[r].fill(0));
  cols.forEach(c => board.forEach(row => row[c] = 0));
  return n;
}

function onDrop() {
  if (!drag) return;
  const p = pieces[drag.idx];
  const rect = boardCanvas.getBoundingClientRect();
  const cx = drag.x - rect.left, cy = drag.y - rect.top;
  const cc = Math.floor(cx / CELL), cr = Math.floor(cy / CELL);
  const offC = Math.floor(p[0].length / 2), offR = Math.floor(p.length / 2);
  const gc = cc - offC, gr = cr - offR;
  if (canPlace(p, gr, gc)) {
    place(p, gr, gc);
    const cleared = clearLines();
    let gained = p.flat().filter(x => x).length;
    if (cleared) {
      gained += cleared * 100;
      score += gained; // simple
    } else score += gained;
    pieces[drag.idx] = null;
    // remove nulls? keep slots
    if (pieces.every(x => x === null)) { newPieces(); }
    else renderTrayPartial();
    checkGameOver();
  }
  drag = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', onDrop);
  document.removeEventListener('touchmove', onDragTouch);
  document.removeEventListener('touchend', onDrop);
  updateScore();
  drawBoard();
}

function renderTrayPartial() {
  // re-render tray skipping null
  tray.innerHTML = '';
  pieces.forEach((p, idx) => {
    if (!p) return;
    const c = document.createElement('canvas');
    const rows = p.length, cols = p[0].length;
    c.width = cols * 24; c.height = rows * 24;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#60a5fa';
    p.forEach((row, r) => row.forEach((v, cc) => { if (v) ctx.fillRect(cc * 24 + 2, r * 24 + 2, 20, 20); }));
    const wrap = document.createElement('div'); wrap.className = 'piece'; wrap.appendChild(c);
    wrap.addEventListener('mousedown', e => startDrag(idx, e));
    wrap.addEventListener('touchstart', e => { e.preventDefault(); startDrag(idx, e.touches[0]); });
    tray.appendChild(wrap);
  });
}

function checkGameOver() {
  const available = pieces.filter(Boolean);
  if (available.length === 0) return;
  let any = false;
  for (const p of available) {
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (canPlace(p, r, c)) { any = true; break; }
    }
    if (any) break;
  }
  if (!any) {
    document.getElementById('msg').textContent = 'Game Over!';
    if (score > best) { best = score; localStorage.setItem('bb_best', best); }
    updateScore();
  }
}

function updateScore() {
  document.getElementById('score').textContent = score;
  document.getElementById('best').textContent = best;
}

document.getElementById('restart').onclick = () => {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  score = 0; newPieces(); document.getElementById('msg').textContent = '';
  updateScore(); drawBoard();
};

newPieces(); drawBoard(); updateScore();