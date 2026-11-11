document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const eyeIcon = document.querySelector('.eye-icon');

    const validators = {
        firstName: (value) => value.length >= 2 ? '' : 'First name must be at least 2 characters',
        lastName: (value) => value.length >= 2 ? '' : 'Last name must be at least 2 characters',
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address',
        phone: (value) => !value || /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits',
        password: (value) => {
            if (value.length < 8) return 'Password must be at least 8 characters';
            if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
            if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
            if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
            if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain at least one special character';
            return '';
        },
        confirmPassword: (value) => value === passwordInput.value ? '' : 'Passwords do not match',
        dob: (value) => {
            if (!value) return 'Date of birth is required';
            const dob = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            return age >= 13 ? '' : 'You must be at least 13 years old';
        },
        gender: () => {
            const gender = document.querySelector('input[name="gender"]:checked');
            return gender ? '' : 'Please select a gender';
        },
        terms: () => document.getElementById('terms').checked ? '' : 'You must agree to the terms'
    };

    function showError(fieldName, message) {
        const input = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
        const errorEl = document.querySelector(`.error-message[data-for="${fieldName}"]`);
        if (input) input.classList.add('error');
        if (errorEl) errorEl.textContent = message;
    }

    function clearError(fieldName) {
        const input = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
        const errorEl = document.querySelector(`.error-message[data-for="${fieldName}"]`);
        if (input) input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
    }

    function validateField(fieldName) {
        const input = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
        if (!input) return true;

        const value = input.type === 'checkbox' ? input.checked : input.value.trim();
        const validator = validators[fieldName];
        if (!validator) return true;

        const error = validator(value);
        if (error) {
            showError(fieldName, error);
            return false;
        } else {
            clearError(fieldName);
            if (input.type !== 'checkbox' && input.type !== 'radio') {
                input.classList.add('valid');
            }
            return true;
        }
    }

    function checkPasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }

    function updatePasswordStrength(password) {
        const fill = document.querySelector('.strength-fill');
        const text = document.querySelector('.strength-text');
        const score = checkPasswordStrength(password);

        fill.className = 'strength-fill';
        if (score <= 1) {
            fill.classList.add('weak');
            text.textContent = 'Weak';
            text.style.color = '#e74c3c';
        } else if (score <= 2) {
            fill.classList.add('fair');
            text.textContent = 'Fair';
            text.style.color = '#f39c12';
        } else if (score <= 4) {
            fill.classList.add('good');
            text.textContent = 'Good';
            text.style.color = '#3498db';
        } else {
            fill.classList.add('strong');
            text.textContent = 'Strong';
            text.style.color = '#27ae60';
        }
        if (!password) {
            fill.className = 'strength-fill';
            text.textContent = '';
        }
    }

    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input.name));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input.name);
            }
            if (input.name === 'password') {
                updatePasswordStrength(input.value);
            }
        });
    });

    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', () => validateField('gender'));
    });

    document.getElementById('terms').addEventListener('change', () => validateField('terms'));

    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        eyeIcon.textContent = type === 'password' ? '👁' : '🙈';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        Object.keys(validators).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });

        if (isValid) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log('Registration Data:', data);

            alert('Registration successful! Check console for form data.');
            form.reset();
            document.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
            document.querySelector('.strength-fill').className = 'strength-fill';
            document.querySelector('.strength-text').textContent = '';
        } else {
            const firstError = form.querySelector('.error');
            if (firstError) firstError.focus();
        }
    });
});