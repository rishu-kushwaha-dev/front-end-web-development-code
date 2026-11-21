class ScreenRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.stream = null;
        this.webcamStream = null;
        this.startTime = null;
        this.timerInterval = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.recordings = [];
        this.currentRecordingBlob = null;
        this.currentRecordingUrl = null;
        this.currentRecordingMimeType = null;
        this.countdownInterval = null;

        this.initializeElements();
        this.bindEvents();
        this.loadRecordings();
    }

    initializeElements() {
        this.preview = document.getElementById('preview');
        this.webcamPreview = document.getElementById('webcamPreview');
        this.previewOverlay = document.getElementById('previewOverlay');
        this.countdownOverlay = document.getElementById('countdownOverlay');
        this.countdownNumber = document.getElementById('countdownNumber');
        this.recordingIndicator = document.getElementById('recordingIndicator');
        this.recText = document.getElementById('recText');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.timer = document.getElementById('timer');
        this.timerText = this.timer.querySelector('span');
        this.audioCheckbox = document.getElementById('audioCheckbox');
        this.micCheckbox = document.getElementById('micCheckbox');
        this.webcamCheckbox = document.getElementById('webcamCheckbox');
        this.qualitySelect = document.getElementById('qualitySelect');
        this.fpsSelect = document.getElementById('fpsSelect');
        this.recordingsSection = document.getElementById('recordingsSection');
        this.recordingsList = document.getElementById('recordingsList');
        this.previewPlayerSection = document.getElementById('previewPlayerSection');
        this.previewPlayer = document.getElementById('previewPlayer');
        this.downloadWebmBtn = document.getElementById('downloadWebmBtn');
        this.downloadMp4Btn = document.getElementById('downloadMp4Btn');
        this.discardBtn = document.getElementById('discardBtn');
        this.toastContainer = document.getElementById('toastContainer');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startRecording());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.stopBtn.addEventListener('click', () => this.stopRecording());
        this.micCheckbox.addEventListener('change', () => this.updateAudioConstraints());
        this.webcamCheckbox.addEventListener('change', () => this.updateWebcamPreview());
        this.downloadWebmBtn.addEventListener('click', () => this.downloadCurrentRecording('webm'));
        this.downloadMp4Btn.addEventListener('click', () => this.downloadCurrentRecording('mp4'));
        this.discardBtn.addEventListener('click', () => this.discardCurrentRecording());

        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        this.stream?.getVideoTracks().forEach(track => {
            track.addEventListener('ended', () => this.handleTrackEnded());
        });
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey && e.shiftKey) {
            if (e.key.toLowerCase() === 'r') {
                e.preventDefault();
                if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                    this.stopRecording();
                } else if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
                    this.mediaRecorder.resume();
                    this.startTimer();
                    this.isPaused = false;
                    this.recordingIndicator.classList.remove('paused');
                    this.recText.textContent = 'REC';
                } else {
                    this.startRecording();
                }
            } else if (e.key.toLowerCase() === 'p') {
                e.preventDefault();
                if (this.mediaRecorder && (this.mediaRecorder.state === 'recording' || this.mediaRecorder.state === 'paused')) {
                    this.togglePause();
                }
            }
        }
    }

    async updateWebcamPreview() {
        if (this.webcamCheckbox.checked) {
            try {
                this.webcamStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 180 } },
                    audio: false
                });
                this.webcamPreview.srcObject = this.webcamStream;
                this.webcamPreview.hidden = false;
            } catch (err) {
                console.warn('Webcam access denied:', err);
                this.showToast('Webcam access denied', 'error');
                this.webcamCheckbox.checked = false;
            }
        } else {
            if (this.webcamStream) {
                this.webcamStream.getTracks().forEach(track => track.stop());
                this.webcamStream = null;
            }
            this.webcamPreview.srcObject = null;
            this.webcamPreview.hidden = true;
        }
    }

    async startRecording() {
        try {
            this.showToast('Requesting screen access...', 'info');

            const fps = parseInt(this.fpsSelect.value);
            const displayMediaOptions = {
                video: {
                    cursor: 'always',
                    frameRate: { ideal: fps, max: fps }
                },
                audio: this.audioCheckbox.checked
            };

            this.stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

            if (this.micCheckbox.checked) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        }
                    });
                    const audioTrack = audioStream.getAudioTracks()[0];
                    this.stream.addTrack(audioTrack);
                } catch (err) {
                    console.warn('Microphone access denied:', err);
                    this.showToast('Microphone access denied, continuing without it', 'info');
                    this.micCheckbox.checked = false;
                }
            }

            if (this.webcamCheckbox.checked && !this.webcamStream) {
                await this.updateWebcamPreview();
            }

            await this.runCountdown();

            this.setupMediaRecorder();
            this.preview.srcObject = this.stream;
            this.previewOverlay.classList.add('hidden');

            this.mediaRecorder.start(1000);
            this.startTimer();
            this.updateUI('recording');
            this.recordingIndicator.hidden = false;
            this.recordingIndicator.classList.remove('paused');
            this.recText.textContent = 'REC';

            this.showToast('Recording started', 'success');

            this.stream.getVideoTracks()[0].addEventListener('ended', () => {
                if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                    this.stopRecording();
                }
            });

        } catch (err) {
            console.error('Error starting recording:', err);
            if (err.name === 'NotAllowedError') {
                this.showToast('Screen recording permission denied', 'error');
            } else {
                this.showToast('Failed to start recording: ' + err.message, 'error');
            }
            this.resetUI();
            this.hideCountdown();
            this.recordingIndicator.hidden = true;
        }
    }

    async runCountdown() {
        this.countdownOverlay.hidden = false;
        const numbers = ['3', '2', '1', 'GO!'];

        for (let i = 0; i < numbers.length; i++) {
            this.countdownNumber.textContent = numbers[i];
            this.countdownNumber.style.animation = 'none';
            this.countdownNumber.offsetHeight;
            this.countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
            await this.sleep(1000);
        }

        this.hideCountdown();
    }

    hideCountdown() {
        this.countdownOverlay.hidden = true;
        this.countdownNumber.textContent = '';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupMediaRecorder() {
        const quality = this.qualitySelect.value;
        let videoBitsPerSecond;

        switch (quality) {
            case 'high':
                videoBitsPerSecond = 8000000;
                break;
            case 'medium':
                videoBitsPerSecond = 4000000;
                break;
            case 'low':
                videoBitsPerSecond = 1500000;
                break;
        }

        const options = {
            mimeType: this.getSupportedMimeType(),
            videoBitsPerSecond
        };

        try {
            this.mediaRecorder = new MediaRecorder(this.stream, options);
        } catch (err) {
            console.warn('Preferred mimeType not supported, using default');
            this.mediaRecorder = new MediaRecorder(this.stream);
        }

        this.recordedChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };

        this.mediaRecorder.onstop = () => this.onRecordingStop();
        this.mediaRecorder.onerror = (err) => {
            console.error('MediaRecorder error:', err);
            this.showToast('Recording error: ' + err.error.message, 'error');
        };
    }

    getSupportedMimeType() {
        const types = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
            'video/mp4'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return '';
    }

    togglePause() {
        if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') return;

        if (this.isPaused) {
            this.mediaRecorder.resume();
            this.startTimer();
            this.pauseBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                <span>Pause</span>
            `;
            this.timer.classList.remove('paused');
            this.recordingIndicator.classList.remove('paused');
            this.recText.textContent = 'REC';
            this.isPaused = false;
            this.showToast('Recording resumed', 'info');
        } else {
            this.mediaRecorder.pause();
            this.stopTimer();
            this.pauseBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Resume</span>
            `;
            this.timer.classList.add('paused');
            this.recordingIndicator.classList.add('paused');
            this.recText.textContent = 'PAUSED';
            this.isPaused = true;
            this.showToast('Recording paused', 'info');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        this.stopTimer();
        this.cleanupStream();
        this.updateUI('stopped');
        this.recordingIndicator.hidden = true;
    }

    onRecordingStop() {
        const blob = new Blob(this.recordedChunks, {
            type: this.mediaRecorder.mimeType || 'video/webm'
        });

        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = this.getExtensionFromMimeType(this.mediaRecorder.mimeType);
        const filename = `recording-${timestamp}.${extension}`;

        const recording = {
            id: Date.now(),
            filename,
            blob,
            url,
            size: blob.size,
            duration: this.getElapsedTime(),
            mimeType: this.mediaRecorder.mimeType,
            date: new Date().toISOString()
        };

        this.recordings.unshift(recording);
        this.saveRecordings();
        this.renderRecordings();
        this.recordingsSection.hidden = false;

        this.currentRecordingBlob = blob;
        this.currentRecordingUrl = url;
        this.currentRecordingMimeType = this.mediaRecorder.mimeType;
        this.showPreviewPlayer(url, this.mediaRecorder.mimeType);

        this.showToast(`Recording saved as ${filename}`, 'success');
    }

    showPreviewPlayer(url, mimeType) {
        this.previewPlayer.src = url;
        this.previewPlayerSection.hidden = false;

        const isMp4Supported = MediaRecorder.isTypeSupported('video/mp4');
        this.downloadMp4Btn.disabled = !isMp4Supported;
        this.downloadMp4Btn.title = isMp4Supported ? '' : 'MP4 not supported in this browser';
    }

    async downloadCurrentRecording(format) {
        if (!this.currentRecordingBlob) return;

        if (format === 'webm' || this.currentRecordingMimeType.includes('webm')) {
            this.downloadBlob(this.currentRecordingBlob, 'webm');
        } else if (format === 'mp4') {
            if (this.currentRecordingMimeType.includes('mp4')) {
                this.downloadBlob(this.currentRecordingBlob, 'mp4');
            } else {
                this.showToast('Converting to MP4...', 'info');
                try {
                    const mp4Blob = await this.convertToMp4(this.currentRecordingBlob);
                    this.downloadBlob(mp4Blob, 'mp4');
                } catch (err) {
                    console.error('MP4 conversion failed:', err);
                    this.showToast('MP4 conversion failed, downloading WebM instead', 'error');
                    this.downloadBlob(this.currentRecordingBlob, 'webm');
                }
            }
        }
    }

    downloadBlob(blob, extension) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `recording-${timestamp}.${extension}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast(`Downloaded ${filename}`, 'success');
    }

    async convertToMp4(webmBlob) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(webmBlob);
            video.muted = true;

            video.onloadeddata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');

                const stream = canvas.captureStream(30);
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
                const chunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    URL.revokeObjectURL(video.src);
                    resolve(new Blob(chunks, { type: 'video/mp4' }));
                };

                mediaRecorder.start(1000);

                const drawFrame = () => {
                    if (video.paused || video.ended) {
                        mediaRecorder.stop();
                        return;
                    }
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    requestAnimationFrame(drawFrame);
                };

                video.play();
                drawFrame();
            };

            video.onerror = () => {
                URL.revokeObjectURL(video.src);
                reject(new Error('Video load failed'));
            };
        });
    }

    discardCurrentRecording() {
        if (this.currentRecordingUrl) {
            URL.revokeObjectURL(this.currentRecordingUrl);
        }
        this.currentRecordingBlob = null;
        this.currentRecordingUrl = null;
        this.currentRecordingMimeType = null;
        this.previewPlayer.src = '';
        this.previewPlayerSection.hidden = true;
        this.showToast('Recording discarded', 'info');
    }

    getExtensionFromMimeType(mimeType) {
        if (mimeType.includes('mp4')) return 'mp4';
        if (mimeType.includes('webm')) return 'webm';
        return 'webm';
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        const now = this.isPaused ? this.pausedTime : Date.now();
        return Math.floor((now - this.startTime) / 1000);
    }

    startTimer() {
        this.startTime = Date.now() - this.pausedTime;
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        this.updateTimer();
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (!this.isPaused && this.startTime) {
            this.pausedTime = Date.now() - this.startTime;
        }
    }

    updateTimer() {
        const elapsed = this.getElapsedTime();
        const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        this.timerText.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateUI(state) {
        switch (state) {
            case 'recording':
                this.startBtn.disabled = true;
                this.pauseBtn.disabled = false;
                this.stopBtn.disabled = false;
                this.audioCheckbox.disabled = true;
                this.micCheckbox.disabled = true;
                this.webcamCheckbox.disabled = true;
                this.qualitySelect.disabled = true;
                this.fpsSelect.disabled = true;
                this.timer.classList.add('recording');
                this.startBtn.innerHTML = `
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    <span>Recording...</span>
                `;
                break;
            case 'stopped':
                this.resetUI();
                break;
        }
    }

    resetUI() {
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.stopBtn.disabled = true;
        this.audioCheckbox.disabled = false;
        this.micCheckbox.disabled = false;
        this.webcamCheckbox.disabled = false;
        this.qualitySelect.disabled = false;
        this.fpsSelect.disabled = false;
        this.timer.classList.remove('recording', 'paused');
        this.isPaused = false;
        this.pausedTime = 0;
        this.startBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
            <span>Start Recording</span>
        `;
        this.pauseBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            <span>Pause</span>
        `;
    }

    cleanupStream() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(track => track.stop());
            this.webcamStream = null;
        }
        this.preview.srcObject = null;
        this.webcamPreview.srcObject = null;
        this.webcamPreview.hidden = true;
        this.previewOverlay.classList.remove('hidden');
    }

    handleTrackEnded() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.stopRecording();
        }
    }

    async updateAudioConstraints() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.showToast('Cannot change audio during recording', 'info');
            this.micCheckbox.checked = !this.micCheckbox.checked;
            return;
        }
    }

    renderRecordings() {
        this.recordingsList.innerHTML = '';

        this.recordings.forEach(recording => {
            const item = document.createElement('div');
            item.className = 'recording-item';
            item.innerHTML = `
                <div class="recording-info">
                    <div class="recording-name">${recording.filename}</div>
                    <div class="recording-meta">
                        ${this.formatBytes(recording.size)} • ${this.formatDuration(recording.duration)} • ${new Date(recording.date).toLocaleString()}
                    </div>
                </div>
                <div class="recording-actions">
                    <button class="btn-play" data-id="${recording.id}" aria-label="Play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Play
                    </button>
                    <button class="btn-download" data-id="${recording.id}" aria-label="Download">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download
                    </button>
                    <button class="btn-delete" data-id="${recording.id}" aria-label="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Delete
                    </button>
                </div>
            `;
            this.recordingsList.appendChild(item);
        });

        this.recordingsList.querySelectorAll('.btn-play').forEach(btn => {
            btn.addEventListener('click', (e) => this.playRecording(parseInt(e.currentTarget.dataset.id)));
        });
        this.recordingsList.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', (e) => this.downloadRecording(parseInt(e.currentTarget.dataset.id)));
        });
        this.recordingsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteRecording(parseInt(e.currentTarget.dataset.id)));
        });
    }

    playRecording(id) {
        const recording = this.recordings.find(r => r.id === id);
        if (!recording) return;

        const video = document.createElement('video');
        video.src = recording.url;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '80vh';

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 2000;
            display: flex; align-items: center; justify-content: center; padding: 1rem;
        `;
        modal.appendChild(video);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                video.pause();
                URL.revokeObjectURL(video.src);
            }
        });
        document.body.appendChild(modal);
        video.play();
    }

    downloadRecording(id) {
        const recording = this.recordings.find(r => r.id === id);
        if (!recording) return;

        const a = document.createElement('a');
        a.href = recording.url;
        a.download = recording.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.showToast(`Downloaded ${recording.filename}`, 'success');
    }

    deleteRecording(id) {
        const index = this.recordings.findIndex(r => r.id === id);
        if (index === -1) return;

        const recording = this.recordings[index];
        URL.revokeObjectURL(recording.url);
        this.recordings.splice(index, 1);
        this.saveRecordings();
        this.renderRecordings();

        if (this.recordings.length === 0) {
            this.recordingsSection.hidden = true;
        }
        this.showToast('Recording deleted', 'info');
    }

    saveRecordings() {
        const data = this.recordings.map(r => ({
            id: r.id,
            filename: r.filename,
            size: r.size,
            duration: r.duration,
            mimeType: r.mimeType,
            date: r.date
        }));
        localStorage.setItem('screenRecordings', JSON.stringify(data));
    }

    loadRecordings() {
        try {
            const data = JSON.parse(localStorage.getItem('screenRecordings') || '[]');
            this.recordings = data.map(r => ({
                ...r,
                blob: null,
                url: null
            }));
            if (this.recordings.length > 0) {
                this.recordingsSection.hidden = false;
                this.renderRecordings();
            }
        } catch (err) {
            console.error('Failed to load recordings:', err);
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDuration(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };

        toast.innerHTML = `
            ${icons[type]}
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Dismiss">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        });

        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem;text-align:center;color:var(--fg-secondary);">
                <div>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:1rem;color:var(--fg-muted);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <h1 style="margin-bottom:0.5rem;color:var(--fg-primary);">Screen Recording Not Supported</h1>
                    <p>Your browser doesn't support the Screen Capture API.</p>
                    <p style="margin-top:1rem;font-size:0.9rem;">Please use Chrome, Edge, Firefox, or Safari 13+</p>
                </div>
            </div>
        `;
        return;
    }

    new ScreenRecorder();
});