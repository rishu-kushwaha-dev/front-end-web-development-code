const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 700;

const TILE_SIZE = 40;
const COLS = Math.floor(canvas.width / TILE_SIZE);
const ROWS = Math.floor(canvas.height / TILE_SIZE);

let score = 0;
let highScore = 0;
let gameRunning = false;
let gameOver = false;
let paused = false;
let animationId;
let cameraY = 0;
let targetCameraY = 0;

const keys = {};
let canMove = true;
const MOVE_DELAY = 150;
let lastMoveTime = 0;

const ROW_TYPES = {
    GRASS: 'grass',
    ROAD: 'road',
    RIVER: 'river',
    RAIL: 'rail'
};

const player = {
    x: Math.floor(COLS / 2),
    y: ROWS - 2,
    width: TILE_SIZE * 0.8,
    height: TILE_SIZE * 0.8,
    alive: true,
    onLog: null,
    onTurtle: null
};

let rows = [];
let cars = [];
let logs = [];
let turtles = [];
let trains = [];
let trainWarnings = [];
let particles = [];
let lastTime = 0;

function initGame() {
    score = 0;
    cameraY = 0;
    targetCameraY = 0;
    gameOver = false;
    paused = false;
    gameRunning = true;
    rows = [];
    cars = [];
    logs = [];
    turtles = [];
    trains = [];
    trainWarnings = [];
    particles = [];

    player.x = Math.floor(COLS / 2);
    player.y = ROWS - 2;
    player.alive = true;
    player.onLog = null;
    player.onTurtle = null;

    generateRows();
    updateScore();

    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('pauseScreen').style.display = 'none';

    if (animationId) cancelAnimationFrame(animationId);
    lastTime = Date.now();
    gameLoop();
}

function generateRows() {
    let typeWeights = {
        [ROW_TYPES.GRASS]: 30,
        [ROW_TYPES.ROAD]: 35,
        [ROW_TYPES.RIVER]: 25,
        [ROW_TYPES.RAIL]: 10
    };

    for (let i = 0; i < ROWS + 20; i++) {
        let type = selectRowType(typeWeights, i);
        rows.push({
            type: type,
            y: i
        });

        if (type === ROW_TYPES.ROAD) {
            spawnCars(i);
        } else if (type === ROW_TYPES.RIVER) {
            spawnLogsAndTurtles(i);
        } else if (type === ROW_TYPES.RAIL) {
            trainWarnings.push({
                row: i,
                timer: Math.random() * 300 + 200,
                active: false,
                trainPassed: false
            });
        }
    }
}

function selectRowType(weights, rowIndex) {
    let totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    if (rowIndex < 5) {
        return ROW_TYPES.GRASS;
    }

    for (let [type, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0) {
            return type;
        }
    }
    return ROW_TYPES.GRASS;
}

function spawnCars(row) {
    let direction = Math.random() > 0.5 ? 1 : -1;
    let speed = (Math.random() * 3 + 2) * direction;
    let gap = Math.floor(Math.random() * 3) + 3;
    let startX = Math.random() * COLS;

    for (let i = 0; i < 3; i++) {
        cars.push({
            x: (startX + i * gap) % (COLS + 3) - 3,
            y: row,
            width: TILE_SIZE * (Math.random() > 0.5 ? 1.5 : 2),
            height: TILE_SIZE * 0.8,
            speed: speed,
            color: ['#e74c3c', '#3498db', '#9b59b6', '#e67e22', '#1abc9c'][Math.floor(Math.random() * 5)]
        });
    }
}

function spawnLogsAndTurtles(row) {
    let direction = Math.random() > 0.5 ? 1 : -1;
    let speed = (Math.random() * 1.5 + 1) * direction;
    let isLog = Math.random() > 0.3;
    let count = Math.floor(Math.random() * 2) + 2;
    let startX = Math.random() * COLS;
    let gap = Math.floor(Math.random() * 2) + 2;

    for (let i = 0; i < count; i++) {
        if (isLog) {
            logs.push({
                x: (startX + i * gap) % (COLS + 5) - 5,
                y: row,
                width: TILE_SIZE * (Math.random() > 0.5 ? 2 : 3),
                height: TILE_SIZE * 0.9,
                speed: speed,
                color: '#8B4513'
            });
        } else {
            turtles.push({
                x: (startX + i * gap) % (COLS + 3) - 3,
                y: row,
                width: TILE_SIZE * 0.8,
                height: TILE_SIZE * 0.8,
                speed: speed,
                diveTimer: Math.random() * 200,
                diving: false,
                diveDuration: 0,
                color: '#2ecc71'
            });
        }
    }
}

