class ScreenRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.stream = null;
        this.webcamStream = null;
        this.audioContext = null;
        this.analyser = null;
        this.micStream = null;
        this.startTime = null;
        this.timerInterval = null;
        this.fileSizeInterval = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.recordings = [];
        this.currentRecordingBlob = null;
        this.currentRecordingUrl = null;
        this.currentRecordingMimeType = null;
        this.countdownInterval = null;
        this.autoStopTimeout = null;
        this.trimStart = 0;
        this.trimEnd = 1;
        this.videoDuration = 0;

        this.drawingCanvas = null;
        this.drawingCtx = null;
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.drawingColor = '#00d4aa';
        this.drawingLineWidth = 3;
        this.lastDrawPoint = null;
        this.drawings = [];

        this.initializeElements();
        this.bindEvents();
        this.initIndexedDB();
        this.loadRecordings();
    }

    initializeElements() {
        this.preview = document.getElementById('preview');
        this.webcamPreview = document.getElementById('webcamPreview');
        this.drawingCanvas = document.getElementById('drawingCanvas');
        this.drawingToolbar = document.getElementById('drawingToolbar');
        this.previewOverlay = document.getElementById('previewOverlay');
        this.countdownOverlay = document.getElementById('countdownOverlay');
        this.countdownNumber = document.getElementById('countdownNumber');
        this.recordingIndicator = document.getElementById('recordingIndicator');
        this.recText = document.getElementById('recText');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.screenshotBtnRecording = document.getElementById('screenshotBtnRecording');
        this.timer = document.getElementById('timer');
        this.timerText = this.timer.querySelector('span');
        this.fileSizeDisplay = document.getElementById('fileSizeDisplay');
        this.audioVisualizer = document.getElementById('audioVisualizer');
        this.visualizerBars = this.audioVisualizer?.querySelectorAll('.bar');
        this.audioCheckbox = document.getElementById('audioCheckbox');
        this.micCheckbox = document.getElementById('micCheckbox');
        this.webcamCheckbox = document.getElementById('webcamCheckbox');
        this.qualitySelect = document.getElementById('qualitySelect');
        this.fpsSelect = document.getElementById('fpsSelect');
        this.watermarkInput = document.getElementById('watermarkInput');
        this.autoStopSelect = document.getElementById('autoStopSelect');
        this.recordingsSection = document.getElementById('recordingsSection');
        this.recordingsList = document.getElementById('recordingsList');
        this.previewPlayerSection = document.getElementById('previewPlayerSection');
        this.previewPlayer = document.getElementById('previewPlayer');
        this.trimmerSection = document.getElementById('trimmerSection');
        this.trimStartInput = document.getElementById('trimStart');
        this.trimEndInput = document.getElementById('trimEnd');
        this.trimStartRange = document.getElementById('trimStartRange');
        this.trimEndRange = document.getElementById('trimEndRange');
        this.applyTrimBtn = document.getElementById('applyTrimBtn');
        this.trimToggleBtn = document.getElementById('trimToggleBtn');
        this.customFilename = document.getElementById('customFilename');
        this.screenshotBtn = document.getElementById('screenshotBtn');
        this.downloadWebmBtn = document.getElementById('downloadWebmBtn');
        this.downloadMp4Btn = document.getElementById('downloadMp4Btn');
        this.discardBtn = document.getElementById('discardBtn');
        this.toastContainer = document.getElementById('toastContainer');

        if (this.drawingCanvas) {
            this.drawingCtx = this.drawingCanvas.getContext('2d');
        }
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startRecording());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.stopBtn.addEventListener('click', () => this.stopRecording());
        this.screenshotBtnRecording.addEventListener('click', () => this.takeScreenshot());
        this.micCheckbox.addEventListener('change', () => this.updateAudioConstraints());
        this.webcamCheckbox.addEventListener('change', () => this.updateWebcamPreview());
        this.watermarkInput.addEventListener('input', () => this.updateWatermark());
        this.autoStopSelect.addEventListener('change', () => this.updateAutoStopTimer());

        this.downloadWebmBtn.addEventListener('click', () => this.downloadCurrentRecording('webm'));
        this.downloadMp4Btn.addEventListener('click', () => this.downloadCurrentRecording('mp4'));
        this.discardBtn.addEventListener('click', () => this.discardCurrentRecording());
        this.screenshotBtn.addEventListener('click', () => this.takeScreenshotFromPreview());
        this.trimToggleBtn.addEventListener('click', () => this.toggleTrimmer());
        this.applyTrimBtn.addEventListener('click', () => this.applyTrim());

        this.trimStartInput.addEventListener('change', () => this.updateTrimFromInputs());
        this.trimEndInput.addEventListener('change', () => this.updateTrimFromInputs());
        this.trimStartRange.addEventListener('input', () => this.updateTrimFromRange());
        this.trimEndRange.addEventListener('input', () => this.updateTrimFromRange());

        document.querySelectorAll('.draw-tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDrawTool(e.currentTarget.dataset.tool));
        });

        this.drawingCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.drawingCanvas.addEventListener('mousemove', (e) => this.draw(e));
        this.drawingCanvas.addEventListener('mouseup', () => this.stopDrawing());
        this.drawingCanvas.addEventListener('mouseleave', () => this.stopDrawing());

        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        window.addEventListener('resize', () => this.resizeDrawingCanvas());
    }

    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ScreenRecorderDB', 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('recordings')) {
                    db.createObjectStore('recordings', { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    }

    async saveRecordingToDB(recording) {
        if (!this.db) return;
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('recordings', 'readwrite');
            const store = tx.objectStore('recordings');
            const data = {
                ...recording,
                blob: recording.blob,
                url: null
            };
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async loadRecordingsFromDB() {
        if (!this.db) return [];
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('recordings', 'readonly');
            const store = tx.objectStore('recordings');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteRecordingFromDB(id) {
        if (!this.db) return;
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('recordings', 'readwrite');
            const store = tx.objectStore('recordings');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
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
                    this.startFileSizeUpdater();
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
            } else if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                    this.takeScreenshot();
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

    updateWatermark() { }

    updateAutoStopTimer() {
        if (this.autoStopTimeout) {
            clearTimeout(this.autoStopTimeout);
            this.autoStopTimeout = null;
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
                    this.micStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        }
                    });
                    const audioTrack = this.micStream.getAudioTracks()[0];
                    this.stream.addTrack(audioTrack);
                    this.setupAudioVisualizer(this.micStream);
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
            this.resizeDrawingCanvas();
            this.drawingCanvas.hidden = false;
            this.drawingToolbar.hidden = false;

            this.mediaRecorder.start(1000);
            this.startTimer();
            this.startFileSizeUpdater();
            this.updateUI('recording');
            this.recordingIndicator.hidden = false;
            this.recordingIndicator.classList.remove('paused');
            this.recText.textContent = 'REC';

            const autoStopSeconds = parseInt(this.autoStopSelect.value);
            if (autoStopSeconds > 0) {
                this.autoStopTimeout = setTimeout(() => {
                    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                        this.stopRecording();
                        this.showToast(`Auto-stopped after ${autoStopSeconds / 60} minute(s)`, 'info');
                    }
                }, autoStopSeconds * 1000);
            }

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
            this.drawingCanvas.hidden = true;
            this.drawingToolbar.hidden = true;
        }
    }

    setupAudioVisualizer(audioStream) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        const source = this.audioContext.createMediaStreamSource(audioStream);
        source.connect(this.analyser);
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;
        this.audioVisualizer.hidden = false;
        this.animateVisualizer();
    }

    animateVisualizer() {
        if (!this.analyser || this.audioVisualizer.hidden) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);

        const barCount = this.visualizerBars.length;
        const step = Math.ceil(bufferLength / barCount);

        for (let i = 0; i < barCount; i++) {
            let sum = 0;
            for (let j = 0; j < step; j++) {
                sum += dataArray[i * step + j] || 0;
            }
            const avg = sum / step;
            const height = Math.max(4, (avg / 255) * 40);
            this.visualizerBars[i].style.height = `${height}px`;
            this.visualizerBars[i].style.background = avg > 128
                ? `linear-gradient(to top, var(--danger), var(--danger-hover))`
                : `linear-gradient(to top, var(--accent), var(--accent-hover))`;
        }

        requestAnimationFrame(() => this.animateVisualizer());
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
            this.startFileSizeUpdater();
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
            this.stopFileSizeUpdater();
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
        this.stopFileSizeUpdater();
        this.cleanupStream();
        this.updateUI('stopped');
        this.recordingIndicator.hidden = true;
        this.drawingCanvas.hidden = true;
        this.drawingToolbar.hidden = true;
        this.audioVisualizer.hidden = true;
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
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
        this.saveRecordingToDB(recording);
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
        this.trimmerSection.hidden = true;
        this.trimToggleBtn.textContent = 'Trim Video';

        this.previewPlayer.onloadedmetadata = () => {
            this.videoDuration = this.previewPlayer.duration;
            this.trimEnd = 1;
            this.updateTrimInputs();
        };

        const isMp4Supported = MediaRecorder.isTypeSupported('video/mp4');
        this.downloadMp4Btn.disabled = !isMp4Supported;
        this.downloadMp4Btn.title = isMp4Supported ? '' : 'MP4 not supported in this browser';

        const baseName = this.currentRecordingBlob ? 'recording' : 'recording';
        this.customFilename.value = baseName;
    }

    toggleTrimmer() {
        const isHidden = this.trimmerSection.hidden;
        this.trimmerSection.hidden = !isHidden;
        this.trimToggleBtn.innerHTML = isHidden
            ? `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg><span>Hide Trimmer</span>`
            : `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg><span>Trim Video</span>`;
    }

    updateTrimInputs() {
        const startTime = this.trimStart * this.videoDuration;
        const endTime = this.trimEnd * this.videoDuration;
        this.trimStartInput.value = this.secondsToTimeInput(startTime);
        this.trimEndInput.value = this.secondsToTimeInput(endTime);
        this.trimStartRange.value = this.trimStart * 100;
        this.trimEndRange.value = this.trimEnd * 100;
    }

    updateTrimFromInputs() {
        const start = this.timeInputToSeconds(this.trimStartInput.value);
        const end = this.timeInputToSeconds(this.trimEndInput.value);
        this.trimStart = Math.max(0, Math.min(start / this.videoDuration, 0.99));
        this.trimEnd = Math.max(0.01, Math.min(end / this.videoDuration, 1));
        if (this.trimStart >= this.trimEnd) {
            this.trimStart = Math.max(0, this.trimEnd - 0.01);
        }
        this.updateTrimInputs();
    }

    updateTrimFromRange() {
        this.trimStart = parseFloat(this.trimStartRange.value) / 100;
        this.trimEnd = parseFloat(this.trimEndRange.value) / 100;
        if (this.trimStart >= this.trimEnd) {
            if (this.trimStartRange === document.activeElement) {
                this.trimStart = Math.max(0, this.trimEnd - 0.01);
            } else {
                this.trimEnd = Math.min(1, this.trimStart + 0.01);
            }
        }
        this.updateTrimInputs();
    }

    secondsToTimeInput(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    timeInputToSeconds(timeStr) {
        const [h, m, s] = timeStr.split(':').map(Number);
        return h * 3600 + m * 60 + s;
    }

    async applyTrim() {
        if (!this.currentRecordingBlob) return;

        this.showToast('Trimming video...', 'info');
        this.applyTrimBtn.disabled = true;

        try {
            const trimmedBlob = await this.trimVideo(this.currentRecordingBlob, this.trimStart, this.trimEnd);
            if (this.currentRecordingUrl) {
                URL.revokeObjectURL(this.currentRecordingUrl);
            }
            this.currentRecordingBlob = trimmedBlob;
            this.currentRecordingUrl = URL.createObjectURL(trimmedBlob);
            this.previewPlayer.src = this.currentRecordingUrl;
            this.showToast('Video trimmed successfully', 'success');
        } catch (err) {
            console.error('Trim failed:', err);
            this.showToast('Trimming failed', 'error');
        } finally {
            this.applyTrimBtn.disabled = false;
        }
    }

    async trimVideo(blob, startRatio, endRatio) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(blob);
            video.muted = true;

            video.onloadeddata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');

                const stream = canvas.captureStream(30);
                const mimeType = this.currentRecordingMimeType.includes('mp4') ? 'video/mp4' : 'video/webm';
                const mediaRecorder = new MediaRecorder(stream, { mimeType });
                const chunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    URL.revokeObjectURL(video.src);
                    resolve(new Blob(chunks, { type: mimeType }));
                };

                const startTime = startRatio * video.duration;
                const endTime = endRatio * video.duration;
                video.currentTime = startTime;

                mediaRecorder.start(100);

                const drawFrame = () => {
                    if (video.currentTime >= endTime || video.paused || video.ended) {
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

    async downloadCurrentRecording(format) {
        if (!this.currentRecordingBlob) return;

        const customName = this.customFilename.value.trim() || 'recording';
        const safeName = customName.replace(/[^a-zA-Z0-9_-]/g, '_');

        if (format === 'webm' || this.currentRecordingMimeType.includes('webm')) {
            this.downloadBlob(this.currentRecordingBlob, 'webm', safeName);
        } else if (format === 'mp4') {
            if (this.currentRecordingMimeType.includes('mp4')) {
                this.downloadBlob(this.currentRecordingBlob, 'mp4', safeName);
            } else {
                this.showToast('Converting to MP4...', 'info');
                try {
                    const mp4Blob = await this.convertToMp4(this.currentRecordingBlob);
                    this.downloadBlob(mp4Blob, 'mp4', safeName);
                } catch (err) {
                    console.error('MP4 conversion failed:', err);
                    this.showToast('MP4 conversion failed, downloading WebM instead', 'error');
                    this.downloadBlob(this.currentRecordingBlob, 'webm', safeName);
                }
            }
        }
    }

    downloadBlob(blob, extension, filename) {
        const fullName = `${filename}.${extension}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fullName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast(`Downloaded ${fullName}`, 'success');
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

    takeScreenshot() {
        if (!this.stream) return;

        const canvas = document.createElement('canvas');
        const videoTrack = this.stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        canvas.width = settings.width || this.preview.videoWidth;
        canvas.height = settings.height || this.preview.videoHeight;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(this.preview, 0, 0, canvas.width, canvas.height);

        if (this.webcamStream && !this.webcamPreview.hidden) {
            const webcamRect = this.webcamPreview.getBoundingClientRect();
            const previewRect = this.preview.getBoundingClientRect();
            const scaleX = canvas.width / previewRect.width;
            const scaleY = canvas.height / previewRect.height;
            ctx.drawImage(this.webcamPreview,
                (webcamRect.left - previewRect.left) * scaleX,
                (webcamRect.top - previewRect.top) * scaleY,
                webcamRect.width * scaleX,
                webcamRect.height * scaleY);
        }

        if (this.drawings.length > 0) {
            this.drawings.forEach(drawing => {
                this.drawOnCanvas(ctx, drawing, canvas.width / this.drawingCanvas.width, canvas.height / this.drawingCanvas.height);
            });
        }

        const watermark = this.watermarkInput.value.trim();
        if (watermark) {
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 4;
            const x = canvas.width - ctx.measureText(watermark).width - 20;
            const y = canvas.height - 20;
            ctx.strokeText(watermark, x, y);
            ctx.fillText(watermark, x, y);
        }

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `screenshot-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast('Screenshot saved', 'success');
        }, 'image/png');
    }

    takeScreenshotFromPreview() {
        if (!this.previewPlayer.src) return;

        const canvas = document.createElement('canvas');
        canvas.width = this.previewPlayer.videoWidth;
        canvas.height = this.previewPlayer.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.previewPlayer, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `snapshot-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast('Snapshot saved', 'success');
        }, 'image/png');
    }

    selectDrawTool(tool) {
        this.currentTool = tool;
        document.querySelectorAll('.draw-tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
    }

    resizeDrawingCanvas() {
        if (!this.drawingCanvas || !this.preview) return;
        const rect = this.preview.getBoundingClientRect();
        this.drawingCanvas.width = rect.width;
        this.drawingCanvas.height = rect.height;
        this.drawingCanvas.style.width = `${rect.width}px`;
        this.drawingCanvas.style.height = `${rect.height}px`;
        this.redrawAll();
    }

    getCanvasPoint(e) {
        const rect = this.drawingCanvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.lastDrawPoint = this.getCanvasPoint(e);
        this.drawings.push({
            tool: this.currentTool,
            points: [this.lastDrawPoint],
            color: this.drawingColor,
            lineWidth: this.drawingLineWidth
        });
        this.drawingCanvas.classList.add('drawing');
    }

    draw(e) {
        if (!this.isDrawing || !this.lastDrawPoint) return;

        const currentPoint = this.getCanvasPoint(e);
        const drawing = this.drawings[this.drawings.length - 1];
        drawing.points.push(currentPoint);

        this.drawSegment(this.drawingCtx, this.lastDrawPoint, currentPoint, drawing);

        this.lastDrawPoint = currentPoint;
    }

    stopDrawing() {
        this.isDrawing = false;
        this.lastDrawPoint = null;
        this.drawingCanvas.classList.remove('drawing');
    }

    drawSegment(ctx, p1, p2, drawing) {
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (drawing.tool === 'highlighter') {
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = drawing.lineWidth * 3;
        } else {
            ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        if (drawing.tool === 'arrow' && drawing.points.length === 2) {
            this.drawArrowHead(ctx, p1, p2, drawing);
        }

        ctx.globalAlpha = 1;
    }

    drawArrowHead(ctx, from, to, drawing) {
        const headLen = 15;
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        ctx.beginPath();
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }

    drawOnCanvas(ctx, drawing, scaleX, scaleY) {
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.lineWidth * Math.max(scaleX, scaleY);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (drawing.tool === 'highlighter') {
            ctx.globalAlpha = 0.3;
            ctx.lineWidth *= 3;
        } else {
            ctx.globalAlpha = 1;
        }

        const points = drawing.points;
        if (points.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(points[0].x * scaleX, points[0].y * scaleY);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x * scaleX, points[i].y * scaleY);
        }
        ctx.stroke();

        if (drawing.tool === 'arrow' && points.length >= 2) {
            const from = points[points.length - 2];
            const to = points[points.length - 1];
            this.drawArrowHead(ctx,
                { x: from.x * scaleX, y: from.y * scaleY },
                { x: to.x * scaleX, y: to.y * scaleY },
                drawing
            );
        }

        ctx.globalAlpha = 1;
    }

    redrawAll() {
        if (!this.drawingCtx) return;
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        this.drawings.forEach(drawing => this.drawOnCanvas(this.drawingCtx, drawing, 1, 1));
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

    startFileSizeUpdater() {
        this.fileSizeInterval = setInterval(() => this.updateFileSize(), 500);
        this.updateFileSize();
        this.fileSizeDisplay.hidden = false;
    }

    stopFileSizeUpdater() {
        if (this.fileSizeInterval) {
            clearInterval(this.fileSizeInterval);
            this.fileSizeInterval = null;
        }
    }

    updateFileSize() {
        const totalSize = this.recordedChunks.reduce((sum, chunk) => sum + chunk.size, 0);
        const mb = (totalSize / (1024 * 1024)).toFixed(1);
        this.fileSizeDisplay.textContent = `• ${mb} MB`;
    }

    updateUI(state) {
        switch (state) {
            case 'recording':
                this.startBtn.disabled = true;
                this.pauseBtn.disabled = false;
                this.stopBtn.disabled = false;
                this.screenshotBtnRecording.disabled = false;
                this.audioCheckbox.disabled = true;
                this.micCheckbox.disabled = true;
                this.webcamCheckbox.disabled = true;
                this.qualitySelect.disabled = true;
                this.fpsSelect.disabled = true;
                this.watermarkInput.disabled = true;
                this.autoStopSelect.disabled = true;
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
        this.screenshotBtnRecording.disabled = true;
        this.audioCheckbox.disabled = false;
        this.micCheckbox.disabled = false;
        this.webcamCheckbox.disabled = false;
        this.qualitySelect.disabled = false;
        this.fpsSelect.disabled = false;
        this.watermarkInput.disabled = false;
        this.autoStopSelect.disabled = false;
        this.timer.classList.remove('recording', 'paused');
        this.fileSizeDisplay.hidden = true;
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
        if (this.micStream) {
            this.micStream.getTracks().forEach(track => track.stop());
            this.micStream = null;
        }
        this.preview.srcObject = null;
        this.webcamPreview.srcObject = null;
        this.webcamPreview.hidden = true;
        this.previewOverlay.classList.remove('hidden');
        this.drawings = [];
        this.redrawAll();
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

    async deleteRecording(id) {
        const index = this.recordings.findIndex(r => r.id === id);
        if (index === -1) return;

        const recording = this.recordings[index];
        URL.revokeObjectURL(recording.url);
        this.recordings.splice(index, 1);
        this.saveRecordings();
        await this.deleteRecordingFromDB(id);
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

    async loadRecordings() {
        try {
            const dbRecordings = await this.loadRecordingsFromDB();
            const localData = JSON.parse(localStorage.getItem('screenRecordings') || '[]');

            const allRecordings = [...dbRecordings, ...localData];
            const uniqueRecordings = allRecordings.filter((rec, idx, arr) =>
                arr.findIndex(r => r.id === rec.id) === idx
            );

            this.recordings = uniqueRecordings.map(r => ({
                ...r,
                blob: null,
                url: null
            })).sort((a, b) => b.id - a.id);

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