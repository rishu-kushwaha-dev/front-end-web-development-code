const form = document.getElementById('regForm');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const ageDisplay = document.getElementById('ageDisplay');
const modal = document.getElementById('summaryModal');
const receiptBody = document.getElementById('receiptBody');
const printBtn = document.getElementById('printBtn');
const closeModal = document.getElementById('closeModal');
const resetBtn = document.getElementById('resetBtn');

const STORAGE_KEY = 'studentRegistrationDraft';

const photoConfigs = [
    { input: document.getElementById('photoInput'), preview: document.getElementById('photoPreview'), label: 'Student photo' },
    { input: document.getElementById('fatherPhotoInput'), preview: document.getElementById('fatherPhotoPreview'), label: 'Father photo' },
    { input: document.getElementById('motherPhotoInput'), preview: document.getElementById('motherPhotoPreview'), label: 'Mother photo' },
    { input: document.getElementById('birthCertInput'), preview: document.getElementById('birthCertPreview'), label: 'Birth certificate' },
    { input: document.getElementById('tcInput'), preview: document.getElementById('tcPreview'), label: 'TC / Marksheet' },
    { input: document.getElementById('aadhaarInput'), preview: document.getElementById('aadhaarPreview'), label: 'Aadhaar copy' },
    { input: document.getElementById('parents_signature'), preview: document.getElementById('parentsSignaturePreview'), label: 'Parents signature' }
];

const siblingsClass = form.elements.siblings_class;
const siblingsCount = form.elements.siblings;
const siblingsCountGroup = document.getElementById('siblingsCountGroup');
const lastSchool = form.elements.last_school;
const reason = form.elements.reason;
const permanentAddress = form.elements.address;
const tempAddress = form.elements.temp_address;
const sameAsPermanent = document.getElementById('sameAsPermanent');
const transportRoute = form.elements.transport_route;
const routeGroup = document.getElementById('routeGroup');
const siblingsClassGroup = document.getElementById('siblingsClassGroup');
const classNote = document.getElementById('classNote');

const formatRules = {
    phone: { test: (v) => /^\d{10}$/.test(v), msg: 'Enter a valid 10-digit phone number' },
    alternate_phone: { test: (v) => /^\d{10}$/.test(v), msg: 'Enter a valid 10-digit phone number' },
    emergency_contact: { test: (v) => /^\d{10}$/.test(v), msg: 'Enter a valid 10-digit emergency contact number' },
    pincode: { test: (v) => /^\d{6}$/.test(v), msg: 'PIN code must be exactly 6 digits' },
    annual_income: { test: (v) => /^\d+$/.test(v), msg: 'Enter a valid annual income amount' },
    email: { test: (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v), msg: 'Enter a valid email address' },
    dob: { test: (v) => new Date(v) < new Date(), msg: 'Date of birth cannot be in the future' }
};

function getGroup(el) {
    return el.closest('.form-group');
}

function setError(el, message) {
    const group = getGroup(el);
    if (!group) return;
    group.classList.add('has-error');
    let errorEl = group.querySelector('.field-error');
    if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.className = 'field-error';
        group.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.hidden = false;
}

function clearErrors() {
    form.querySelectorAll('.has-error').forEach((group) => group.classList.remove('has-error'));
    form.querySelectorAll('.field-error').forEach((errorEl) => {
        errorEl.textContent = '';
        errorEl.hidden = true;
    });
}

function clearGroupError(el) {
    const group = getGroup(el);
    if (!group) return;
    group.classList.remove('has-error');
    const errorEl = group.querySelector('.field-error');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
    }
}

function labelTextFor(el) {
    const group = getGroup(el);
    const label = group ? group.querySelector('label') : null;
    if (!label) return 'This field';
    return label.textContent.replace('*', '').trim();
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function setFileChip(input, text) {
    const group = getGroup(input);
    if (!group) return;
    let chip = group.querySelector('.file-chip');
    if (!text) {
        if (chip) chip.remove();
        return;
    }
    if (!chip) {
        chip = document.createElement('p');
        chip.className = 'file-chip';
        group.appendChild(chip);
    }
    chip.textContent = text;
}

function showFileInfo(input, preview, file) {
    preview.removeAttribute('src');
    preview.style.display = 'none';
    setFileChip(input, `Selected: ${file.name} · ${formatFileSize(file.size)}`);
}

function setupPhotoPreview(config) {
    const { input, preview, label } = config;

    input.addEventListener('change', () => {
        clearGroupError(input);
        setFileChip(input, '');
        const file = input.files[0];

        if (!file) {
            preview.removeAttribute('src');
            preview.style.display = 'none';
            return;
        }

        const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp|svg|avif|heic|heif|tiff?|ico|jfif|jxl)$/i.test(file.name);

        if (!isImage) {
            showFileInfo(input, preview, file);
            saveDraft();
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
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
                preview.src = canvas.toDataURL('image/jpeg', 0.9);
                preview.style.display = 'block';
                saveDraft();
            };
            img.onerror = () => {
                showFileInfo(input, preview, file);
                saveDraft();
            };
            img.src = event.target.result;
        };
        reader.onerror = () => {
            showFileInfo(input, preview, file);
            saveDraft();
        };
        reader.readAsDataURL(file);
    });
}

