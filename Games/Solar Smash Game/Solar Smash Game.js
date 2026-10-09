const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 900;
canvas.height = 600;

const planets = [
  { name: 'Mercury', color: '#b5b5b5', size: 30, x: 450, y: 300, health: 100 },
  { name: 'Venus', color: '#e6c87a', size: 45, x: 450, y: 300, health: 100 },
  { name: 'Earth', color: '#4da6ff', size: 48, x: 450, y: 300, health: 100 },
  { name: 'Mars', color: '#e05d44', size: 38, x: 450, y: 300, health: 100 },
  { name: 'Jupiter', color: '#d9a066', size: 80, x: 450, y: 300, health: 100 },
  { name: 'Saturn', color: '#f4d59e', size: 70, x: 450, y: 300, health: 100, hasRing: true },
  { name: 'Uranus', color: '#d1f5f8', size: 55, x: 450, y: 300, health: 100 },
  { name: 'Neptune', color: '#4b70dd', size: 52, x: 450, y: 300, health: 100 },
  { name: 'Pluto', color: '#c9b9a8', size: 20, x: 450, y: 300, health: 100 }
];

let selectedPlanet = null;
let currentWeapon = 'bomb';
let projectiles = [];
let explosions = [];
let particles = [];
let stars = [];
let gameRunning = false;

function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      brightness: Math.random()
    });
  }
}

function drawStars() {
  stars.forEach(star => {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlanet(planet) {
  ctx.save();
  ctx.translate(planet.x, planet.y);

  if (planet.hasRing) {
    ctx.strokeStyle = 'rgba(200, 180, 150, 0.6)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, planet.size + 20, planet.size / 3, -0.3, 0, Math.PI * 2);
    ctx.stroke();
  }

  const grad = ctx.createRadialGradient(-planet.size/3, -planet.size/3, 0, 0, 0, planet.size);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(0.3, planet.color);
  grad.addColorStop(1, '#000');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function spawnProjectile(type, targetX, targetY) {
  if (!selectedPlanet) return;

  const startX = 450;
  const startY = 550;

  projectiles.push({
    type: type,
    x: startX,
    y: startY,
    targetX: targetX,
    targetY: targetY,
    speed: type === 'missile' ? 12 : type === 'rocket' ? 8 : 6,
    damage: type === 'bomb' ? 40 : type === 'rocket' ? 30 : type === 'missile' ? 20 : 15,
    trail: []
  });
}

function updateProjectiles() {
  projectiles = projectiles.filter(proj => {
    const dx = proj.targetX - proj.x;
    const dy = proj.targetY - proj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < proj.speed) {
      hitPlanet(proj);
      return false;
    }

    proj.x += (dx / dist) * proj.speed;
    proj.y += (dy / dist) * proj.speed;

    proj.trail.push({ x: proj.x, y: proj.y, life: 1 });
    if (proj.trail.length > 15) proj.trail.shift();
    proj.trail.forEach(t => t.life -= 0.07);

    return true;
  });
}

function drawProjectiles() {
  projectiles.forEach(proj => {
    proj.trail.forEach(t => {
      if (t.life > 0) {
        ctx.globalAlpha = t.life * 0.6;
        ctx.fillStyle = proj.type === 'laser' ? '#ff0000' : '#ffaa00';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;

    if (proj.type === 'laser') {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff0000';
      ctx.beginPath();
      ctx.moveTo(proj.x, proj.y);
      ctx.lineTo(proj.targetX, proj.targetY);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = proj.type === 'rocket' ? '#ff4444' : proj.type === 'missile' ? '#ff8800' : '#ffff00';
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function hitPlanet(proj) {
  if (!selectedPlanet) return;

  selectedPlanet.health -= proj.damage;

  for (let i = 0; i < 30; i++) {
    particles.push({
      x: proj.targetX,
      y: proj.targetY,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1,
      color: proj.type === 'laser' ? '#ff0000' : '#ffaa00',
      size: 2 + Math.random() * 4
    });
  }

  if (selectedPlanet.health <= 0) {
    destroyPlanet(selectedPlanet);
  }
}

function destroyPlanet(planet) {
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: planet.x,
      y: planet.y,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      life: 1,
      color: planet.color,
      size: 3 + Math.random() * 6
    });
  }

  document.getElementById('status').textContent = `${planet.name} has been destroyed!`;

  setTimeout(() => {
    selectedPlanet = null;
    document.getElementById('planet-selector').style.display = 'block';
    document.getElementById('close-selector').style.display = 'none';
    document.getElementById('status').textContent = 'Select a weapon and click on the planet';
  }, 2000);
}

function updateParticles() {
  particles = particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
    p.size *= 0.98;
    return p.life > 0;
  });
}

function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawHealthBar() {
  if (!selectedPlanet) return;

  const barWidth = 100;
  const barHeight = 8;
  const x = selectedPlanet.x - barWidth / 2;
  const y = selectedPlanet.y - selectedPlanet.size - 20;

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2);

  ctx.fillStyle = '#333';
  ctx.fillRect(x, y, barWidth, barHeight);

  const healthPercent = Math.max(0, selectedPlanet.health) / 100;
  ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.25 ? '#f1c40f' : '#e74c3c';
  ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();

  if (selectedPlanet) {
    drawPlanet(selectedPlanet);
    drawHealthBar();
  }

  updateProjectiles();
  drawProjectiles();
  updateParticles();
  drawParticles();

  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

function initPlanetSelector() {
  const list = document.getElementById('planet-list');
  planets.forEach((planet, index) => {
    const div = document.createElement('div');
    div.className = 'planet-option';
    div.style.background = `radial-gradient(circle at 30% 30%, ${planet.color}, #000)`;
    div.textContent = planet.name;
    div.title = planet.name;
    div.addEventListener('click', () => {
      document.querySelectorAll('.planet-option').forEach(p => p.classList.remove('selected'));
      div.classList.add('selected');
      selectedPlanet = { ...planet };
      document.getElementById('close-selector').style.display = 'inline-block';
    });
    list.appendChild(div);
  });

  document.getElementById('close-selector').addEventListener('click', () => {
    document.getElementById('planet-selector').style.display = 'none';
    if (!gameRunning) {
      gameRunning = true;
      gameLoop();
    }
  });
}

document.querySelectorAll('.weapon-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.weapon-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentWeapon = btn.dataset.weapon;
  });
});

canvas.addEventListener('click', (e) => {
  if (!selectedPlanet || gameRunning === false) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clickX = (e.clientX - rect.left) * scaleX;
  const clickY = (e.clientY - rect.top) * scaleY;

  spawnProjectile(currentWeapon, clickX, clickY);
});

initStars();
initPlanetSelector();
