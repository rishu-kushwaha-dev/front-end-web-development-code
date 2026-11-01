const textInput = document.getElementById('textInput');
const charsCountEl = document.getElementById('charsCount');
const charsNoSpaceCountEl = document.getElementById('charsNoSpaceCount');
const wordsCountEl = document.getElementById('wordsCount');
const sentencesCountEl = document.getElementById('sentencesCount');
const paragraphsCountEl = document.getElementById('paragraphsCount');
const readingTimeCountEl = document.getElementById('readingTimeCount');
const wpmCountEl = document.getElementById('wpmCount');
const readingProgressEl = document.getElementById('readingProgress');
const readingTimeDisplayEl = document.getElementById('readingTimeDisplay');
const speedBtns = document.querySelectorAll('.speed-btn');
const customWpmInput = document.getElementById('customWpm');

let selectedWpm = 200;
let customOverride = false;

function countWords(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
}

function countCharacters(text) {
    return text.length;
}

function countCharactersNoSpaces(text) {
    return text.replace(/\s/g, '').length;
}

function countSentences(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/[.!?]+[\s]*/).filter(s => s.trim().length > 0).length;
}

function countParagraphs(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
}

function calculateReadingTime(words, wpm) {
    const minutes = words / wpm;
    const totalSeconds = Math.round(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return { minutes, totalSeconds, mins, secs };
}

function updateStats() {
    const text = textInput.value;
    const words = countWords(text);
    const chars = countCharacters(text);
    const charsNoSpace = countCharactersNoSpaces(text);
    const sentences = countSentences(text);
    const paragraphs = countParagraphs(text);

    charsCountEl.textContent = chars.toLocaleString();
    charsNoSpaceCountEl.textContent = charsNoSpace.toLocaleString();
    wordsCountEl.textContent = words.toLocaleString();
    sentencesCountEl.textContent = sentences.toLocaleString();
    paragraphsCountEl.textContent = paragraphs.toLocaleString();

    const { minutes, totalSeconds, mins, secs } = calculateReadingTime(words, selectedWpm);

    readingTimeCountEl.textContent = mins > 0 ? `${mins} min` : '<1 min';
    wpmCountEl.textContent = `${selectedWpm} WPM`;
    readingTimeDisplayEl.textContent = `${mins} minutes ${secs} seconds`;
    readingProgressEl.style.width = Math.min(Math.round((totalSeconds / 300) * 100), 100) + '%';

    [charsCountEl, charsNoSpaceCountEl, wordsCountEl, sentencesCountEl, paragraphsCountEl, readingTimeCountEl, wpmCountEl].forEach(el => {
        el.classList.remove('highlight');
        void el.offsetWidth;
        if (words > 0) el.classList.add('highlight');
    });
}

function setWpm(wpm, fromCustom = false) {
    selectedWpm = wpm;
    customOverride = fromCustom;

    speedBtns.forEach(btn => {
        const btnWpm = parseInt(btn.dataset.wpm, 10);
        btn.classList.toggle('active', btnWpm === wpm && !customOverride);
    });

    if (customOverride) {
        speedBtns.forEach(btn => btn.classList.remove('active'));
        customWpmInput.value = wpm;
    }

    updateStats();
}

textInput.addEventListener('input', updateStats);

speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setWpm(parseInt(btn.dataset.wpm, 10), false);
    });
});

customWpmInput.addEventListener('input', () => {
    const val = parseInt(customWpmInput.value, 10);
    if (!isNaN(val) && val >= 50 && val <= 1000) {
        setWpm(val, true);
    }
});

updateStats();