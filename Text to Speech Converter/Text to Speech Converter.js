const synth = window.speechSynthesis;
const text = document.getElementById('text');
const voiceSelect = document.getElementById('voice');
const rate = document.getElementById('rate');
const pitch = document.getElementById('pitch');
const volume = document.getElementById('volume');
const rateVal = document.getElementById('rateVal');
const pitchVal = document.getElementById('pitchVal');
const volVal = document.getElementById('volVal');
const status = document.getElementById('status');
const count = document.getElementById('count');
const langFilter = document.getElementById('langFilter');
const preset = document.getElementById('preset');
const historyEl = document.getElementById('history');

let voices = [];

function loadVoices() {
  voices = synth.getVoices();
  renderVoices();
}

function renderVoices() {
  const filter = langFilter.value.trim().toLowerCase();
  voiceSelect.innerHTML = '';
  voices
    .filter(v => !filter || v.lang.toLowerCase().includes(filter))
    .forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      voiceSelect.appendChild(opt);
    });
}

loadVoices();
if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;
langFilter.addEventListener('input', renderVoices);

rate.addEventListener('input', () => rateVal.textContent = rate.value);
pitch.addEventListener('input', () => pitchVal.textContent = pitch.value);
volume.addEventListener('input', () => volVal.textContent = volume.value);

preset.addEventListener('change', () => {
  if (preset.value === 'slow') rate.value = 0.7;
  else if (preset.value === 'fast') rate.value = 1.5;
  else rate.value = 1;
  rateVal.textContent = rate.value;
});

function updateCount() {
  const v = text.value;
  const words = v.trim() ? v.trim().split(/\s+/).length : 0;
  count.textContent = `${v.length} chars / ${words} words`;
}
text.addEventListener('input', updateCount);
updateCount();

document.getElementById('clear').addEventListener('click', () => { text.value = ''; updateCount(); });

const HISTORY_KEY = 'tts-history';
function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; } }
function saveHistory(list) { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); }
function renderHistory() {
  const list = getHistory();
  historyEl.innerHTML = '';
  list.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = t.slice(0, 80);
    li.addEventListener('click', () => { text.value = t; updateCount(); });
    historyEl.appendChild(li);
  });
}
function addToHistory(t) {
  if (!t.trim()) return;
  const list = getHistory().filter(x => x !== t);
  list.unshift(t);
  saveHistory(list.slice(0, 20));
  renderHistory();
}
renderHistory();
document.getElementById('clearHist').addEventListener('click', () => { localStorage.removeItem(HISTORY_KEY); renderHistory(); });

function speakText(str) {
  if (synth.speaking) synth.cancel();
  const utter = new SpeechSynthesisUtterance(str);
  const selected = voices.find(v => v.name === voiceSelect.value);
  if (selected) utter.voice = selected;
  utter.rate = parseFloat(rate.value);
  utter.pitch = parseFloat(pitch.value);
  utter.volume = parseFloat(volume.value);
  utter.onstart = () => status.textContent = 'Speaking...';
  utter.onend = () => status.textContent = 'Done.';
  utter.onerror = (e) => status.textContent = 'Error: ' + e.error;
  synth.speak(utter);
  addToHistory(str);
}

document.getElementById('speak').addEventListener('click', () => speakText(text.value));
document.getElementById('speakSel').addEventListener('click', () => {
  const sel = text.value.substring(text.selectionStart, text.selectionEnd);
  speakText(sel || text.value);
});
document.getElementById('pause').addEventListener('click', () => { if (synth.speaking) synth.pause(); });
document.getElementById('resume').addEventListener('click', () => { if (synth.paused) synth.resume(); });
document.getElementById('stop').addEventListener('click', () => { synth.cancel(); status.textContent = 'Stopped.'; });