function spawnTrain(row) {
    let direction = Math.random() > 0.5 ? 1 : -1;
    trains.push({
        x: direction > 0 ? -5 : COLS + 5,
        y: row,
        width: TILE_SIZE * 8,
        height: TILE_SIZE * 0.9,
        speed: 12 * direction,
        color: '#2c3e50'
    });
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (!gameRunning || gameOver) return;

    if (e.key === ' ' || e.key === 'Escape') {
        togglePause();
        return;
    }

    if (paused) return;

    let now = Date.now();
    if (now - lastMoveTime < MOVE_DELAY) return;

    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        movePlayer(0, -1);
        lastMoveTime = now;
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        movePlayer(0, 1);
        lastMoveTime = now;
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        movePlayer(-1, 0);
        lastMoveTime = now;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        movePlayer(1, 0);
        lastMoveTime = now;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function movePlayer(dx, dy) {
    if (!canMove || !gameRunning || gameOver || paused) return;

    let newX = player.x + dx;
    let newY = player.y + dy;

    if (newX < 0 || newX >= COLS) return;
    if (newY < 0) return;

    if (dy < 0) {
        score++;
        updateScore();
        targetCameraY = Math.max(targetCameraY, newY * TILE_SIZE - canvas.height * 0.4);
    }

    player.x = newX;
    player.y = newY;
    player.onLog = null;
    player.onTurtle = null;

    if (newY >= rows.length) {
        generateMoreRows();
    }

    canMove = false;
    setTimeout(() => { canMove = true; }, 80);
}

function togglePause() {
    if (!gameRunning || gameOver) return;

    paused = !paused;

    if (paused) {
        document.getElementById('pauseScreen').style.display = 'flex';
    } else {
        document.getElementById('pauseScreen').style.display = 'none';
        lastTime = Date.now();
    }
}

function generateMoreRows() {
    let lastY = rows[rows.length - 1].y;
    let typeWeights = {
        [ROW_TYPES.GRASS]: 25,
        [ROW_TYPES.ROAD]: 35,
        [ROW_TYPES.RIVER]: 25,
        [ROW_TYPES.RAIL]: 15
    };

    for (let i = 0; i < 20; i++) {
        lastY++;
        let type = selectRowType(typeWeights, lastY);
        rows.push({
            type: type,
            y: lastY
        });

        if (type === ROW_TYPES.ROAD) {
            spawnCars(lastY);
        } else if (type === ROW_TYPES.RIVER) {
            spawnLogsAndTurtles(lastY);
        } else if (type === ROW_TYPES.RAIL) {
            trainWarnings.push({
                row: lastY,
                timer: Math.random() * 300 + 200,
                active: false,
                trainPassed: false
            });
        }
    }

    rows = rows.filter(r => r.y > -20);
    cars = cars.filter(c => c.y > -20 && c.y < rows[rows.length - 1].y + 10);
    logs = logs.filter(l => l.y > -20 && l.y < rows[rows.length - 1].y + 10);
    turtles = turtles.filter(t => t.y > -20 && t.y < rows[rows.length - 1].y + 10);
    trainWarnings = trainWarnings.filter(w => w.row > -20 && w.row < rows[rows.length - 1].y + 10);
    trains = trains.filter(t => t.y > -20 && t.y < rows[rows.length - 1].y + 10);
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function update(dt) {
    if (!gameRunning || gameOver || paused) return;

    cameraY += (targetCameraY - cameraY) * 0.1;

    cars.forEach(car => {
        car.x += car.speed * dt;
        if (car.speed > 0 && car.x > COLS + 2) car.x = -3;
        if (car.speed < 0 && car.x < -3) car.x = COLS + 2;
    });

    logs.forEach(log => {
        log.x += log.speed * dt;
        if (log.speed > 0 && log.x > COLS + 5) log.x = -5 - log.width;
        if (log.speed < 0 && log.x < -5 - log.width) log.x = COLS + 5;
    });

    turtles.forEach(turtle => {
        turtle.x += turtle.speed * dt;
        turtle.diveTimer -= dt;

        if (!turtle.diving && turtle.diveTimer <= 0) {
            turtle.diving = true;
            turtle.diveDuration = 120;
        }

        if (turtle.diving) {
            turtle.diveDuration -= dt;
            if (turtle.diveDuration <= 0) {
                turtle.diving = false;
                turtle.diveTimer = Math.random() * 200 + 100;
            }
        }

        if (turtle.speed > 0 && turtle.x > COLS + 3) turtle.x = -3;
        if (turtle.speed < 0 && turtle.x < -3) turtle.x = COLS + 3;
    });

    trainWarnings.forEach(warning => {
        if (!warning.active && !warning.trainPassed) {
            warning.timer -= dt;
            if (warning.timer <= 0) {
                warning.active = true;
                spawnTrain(warning.row);
            }
        }
    });

    trains.forEach(train => {
        train.x += train.speed * dt;
    });

    trains = trains.filter(train => {
        if (train.speed > 0 && train.x > COLS + 10) return false;
        if (train.speed < 0 && train.x < -10) {
            let warning = trainWarnings.find(w => w.row === train.y);
            if (warning) {
                warning.active = false;
                warning.trainPassed = true;
                warning.timer = Math.random() * 400 + 300;
            }
            return false;
        }
        return true;
    });

    trainWarnings.forEach(w => {
        if (w.trainPassed) {
            w.timer -= dt;
            if (w.timer <= 0) {
                w.trainPassed = false;
                w.timer = Math.random() * 300 + 200;
            }
        }
    });

    checkCollisions();

    if (player.y > rows[rows.length - 1].y - 10) {
        generateMoreRows();
    }
}

function checkCollisions() {
    let currentRow = rows.find(r => r.y === player.y);
    if (!currentRow) return;

    if (currentRow.type === ROW_TYPES.GRASS) {
        return;
    }

    if (currentRow.type === ROW_TYPES.ROAD) {
        let onCar = cars.some(car => {
            return player.y === car.y &&
                player.x + 0.3 >= car.x &&
                player.x - 0.3 <= car.x + car.width / TILE_SIZE;
        });

        if (onCar) {
            killPlayer();
        }
    }

    if (currentRow.type === ROW_TYPES.RIVER) {
        let onLog = logs.some(log => {
            return player.y === log.y &&
                player.x + 0.3 >= log.x &&
                player.x - 0.3 <= log.x + log.width / TILE_SIZE;
        });

        let onTurtle = turtles.some(turtle => {
            if (turtle.diving) return false;
            return player.y === turtle.y &&
                player.x + 0.3 >= turtle.x &&
                player.x - 0.3 <= turtle.x + turtle.width / TILE_SIZE;
        });

        if (onLog) {
            player.onLog = logs.find(log =>
                player.y === log.y &&
                player.x + 0.3 >= log.x &&
                player.x - 0.3 <= log.x + log.width / TILE_SIZE
            );
            player.x += player.onLog.speed * 0.016;
        } else if (onTurtle) {
            player.onTurtle = turtles.find(turtle =>
                !turtle.diving &&
                player.y === turtle.y &&
                player.x + 0.3 >= turtle.x &&
                player.x - 0.3 <= turtle.x + turtle.width / TILE_SIZE
            );
            player.x += player.onTurtle.speed * 0.016;
        } else {
            killPlayer();
        }
    }

    if (currentRow.type === ROW_TYPES.RAIL) {
        trains.forEach(train => {
            if (player.y === train.y) {
                let playerLeft = (player.x + 0.1) * TILE_SIZE;
                let playerRight = (player.x + 0.9) * TILE_SIZE;
                let trainLeft = train.x * TILE_SIZE;
                let trainRight = (train.x + train.width / TILE_SIZE) * TILE_SIZE;

                if (playerRight > trainLeft && playerLeft < trainRight) {
                    killPlayer();
                }
            }
        });
    }

    if (player.x < -0.5 || player.x > COLS - 0.5) {
        killPlayer();
    }
}

function killPlayer() {
    if (!player.alive) return;
    player.alive = false;
    gameOver = true;
    gameRunning = false;

    for (let i = 0; i < 30; i++) {
        particles.push({
            x: (player.x + 0.5) * TILE_SIZE,
            y: (player.y + 0.5) * TILE_SIZE - cameraY,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1,
            color: ['#f1c40f', '#e74c3c', '#f39c12', '#e67e22'][Math.floor(Math.random() * 4)]
        });
    }

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('crossyRoadHighScore', highScore);
    }

    setTimeout(() => {
        document.getElementById('finalScore').textContent = score;
        document.getElementById('highScore').textContent = highScore;

        if (score >= highScore && score > 0) {
            document.getElementById('newHighScore').style.display = 'block';
        } else {
            document.getElementById('newHighScore').style.display = 'none';
        }

        document.getElementById('gameOverScreen').style.display = 'flex';
    }, 1000);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(0, -cameraY);

    for (let row of rows) {
        let screenY = row.y * TILE_SIZE;
        if (screenY + TILE_SIZE < cameraY - 50 || screenY > cameraY + canvas.height + 50) continue;

        drawRow(row);
    }

    cars.forEach(car => drawCar(car));
    logs.forEach(log => drawLog(log));
    turtles.forEach(turtle => drawTurtle(turtle));
    trains.forEach(train => drawTrain(train));

    if (player.alive) {
        drawPlayer();
    }

    ctx.restore();

    trainWarnings.forEach(warning => {
        if (warning.active) {
            let screenY = warning.row * TILE_SIZE - cameraY;
            if (screenY > -50 && screenY < canvas.height + 50) {
                ctx.fillStyle = 'rgba(231, 76, 60, 0.9)';
                ctx.fillRect(0, screenY, canvas.width, 6);
            }
        }
    });

    particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 + (1 - p.life) * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });

    if (paused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawRow(row) {
    let y = row.y * TILE_SIZE;

    if (row.type === ROW_TYPES.GRASS) {
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(0, y, canvas.width, TILE_SIZE);

        ctx.fillStyle = '#2ecc71';
        for (let i = 0; i < COLS; i++) {
            if ((i + row.y) % 3 === 0) {
                ctx.fillRect(i * TILE_SIZE + 5, y + 5, TILE_SIZE - 10, TILE_SIZE - 10);
            }
        }

        if (row.y % 7 === 0) {
            ctx.fillStyle = '#6B3E26';
            ctx.fillRect(0, y + TILE_SIZE - 8, canvas.width, 8);
        }
    } else if (row.type === ROW_TYPES.ROAD) {
        ctx.fillStyle = '#34495e';
        ctx.fillRect(0, y, canvas.width, TILE_SIZE);

        ctx.strokeStyle = '#7f8c8d';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 15]);
        ctx.beginPath();
        ctx.moveTo(0, y + TILE_SIZE / 2);
        ctx.lineTo(canvas.width, y + TILE_SIZE / 2);
        ctx.stroke();
        ctx.setLineDash([]);
    } else if (row.type === ROW_TYPES.RIVER) {
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(0, y, canvas.width, TILE_SIZE);

        ctx.fillStyle = '#3498db';
        for (let i = 0; i < COLS; i++) {
            if ((i + row.y) % 2 === 0) {
                ctx.fillRect(i * TILE_SIZE, y + 5, TILE_SIZE, TILE_SIZE - 10);
            }
        }
    } else if (row.type === ROW_TYPES.RAIL) {
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(0, y, canvas.width, TILE_SIZE);

        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(0, y + 5, canvas.width, 6);
        ctx.fillRect(0, y + TILE_SIZE - 11, canvas.width, 6);

        for (let i = 0; i < COLS; i += 2) {
            ctx.fillStyle = '#34495e';
            ctx.fillRect(i * TILE_SIZE + 10, y + 8, 4, TILE_SIZE - 16);
        }
    }
}

