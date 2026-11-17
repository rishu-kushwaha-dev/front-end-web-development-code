const form = document.getElementById('regForm');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const progressFill = document.getElementById('progressFill');
const modal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');

photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                // Passport size: 35mm x 45mm ratio (7:9). Crop center and resize.
                const targetW = 140;
                const targetH = 180;
                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');
                const srcRatio = img.width / img.height;
                const dstRatio = targetW / targetH;
                let sx, sy, sw, sh;
                if (srcRatio > dstRatio) {
                    sh = img.height;
                    sw = sh * dstRatio;
                    sx = (img.width - sw) / 2;
                    sy = 0;
                } else {
                    sw = img.width;
                    sh = sw / dstRatio;
                    sx = 0;
                    sy = (img.height - sh) / 2;
                }
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
                photoPreview.src = canvas.toDataURL('image/jpeg', 0.9);
                photoPreview.style.display = 'block';
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function updateProgress() {
    const required = form.querySelectorAll('[required]');
    let filled = 0;
    required.forEach((el) => {
        if (el.type === 'checkbox' || el.type === 'radio') {
            const group = form.querySelectorAll(`[name="${el.name}"]`);
            if (Array.from(group).some((r) => r.checked)) filled++;
        } else if (el.value.trim() !== '') {
            filled++;
        }
    });
    const pct = required.length ? (filled / required.length) * 100 : 0;
    progressFill.style.width = pct + '%';
}

form.addEventListener('input', updateProgress);
form.addEventListener('change', updateProgress);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    modal.classList.add('show');
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    form.reset();
    photoPreview.style.display = 'none';
    progressFill.style.width = '0%';
});