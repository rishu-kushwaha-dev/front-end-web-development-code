const AUDIO_CTX_SAMPLE_RATE = 44100;
const SPEED_OF_SOUND = 343;

const frequencyInput = document.getElementById('frequency');
const frequencyNum = document.getElementById('frequencyNum');
const freqValue = document.getElementById('freqValue');
const volumeInput = document.getElementById('volume');
const volValue = document.getElementById('volValue');
const waveformSelect = document.getElementById('waveform');
const presetSelect = document.getElementById('preset');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const statusEl = document.getElementById('status');
const infoFreq = document.getElementById('infoFreq');
const infoNote = document.getElementById('infoNote');
const infoPeriod = document.getElementById('infoPeriod');
const infoWavelength = document.getElementById('infoWavelength');
const keysContainer = document.getElementById('keys');
const canvas = document.getElementById('analyserCanvas');
const ctx = canvas.getContext('2d');

let audioCtx = null;
let oscillator = null;
let gainNode = null;
let analyser = null;
let animationId = null;

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const QUICK_NOTES = [
    { label: 'C4', freq: 261.63 },
    { label: 'D4', freq: 293.66 },
    { label: 'E4', freq: 329.63 },
    { label: 'F4', freq: 349.23 },
    { label: 'G4', freq: 392.00 },
    { label: 'A4', freq: 440.00 },
    { label: 'B4', freq: 493.88 },
    { label: 'C5', freq: 523.25 }
];

const FREQ_MAP = {
    A4: 440,
    C4: 261.63,
    E4: 329.63,
    G4: 392,
    A5: 880,
    C5: 523.25,
    low: 60,
    high: 10000
};

function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext({ sampleRate: AUDIO_CTX_SAMPLE_RATE });

    oscillator = audioCtx.createOscillator();
    oscillator.type = waveformSelect.value;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = parseFloat(volumeInput.value);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    oscillator.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    resizeCanvas();
    draw();
}

function play() {
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    oscillator.frequency.setValueAtTime(parseFloat(frequencyInput.value), audioCtx.currentTime);
    oscillator.start();
    playBtn.disabled = true;
    stopBtn.disabled = false;
    statusEl.textContent = 'Active';
    statusEl.classList.add('active');
    updateInfo();
}

function stop() {
    if (oscillator) {
        try { oscillator.stop(); } catch (e) { }
        oscillator.disconnect();
        oscillator = null;
    }
    if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
    }
    gainNode = null;
    analyser = null;
    playBtn.disabled = false;
    stopBtn.disabled = true;
    statusEl.textContent = 'Inactive';
    statusEl.classList.remove('active');
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setFrequency(value) {
    value = Math.max(20, Math.min(20000, parseFloat(value)));
    frequencyInput.value = value;
    frequencyNum.value = value;
    freqValue.textContent = value;
    if (oscillator) {
        oscillator.frequency.setValueAtTime(value, audioCtx.currentTime);
    }
    updateInfo();
}

function updateInfo() {
    const f = parseFloat(frequencyInput.value);
    infoFreq.textContent = f.toFixed(2);
    infoNote.textContent = freqToNote(f);
    infoPeriod.textContent = (1000 / f).toFixed(2);
    infoWavelength.textContent = (SPEED_OF_SOUND / f).toFixed(2);
}

function freqToNote(f) {
    const noteNum = 12 * Math.log2(f / 440) + 69;
    const noteIndex = Math.round(noteNum) % 12;
    const octave = Math.floor(Math.round(noteNum) / 12) - 1;
    return NOTE_NAMES[noteIndex] + octave;
}

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
}

function draw() {
    if (!analyser) {
        animationId = requestAnimationFrame(draw);
        return;
    }
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        const r = barHeight + (25 * (i / bufferLength));
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }

    animationId = requestAnimationFrame(draw);
}

frequencyInput.addEventListener('input', () => {
    frequencyNum.value = frequencyInput.value;
    freqValue.textContent = frequencyInput.value;
    if (oscillator) {
        oscillator.frequency.setValueAtTime(parseFloat(frequencyInput.value), audioCtx.currentTime);
    }
    updateInfo();
});

frequencyNum.addEventListener('input', () => {
    frequencyInput.value = frequencyNum.value;
    freqValue.textContent = frequencyNum.value;
    if (oscillator) {
        oscillator.frequency.setValueAtTime(parseFloat(frequencyNum.value), audioCtx.currentTime);
    }
    updateInfo();
});

volumeInput.addEventListener('input', () => {
    volValue.textContent = volumeInput.value;
    if (gainNode) {
        gainNode.gain.value = parseFloat(volumeInput.value);
    }
});

waveformSelect.addEventListener('change', () => {
    if (oscillator) {
        oscillator.type = waveformSelect.value;
    }
});

const hypnoSpeedInput = document.getElementById('hypnoSpeed');
const hypnoSpeedValue = document.getElementById('hypnoSpeedValue');
const hypnoDisk = document.querySelector('.hypno-disk');

hypnoSpeedInput.addEventListener('input', () => {
    const s = hypnoSpeedInput.value + 's';
    hypnoSpeedValue.textContent = s;
    document.documentElement.style.setProperty('--hypno-speed', s);
});

presetSelect.addEventListener('change', () => {
    const val = presetSelect.value;
    if (val === 'none') return;
    const freq = FREQ_MAP[val];
    if (freq) {
        setFrequency(freq);
        presetSelect.value = 'none';
    }
});

playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    play();
});

stopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    stop();
});

window.addEventListener('resize', resizeCanvas);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (playBtn.disabled) stop();
        else play();
    }
});

QUICK_NOTES.forEach(note => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'key';
    btn.textContent = `${note.label} (${note.freq} Hz)`;
    btn.dataset.freq = note.freq;
    btn.dataset.label = note.label;
    btn.addEventListener('click', () => {
        document.querySelectorAll('.key').forEach(k => k.classList.remove('active'));
        btn.classList.add('active');
        setFrequency(note.freq);
        if (playBtn.disabled) {
            oscillator.frequency.setValueAtTime(note.freq, audioCtx.currentTime);
        } else {
            play();
        }
    });
    keysContainer.appendChild(btn);
});
