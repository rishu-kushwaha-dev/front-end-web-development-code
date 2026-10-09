const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const newHighElement = document.getElementById('new-high');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const CONFIG = {
    width: 400,
    height: 600,
    gravity: 0.35,
    jumpForce: -11,
    moveSpeed: 6,
    platformWidth: 70,
    platformHeight: 15,
    doodlerWidth: 40,
    doodlerHeight: 50,
    maxPlatforms: 8,
    minPlatformGap: 50,
    maxPlatformGap: 90
};

canvas.width = CONFIG.width;
canvas.height = CONFIG.height;

let doodler = {
    x: CONFIG.width / 2 - CONFIG.doodlerWidth / 2,
    y: CONFIG.height - 150,
    vx: 0,
    vy: 0,
    width: CONFIG.doodlerWidth,
    height: CONFIG.doodlerHeight,
    direction: 1,
    trail: []
};

let platforms = [];
let score = 0;
let highScore = parseInt(localStorage.getItem('doodleJumpHighScore')) || 0;
let cameraY = 0;
let gameRunning = false;
let animationId = null;
let particles = [];
let clouds = [];
let time = 0;

const keys = {
    left: false,
    right: false
};

function initClouds() {
    clouds = [];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * CONFIG.width,
            y: Math.random() * CONFIG.height,
            speed: 0.2 + Math.random() * 0.3,
            size: 0.5 + Math.random() * 0.5
        });
    }
}

function init() {
    platforms = [];
    doodler.x = CONFIG.width / 2 - CONFIG.doodlerWidth / 2;
    doodler.y = CONFIG.height - 150;
    doodler.vx = 0;
    doodler.vy = CONFIG.jumpForce;
    doodler.trail = [];
    score = 0;
    cameraY = 0;
    particles = [];
    time = 0;
    initClouds();

    for (let i = 0; i < CONFIG.maxPlatforms; i++) {
        platforms.push(createPlatform(CONFIG.height - 100 - i * (CONFIG.minPlatformGap + Math.random() * (CONFIG.maxPlatformGap - CONFIG.minPlatformGap))));
    }

    updateScore();
}

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            color: color,
            size: 2 + Math.random() * 3
        });
    }
}

function updateParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
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

function createPlatform(y) {
    const rand = Math.random();
    let platform;

    if (rand < 0.12) {
        platform = { color: '#FFD700', type: 'spring' };
    } else if (rand < 0.30) {
        platform = { color: '#9370DB', type: 'moving', moveDir: 1, moveSpeed: 2 + Math.random() * 2 };
    } else if (rand < 0.45) {
        platform = { color: '#FF6B6B', type: 'breakable' };
    } else {
        const colors = ['#8B4513', '#228B22', '#DC143C', '#4169E1'];
        platform = { color: colors[Math.floor(Math.random() * colors.length)], type: 'normal' };
    }

    return {
        x: Math.random() * (CONFIG.width - CONFIG.platformWidth),
        y: y,
        width: CONFIG.platformWidth,
        height: CONFIG.platformHeight,
        color: platform.color,
        type: platform.type,
        moveDir: platform.moveDir || 0,
        moveSpeed: platform.moveSpeed || 0,
        broken: false
    };
}

function handleInput() {
    doodler.vx = 0;
    if (keys.left) {
        doodler.vx = -CONFIG.moveSpeed;
        doodler.direction = -1;
    }
    if (keys.right) {
        doodler.vx = CONFIG.moveSpeed;
        doodler.direction = 1;
    }
}

