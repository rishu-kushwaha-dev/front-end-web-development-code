const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const celebrateBtn = document.getElementById('celebrateBtn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const fireworks = [];
const particles = [];
const colors = ['#FF9933', '#138808', '#FFD700', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#FF4500'];

class Particle {
    constructor(x, y, color, velocity, alpha, decay) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = alpha;
        this.decay = decay;
        this.gravity = 0.05;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
}

class Firework {
    constructor(x, y, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.color = color;
        this.speed = 3 + Math.random() * 2;
        this.exploded = false;
        this.trail = [];
    }

    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        if (this.exploded) return;

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) {
            this.trail.shift();
        }

        this.y -= this.speed;

        if (this.y <= this.targetY) {
            this.explode();
        }
    }

    explode() {
        this.exploded = true;
        const particleCount = 80 + Math.random() * 40;
        const color = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i;
            const speed = 2 + Math.random() * 4;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            particles.push(new Particle(
                this.x,
                this.y,
                color,
                velocity,
                1,
                0.015 + Math.random() * 0.01
            ));
        }
    }
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const targetY = canvas.height * 0.2 + Math.random() * (canvas.height * 0.3);
    const color = colors[Math.floor(Math.random() * colors.length)];
    fireworks.push(new Firework(x, y, targetY, color));
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].draw();
        fireworks[i].update();
        if (fireworks[i].exploded) {
            fireworks.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].draw();
        particles[i].update();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

function burstFireworks(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 100);
    }
}

celebrateBtn.addEventListener('click', () => {
    burstFireworks(15);
    celebrateBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        celebrateBtn.style.transform = 'scale(1)';
    }, 200);
});

function getNextIndependenceDay() {
    const now = new Date();
    const year = now.getFullYear();
    let target = new Date(`August 15, ${year} 00:00:00`);
    
    if (now >= target) {
        target = new Date(`August 15, ${year + 1} 00:00:00`);
    }
    
    return target;
}

function updateCountdown() {
    const now = new Date();
    const target = getNextIndependenceDay();
    const diff = target - now;
    
    if (diff <= 0) {
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

setInterval(() => {
    if (Math.random() > 0.6) {
        createFirework();
    }
}, 2000);

setTimeout(() => {
    burstFireworks(10);
}, 1000);

animate();

const flag = document.querySelector('.flag-gif');
if (flag) {
    flag.addEventListener('click', () => {
        burstFireworks(8);
    });
}