function drawPlayer() {
    let x = (player.x + 0.5) * TILE_SIZE;
    let y = (player.y + 0.5) * TILE_SIZE - cameraY;

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y - 8, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e67e22';
    ctx.fillRect(x - 15, y - 3, 8, 5);
    ctx.fillRect(x + 7, y - 3, 8, 5);

    ctx.fillStyle = '#000000';
    ctx.fillRect(x - 8, y + 3, 4, 4);
    ctx.fillRect(x + 4, y + 3, 4, 4);

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x - 3, y + 10, 6, 4);
}

function drawCar(car) {
    let x = car.x * TILE_SIZE;
    let y = car.y * TILE_SIZE - cameraY;

    if (y < -TILE_SIZE || y > canvas.height + TILE_SIZE) return;

    ctx.fillStyle = car.color;
    ctx.fillRect(x, y + 4, car.width, car.height - 8);

    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 4, y + 2, car.width - 8, 6);

    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + car.width - 8, y + car.height - 10, 5, 5);
    ctx.fillRect(x + 3, y + car.height - 10, 5, 5);
}

function drawLog(log) {
    let x = log.x * TILE_SIZE;
    let y = log.y * TILE_SIZE - cameraY;

    if (y < -TILE_SIZE || y > canvas.height + TILE_SIZE) return;

    ctx.fillStyle = log.color;
    ctx.fillRect(x, y + 2, log.width, log.height - 4);

    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < log.width; i += TILE_SIZE) {
        ctx.fillRect(x + i + 5, y + 5, TILE_SIZE - 10, log.height - 10);
    }
}

