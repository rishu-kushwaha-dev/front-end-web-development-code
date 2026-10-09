const tabs = document.querySelectorAll('.tab');
const pinTab = document.getElementById('pinTab');
const patternTab = document.getElementById('patternTab');
const passwordTab = document.getElementById('passwordTab');

const pinLength = document.getElementById('pinLength');
const pinLengthValue = document.getElementById('pinLengthValue');
const pinOutput = document.getElementById('pinOutput');
const pinCopyBtn = document.getElementById('pinCopyBtn');
const generatePinBtn = document.getElementById('generatePinBtn');

const patternOutput = document.getElementById('patternOutput');
const patternCopyBtn = document.getElementById('patternCopyBtn');
const generatePatternBtn = document.getElementById('generatePatternBtn');
const patternCanvas = document.getElementById('patternCanvas');
const patternDots = document.querySelectorAll('.pattern-dot');
const ctx = patternCanvas.getContext('2d');

const lengthRange = document.getElementById('lengthRange');
const lengthValue = document.getElementById('lengthValue');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const generateBtn = document.getElementById('generateBtn');
const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

function switchTab(tabName) {
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    pinTab.style.display = 'none';
    patternTab.style.display = 'none';
    passwordTab.style.display = 'none';

    if (tabName === 'pin') pinTab.style.display = 'block';
    if (tabName === 'pattern') patternTab.style.display = 'block';
    if (tabName === 'password') passwordTab.style.display = 'block';
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

function getPinDotCenters() {
    const centers = [];
    const gridRect = patternCanvas.getBoundingClientRect();
    const canvasSize = 300;
    const padding = 20;
    const gap = 20;
    const cellSize = (canvasSize - 2 * padding - 2 * gap) / 3;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            centers.push({
                x: padding + col * (cellSize + gap) + cellSize / 2,
                y: padding + row * (cellSize + gap) + cellSize / 2
            });
        }
    }
    return centers;
}

function getRandomInt(min, max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % (max - min + 1));
}

function generatePIN() {
    const length = parseInt(pinLength.value);
    let pin = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        pin += array[i] % 10;
    }

    pinOutput.value = pin;
}

function generatePattern() {
    const minLen = 4;
    const maxLen = 9;
    const length = getRandomInt(minLen, maxLen);

    const visited = new Set();
    const sequence = [];
    const adj = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    let current = getRandomInt(0, 8);
    visited.add(current);
    sequence.push(current);

    while (sequence.length < length) {
        const row = Math.floor(current / 3);
        const col = current % 3;
        const candidates = [];

        for (const [dr, dc] of adj) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
                const idx = nr * 3 + nc;
                if (!visited.has(idx)) {
                    candidates.push(idx);
                }
            }
        }

        if (candidates.length === 0) break;

        const next = candidates[getRandomInt(0, candidates.length - 1)];
        visited.add(next);
        sequence.push(next);
        current = next;
    }

    drawPattern(sequence);
    patternOutput.value = sequence.join('-');
}

function drawPattern(sequence) {
    ctx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
    patternDots.forEach(d => d.classList.remove('active'));

    if (sequence.length === 0) return;

    const centers = getPinDotCenters();

    ctx.beginPath();
    ctx.moveTo(centers[sequence[0]].x, centers[sequence[0]].y);

    for (let i = 1; i < sequence.length; i++) {
        ctx.lineTo(centers[sequence[i]].x, centers[sequence[i]].y);
    }

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    sequence.forEach(idx => {
        patternDots[idx].classList.add('active');
    });
}

function getAvailableChars() {
    let chars = '';
    if (uppercase.checked) chars += CHAR_SETS.uppercase;
    if (lowercase.checked) chars += CHAR_SETS.lowercase;
    if (numbers.checked) chars += CHAR_SETS.numbers;
    if (symbols.checked) chars += CHAR_SETS.symbols;
    return chars;
}

function generatePassword() {
    const chars = getAvailableChars();
    if (!chars) {
        passwordOutput.value = '';
        updateStrength(0);
        return;
    }

    const length = parseInt(lengthRange.value);
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }

    passwordOutput.value = password;
    updateStrength(calculateStrength(password));
}

function calculateStrength(password) {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;

    return score;
}

function updateStrength(score) {
    let percent = 0;
    let color = '#ef4444';
    let text = 'Very Weak';

    if (score >= 7) {
        percent = 100;
        color = '#10b981';
        text = 'Very Strong';
    } else if (score >= 5) {
        percent = 80;
        color = '#84cc16';
        text = 'Strong';
    } else if (score >= 3) {
        percent = 60;
        color = '#facc15';
        text = 'Medium';
    } else if (score >= 1) {
        percent = 30;
        color = '#f97316';
        text = 'Weak';
    }

    strengthBar.style.width = percent + '%';
    strengthBar.style.background = color;
    strengthText.textContent = passwordOutput.value ? text : 'No password';
    strengthText.style.color = color;
}

function copyToClipboard(btn, output) {
    if (!output.value) return;

    navigator.clipboard.writeText(output.value).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        output.select();
        document.execCommand('copy');
    });
}

pinLength.addEventListener('input', () => {
    pinLengthValue.textContent = pinLength.value;
    generatePIN();
});

generatePinBtn.addEventListener('click', generatePIN);
pinCopyBtn.addEventListener('click', () => copyToClipboard(pinCopyBtn, pinOutput));

generatePatternBtn.addEventListener('click', generatePattern);
patternCopyBtn.addEventListener('click', () => copyToClipboard(patternCopyBtn, patternOutput));

lengthRange.addEventListener('input', () => {
    lengthValue.textContent = lengthRange.value;
    generatePassword();
});

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', () => copyToClipboard(copyBtn, passwordOutput));

passwordOutput.addEventListener('focus', () => passwordOutput.select());
pinOutput.addEventListener('focus', () => pinOutput.select());
patternOutput.addEventListener('focus', () => patternOutput.select());

generatePIN();
generatePattern();
generatePassword();