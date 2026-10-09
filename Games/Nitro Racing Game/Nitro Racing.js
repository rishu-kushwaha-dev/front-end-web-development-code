const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 900;
canvas.height = 650;

let gameRunning = false;
let score = 0;
let speed = 0;
let maxSpeed = 450;
let baseSpeed = 200;
let nitroActive = false;
let nitroAmount = 100;
let roadOffset = 0;
let screenShake = 0;
let time = 0;

const player = {
    x: 425,
    y: 500,
    width: 60,
    height: 100,
    speed: 6,
    targetX: 425,
    targetY: 500,
    tilt: 0
};

const keys = {};
let obstacles = [];
let particles = [];
let roadLines = [];
let scenery = [];
let exhaustParticles = [];
let speedLines = [];

function init() {
    obstacles = [];
    particles = [];
    roadLines = [];
    scenery = [];
    exhaustParticles = [];
    speedLines = [];
    score = 0;
    speed = baseSpeed;
    nitroAmount = 100;
    nitroActive = false;
    player.x = 425;
    player.y = 500;
    player.targetX = 425;
    player.targetY = 500;
    player.tilt = 0;

    for (let i = 0; i < 6; i++) {
        roadLines.push({
            y: i * 140,
            x: 450
        });
    }

    for (let i = 0; i < 20; i++) {
        scenery.push({
            x: Math.random() < 0.5 ? Math.random() * 130 : 760 + Math.random() * 130,
            y: Math.random() * canvas.height,
            type: Math.random() < 0.7 ? 'tree' : 'bush',
            size: 15 + Math.random() * 25,
            color: `hsl(${100 + Math.random() * 40}, ${50 + Math.random() * 30}%, ${20 + Math.random() * 20}%)`
        });
    }
}

