const CONFIG = {
    loadingDuration: 2000,
    vibrateMs: 15,
    successVibrate: [30, 40, 60],
    orbitDuration: 1600,
    captchaLength: 6,
    chars: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789',
    texts: {
        idleTitle: 'Enter Captcha',
        idleSubtitle: 'Type the characters shown in the image.',
        loadingTitle: 'Verifying...',
        loadingSubtitle: 'Securely checking your credentials.',
        successTitle: 'Verified',
        successSubtitle: 'Captcha verified successfully.',
        errorTitle: 'Verification Failed',
        errorSubtitle: 'The code you entered is incorrect.'
    }
};

const card = document.getElementById('card');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const captchaCanvas = document.getElementById('captchaCanvas');
const ctx = captchaCanvas.getContext('2d');
const refreshBtn = document.getElementById('refreshBtn');
const captchaInput = document.getElementById('captchaInput');
const captchaStage = document.getElementById('captchaStage');
const orbitLayer = document.getElementById('orbitLayer');
const orbitRing = document.getElementById('orbitRing');
const loadingWrap = document.getElementById('loadingWrap');
const loadingPercent = document.getElementById('loadingPercent');
const successWrap = document.getElementById('successWrap');
const errorMsg = document.getElementById('errorMsg');
const verifyBtn = document.getElementById('verifyBtn');
const pointerLight = document.getElementById('pointerLight');

let state = 'idle';
let currentCaptcha = '';
let resetTimer = null;
const timers = [];

function clearAllTimers() {
    clearTimeout(resetTimer);
    timers.forEach(t => clearTimeout(t));
    timers.length = 0;
}

document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    pointerLight.style.opacity = '1';
    pointerLight.style.left = `${e.clientX}px`;
    pointerLight.style.top = `${e.clientY}px`;
});
document.addEventListener('pointerleave', () => pointerLight.style.opacity = '0');

function vibrate(pattern = CONFIG.vibrateMs) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}

function generateCaptcha() {
    let result = '';
    for (let i = 0; i < CONFIG.captchaLength; i++) {
        result += CONFIG.chars.charAt(Math.floor(Math.random() * CONFIG.chars.length));
    }
    currentCaptcha = result;
    drawCaptcha();
}

