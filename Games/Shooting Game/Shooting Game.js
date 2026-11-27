const c = document.getElementById('gameCanvas');
const ctx = c.getContext('2d');
const loginContainer = document.getElementById('login-container');
const createAccountContainer = document.getElementById('create-account-container');
const loginError = document.getElementById('login-error');
const createError = document.getElementById('create-error');

let currentUser = null;
const accountsKey = 'gameAccounts';
let accounts = JSON.parse(localStorage.getItem(accountsKey)) || {};
const highScoreKey = 'shootingGameHighScore';
let highScore = parseInt(localStorage.getItem(highScoreKey)) || 0;

function showCreateAccount() {
  loginContainer.classList.add('hidden');
  createAccountContainer.classList.remove('hidden');
  loginError.textContent = '';
  createError.textContent = '';
}

function showLogin() {
  createAccountContainer.classList.add('hidden');
  loginContainer.classList.remove('hidden');
  loginError.textContent = '';
  createError.textContent = '';
}

function createAccount() {
  const username = document.getElementById('create-username').value.trim();
  const password = document.getElementById('create-password').value;

  if (!username || !password) {
    createError.textContent = 'Please enter a username & password.';
    return;
  }

  if (accounts[username]) {
    createError.textContent = 'Account already exists!';
    return;
  }

  accounts[username] = password;
  localStorage.setItem(accountsKey, JSON.stringify(accounts));
  createError.textContent = 'Account created successfully. Please log in.';
  showLogin();
}

function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (accounts[username] === password) {
    currentUser = username;
    loginContainer.classList.add('hidden');
    createAccountContainer.classList.add('hidden');
    c.classList.remove('hidden');
    startGame();
    loginError.textContent = '';
  } else {
    loginError.textContent = 'Invalid username or password.';
  }
}

function startGame() {
  c.width = 600;
  c.height = 400;

  const p = { x: c.width / 2, y: c.height - 30, w: 20, h: 30, color: 'white', s: 5 };
  const bs = [];
  const bsS = 10;
  const bsR = 5;
  const bsC = 'red';
  const es = [];
  const esR = 15;
  const esC = 'blue';
  const esS = 2;
  const esI = 60;
  let esIC = 0;
  let currentScore = 0;
  const fI = 10;
  let fIC = 0;

  function dP() { ctx.fillStyle = p.color; ctx.fillRect(p.x - p.w / 2, p.y - p.h, p.w, p.h); }
  function dB(b) { ctx.fillStyle = b.color; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); ctx.closePath(); }
  function uBs() { for (let i = bs.length - 1; i >= 0; i--) { bs[i].y -= bsS; dB(bs[i]); if (bs[i].y < 0) { bs.splice(i, 1); } } }
  function fB() { bs.push({ x: p.x, y: p.y - p.h / 2, r: bsR, color: bsC }); }
  function sE() { const x = Math.random() * c.width; const y = 0 - esR; es.push({ x: x, y: y, r: esR, color: esC }); }
  function dE(e) { ctx.fillStyle = e.color; ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill(); ctx.closePath(); }
  function uEs() { for (let i = es.length - 1; i >= 0; i--) { es[i].y += esS; dE(es[i]); if (es[i].y > c.height + esR) { es.splice(i, 1); } } }
  function cC() { for (let i = bs.length - 1; i >= 0; i--) { const b = bs[i]; for (let j = es.length - 1; j >= 0; j--) { const e = es[j]; const dx = b.x - e.x; const dy = b.y - e.y; const d = Math.sqrt(dx * dx + dy * dy); if (d < b.r + e.r) { bs.splice(i, 1); es.splice(j, 1); currentScore++; break; } } } }
  function dS() { ctx.fillStyle = 'white'; ctx.font = '16px Arial'; ctx.fillText('Score: ' + currentScore + ` High Score: ${highScore}`, 10, 20); }

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowLeft': p.x -= p.s; break;
      case 'ArrowRight': p.x += p.s; break;
      case 'ArrowUp': p.y -= p.s; break;
      case 'ArrowDown': p.y += p.s; break;
    }
  });

  function gameLoop() {
    ctx.clearRect(0, 0, c.width, c.height);
    fIC++;
    if (fIC % fI === 0) { fB(); fIC = 0; }
    esIC++;
    if (esIC % esI === 0) { sE(); esIC = 0; }
    uEs();
    uBs();
    cC();
    dP();
    dS();
    if (p.x < p.w / 2) p.x = p.w / 2;
    if (p.x > c.width - p.w / 2) p.x = c.width - p.w / 2;
    if (p.y < p.h) p.y = p.h;
    if (p.y > c.height) p.y = c.height;

    if (currentScore > highScore) {
      highScore = currentScore;
      localStorage.setItem(highScoreKey, highScore);
    }

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

function logout() {
  currentUser = null;
  c.classList.add('hidden');
  loginContainer.classList.remove('hidden');
  alert('Logged out.');
}
