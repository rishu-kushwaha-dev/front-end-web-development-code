const textInput = document.getElementById('qr-text');
const imageFile = document.getElementById('image-file');
const videoFile = document.getElementById('video-file');
const imagePreview = document.getElementById('image-preview');
const videoPreview = document.getElementById('video-preview');
const qrBox = document.getElementById('qrcode');
const downloadBtn = document.getElementById('download-btn');
const tabs = document.querySelectorAll('.tab');
const textBox = document.getElementById('text-box');
const imageBox = document.getElementById('image-box');
const videoBox = document.getElementById('video-box');

let qrInstance = null;
let currentData = '';

function showBox(id) {
    textBox.style.display = 'none';
    imageBox.style.display = 'none';
    videoBox.style.display = 'none';
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="' + id + '"]').classList.add('active');
    if (id === 'text') textBox.style.display = 'block';
    if (id === 'image') imageBox.style.display = 'block';
    if (id === 'video') videoBox.style.display = 'block';
    generateQR(currentData);
}

tabs.forEach(tab => {
    tab.addEventListener('click', function () {
        showBox(tab.dataset.tab);
    });
});

function generateQR(data) {
    qrBox.innerHTML = '';
    if (!data) {
        downloadBtn.style.display = 'none';
        qrInstance = null;
        return;
    }
    try {
        qrInstance = new QRCode(qrBox, {
            text: data,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = function () {
            const img = qrBox.querySelector('img');
            if (!img) return;
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = img.src;
            link.click();
        };
    } catch (e) {
        qrBox.innerHTML = '<p style="color:red">Data too large for QR code. Upload online and paste the link in Text/URL tab.</p>';
        downloadBtn.style.display = 'none';
    }
}

textInput.addEventListener('input', function () {
    currentData = textInput.value.trim();
    generateQR(currentData);
});

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

imageFile.addEventListener('change', async function () {
    if (!this.files[0]) return;
    try {
        const data = await fileToDataURL(this.files[0]);
        imagePreview.innerHTML = '<img src="' + data + '" alt="Preview">';
        imagePreview.style.display = 'block';
        qrBox.innerHTML = '<p style="color:#667eea">Image selected.<br><br>QR codes cannot store image files directly.<br>Upload this image to Google Drive / Imgur / any file host,<br>then paste the link in the <b>Text / URL</b> tab.</p>';
        downloadBtn.style.display = 'none';
    } catch (e) {
        alert('Could not read image');
    }
});

videoFile.addEventListener('change', async function () {
    if (!this.files[0]) return;
    try {
        const data = await fileToDataURL(this.files[0]);
        videoPreview.innerHTML = '<video src="' + data + '" controls muted playsinline></video>';
        videoPreview.style.display = 'block';
        qrBox.innerHTML = '<p style="color:#667eea">Video selected.<br><br>QR codes cannot store video files directly.<br>Upload this video to YouTube / Google Drive / any file host,<br>then paste the link in the <b>Text / URL</b> tab.</p>';
        downloadBtn.style.display = 'none';
    } catch (e) {
        alert('Could not read video');
    }
});

generateQR('');