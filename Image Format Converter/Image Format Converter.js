const dropZone = document.getElementById('dropZone');
const browseBtn = document.getElementById('browseBtn');
const fileInput = document.getElementById('fileInput');
const controlsSection = document.getElementById('controlsSection');
const previewSection = document.getElementById('previewSection');
const formatSelect = document.getElementById('formatSelect');
const qualityRow = document.getElementById('qualityRow');
const qualityInput = document.getElementById('qualityInput');
const qualityValue = document.getElementById('qualityValue');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const originalImg = document.getElementById('originalImg');
const convertedImg = document.getElementById('convertedImg');
const originalInfo = document.getElementById('originalInfo');
const convertedInfo = document.getElementById('convertedInfo');

let currentFile = null;
let convertedBlob = null;

browseBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', handleFileSelect);

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length && files[0].type.startsWith('image/')) {
        handleFileSelect({ target: { files } });
    }
});

formatSelect.addEventListener('change', () => {
    const isLossy = formatSelect.value === 'image/jpeg' || formatSelect.value === 'image/webp';
    qualityRow.hidden = !isLossy;
});

qualityInput.addEventListener('input', () => {
    qualityValue.textContent = qualityInput.value + '%';
});

convertBtn.addEventListener('click', convertImage);

downloadBtn.addEventListener('click', () => {
    if (!convertedBlob) return;
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${Date.now()}${formatSelect.value.split('/')[1] === 'jpeg' ? '.jpg' : '.' + formatSelect.value.split('/')[1]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

function handleFileSelect(e) {
    const file = e.target.files?.[0] || (e.dataTransfer && e.dataTransfer.files?.[0]);
    if (!file || !file.type.startsWith('image/')) return;

    currentFile = file;
    const url = URL.createObjectURL(file);
    originalImg.src = url;
    originalInfo.textContent = `${file.name} \u00b7 ${formatBytes(file.size)}`;

    controlsSection.hidden = false;
    previewSection.hidden = true;
    downloadBtn.hidden = true;
    convertedImg.src = '';
    convertedInfo.textContent = '';
    convertedBlob = null;
}

async function convertImage() {
    if (!currentFile) return;

    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';

    try {
        const img = await loadImage(currentFile);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const mimeType = formatSelect.value;
        const quality = parseInt(qualityInput.value, 10) / 100;

        convertedBlob = await new Promise((resolve, reject) => {
            canvas.toBlob(resolve, mimeType, quality);
        });

        const convertedUrl = URL.createObjectURL(convertedBlob);
        convertedImg.src = convertedUrl;
        convertedInfo.textContent = `converted.${mimeType.split('/')[1]} \u00b7 ${formatBytes(convertedBlob.size)}`;

        previewSection.hidden = false;
        downloadBtn.hidden = false;
    } catch (err) {
        console.error(err);
        alert('Failed to convert image.');
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert';
    }
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}