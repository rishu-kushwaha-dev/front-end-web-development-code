const ctx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = ctx.createGain();
masterGain.connect(ctx.destination);
masterGain.gain.value = 0.8;

const decks = {};
function makeDeck(id, vinylEl, nameEl, bpmEl) {
  const gain = ctx.createGain();
  const hi = ctx.createBiquadFilter(); hi.type = 'highshelf'; hi.frequency.value = 3000;
  const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 1000; mid.Q.value = 1;
  const lo = ctx.createBiquadFilter(); lo.type = 'lowshelf'; lo.frequency.value = 200;
  gain.connect(hi); hi.connect(mid); mid.connect(lo); lo.connect(masterGain);
  return { id, audio: null, source: null, gain, hi, mid, lo, playing: false, vinyl: vinylEl, nameEl, bpmEl, cueTime: 0 };
}
decks.A = makeDeck('A', document.getElementById('vinylA'), document.getElementById('nameA'), document.getElementById('bpmA'));
decks.B = makeDeck('B', document.getElementById('vinylB'), document.getElementById('nameB'), document.getElementById('bpmB'));

function loadFile(deck, file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const buf = await ctx.decodeAudioData(e.target.result);
    deck.buffer = buf;
    deck.nameEl.textContent = file.name;
    deck.bpmEl.textContent = '--';
  };
  reader.readAsArrayBuffer(file);
}
document.getElementById('fileA').addEventListener('change', e => { if (e.target.files[0]) loadFile(decks.A, e.target.files[0]); });
document.getElementById('fileB').addEventListener('change', e => { if (e.target.files[0]) loadFile(decks.B, e.target.files[0]); });

function playDeck(deck) {
  if (!deck.buffer) return;
  if (deck.source) { try { deck.source.stop(); } catch (e) { } }
  const src = ctx.createBufferSource();
  src.buffer = deck.buffer;
  src.playbackRate.value = parseFloat(document.getElementById('speed' + deck.id).value);
  src.connect(deck.gain);
  src.start(0, deck.cueTime || 0);
  deck.source = src;
  deck.playing = true;
  deck.vinyl.classList.add('spinning');
  src.onended = () => { deck.playing = false; deck.vinyl.classList.remove('spinning'); };
}
function stopDeck(deck) {
  if (deck.source) { try { deck.source.stop(); } catch (e) { } deck.source = null; }
  deck.playing = false;
  deck.vinyl.classList.remove('spinning');
}
document.getElementById('playA').addEventListener('click', () => {
  if (decks.A.playing) { stopDeck(decks.A); document.getElementById('playA').textContent = '▶ Play'; }
  else { playDeck(decks.A); document.getElementById('playA').textContent = '⏸ Pause'; }
});
document.getElementById('playB').addEventListener('click', () => {
  if (decks.B.playing) { stopDeck(decks.B); document.getElementById('playB').textContent = '▶ Play'; }
  else { playDeck(decks.B); document.getElementById('playB').textContent = '⏸ Pause'; }
});
document.getElementById('cueA').addEventListener('click', () => { stopDeck(decks.A); decks.A.cueTime = 0; document.getElementById('playA').textContent = '▶ Play'; });
document.getElementById('cueB').addEventListener('click', () => { stopDeck(decks.B); decks.B.cueTime = 0; document.getElementById('playB').textContent = '▶ Play'; });

['A', 'B'].forEach(L => {
  document.getElementById('vol' + L).addEventListener('input', e => decks[L].gain.gain.value = e.target.value * crossGain(L));
  document.getElementById('hi' + L).addEventListener('input', e => decks[L].hi.gain.value = (e.target.value - 1) * 12);
  document.getElementById('mid' + L).addEventListener('input', e => decks[L].mid.gain.value = (e.target.value - 1) * 12);
  document.getElementById('lo' + L).addEventListener('input', e => decks[L].lo.gain.value = (e.target.value - 1) * 12);
  document.getElementById('speed' + L).addEventListener('input', e => { if (decks[L].source) decks[L].source.playbackRate.value = e.target.value; });
});

function crossGain(deck) {
  const cf = parseFloat(document.getElementById('crossfader').value);
  if (deck === 'A') return 1 - cf;
  return cf;
}
document.getElementById('crossfader').addEventListener('input', () => {
  decks.A.gain.gain.value = parseFloat(document.getElementById('volA').value) * crossGain('A');
  decks.B.gain.gain.value = parseFloat(document.getElementById('volB').value) * crossGain('B');
});
document.getElementById('masterVol').addEventListener('input', e => { masterGain.gain.value = e.target.value; });

// Media loader (any platform / direct video)
document.getElementById('loadYt').addEventListener('click', () => {
  const url = document.getElementById('ytUrl').value.trim();
  const box = document.getElementById('ytPlayer');
  if (!url) return;
  // YouTube
  const ym = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (ym) { box.innerHTML = `<iframe src="https://www.youtube.com/embed/${ym[1]}" allowfullscreen></iframe>`; return; }
  // SoundCloud
  if (url.includes('soundcloud.com')) { box.innerHTML = `<iframe src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}" allow="autoplay"></iframe>`; return; }
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) { box.innerHTML = `<iframe src="https://player.vimeo.com/video/${vm[1]}" allowfullscreen></iframe>`; return; }
  // Direct video file
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) { box.innerHTML = `<video src="${url}" controls autoplay style="width:100%;border-radius:8px;"></video>`; return; }
  // Fallback: try iframe
  box.innerHTML = `<iframe src="${url}" allowfullscreen></iframe>`;
});

// Background music
const bgAudio = new Audio();
bgAudio.loop = true;
document.getElementById('bgFile').addEventListener('change', e => {
  if (e.target.files[0]) { bgAudio.src = URL.createObjectURL(e.target.files[0]); bgAudio.play(); }
});
document.getElementById('bgVol').addEventListener('input', e => { bgAudio.volume = e.target.value; });
document.getElementById('bgPlay').addEventListener('click', () => {
  if (bgAudio.paused) bgAudio.play(); else bgAudio.pause();
});
document.getElementById('syncB').addEventListener('click', () => {
  document.getElementById('speedB').value = document.getElementById('speedA').value;
  if (decks.B.source) decks.B.source.playbackRate.value = parseFloat(document.getElementById('speedA').value);
});
document.getElementById('syncA').addEventListener('click', () => {
  document.getElementById('speedA').value = document.getElementById('speedB').value;
  if (decks.A.source) decks.A.source.playbackRate.value = parseFloat(document.getElementById('speedB').value);
});