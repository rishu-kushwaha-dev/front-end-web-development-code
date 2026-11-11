const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const highScoreEl = document.getElementById('high-score');
const levelEl = document.getElementById('level');
const powerupStatusEl = document.getElementById('powerup-status');
const finalScoreEl = document.getElementById('final-score');
const bestScoreEl = document.getElementById('best-score');
const newHighEl = document.getElementById('new-high');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pauseScreen = document.getElementById('pause-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

canvas.width = 800;
canvas.height = 600;

const HS_KEY = 'spaceShooterHighScore';
let state = 'start';
let score = 0;
let highScore = Number(localStorage.getItem(HS_KEY) || 0);
let lives = 3;
let level = 1;
let keys = {};
let bullets = [];
let enemies = [];
let stars = [];
let powerUps = [];
let particles = [];
let lastShot = 0;
let spawnTimer = 0;
let lastTime = 0;
let animationId;
let shieldTime = 0;
let rapidTime = 0;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  w: 40,
  h: 40,
  speed: 360,
};

highScoreEl.textContent = highScore;

function initStars() {
  stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    speed: Math.random() * 40 + 20,
  }));
}

function resetGame() {
  score = 0;
  lives = 3;
  level = 1;
  bullets = [];
  enemies = [];
  powerUps = [];
  particles = [];
  player.x = canvas.width / 2;
  player.y = canvas.height - 60;
  spawnTimer = 0;
  lastShot = 0;
  shieldTime = 0;
  rapidTime = 0;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  levelEl.textContent = level;
  highScoreEl.textContent = highScore;
  powerupStatusEl.textContent = '';
  initStars();
}

function startGame() {
  resetGame();
  state = 'playing';
  startScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
  pauseScreen.style.display = 'none';
  lastTime = performance.now();
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(loop);
}

function togglePause() {
  if (state === 'playing') {
    state = 'paused';
    pauseScreen.style.display = 'flex';
  } else if (state === 'paused') {
    state = 'playing';
    pauseScreen.style.display = 'none';
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }
}

function endGame() {
  state = 'gameover';
  const isNew = score > highScore;
  if (isNew) {
    highScore = score;
    localStorage.setItem(HS_KEY, String(highScore));
  }
  highScoreEl.textContent = highScore;
  finalScoreEl.textContent = `Final Score: ${score}`;
  bestScoreEl.textContent = `High Score: ${highScore}`;
  newHighEl.style.display = isNew ? 'block' : 'none';
  gameOverScreen.style.display = 'flex';
}

function shoot(now) {
  const delay = rapidTime > 0 ? 110 : 220;
  if (now - lastShot < delay) return;
  bullets.push({ x: player.x, y: player.y - player.h / 2, w: 4, h: 12, speed: 560 });
  lastShot = now;
}

function spawnEnemy() {
  const roll = Math.random();
  let size = 28 + Math.random() * 18;
  let hp = 1;
  let speed = 90 + Math.random() * 70 + level * 12;
  let type = 'normal';
  let points = 10;

  if (roll > 0.82 && level >= 2) {
    type = 'fast';
    size = 22 + Math.random() * 10;
    speed += 70;
    points = 15;
  } else if (roll < 0.18 && level >= 3) {
    type = 'tank';
    size = 44 + Math.random() * 10;
    hp = 2;
    speed *= 0.7;
    points = 25;
  }

  enemies.push({
    x: size / 2 + Math.random() * (canvas.width - size),
    y: -size,
    w: size,
    h: size,
    speed,
    hp,
    type,
    points,
  });
}

function spawnPowerUp(x, y) {
  if (Math.random() > 0.18) return;
  const types = ['shield', 'rapid', 'life'];
  const type = types[Math.floor(Math.random() * types.length)];
  powerUps.push({ x, y, w: 22, h: 22, speed: 120, type });
}

function addExplosion(x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 40 + Math.random() * 140;
    particles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 0.4 + Math.random() * 0.4,
      maxLife: 0.8,
      r: 2 + Math.random() * 3,
      color,
    });
  }
}

function rectsHit(a, b) {
  return a.x - a.w / 2 < b.x + b.w / 2 &&
    a.x + a.w / 2 > b.x - b.w / 2 &&
    a.y - a.h / 2 < b.y + b.h / 2 &&
    a.y + a.h / 2 > b.y - b.h / 2;
}

function applyPowerUp(type) {
  if (type === 'shield') shieldTime = 6;
  if (type === 'rapid') rapidTime = 6;
  if (type === 'life') {
    lives = Math.min(5, lives + 1);
    livesEl.textContent = lives;
  }
}

function updateStatusText() {
  const parts = [];
  if (shieldTime > 0) parts.push(`Shield ${shieldTime.toFixed(1)}s`);
  if (rapidTime > 0) parts.push(`Rapid ${rapidTime.toFixed(1)}s`);
  powerupStatusEl.textContent = parts.join('  |  ');
}

