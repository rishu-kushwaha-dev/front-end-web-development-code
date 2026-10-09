let form, checkIn, checkOut, specialRequests, requestsCount;

document.addEventListener('DOMContentLoaded', function () {
    checkIn = document.getElementById('checkIn');
    checkOut = document.getElementById('checkOut');

    form = document.getElementById('bookingForm');
    specialRequests = document.getElementById('specialRequests');
    requestsCount = document.getElementById('requestsCount');

    if (specialRequests && requestsCount) {
        specialRequests.addEventListener('input', function () {
            requestsCount.textContent = this.value.length;
        });
    }

    const childrenYes = document.getElementById('childrenYes');
    const childrenNo = document.getElementById('childrenNo');
    const guestChildrenCountGroup = document.getElementById('guestChildrenCountGroup');
    const guestChildrenCount = document.getElementById('guestChildrenCount');

    if (childrenYes && childrenNo && guestChildrenCountGroup && guestChildrenCount) {
        function toggleChildrenCount() {
            if (childrenYes.checked) {
                guestChildrenCountGroup.style.display = 'block';
            } else {
                guestChildrenCountGroup.style.display = 'none';
                guestChildrenCount.value = '';
            }
        }

        childrenYes.addEventListener('change', toggleChildrenCount);
        childrenNo.addEventListener('change', toggleChildrenCount);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
            submitBooking();
        }
    });

    form.addEventListener('reset', function () {
        setTimeout(function () {
            clearErrors();
            if (requestsCount) requestsCount.textContent = '0';
            clearSignature();

            const guestChildrenCountGroup = document.getElementById('guestChildrenCountGroup');
            const guestChildrenCount = document.getElementById('guestChildrenCount');
            if (guestChildrenCountGroup) guestChildrenCountGroup.style.display = 'none';
            if (guestChildrenCount) guestChildrenCount.value = '';

            document.querySelectorAll('.room-card').forEach(card => card.classList.remove('selected'));
        }, 10);
    });

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            clearFieldError(this);

            if (this.id === 'phone' || this.id === 'emergencyPhone' || this.id === 'zipCode') {
                this.value = this.value.replace(/\D/g, '');
            }
        });


    });

    loadDraft();

    const saveDraftBtn = document.getElementById('saveDraft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', saveDraft);
    }

    const printFormBtn = document.getElementById('printForm');
    if (printFormBtn) {
        printFormBtn.addEventListener('click', printForm);
    }

    initSignaturePad();

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.form-section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    function updateActiveNav() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    initRoomCards();
    initDarkMode();
});

function validateForm() {
    let isValid = true;
    const requiredFields = [
        { id: 'fullName', message: 'Full Name is required' },
        { id: 'email', message: 'Email Address is required' },
        { id: 'phone', message: 'Phone Number is required' },
        { id: 'checkIn', message: 'Check-in Date is required' },
        { id: 'checkOut', message: 'Check-out Date is required' },
        { id: 'roomType', message: 'Please select Room Type', type: 'radio' },
        { id: 'numRooms', message: 'Number of Rooms is required' },
        { id: 'numAdults', message: 'Number of Adults is required' },
        { id: 'totalGuests', message: 'Total Guests is required' },

        { id: 'emergencyPhone', message: 'Emergency Phone Number is required' },
        { id: 'signature', message: 'Please provide your signature', type: 'signature' },
        { id: 'signDate', message: 'Date is required' },
        { id: 'declaration', message: 'Please accept the declaration', type: 'checkbox' }
    ];

    requiredFields.forEach(field => {
        if (!validateFieldById(field.id, field.type)) {
            isValid = false;
        }
    });

    if (!validateGuestBreakdown()) {
        isValid = false;
    }

    if (checkIn && checkOut && checkIn.value && checkOut.value) {
        if (new Date(checkOut.value) <= new Date(checkIn.value)) {
            showFieldError(checkOut, 'Check-out date must be after check-in date');
            isValid = false;
        }
    }

    return isValid;
}