function drawSky() {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.4);
    skyGrad.addColorStop(0, '#0a0a1a');
    skyGrad.addColorStop(0.5, '#1a0a2e');
    skyGrad.addColorStop(1, '#2d1b4e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);

    for (let i = 0; i < 50; i++) {
        const x = (i * 73 + time * 0.1) % canvas.width;
        const y = (i * 47) % (canvas.height * 0.3);
        const size = Math.random() * 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.7})`;
        ctx.fillRect(x, y, size, size);
    }
}

function drawRoad() {
    drawSky();

    const grassGrad = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
    grassGrad.addColorStop(0, '#1a3a1a');
    grassGrad.addColorStop(1, '#0d2d0d');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.6);

    const roadGrad = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
    roadGrad.addColorStop(0, '#2c3e50');
    roadGrad.addColorStop(0.5, '#34495e');
    roadGrad.addColorStop(1, '#2c3e50');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(150, canvas.height * 0.4, 600, canvas.height * 0.6);

    for (let i = 0; i < 3; i++) {
        const rumbleX = 140 + i * 200;
        ctx.fillStyle = i % 2 === 0 ? '#e74c3c' : '#fff';
        const rumbleY = (canvas.height * 0.4 + roadOffset * 0.5) % 40;
        for (let j = -1; j < canvas.height / 40 + 1; j++) {
            ctx.fillRect(rumbleX - 3, rumbleY + j * 40, 6, 20);
        }
    }

    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f1c40f';
    ctx.setLineDash([50, 40]);
    ctx.lineDashOffset = -roadOffset;
    ctx.beginPath();
    ctx.moveTo(450, canvas.height * 0.4);
    ctx.lineTo(450, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    for (let i = 0; i < 3; i++) {
        const laneX = 300 + i * 150;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([30, 50]);
        ctx.lineDashOffset = -roadOffset;
        ctx.beginPath();
        ctx.moveTo(laneX, canvas.height * 0.4);
        ctx.lineTo(laneX, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function drawScenery() {
    scenery.forEach(thing => {
        thing.y += speed * 0.015;
        if (thing.y > canvas.height + 50) {
            thing.y = -50;
            thing.x = Math.random() < 0.5 ? Math.random() * 130 : 760 + Math.random() * 130;
        }

        ctx.fillStyle = thing.color;
        if (thing.type === 'tree') {
            ctx.fillRect(thing.x - 3, thing.y, 6, thing.size);
            ctx.beginPath();
            ctx.arc(thing.x, thing.y - thing.size * 0.3, thing.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.ellipse(thing.x, thing.y, thing.size * 0.8, thing.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

    if (nitroActive) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#00d4ff';
    }

    const carGrad = ctx.createLinearGradient(-player.width / 2, 0, player.width / 2, 0);
    carGrad.addColorStop(0, '#c0392b');
    carGrad.addColorStop(0.5, '#e94560');
    carGrad.addColorStop(1, '#c0392b');
    ctx.fillStyle = carGrad;

    ctx.beginPath();
    ctx.moveTo(-player.width / 2, player.height / 2);
    ctx.lineTo(-player.width / 2 - 5, -player.height / 3);
    ctx.lineTo(-player.width / 3, -player.height / 2);
    ctx.lineTo(player.width / 3, -player.height / 2);
    ctx.lineTo(player.width / 2 + 5, -player.height / 3);
    ctx.lineTo(player.width / 2, player.height / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.moveTo(-player.width / 2 + 10, player.height / 2 - 5);
    ctx.lineTo(-player.width / 2 + 5, -player.height / 4);
    ctx.lineTo(-player.width / 4, -player.height / 3);
    ctx.lineTo(-player.width / 4, player.height / 2 - 15);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.moveTo(player.width / 2 - 10, player.height / 2 - 5);
    ctx.lineTo(player.width / 2 - 5, -player.height / 4);
    ctx.lineTo(player.width / 4, -player.height / 3);
    ctx.lineTo(player.width / 4, player.height / 2 - 15);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#3498db';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-player.width / 2 + 8, -player.height / 2 + 5, player.width / 3, 20);
    ctx.fillRect(player.width / 2 - 8 - player.width / 3, -player.height / 2 + 5, player.width / 3, 20);
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#f1c40f';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f1c40f';
    ctx.fillRect(-player.width / 2 + 8, -player.height / 2 + 3, 12, 8);
    ctx.fillRect(player.width / 2 - 20, -player.height / 2 + 3, 12, 8);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#e74c3c';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#e74c3c';
    ctx.fillRect(-player.width / 2 + 5, player.height / 2 - 12, 10, 8);
    ctx.fillRect(player.width / 2 - 15, player.height / 2 - 12, 10, 8);
    ctx.shadowBlur = 0;

    if (nitroActive) {
        const flameGrad = ctx.createLinearGradient(0, player.height / 2, 0, player.height / 2 + 60);
        flameGrad.addColorStop(0, '#00d4ff');
        flameGrad.addColorStop(0.3, '#0099ff');
        flameGrad.addColorStop(0.6, '#ff00ff');
        flameGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = flameGrad;
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#00d4ff';
        ctx.beginPath();
        ctx.moveTo(-15, player.height / 2);
        ctx.quadraticCurveTo(-20 + Math.random() * 10, player.height / 2 + 30, -5 + Math.random() * 10, player.height / 2 + 50 + Math.random() * 20);
        ctx.lineTo(5 + Math.random() * 10, player.height / 2 + 50 + Math.random() * 20);
        ctx.quadraticCurveTo(20 - Math.random() * 10, player.height / 2 + 30, 15, player.height / 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    ctx.restore();
}

function drawObstacles() {
    obstacles.forEach(obs => {
        ctx.save();
        ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);

        const carGrad = ctx.createLinearGradient(-obs.width / 2, 0, obs.width / 2, 0);
        carGrad.addColorStop(0, '#2c3e50');
        carGrad.addColorStop(0.5, obs.color);
        carGrad.addColorStop(1, '#2c3e50');
        ctx.fillStyle = carGrad;

        ctx.beginPath();
        ctx.moveTo(-obs.width / 2, obs.height / 2);
        ctx.lineTo(-obs.width / 2 - 3, -obs.height / 3);
        ctx.lineTo(-obs.width / 3, -obs.height / 2);
        ctx.lineTo(obs.width / 3, -obs.height / 2);
        ctx.lineTo(obs.width / 2 + 3, -obs.height / 3);
        ctx.lineTo(obs.width / 2, obs.height / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1a1a2e';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(-obs.width / 2 + 5, -obs.height / 3, obs.width / 3, 15);
        ctx.fillRect(obs.width / 2 - 5 - obs.width / 3, -obs.height / 3, obs.width / 3, 15);
        ctx.globalAlpha = 1;

        ctx.fillStyle = obs.taillightColor || '#ff0000';
        ctx.shadowBlur = 8;
        ctx.shadowColor = obs.taillightColor || '#ff0000';
        ctx.fillRect(-obs.width / 2 + 5, obs.height / 2 - 10, 8, 6);
        ctx.fillRect(obs.width / 2 - 13, obs.height / 2 - 10, 8, 6);
        ctx.shadowBlur = 0;

        ctx.restore();
    });
}

function drawParticles() {
    exhaustParticles.forEach((p, index) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        p.size *= 0.98;

        if (p.life <= 0) {
            exhaustParticles.splice(index, 1);
        }
    });
}

function drawSpeedLines() {
    speedLines.forEach((line, index) => {
        ctx.strokeStyle = `rgba(255, 255, 255, ${line.life * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + line.vx, line.y + line.vy);
        ctx.stroke();

        line.x += line.vx;
        line.y += line.vy;
        line.life -= 0.05;

        if (line.life <= 0) {
            speedLines.splice(index, 1);
        }
    });
}