photoConfigs.forEach(setupPhotoPreview);

function updateAge() {
    const dob = form.elements.dob.value;
    ageDisplay.classList.remove('error');

    if (!dob) {
        ageDisplay.textContent = '';
        return;
    }

    const birth = new Date(dob);
    const today = new Date();

    if (Number.isNaN(birth.getTime()) || birth > today) {
        ageDisplay.textContent = 'Invalid date of birth';
        ageDisplay.classList.add('error');
        return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (today.getDate() < birth.getDate()) months--;
    if (months < 0) {
        years--;
        months += 12;
    }

    ageDisplay.textContent = `Age: ${years} year${years === 1 ? '' : 's'} ${months} month${months === 1 ? '' : 's'}`;
}

function updateProgress() {
    const required = Array.from(form.elements).filter(
        (el) => el.hasAttribute('required') && !el.disabled && el.type !== 'file'
    );

    const counted = new Set();
    let filled = 0;

    required.forEach((el) => {
        if (el.type === 'radio') {
            if (counted.has(el.name)) return;
            counted.add(el.name);
            const group = form.querySelectorAll(`input[name="${el.name}"]`);
            if (Array.from(group).some((radio) => radio.checked)) filled++;
        } else if (el.type === 'checkbox') {
            if (el.checked) filled++;
        } else if (el.value.trim() !== '') {
            filled++;
        }
    });

    const pct = required.length ? Math.round((filled / required.length) * 100) : 0;
    progressFill.style.width = pct + '%';
    progressText.textContent = pct + '% complete';
}

function applySiblingsLogic() {
    const noSelected = form.querySelector('input[name="siblings_school"][value="no"]').checked;
    siblingsClassGroup.hidden = noSelected;
    siblingsClass.disabled = noSelected;
    siblingsCount.disabled = noSelected;
    siblingsCountGroup.classList.toggle('is-disabled', noSelected);
    if (noSelected) {
        siblingsClass.removeAttribute('required');
        clearGroupError(siblingsCount);
    } else {
        siblingsClass.setAttribute('required', '');
    }
}

function applyClassLogic() {
    const isFirstClass = form.elements['class'].value === '1';
    lastSchool.disabled = isFirstClass;
    reason.disabled = isFirstClass;
    document.getElementById('lastSchoolGroup').classList.toggle('is-disabled', isFirstClass);
    document.getElementById('reasonGroup').classList.toggle('is-disabled', isFirstClass);
    classNote.hidden = !isFirstClass;
    if (isFirstClass) {
        lastSchool.removeAttribute('required');
        reason.removeAttribute('required');
    } else {
        lastSchool.setAttribute('required', '');
        reason.setAttribute('required', '');
    }
}

function applyStreamLogic() {
    const isSenior = form.elements['class'].value === '11' || form.elements['class'].value === '12';
    document.getElementById('streamGroup').hidden = !isSenior;
    const stream = form.elements.stream;
    stream.disabled = !isSenior;
    if (!isSenior) stream.removeAttribute('required');
    else stream.setAttribute('required', '');
}
function applyTransportLogic() {
    const yesSelected = form.querySelector('input[name="transport"][value="yes"]').checked;
    routeGroup.hidden = !yesSelected;
    transportRoute.disabled = !yesSelected;
}

function applySameAddressLogic() {
    if (sameAsPermanent.checked) {
        tempAddress.value = permanentAddress.value;
        tempAddress.readOnly = true;
    } else {
        tempAddress.readOnly = false;
    }
}

function validateForm() {
    clearErrors();
    let valid = true;

    const radioGroups = new Map();

    Array.from(form.elements).forEach((el) => {
        if (!el.name || el.disabled) return;
        if (el.type === 'file') return;

        if (el.type === 'radio') {
            if (!el.hasAttribute('required')) return;
            if (!radioGroups.has(el.name)) radioGroups.set(el.name, []);
            radioGroups.get(el.name).push(el);
            return;
        }

        if (el.type === 'checkbox') {
            if (el.hasAttribute('required') && !el.checked) {
                setError(el, 'You must agree to the terms and conditions');
                valid = false;
            }
            return;
        }

        const value = el.value.trim();

        if (el.hasAttribute('required') && value === '') {
            setError(el, `${labelTextFor(el)} is required`);
            valid = false;
            return;
        }

        const rule = formatRules[el.name];
        if (rule && value !== '' && !rule.test(value)) {
            setError(el, rule.msg);
            valid = false;
        }
    });

    radioGroups.forEach((groups) => {
        if (!groups.some((radio) => radio.checked)) {
            setError(groups[0], `Please select ${labelTextFor(groups[0]).toLowerCase()}`);
            valid = false;
        }
    });

    photoConfigs.forEach((config) => {
        const hasPreview = config.preview.getAttribute('src') && config.preview.style.display !== 'none';
        if (!config.input.files.length && !hasPreview) {
            setError(config.input, `Please upload the ${config.label.toLowerCase()}`);
            valid = false;
        }
    });

    if (form.querySelector('input[name="transport"][value="yes"]').checked && transportRoute.value.trim() === '') {
        setError(transportRoute, 'Please enter the transport route');
        valid = false;
    }

    return valid;
}

function valueOf(name) {
    const el = form.elements[name];
    if (!el) return '';
    return el.value.trim();
}

function checkedValue(name) {
    const el = form.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function buildReceipt() {
    const classSelect = form.elements['class'];
    const className = classSelect.value ? classSelect.options[classSelect.selectedIndex].text : '';

    const sections = [
        {
            title: 'Student Details',
            rows: [
                ['Registration No', receiptNumber],
                ['Name', valueOf('name')],
                ['Date of Birth', valueOf('dob')],
                ['Age', ageDisplay.textContent.replace('Age: ', '')],
                ['Gender', checkedValue('gender')],
                ['Religion', valueOf('religion')],
                ['Caste', valueOf('caste')],
                ['Blood Group', valueOf('blood_group')],
                ['Aadhaar Number', valueOf('aadhaar')]
            ]
        },
        {
            title: 'Parents Details',
            rows: [
                ['Father Name', valueOf('father_name')],
                ["Father's Occupation", valueOf('father_occupation')],
                ['Mother Name', valueOf('mother_name')],
                ["Mother's Occupation", valueOf('mother_occupation')],
                ["Parents' Annual Income", valueOf('annual_income')]
            ]
        },
        {
            title: 'Contact Details',
            rows: [
                ['Phone Number', valueOf('phone')],
                ['Alternate Phone Number', valueOf('alternate_phone')],
                ['Email', valueOf('email')],
                ['Emergency Contact Number', valueOf('emergency_contact')]
            ]
        },
        {
            title: 'Admission Details',
            rows: [
                ['Class', className],
                ['Date of Admission', valueOf('admission_date')],
                ['Any Disease', valueOf('disease')],
                ['Number of Siblings', siblingsCount.disabled ? '' : valueOf('siblings')],
                ['Siblings in the same school', checkedValue('siblings_school')],
                ['Siblings Class', siblingsClass.disabled ? '' : valueOf('siblings_class')],
                ['Last School Name', lastSchool.disabled ? 'N/A (1st Class)' : valueOf('last_school')],
                ['Reason for Leaving', reason.disabled ? 'N/A (1st Class)' : valueOf('reason')],
                ['Transport Facility', checkedValue('transport')],
                ['Transport Route', form.querySelector('input[name="transport"][value="yes"]').checked ? valueOf('transport_route') : ''],
                ['Parents Signature', valueOf('parents_signature')]
            ]
        },
        {
            title: 'Address Details',
            rows: [
                ['Permanent Address', valueOf('address')],
                ['Temporary Address', valueOf('temp_address')]
            ]
        },
        {
            title: 'Consent',
            rows: [
                ['Newsletter', form.elements.newsletter.checked ? 'Yes' : 'No'],
                ['Terms & Conditions', form.elements.terms.checked ? 'Accepted' : 'Not accepted']
            ]
        }
    ];

    const photosHtml = photoConfigs
        .filter((config) => config.preview.getAttribute('src'))
        .map((config) => `
            <figure>
                <img src="${config.preview.src}" alt="${escapeHtml(config.label)}">
                <figcaption>${escapeHtml(config.label.replace(' photo', ''))}</figcaption>
            </figure>`)
        .join('');

    const sectionsHtml = sections.map((section) => {
        const rowsHtml = section.rows
            .filter(([, value]) => value && value !== 'N/A (1st Class)')
            .map(([label, value]) => `
                <div class="receipt-row">
                    <span>${escapeHtml(label)}</span>
                    <strong>${escapeHtml(value.charAt(0).toUpperCase() + value.slice(1))}</strong>
                </div>`)
            .join('');

        if (!rowsHtml) return '';

        return `
            <div class="receipt-section">
                <h3>${escapeHtml(section.title)}</h3>
                ${rowsHtml}
            </div>`;
    }).join('');

    receiptBody.innerHTML = `
        ${photosHtml ? `<div class="receipt-photos">${photosHtml}</div>` : ''}
        ${sectionsHtml}`;
}

let receiptNumber = '';
let saveTimer;

function saveDraft() {
    const data = { values: {}, radios: {}, checks: {}, photos: {}, fileChips: {} };

    Array.from(form.elements).forEach((el) => {
        if (!el.name || el.type === 'file' || el.disabled) return;
        if (el.type === 'radio') {
            if (el.checked) data.radios[el.name] = el.value;
        } else if (el.type === 'checkbox') {
            data.checks[el.name] = el.checked;
        } else {
            data.values[el.name] = el.value;
        }
    });

    photoConfigs.forEach((config) => {
        if (config.preview.getAttribute('src')) {
            data.photos[config.input.name] = config.preview.src;
        }
        const chip = getGroup(config.input) && getGroup(config.input).querySelector('.file-chip');
        if (chip && chip.textContent) {
            data.fileChips[config.input.name] = chip.textContent;
        }
    });

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        /* storage may be full or unavailable */
    }
}

function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 250);
}