function drawTurtle(turtle) {
    let x = turtle.x * TILE_SIZE;
    let y = turtle.y * TILE_SIZE - cameraY;
    let alpha = turtle.diving ? 0.4 : 1;

    if (y < -TILE_SIZE || y > canvas.height + TILE_SIZE) return;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = turtle.color;
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, TILE_SIZE/3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE/2 - 5, y + TILE_SIZE/2 - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE/2 + 5, y + TILE_SIZE/2 - 5, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x + TILE_SIZE/2 - 3, y + TILE_SIZE/2 + 2, 6, 3);

    ctx.globalAlpha = 1;
}

function drawTrain(train) {
    let x = train.x * TILE_SIZE;
    let y = train.y * TILE_SIZE - cameraY;

    if (y < -TILE_SIZE || y > canvas.height + TILE_SIZE) return;

    ctx.fillStyle = train.color;
    ctx.fillRect(x, y + 2, train.width, train.height - 4);

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x + 5, y + 5, train.width - 10, train.height - 10);

    ctx.fillStyle = '#f1c40f';
    for (let i = 0; i < train.width; i += 30) {
        ctx.fillRect(x + i + 10, y + 8, 10, train.height - 16);
    }

    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 5, y + 3, train.width - 10, 5);
    ctx.fillRect(x + 5, y + train.height - 8, train.width - 10, 5);
}