function update() {
    time++;

    doodler.vy += CONFIG.gravity;
    doodler.x += doodler.vx;
    doodler.y += doodler.vy;

    doodler.trail.push({ x: doodler.x + doodler.width / 2, y: doodler.y + doodler.height / 2, life: 1 });
    if (doodler.trail.length > 8) doodler.trail.shift();
    doodler.trail.forEach(t => t.life -= 0.1);

    platforms.forEach(platform => {
        if (platform.type === 'moving') {
            platform.x += platform.moveSpeed * platform.moveDir;
            if (platform.x <= 0 || platform.x + platform.width >= CONFIG.width) {
                platform.moveDir *= -1;
            }
        }
    });

    if (doodler.x < -doodler.width) {
        doodler.x = CONFIG.width;
    } else if (doodler.x > CONFIG.width) {
        doodler.x = -doodler.width;
    }

    if (doodler.vy > 0) {
        platforms.forEach(platform => {
            if (!platform.broken &&
                doodler.x + doodler.width > platform.x &&
                doodler.x < platform.x + platform.width &&
                doodler.y + doodler.height > platform.y &&
                doodler.y + doodler.height < platform.y + platform.height + doodler.vy &&
                doodler.vy > 0) {
                if (platform.type === 'spring') {
                    doodler.vy = CONFIG.jumpForce * 1.8;
                    createParticles(doodler.x + doodler.width / 2, doodler.y + doodler.height, '#FFD700', 10);
                } else if (platform.type === 'breakable') {
                    platform.broken = true;
                    createParticles(platform.x + platform.width / 2, platform.y + platform.height / 2, platform.color, 8);
                } else {
                    doodler.vy = CONFIG.jumpForce;
                }
            }
        });
    }

    if (doodler.y < CONFIG.height / 2) {
        const deltaY = CONFIG.height / 2 - doodler.y;
        doodler.y = CONFIG.height / 2;
        cameraY += deltaY;
        score += Math.floor(deltaY);

        platforms.forEach(platform => {
            platform.y += deltaY;
        });

        platforms = platforms.filter(platform => platform.y < CONFIG.height + 100 && !platform.broken);

        while (platforms.length < CONFIG.maxPlatforms) {
            const highestPlatform = Math.min(...platforms.map(p => p.y));
            const newY = highestPlatform - CONFIG.minPlatformGap - Math.random() * (CONFIG.maxPlatformGap - CONFIG.minPlatformGap);
            platforms.push(createPlatform(newY));
        }
    }

    if (doodler.y > CONFIG.height) {
        gameOver();
    }

    updateParticles();

    clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > CONFIG.width + 50) {
            cloud.x = -50;
            cloud.y = Math.random() * CONFIG.height;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, CONFIG.width, CONFIG.height);

    const heightFactor = Math.min(cameraY / 5000, 1);
    const r1 = Math.floor(135 + (26 - 135) * heightFactor);
    const g1 = Math.floor(206 + (26 - 206) * heightFactor);
    const b1 = Math.floor(235 + (46 - 235) * heightFactor);
    const r2 = Math.floor(224 + (15 - 224) * heightFactor);
    const g2 = Math.floor(246 + (52 - 246) * heightFactor);
    const b2 = Math.floor(255 + (96 - 255) * heightFactor);

    const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.height);
    gradient.addColorStop(0, `rgb(${r1}, ${g1}, ${b1})`);
    gradient.addColorStop(1, `rgb(${r2}, ${g2}, ${b2})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    if (heightFactor > 0.3) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + heightFactor * 0.4})`;
        for (let i = 0; i < 30; i++) {
            const x = (i * 73 + time * 0.2) % CONFIG.width;
            const y = (i * 41) % CONFIG.height;
            const size = (Math.sin(time * 0.05 + i) + 1) * 1.5;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    clouds.forEach(cloud => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 20 * cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + 15 * cloud.size, cloud.y - 5 * cloud.size, 25 * cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + 30 * cloud.size, cloud.y, 20 * cloud.size, 0, Math.PI * 2);
        ctx.fill();
    });

    platforms.forEach(platform => {
        if (platform.broken) return;

        ctx.save();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;

        ctx.fillStyle = platform.color;
        ctx.beginPath();
        ctx.roundRect(platform.x, platform.y, platform.width, platform.height, 8);
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        const platGrad = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
        platGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        platGrad.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
        ctx.fillStyle = platGrad;
        ctx.beginPath();
        ctx.roundRect(platform.x, platform.y, platform.width, platform.height, 8);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(platform.x, platform.y, platform.width, platform.height / 2, [8, 8, 0, 0]);
        ctx.stroke();

        if (platform.type === 'spring') {
            const springY = platform.y - 8 + Math.sin(time * 0.2) * 2;
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(platform.x + platform.width / 2, springY, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(platform.x + platform.width / 2, springY, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        if (platform.type === 'moving') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(platform.x + 5, platform.y + 3, platform.width - 10, 3);
        }

        if (platform.type === 'breakable') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(platform.x + 10, platform.y + 5);
            ctx.lineTo(platform.x + 25, platform.y + 10);
            ctx.moveTo(platform.x + 40, platform.y + 3);
            ctx.lineTo(platform.x + 55, platform.y + 8);
            ctx.stroke();
        }

        ctx.restore();
    });

    doodler.trail.forEach((t, i) => {
        if (t.life > 0) {
            ctx.globalAlpha = t.life * 0.3;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(t.x, t.y, 8 * t.life, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(doodler.x + doodler.width / 2, doodler.y + doodler.height / 2);
    ctx.scale(doodler.direction, 1);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 2, doodler.width / 2, doodler.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    const bodyGrad = ctx.createRadialGradient(-5, -5, 0, 0, 0, doodler.width / 2);
    bodyGrad.addColorStop(0, '#FFE55C');
    bodyGrad.addColorStop(1, '#FFA500');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 2, doodler.width / 2 - 2, doodler.height / 2 - 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-8, -10, 7, 0, Math.PI * 2);
    ctx.arc(8, -10, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-6, -10, 3, 0, Math.PI * 2);
    ctx.arc(10, -10, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-5, -11, 1, 0, Math.PI * 2);
    ctx.arc(11, -11, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(0, 5, 7, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(-15, -5, 6, 3);
    ctx.fillRect(9, -5, 6, 3);

    ctx.restore();

    drawParticles();
}

function updateScore() {
    const oldScore = parseInt(scoreElement.textContent.replace('Score: ', '')) || 0;
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;

    if (score > oldScore && score % 100 === 0) {
        scoreElement.classList.add('bump');
        setTimeout(() => scoreElement.classList.remove('bump'), 300);
    }
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);

    scoreElement.classList.add('hidden');
    highScoreElement.classList.add('hidden');

    finalScoreElement.textContent = `Score: ${score}`;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('doodleJumpHighScore', highScore);
        newHighElement.classList.remove('hidden');
    } else {
        newHighElement.classList.add('hidden');
    }

    updateScore();
    gameOverElement.classList.remove('hidden');

    for (let i = 0; i < 20; i++) {
        createParticles(
            doodler.x + doodler.width / 2,
            doodler.y + doodler.height / 2,
            '#FFD700',
            5
        );
    }
}

function gameLoop() {
    if (!gameRunning) return;

    handleInput();
    update();
    draw();
    updateScore();

    animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
    init();
    initClouds();
    startScreen.classList.add('hidden');
    gameOverElement.classList.add('hidden');
    scoreElement.classList.remove('hidden');
    highScoreElement.classList.remove('hidden');
    gameRunning = true;
    gameLoop();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = false;
    }
});

const touchLeft = document.getElementById('touch-left');
const touchRight = document.getElementById('touch-right');

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

touchLeft.addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; });
touchLeft.addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; });
touchRight.addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; });
touchRight.addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; });

highScoreElement.textContent = `High Score: ${highScore}`;

scoreElement.classList.add('hidden');
highScoreElement.classList.add('hidden');