function restoreDraft() {
    let data;
    try {
        data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (error) {
        return;
    }
    if (!data) return;

    Object.entries(data.values || {}).forEach(([name, value]) => {
        const el = form.elements[name];
        if (el && el.type !== 'file') el.value = value;
    });

    Object.entries(data.radios || {}).forEach(([name, value]) => {
        const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) radio.checked = true;
    });

    Object.entries(data.checks || {}).forEach(([name, checked]) => {
        const el = form.elements[name];
        if (el && el.type === 'checkbox') el.checked = Boolean(checked);
    });

    photoConfigs.forEach((config) => {
        const src = data.photos && data.photos[config.input.name];
        if (src) {
            config.preview.src = src;
            config.preview.style.display = 'block';
        }
        const chipText = data.fileChips && data.fileChips[config.input.name];
        if (chipText) setFileChip(config.input, chipText);
    });
}

function resetForm() {
    form.reset();
    clearErrors();
    photoConfigs.forEach((config) => {
        config.input.value = '';
        config.preview.removeAttribute('src');
        config.preview.style.display = 'none';
        setFileChip(config.input, '');
    });
    sameAsPermanent.checked = false;
    tempAddress.readOnly = false;
    ageDisplay.textContent = '';
    applySiblingsLogic();
    applyClassLogic();
    applyTransportLogic();
    updateProgress();
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        /* ignore */
    }
    clearTimeout(saveTimer);
}