function loseLife() {
  if (shieldTime > 0) {
    shieldTime = 0;
    addExplosion(player.x, player.y - 10, '#66d9ff', 10);
    updateStatusText();
    return false;
  }
  lives -= 1;
  livesEl.textContent = lives;
  addExplosion(player.x, player.y, '#4a90e2', 18);
  if (lives <= 0) {
    endGame();
    return true;
  }
  return false;
}

function update(dt, now) {
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed * dt;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed * dt;
  player.x = Math.max(player.w / 2, Math.min(canvas.width - player.w / 2, player.x));

  shoot(now);

  if (shieldTime > 0) shieldTime = Math.max(0, shieldTime - dt);
  if (rapidTime > 0) rapidTime = Math.max(0, rapidTime - dt);
  updateStatusText();

  level = 1 + Math.floor(score / 120);
  levelEl.textContent = level;

  stars.forEach((s) => {
    s.y += s.speed * dt;
    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }
  });

  particles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
  });
  particles = particles.filter((p) => p.life > 0);

  bullets.forEach((b) => { b.y -= b.speed * dt; });
  bullets = bullets.filter((b) => b.y + b.h > 0);

  spawnTimer += dt;
  const spawnEvery = Math.max(0.28, 1.15 - level * 0.08);
  if (spawnTimer > spawnEvery) {
    spawnEnemy();
    spawnTimer = 0;
  }

  enemies.forEach((e) => { e.y += e.speed * dt; });

  powerUps.forEach((p) => { p.y += p.speed * dt; });
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const p = powerUps[i];
    if (rectsHit(p, player)) {
      applyPowerUp(p.type);
      addExplosion(p.x, p.y, p.type === 'life' ? '#7dff7d' : p.type === 'shield' ? '#66d9ff' : '#ffd966', 8);
      powerUps.splice(i, 1);
      continue;
    }
    if (p.y - p.h / 2 > canvas.height) powerUps.splice(i, 1);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    let removed = false;

    for (let j = bullets.length - 1; j >= 0; j--) {
      if (rectsHit(e, bullets[j])) {
        bullets.splice(j, 1);
        e.hp -= 1;
        addExplosion(e.x, e.y, '#ffb347', 5);
        if (e.hp <= 0) {
          enemies.splice(i, 1);
          score += e.points;
          if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = highScore;
          }
          scoreEl.textContent = score;
          addExplosion(e.x, e.y, e.type === 'tank' ? '#ff6b6b' : '#ff944d', 14);
          spawnPowerUp(e.x, e.y);
        }
        removed = e.hp <= 0;
        break;
      }
    }
    if (removed) continue;

    if (rectsHit(e, player)) {
      enemies.splice(i, 1);
      addExplosion(e.x, e.y, '#ff6b6b', 14);
      if (loseLife()) return;
      continue;
    }

    if (e.y - e.h / 2 > canvas.height) {
      enemies.splice(i, 1);
      if (loseLife()) return;
    }
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  if (shieldTime > 0) {
    ctx.strokeStyle = 'rgba(102, 217, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 2, player.w * 0.75, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#4a90e2';
  ctx.beginPath();
  ctx.moveTo(0, -player.h / 2);
  ctx.lineTo(player.w / 2, player.h / 2);
  ctx.lineTo(0, player.h / 4);
  ctx.lineTo(-player.w / 2, player.h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9fd3ff';
  ctx.fillRect(-4, -2, 8, 10);
  ctx.restore();
}

function drawEnemy(e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  let color = '#e74c3c';
  if (e.type === 'fast') color = '#f39c12';
  if (e.type === 'tank') color = '#8e44ad';
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, e.h / 2);
  ctx.lineTo(e.w / 2, -e.h / 2);
  ctx.lineTo(0, -e.h / 4);
  ctx.lineTo(-e.w / 2, -e.h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(-e.w * 0.15, -4, e.w * 0.3, 8);
  if (e.type === 'tank' && e.hp > 1) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(-e.w * 0.3, -e.h * 0.1, e.w * 0.6, 6);
  }
  ctx.restore();
}

function drawPowerUp(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  let color = '#66d9ff';
  let label = 'S';
  if (p.type === 'rapid') { color = '#ffd966'; label = 'R'; }
  if (p.type === 'life') { color = '#7dff7d'; label = '+'; }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.font = 'bold 14px Courier New';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, 1);
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  stars.forEach((s) => {
    ctx.globalAlpha = Math.min(1, s.r / 2);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#ffe066';
  bullets.forEach((b) => {
    ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
  });

  powerUps.forEach(drawPowerUp);
  enemies.forEach(drawEnemy);
  drawPlayer();
}

function loop(now) {
  if (state !== 'playing') return;
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt, now);
  draw();
  animationId = requestAnimationFrame(loop);
}

window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D', 'p', 'P'].includes(e.key)) e.preventDefault();
  if ((e.key === 'p' || e.key === 'P') && !e.repeat) togglePause();
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

initStars();
draw();