function validateFieldById(fieldId, type) {
    if (type === 'radio') {
        const radios = document.getElementsByName(fieldId);
        return Array.from(radios).some(radio => radio.checked);
    }

    if (type === 'signature') {
        const canvas = document.getElementById('signaturePad');
        return canvas && !isCanvasBlank(canvas);
    }

    if (type === 'checkbox') {
        const field = document.getElementById(fieldId);
        return field && field.checked;
    }

    const field = document.getElementById(fieldId);
    return field ? validateField(field) : false;
}

function validateField(field) {
    if (!field) return false;

    const value = field.value.trim();
    let isValid = true;
    let message = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    } else if (field.id === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    } else if ((field.id === 'phone' || field.id === 'emergencyPhone') && value) {
        if (!/^\d{10,}$/.test(value)) {
            isValid = false;
            message = 'Please enter a valid phone number (min 10 digits)';
        }
    } else if ((field.id === 'numRooms' || field.id === 'numAdults' || field.id === 'numChildren' || field.id === 'totalGuests' || field.id === 'totalMales' || field.id === 'totalFemales' || field.id === 'guestChildrenCount') && value) {
        const num = parseInt(value);
        if (isNaN(num) || num < 0) {
            isValid = false;
            message = 'Please enter a valid number';
        }
    }

    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

function validateGuestBreakdown() {
    let isValid = true;
    const totalGuests = document.getElementById('totalGuests');
    const totalMales = document.getElementById('totalMales');
    const totalFemales = document.getElementById('totalFemales');
    const guestChildrenCount = document.getElementById('guestChildrenCount');
    const childrenYes = document.getElementById('childrenYes');

    if (!totalGuests || !totalGuests.value) return true;

    const guests = parseInt(totalGuests.value) || 0;
    const males = totalMales && totalMales.value ? parseInt(totalMales.value) : 0;
    const females = totalFemales && totalFemales.value ? parseInt(totalFemales.value) : 0;
    const children = (childrenYes && childrenYes.checked && guestChildrenCount && guestChildrenCount.value) ? parseInt(guestChildrenCount.value) : 0;

    if (males + females > guests) {
        if (totalMales) showFieldError(totalMales, 'Males cannot exceed total guests');
        if (totalFemales) showFieldError(totalFemales, 'Females cannot exceed total guests');
        isValid = false;
    } else if (males + females + children > guests) {
        if (guestChildrenCount && childrenYes && childrenYes.checked) {
            showFieldError(guestChildrenCount, 'Total guests breakdown exceeds total guests');
        }
        isValid = false;
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    let errorElement = field.closest('.form-group').querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.closest('.form-group').appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('error');
    const errorElement = field.closest('.form-group').querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.classList.remove('show'));

    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

function showSuccessMessage() {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.style.display = 'block';
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
}

function submitBooking() {
    showSuccessMessage();

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value,
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value,
        roomType: document.getElementById('roomType').value,
        numRooms: document.getElementById('numRooms').value,
        numAdults: document.getElementById('numAdults').value,
        numChildren: document.getElementById('numChildren').value,
        totalGuests: document.getElementById('totalGuests').value,
        totalMales: document.getElementById('totalMales').value,
        totalFemales: document.getElementById('totalFemales').value,
        childrenHaving: document.querySelector('input[name="childrenHaving"]:checked')?.value || 'no',
        guestChildrenCount: document.getElementById('guestChildrenCount').value,
        arrivalTime: document.getElementById('arrivalTime').value,
        specialRequests: document.getElementById('specialRequests').value,
        pickup: document.getElementById('pickup').checked,

        emergencyPhone: document.getElementById('emergencyPhone').value,
        signDate: document.getElementById('signDate').value,
        declaration: document.getElementById('declaration').checked
    };

    localStorage.removeItem('bookingDraft');
}