function drawCaptcha() {
    const width = captchaCanvas.width;
    const height = captchaCanvas.height;
    ctx.clearRect(0, 0, width, height);

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    ctx.fillStyle = isDark ? '#18181b' : '#fafafa';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(${isDark ? '255,255,255' : '0,0,0'}, ${Math.random() * 0.05})`;
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(99, 102, 241, ${Math.random() * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.bezierCurveTo(Math.random() * width, Math.random() * height, Math.random() * width, Math.random() * height, Math.random() * width, Math.random() * height);
        ctx.stroke();
    }

    ctx.font = 'bold 28px monospace';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < currentCaptcha.length; i++) {
        ctx.save();
        ctx.translate(20 + i * 30, height / 2 + (Math.random() - 0.5) * 6);
        ctx.rotate((Math.random() - 0.5) * 0.5);
        ctx.fillStyle = isDark ? `hsl(${220 + Math.random() * 40}, 90%, 75%)` : `hsl(${240 + Math.random() * 30}, 70%, 40%)`;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.3)';
        ctx.shadowBlur = 4;
        ctx.fillText(currentCaptcha[i], 0, 0);
        ctx.restore();
    }
}

refreshBtn.addEventListener('click', () => {
    if (state === 'loading' || state === 'success') return;
    if (state === 'error') resetState(true);
    vibrate();
    refreshBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => { refreshBtn.style.transform = ''; }, 400);
    generateCaptcha();
    captchaInput.value = '';
    captchaInput.focus();
});

captchaInput.addEventListener('input', () => {
    if (state === 'loading' || state === 'success') {
        captchaInput.value = '';
        return;
    }
    if (state === 'error') resetState(true);
    captchaInput.value = captchaInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CONFIG.captchaLength);
});

captchaInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (captchaInput.value.length === CONFIG.captchaLength) triggerVerify();
    }
});

verifyBtn.addEventListener('click', () => {
    if (captchaInput.value.length === CONFIG.captchaLength) {
        triggerVerify();
    } else {
        captchaInput.focus();
    }
});

function buildOrbit() {
    orbitRing.innerHTML = '';
    const radius = 70;
    const chars = captchaInput.value.toUpperCase().split('');

    for (let i = 0; i < chars.length; i++) {
        const angle = (i / chars.length) * Math.PI * 2 - Math.PI / 2;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius;

        const node = document.createElement('div');
        node.className = 'orbit-node';
        node.textContent = chars[i] || '';
        node.style.setProperty('--dx', `${dx}px`);
        node.style.setProperty('--dy', `${dy}px`);
        node.style.animationDelay = `${i * 60}ms`;
        orbitRing.appendChild(node);
    }
}

function playOrbit() {
    buildOrbit();
    orbitLayer.classList.add('active');
    void orbitRing.offsetWidth;
    orbitRing.classList.add('spin');
    document.querySelectorAll('.orbit-node').forEach(n => n.classList.add('node-fly'));
}

function spawnSplash() {
    successWrap.querySelectorAll('.confetti').forEach(c => c.remove());

    const colors = ['#10b981', '#34d399', '#6ee7b7', '#6366f1', '#a78bfa', '#fbbf24', '#f472b6', '#22d3ee'];
    const count = 24;
    const baseDist = 90;

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        const dist = baseDist + Math.random() * 70;
        const cx = Math.cos(angle) * dist;
        const cy = Math.sin(angle) * dist;

        const dot = document.createElement('div');
        dot.className = 'confetti';
        dot.style.background = colors[i % colors.length];
        dot.style.setProperty('--cx', `${cx}px`);
        dot.style.setProperty('--cy', `${cy}px`);
        dot.style.animationDelay = `${0.1 + Math.random() * 0.15}s`;
        dot.style.boxShadow = `0 0 12px ${colors[i % colors.length]}`;

        const size = 6 + Math.random() * 10;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        if (i % 4 === 0) dot.style.borderRadius = '2px';
        else if (i % 4 === 1) dot.style.borderRadius = '50% 0 50% 0';
        else dot.style.borderRadius = '50%';

        successWrap.appendChild(dot);
    }
}

function triggerVerify() {
    if (state === 'loading' || state === 'success') return;
    if (captchaInput.value.length !== CONFIG.captchaLength) return;

    state = 'loading';
    clearAllTimers();

    captchaStage.classList.add('hidden');
    playOrbit();

    const orbitTotal = CONFIG.orbitDuration + 180;

    timers.push(setTimeout(() => {
        orbitLayer.classList.remove('active');
        orbitRing.classList.remove('spin');
        orbitRing.innerHTML = '';
        captchaStage.style.display = 'none';

        title.textContent = CONFIG.texts.loadingTitle;
        subtitle.textContent = CONFIG.texts.loadingSubtitle;
        loadingWrap.classList.add('active');

        const start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / CONFIG.loadingDuration, 1);
            const eased = 1 - Math.pow(1 - p, 2.2);
            loadingPercent.textContent = Math.round(eased * 100);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);

        timers.push(setTimeout(() => {
            const isCorrect = captchaInput.value.toUpperCase() === currentCaptcha.toUpperCase();
            isCorrect ? handleSuccess() : handleError();
        }, CONFIG.loadingDuration));
    }, orbitTotal));
}

function handleSuccess() {
    state = 'success';
    vibrate(CONFIG.successVibrate);

    loadingWrap.classList.remove('active');
    spawnSplash();
    successWrap.classList.add('active');
    card.classList.add('success-tint');

    timers.push(setTimeout(() => {
        title.textContent = CONFIG.texts.successTitle;
        subtitle.textContent = CONFIG.texts.successSubtitle;
    }, 250));

    verifyBtn.disabled = true;
}

function handleError() {
    state = 'error';
    vibrate([20, 60, 20]);
    loadingWrap.classList.remove('active');
    card.classList.add('shake');
    errorMsg.classList.add('show');
    title.textContent = CONFIG.texts.errorTitle;
    subtitle.textContent = CONFIG.texts.errorSubtitle;
    captchaInput.classList.add('error');

    timers.push(setTimeout(() => card.classList.remove('shake'), 500));
    resetTimer = setTimeout(() => {
        if (state === 'error') resetState(true);
    }, 2000);
}

function resetState(immediateFocus) {
    clearAllTimers();
    state = 'idle';

    card.classList.remove('shake', 'success-tint');
    errorMsg.classList.remove('show');
    title.textContent = CONFIG.texts.idleTitle;
    subtitle.textContent = CONFIG.texts.idleSubtitle;

    orbitLayer.classList.remove('active');
    orbitRing.classList.remove('spin');
    orbitRing.innerHTML = '';

    loadingWrap.classList.remove('active');
    loadingPercent.textContent = '0';

    successWrap.classList.remove('active');
    successWrap.querySelectorAll('.confetti').forEach(c => c.remove());
    successWrap.querySelectorAll('.bubble, .success-flash').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
    });

    captchaInput.value = '';
    captchaInput.classList.remove('error');
    captchaStage.style.display = 'flex';
    void captchaStage.offsetWidth;
    captchaStage.classList.remove('hidden');

    verifyBtn.disabled = false;

    generateCaptcha();

    if (immediateFocus !== false) captchaInput.focus();
}

window.addEventListener('load', () => {
    generateCaptcha();
    setTimeout(() => captchaInput.focus(), 300);
});