function gameLoop() {
    if (!gameRunning) return;

    let now = Date.now();
    let dt = Math.min((now - (lastTime || now)) / 16.67, 3);
    lastTime = now;

    if (!gameOver) {
        update(dt);
    }

    draw();

    if (gameOver) {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
        });
        particles = particles.filter(p => p.life > 0);

        if (particles.length > 0) {
            animationId = requestAnimationFrame(gameLoop);
            return;
        }
    }

    animationId = requestAnimationFrame(gameLoop);
}

function loadHighScore() {
    let saved = localStorage.getItem('crossyRoadHighScore');
    if (saved) {
        highScore = parseInt(saved, 10);
        document.getElementById('highScore').textContent = highScore;
    }
}

function setupMobileControls() {
    const btnUp = document.getElementById('btnUp');
    const btnDown = document.getElementById('btnDown');
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnPause = document.getElementById('btnPause');

    function handleMove(dx, dy) {
        if (!gameRunning || gameOver || paused) return;
        let now = Date.now();
        if (now - lastMoveTime < MOVE_DELAY) return;
        movePlayer(dx, dy);
        lastMoveTime = now;
    }

    btnUp.addEventListener('touchstart', (e) => { e.preventDefault(); handleMove(0, -1); });
    btnDown.addEventListener('touchstart', (e) => { e.preventDefault(); handleMove(0, 1); });
    btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); handleMove(-1, 0); });
    btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); handleMove(1, 0); });

    btnUp.addEventListener('mousedown', (e) => { e.preventDefault(); handleMove(0, -1); });
    btnDown.addEventListener('mousedown', (e) => { e.preventDefault(); handleMove(0, 1); });
    btnLeft.addEventListener('mousedown', (e) => { e.preventDefault(); handleMove(-1, 0); });
    btnRight.addEventListener('mousedown', (e) => { e.preventDefault(); handleMove(1, 0); });

    btnPause.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!gameRunning || gameOver) return;
        togglePause();
    });
    btnPause.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (!gameRunning || gameOver) return;
        togglePause();
    });

    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
        if (!gameRunning || gameOver || paused) return;

        let touchEndX = e.changedTouches[0].clientX;
        let touchEndY = e.changedTouches[0].clientY;

        let dx = touchEndX - touchStartX;
        let dy = touchEndY - touchStartY;

        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

        let now = Date.now();
        if (now - lastMoveTime < MOVE_DELAY) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            movePlayer(dx > 0 ? 1 : -1, 0);
        } else {
            movePlayer(0, dy > 0 ? 1 : -1);
        }
        lastMoveTime = now;
    }, { passive: true });
}

document.getElementById('startBtn').addEventListener('click', initGame);
document.getElementById('restartBtn').addEventListener('click', initGame);
document.getElementById('resumeBtn').addEventListener('click', togglePause);

document.getElementById('pauseScreen').addEventListener('click', (e) => {
    if (e.target === document.getElementById('pauseScreen')) {
        togglePause();
    }
});

document.getElementById('startScreen').addEventListener('click', (e) => {
    if (e.target === document.getElementById('startScreen') && gameRunning === false) {
        initGame();
    }
});

document.getElementById('gameOverScreen').addEventListener('click', (e) => {
    if (e.target === document.getElementById('gameOverScreen') && gameOver) {
        initGame();
    }
});

loadHighScore();
setupMobileControls();