function saveDraft() {
    const formData = new FormData(form);
    const draft = {};

    formData.forEach((value, key) => {
        draft[key] = value;
    });

    const signatureCanvas = document.getElementById('signaturePad');
    if (signatureCanvas && !isCanvasBlank(signatureCanvas)) {
        draft.signature = signatureCanvas.toDataURL();
    }

    localStorage.setItem('bookingDraft', JSON.stringify(draft));

    const saveBtn = document.getElementById('saveDraft');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    saveBtn.style.background = '#48bb78';
    saveBtn.style.color = 'white';

    setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = '';
        saveBtn.style.color = '';
    }, 2000);
}

function loadDraft() {
    const draft = localStorage.getItem('bookingDraft');
    if (!draft) return;

    try {
        const data = JSON.parse(draft);

        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (!field) return;

            if (field.type === 'radio') {
                const radio = form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                if (radio) radio.checked = true;
            } else if (field.type === 'checkbox') {
                field.checked = data[key] === 'true' || data[key] === true;
            } else if (key === 'signature') {
                loadSignature(data[key]);
            } else {
                field.value = data[key];
            }

            if (key === 'roomType' && data[key]) {
                const selectedCard = document.querySelector(`.room-card[data-room="${data[key]}"]`);
                if (selectedCard) {
                    document.querySelectorAll('.room-card').forEach(c => c.classList.remove('selected'));
                    selectedCard.classList.add('selected');
                }
            }
        });

        const childrenYes = document.getElementById('childrenYes');
        const guestChildrenCountGroup = document.getElementById('guestChildrenCountGroup');
        if (childrenYes && guestChildrenCountGroup && childrenYes.checked) {
            guestChildrenCountGroup.style.display = 'block';
        }

        if (requestsCount && specialRequests) {
            requestsCount.textContent = specialRequests.value.length;
        }

    } catch (e) {
        console.error('Error loading draft:', e);
    }
}

function printForm() {
    window.print();
}

let isDrawing = false;
let hasSignature = false;

function initSignaturePad() {
    const canvas = document.getElementById('signaturePad');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if (e.touches && e.touches.length > 0) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        if (e.changedTouches && e.changedTouches.length > 0) {
            return {
                x: (e.changedTouches[0].clientX - rect.left) * scaleX,
                y: (e.changedTouches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    function startDrawing(e) {
        e.preventDefault();

        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        hasSignature = true;
        updateSignatureDot();
    }

    function stopDrawing() {

        isDrawing = false;
    }

    function updateSignatureDot() {
        const dot = document.getElementById('signatureDot');
        if (dot) {
            if (hasSignature) {
                dot.classList.add('signed');
            } else {
                dot.classList.remove('signed');
            }
        }
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    const clearBtn = document.getElementById('clearSignature');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSignature);
    }


}

function clearSignature() {
    const canvas = document.getElementById('signaturePad');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
    updateSignatureDot();
}

function isCanvasBlank(canvas) {
    if (!canvas) return true;

    const ctx = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(
        ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );

    return !pixelBuffer.some(color => color !== 0);
}

function loadSignature(dataUrl) {
    const canvas = document.getElementById('signaturePad');
    if (!canvas || !dataUrl) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        hasSignature = true;
        updateSignatureDot();
    };

    img.src = dataUrl;
}

function initRoomCards() {
    const roomCards = document.querySelectorAll('.room-card');
    const roomTypeInput = document.getElementById('roomType');

    roomCards.forEach(card => {
        card.addEventListener('click', function () {
            roomCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');

            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }

            if (roomTypeInput) {
                roomTypeInput.value = this.getAttribute('data-room') || '';
            }
        });
    });

    if (roomTypeInput) {
        roomTypeInput.addEventListener('change', function () {
            const selectedCard = document.querySelector(`.room-card[data-room="${this.value}"]`);
            if (selectedCard) {
                roomCards.forEach(c => c.classList.remove('selected'));
                selectedCard.classList.add('selected');
            }
        });
    }
}

function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const icon = toggle ? toggle.querySelector('i') : null;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                if (icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        });
    }
}