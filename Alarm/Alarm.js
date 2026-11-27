class AlarmClock {
    constructor() {
        this.alarms = [];
        this.audioCtx = null;
        this.hidden = false;
        this.customSounds = {};
        this.previewNodes = null;
        this.init();
    }

    init() {
        this.loadAlarms();
        this.initSounds();
        this.setupEventListeners();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.checkAlarms();
        setInterval(() => this.checkAlarms(), 1000);
        this.requestNotificationPermission();
        this.handleVisibilityChange();
    }

    initSounds() {
        this.sounds = [
            { id: 'none', label: 'No sound' },
            { id: 'classic', label: 'Classic Beep' },
            { id: 'digital', label: 'Digital Clock' },
            { id: 'chime', label: 'Soft Chime' },
            { id: 'siren', label: 'Siren' },
            { id: 'birds', label: 'Morning Birds' },
            { id: 'bell', label: 'Gentle Bell' },
            { id: 'custom', label: '__CUSTOM__' }
        ];
        this.loadCustomSounds().then(() => { this.populateSoundDropdown(); this.renderCustomSoundsList(); });
    }

    populateSoundDropdown() {
        const select = document.getElementById('alarmSoundSelect');
        if (!select) return;
        select.innerHTML = '';
        this.sounds.forEach(s => {
            if (s.id === 'custom') {
                const opt = document.createElement('option');
                opt.value = '__custom__';
                opt.textContent = this.customSounds.length ? 'My Sound (' + this.customSounds.length + ')' : '＋ Add my own sound…';
                select.appendChild(opt);
            } else {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = s.label;
                select.appendChild(opt);
            }
        });
        const defaultSel = localStorage.getItem('defaultSound') || 'classic';
        select.value = defaultSel;
    }

    openCustomSoundDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('AlarmSounds', 1);
            req.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('sounds')) db.createObjectStore('sounds');
            };
            req.onsuccess = e => resolve(e.target.result);
            req.onerror = e => reject(e);
        });
    }

    async loadCustomSounds() {
        this.customSounds = [];
        try {
            const db = await this.openCustomSoundDB();
            this.customSounds = await new Promise((resolve, reject) => {
                const tx = db.transaction('sounds', 'readonly');
                const req = tx.objectStore('sounds').getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = e => reject(e);
            });
        } catch (e) { console.log('IndexedDB error:', e); }
    }

    async saveCustomSound(name, blob) {
        const id = 'custom-' + Date.now();
        const record = { id, name, blob, created: new Date().toISOString() };
        try {
            const db = await this.openCustomSoundDB();
            await new Promise((resolve, reject) => {
                const tx = db.transaction('sounds', 'readwrite');
                tx.objectStore('sounds').put(record, record.id);
                tx.oncomplete = () => resolve();
                tx.onerror = e => reject(e);
            });
            await this.loadCustomSounds();
            this.populateSoundDropdown();
            document.getElementById('alarmSoundSelect').value = id;
            document.getElementById('customSoundGroup').hidden = true;
            this.renderCustomSoundsList();
            this.updateStatus('Custom sound saved: ' + name);
        } catch (e) { console.log('Save error:', e); this.updateStatus('Could not save sound'); }
    }

    async deleteCustomSound(id) {
        try {
            const db = await this.openCustomSoundDB();
            await new Promise((resolve, reject) => {
                const tx = db.transaction('sounds', 'readwrite');
                tx.objectStore('sounds').delete(id);
                tx.oncomplete = () => resolve();
                tx.onerror = e => reject(e);
            });
            await this.loadCustomSounds();
            this.populateSoundDropdown();
            this.renderCustomSoundsList();
        } catch (e) { console.log('Delete error:', e); }
    }

    renderCustomSoundsList() {
        const list = document.getElementById('customSoundsList');
        if (!list) return;
        if (!this.customSounds.length) {
            list.innerHTML = '<span class="empty-state">No custom sounds uploaded.</span>';
            return;
        }
        list.innerHTML = this.customSounds.map(s => `
            <div class="custom-sound-item">
                <span class="custom-sound-name">🎵 ${this.escapeHtml(s.name)}</span>
                <div class="custom-sound-actions">
                    <button class="btn-icon toggle" onclick="alarmClock.playAlarmSound('${s.id}')" title="Preview">▶</button>
                    <button class="btn-icon delete" onclick="alarmClock.deleteCustomSound('${s.id}')" title="Delete">🗑</button>
                </div>
            </div>`).join('');
    }

    loadAlarms() {
        const saved = localStorage.getItem('alarms');
        if (saved) {
            try { this.alarms = JSON.parse(saved); this.renderAlarms(); }
            catch (e) { this.alarms = []; }
        }
    }

    saveAlarms() { localStorage.setItem('alarms', JSON.stringify(this.alarms)); }

    setupEventListeners() {
        document.getElementById('alarmForm').addEventListener('submit', (e) => this.addAlarm(e));
        document.getElementById('notificationsEnabled').addEventListener('change', (e) => localStorage.setItem('notificationsEnabled', e.target.checked));
        document.getElementById('testNotification').addEventListener('click', () => this.testNotification());
        document.getElementById('clearAllAlarms').addEventListener('click', () => this.clearAllAlarms());
        document.getElementById('alarmSoundSelect').addEventListener('change', (e) => {
            const isCustom = e.target.value === '__custom__';
            document.getElementById('customSoundGroup').hidden = !isCustom;
            localStorage.setItem('defaultSound', isCustom ? 'classic' : e.target.value);
        });
        document.getElementById('customSoundFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.saveCustomSound(file.name, file);
        });
        document.getElementById('previewSound').addEventListener('click', () => this.previewSelectedSound());
    }

    updateClock() {
        document.getElementById('currentTime').textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }

    getSelectedSound() {
        const val = document.getElementById('alarmSoundSelect').value;
        if (val === '__custom__') {
            if (this.customSounds.length === 0) return 'classic';
            return this.customSounds[this.customSounds.length - 1].id;
        }
        return val;
    }

    addAlarm(e) {
        e.preventDefault();
        const time = document.getElementById('alarmTime').value;
        const label = document.getElementById('alarmLabel').value || 'Alarm';
        const repeat = document.getElementById('alarmRepeat').checked;
        const sound = this.getSelectedSound();
        if (!time) return;

        this.alarms.push({ id: Date.now(), time, label, repeat, sound, enabled: true, created: new Date().toISOString() });
        this.saveAlarms(); this.renderAlarms(); this.updateStatus(`Alarm set for ${time} · ${this.soundLabel(sound)}`);
        document.getElementById('alarmForm').reset();
        document.getElementById('alarmRepeat').checked = true;
    }

    soundLabel(id) {
        if (id === 'none') return 'No sound';
        if (id.startsWith('custom-')) {
            const c = this.customSounds.find(s => s.id === id);
            return c ? c.name : 'Custom';
        }
        const s = this.sounds.find(s => s.id === id);
        return s ? s.label : id;
    }

    removeAlarm(id) { this.alarms = this.alarms.filter(a => a.id !== id); this.saveAlarms(); this.renderAlarms(); this.updateStatus('Alarm removed'); }

    toggleAlarm(id) {
        const alarm = this.alarms.find(a => a.id === id);
        if (alarm) { alarm.enabled = !alarm.enabled; this.saveAlarms(); this.renderAlarms(); this.updateStatus(alarm.enabled ? 'Alarm enabled' : 'Alarm disabled'); }
    }

    clearAllAlarms() { if (confirm('Are you sure you want to clear all Alarms?')) { this.alarms = []; this.saveAlarms(); this.renderAlarms(); this.updateStatus('All alarms cleared'); } }

    renderAlarms() {
        const list = document.getElementById('alarmsList');
        if (this.alarms.length === 0) { list.innerHTML = '<div class="empty-state">No alarms set.</div>'; return; }
        list.innerHTML = this.alarms.map(a => {
            const soundTag = a.sound && a.sound !== 'none'
                ? `<span class="badge badge-sound">🔊 ${this.escapeHtml(this.soundLabel(a.sound))}</span>`
                : '<span class="badge badge-once">Silent</span>';
            return `
            <div class="alarm-item" data-id="${a.id}">
                <div class="alarm-info">
                    <span class="alarm-time">${a.time}</span>
                    <span class="alarm-label">${this.escapeHtml(a.label)}</span>
                    <div class="alarm-meta">
                        <span class="badge ${a.repeat ? 'badge-repeat' : 'badge-once'}">${a.repeat ? 'Daily' : 'Once'}</span>
                        ${soundTag}
                    </div>
                </div>
                <div class="alarm-actions">
                    <button class="btn-icon toggle ${a.enabled ? '' : 'off'}" onclick="alarmClock.toggleAlarm(${a.id})" title="${a.enabled ? 'Disable' : 'Enable'}">${a.enabled ? '⏸' : '▶'}</button>
                    <button class="btn-icon delete" onclick="alarmClock.removeAlarm(${a.id})" title="Delete">🗑</button>
                </div>
            </div>`;
        }).join('');
    }

    checkAlarms() {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5);
        this.alarms.forEach(alarm => {
            if (!alarm.enabled || alarm.time !== currentTime) return;
            const last = alarm.lastTriggered ? new Date(alarm.lastTriggered) : null;
            const sameDay = last && last.toDateString() === now.toDateString();
            if (alarm.repeat || !sameDay) {
                this.triggerAlarm(alarm);
                alarm.lastTriggered = now.toISOString(); this.saveAlarms();
                if (!alarm.repeat) { alarm.enabled = false; this.saveAlarms(); this.renderAlarms(); }
            }
        });
    }

    triggerAlarm(alarm) {
        this.updateStatus(`⏰ Alarm: ${alarm.label} at ${alarm.time}`);
        if (document.getElementById('notificationsEnabled').checked) this.showNotification(alarm);
        if (alarm.sound && alarm.sound !== 'none') this.playAlarmSound(alarm.sound);
        this.flashScreen();
    }

    showNotification(alarm) {
        if (Notification.permission === 'granted') {
            const n = new Notification(`⏰ ${alarm.label}`, { body: `Alarm for ${alarm.time}`, icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>', tag: `alarm-${alarm.id}`, requireInteraction: true, vibrate: [200, 100, 200, 100, 200] });
            n.onclick = () => { window.focus(); n.close(); };
            setTimeout(() => n.close(), 30000);
        }
    }

    async playAlarmSound(soundId) {
        if (soundId && soundId.startsWith('custom-')) return this.playCustomSound(soundId);
        return this.playPresetSound(soundId || 'classic');
    }

    async playCustomSound(id) {
        try {
            const db = await this.openCustomSoundDB();
            const blob = await new Promise((resolve, reject) => {
                const tx = db.transaction('sounds', 'readonly');
                const req = tx.objectStore('sounds').get(id);
                req.onsuccess = () => resolve(req.result);
                req.onerror = e => reject(e);
            });
            if (!blob) return this.playPresetSound('classic');
            const url = URL.createObjectURL(blob.blob);
            const audio = new Audio(url);
            audio.loop = true;
            audio.volume = 1;
            this.stopPreview();
            this.previewNodes = { audio, url };
            await audio.play();
            clearTimeout(this._customStopTimer);
            this._customStopTimer = setTimeout(() => this.stopPreview(), 60000);
        } catch (e) { console.log('Custom sound error:', e); this.playPresetSound('classic'); }
    }

    async previewSelectedSound() {
        this.stopPreview();
        await this.playAlarmSound(this.getSelectedSound());
        setTimeout(() => this.stopPreview(), 3000);
    }

    stopPreview() {
        clearTimeout(this._customStopTimer);
        if (this.previewNodes) {
            try { this.previewNodes.audio.pause(); } catch (e) { }
            if (this.previewNodes.url) URL.revokeObjectURL(this.previewNodes.url);
            this.previewNodes = null;
        }
    }

    async playPresetSound(id) {
        try {
            if (this.audioCtx) { try { await this.audioCtx.close(); } catch (e) { } }
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const ctx = this.audioCtx;
            if (id === 'none') { await ctx.close(); return; }
            if (id === 'classic') return this._classic(ctx);
            if (id === 'digital') return this._digital(ctx);
            if (id === 'chime') return this._chime(ctx);
            if (id === 'siren') return this._siren(ctx);
            if (id === 'birds') return this._birds(ctx);
            if (id === 'bell') return this._bell(ctx);
            return this._classic(ctx);
        } catch (e) { console.log('Audio error:', e); }
    }

    _beep(ctx, freq, start, dur, type = 'sine', vol = 0.3) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
    }

    _classic(ctx) {
        const pattern = [800, 600, 800, 600, 800];
        pattern.forEach((f, i) => this._beep(ctx, f, i * 0.4, 0.3, 'sine', 0.3));
        setTimeout(() => { if (ctx.state !== 'closed') ctx.close(); }, 2400);
    }

    _digital(ctx) {
        const pattern = [1200, 1200, 900, 1200, 900, 1200];
        pattern.forEach((f, i) => this._beep(ctx, f, i * 0.18, 0.1, 'square', 0.2));
        setTimeout(() => { if (ctx.state !== 'closed') ctx.close(); }, 1500);
    }

    _chime(ctx) {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this._beep(ctx, f, i * 0.35, 0.6, 'sine', 0.25));
        setTimeout(() => { if (ctx.state !== 'closed') ctx.close(); }, 2400);
    }

    _siren(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        gain.gain.value = 0.2;
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        const iv = setInterval(() => {
            if (ctx.state === 'closed') { clearInterval(iv); return; }
            const t = ctx.currentTime;
            osc.frequency.linearRampToValueAtTime(1000, t + 0.5);
            osc.frequency.linearRampToValueAtTime(600, t + 1.0);
        }, 1000);
        osc.start();
        setTimeout(() => { clearInterval(iv); try { osc.stop(); ctx.close(); } catch (e) { } }, 3000);
    }

    _birds(ctx) {
        const chirp = (freq, t) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.6, t + 0.08);
            osc.frequency.exponentialRampToValueAtTime(freq, t + 0.18);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.25, t + 0.02);
            gain.gain.linearRampToValueAtTime(0, t + 0.2);
            osc.start(t); osc.stop(t + 0.22);
        };
        let t = 0;
        for (let i = 0; i < 6; i++) { chirp(1500 + Math.random() * 600, t); t += 0.3 + Math.random() * 0.2; }
        setTimeout(() => { if (ctx.state !== 'closed') ctx.close(); }, (t + 0.5) * 1000);
    }

    _bell(ctx) {
        [880, 1320, 1760].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.25 / (i + 1), ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
            osc.start(); osc.stop(ctx.currentTime + 1.9);
        });
        setTimeout(() => { if (ctx.state !== 'closed') ctx.close(); }, 2200);
    }

    flashScreen() {
        document.body.style.transition = 'background 0.1s';
        let c = 0; const bg = document.body.style.background;
        const iv = setInterval(() => {
            document.body.style.background = c % 2 ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)' : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)';
            if (++c >= 10) { clearInterval(iv); document.body.style.background = bg; }
        }, 200);
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) { document.getElementById('notificationsEnabled').disabled = true; return; }
        if (Notification.permission === 'default') await Notification.requestPermission();
    }

    testNotification() {
        if (Notification.permission === 'granted') {
            new Notification('🔔 Test', { body: 'Alarms working!', vibrate: [100, 50, 100] });
            this.updateStatus('Test sent');
        } else { this.requestNotificationPermission().then(() => this.testNotification()); }
    }

    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => { this.hidden = document.hidden; });
    }

    updateStatus(msg) { document.getElementById('statusText').textContent = msg; setTimeout(() => document.getElementById('statusText').textContent = 'Ready', 3000); }

    escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
}

const alarmClock = new AlarmClock();