function spawnObstacle() {
    if (Math.random() < 0.015 + speed * 0.00005) {
        const lanes = [180, 330, 480, 630];
        const lane = lanes[Math.floor(Math.random() * lanes.length)];
        const colors = ['#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];
        const taillightColors = ['#ff0000', '#ff6600', '#ff00ff', '#00ff00', '#ffaa00'];

        obstacles.push({
            x: lane,
            y: -120,
            width: 55,
            height: 90,
            color: colors[Math.floor(Math.random() * colors.length)],
            taillightColor: taillightColors[Math.floor(Math.random() * taillightColors.length)]
        });
    }
}

function spawnExhaust() {
    if (nitroActive && Math.random() < 0.8) {
        exhaustParticles.push({
            x: player.x + player.width / 2 + (Math.random() - 0.5) * 25,
            y: player.y + player.height / 2 + 30,
            vx: (Math.random() - 0.5) * 3,
            vy: 4 + Math.random() * 3,
            size: 4 + Math.random() * 6,
            color: Math.random() < 0.5 ? '#00d4ff' : '#ff00ff',
            life: 1
        });
    } else if (Math.random() < 0.3) {
        exhaustParticles.push({
            x: player.x + player.width / 2 + (Math.random() - 0.5) * 15,
            y: player.y + player.height / 2 + 20,
            vx: (Math.random() - 0.5) * 1,
            vy: 2 + Math.random() * 2,
            size: 2 + Math.random() * 3,
            color: '#666',
            life: 0.8
        });
    }
}

function spawnSpeedLines() {
    if (speed > 300 && Math.random() < 0.3) {
        speedLines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 10,
            vy: speed * 0.1,
            life: 1
        });
    }
}

function update() {
    if (!gameRunning) return;

    time++;

    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.targetX = Math.max(165, player.targetX - player.speed * 1.2);
        player.tilt = Math.max(-0.1, player.tilt - 0.02);
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.targetX = Math.min(675, player.targetX + player.speed * 1.2);
        player.tilt = Math.min(0.1, player.tilt + 0.02);
    } else {
        player.tilt *= 0.9;
    }

    if (keys['ArrowUp'] || keys['KeyW']) {
        player.targetY = Math.max(150, player.targetY - player.speed);
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        player.targetY = Math.min(550, player.targetY + player.speed);
    }

    player.x += (player.targetX - player.x) * 0.15;
    player.y += (player.targetY - player.y) * 0.15;

    if (keys['Space'] && nitroAmount > 0) {
        nitroActive = true;
        nitroAmount -= 1.2;
        speed = maxSpeed;
        screenShake = Math.max(screenShake, 2);
    } else {
        nitroActive = false;
        speed = baseSpeed + Math.min(nitroAmount * 0.5, 50);
        if (nitroAmount < 100) {
            nitroAmount += 0.4;
        }
    }

    roadOffset += speed * 0.03;

    score += speed * 0.008;

    obstacles.forEach((obs, index) => {
        obs.y += speed * 0.025;

        if (checkCollision(player, obs)) {
            triggerGameOver();
        }

        if (obs.y > canvas.height + 100) {
            obstacles.splice(index, 1);
            score += 50;
        }
    });

    spawnObstacle();
    spawnExhaust();
    spawnSpeedLines();

    if (screenShake > 0) screenShake *= 0.9;

    updateUI();
}

function checkCollision(rect1, rect2) {
    const padding = 10;
    return rect1.x + padding < rect2.x + rect2.width - padding &&
        rect1.x + rect1.width - padding > rect2.x + padding &&
        rect1.y + padding < rect2.y + rect2.height - padding &&
        rect1.y + rect1.height - padding > rect2.y + padding;
}

function triggerGameOver() {
    gameRunning = false;

    const flash = document.getElementById('flash');
    flash.style.opacity = '0.8';
    setTimeout(() => {
        flash.style.opacity = '0';
    }, 100);

    setTimeout(() => {
        document.getElementById('finalScore').textContent = Math.floor(score);
        document.getElementById('gameOverScreen').style.display = 'flex';
    }, 500);
}

function updateUI() {
    document.getElementById('score').textContent = String(Math.floor(score)).padStart(6, '0');
    document.getElementById('speed').textContent = Math.floor(speed);
    document.getElementById('nitroFill').style.width = `${nitroAmount}%`;
}

function draw() {
    ctx.save();

    if (screenShake > 0.5) {
        ctx.translate(
            (Math.random() - 0.5) * screenShake * 2,
            (Math.random() - 0.5) * screenShake * 2
        );
    }

    ctx.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);

    drawRoad();
    drawScenery();
    drawSpeedLines();
    drawObstacles();
    drawParticles();
    drawPlayer();

    ctx.restore();
}

function gameLoop() {
    if (!gameRunning) return;

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

function startGame() {
    init();
    gameRunning = true;
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    gameLoop();
}

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space') {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);