form.addEventListener('input', (event) => {
    if (event.target.type !== 'file') clearGroupError(event.target);
    updateProgress();
    updateAge();
    scheduleSave();
});

form.addEventListener('change', (event) => {
    if (event.target.type !== 'file') clearGroupError(event.target);
    updateProgress();
    scheduleSave();
});

['phone', 'alternate_phone', 'emergency_contact', 'aadhaar', 'father_mobile', 'mother_mobile', 'pincode'].forEach((name) => {
    const el = form.elements[name];
    if (el) {
        el.addEventListener('input', () => {
            el.value = el.value.replace(/\D/g, '');
        });
    }
});

form.elements.siblings.addEventListener('input', () => {
    form.elements.siblings.value = form.elements.siblings.value.replace(/\D/g, '');
});

form.elements.dob.addEventListener('change', updateAge);

form.querySelectorAll('input[name="siblings_school"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        applySiblingsLogic();
        updateProgress();
        scheduleSave();
    });
});

form.elements['class'].addEventListener('change', () => {
    applyClassLogic();
    applyStreamLogic();
    updateProgress();
    scheduleSave();
});

form.querySelectorAll('input[name="transport"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        applyTransportLogic();
        updateProgress();
        scheduleSave();
    });
});

permanentAddress.addEventListener('input', () => {
    if (sameAsPermanent.checked) {
        tempAddress.value = permanentAddress.value;
        scheduleSave();
    }
});

sameAsPermanent.addEventListener('change', () => {
    applySameAddressLogic();
    clearGroupError(tempAddress);
    updateProgress();
    scheduleSave();
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm()) {
        const firstError = form.querySelector('.has-error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    receiptNumber = `REG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    buildReceipt();
    modal.classList.add('show');
});

printBtn.addEventListener('click', () => {
    window.print();
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    resetForm();
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('show');
        resetForm();
    }
});

resetBtn.addEventListener('click', () => {
    if (!confirm('Are you sure you want to clear all fields?')) return;
    resetForm();
});

const today = new Date().toISOString().split('T')[0];
form.elements.dob.setAttribute('max', today);

restoreDraft();
applySiblingsLogic();
applyClassLogic();
applyStreamLogic();
applyTransportLogic();
applySameAddressLogic();
updateAge();
updateProgress();