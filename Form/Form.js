document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('body');
    const nameInput = document.getElementById('name');
    const dobInput = document.getElementById('dob');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const ticketsInput = document.getElementById('tickets');
    const signatureInput = document.getElementById('signature');
    const dateSignedInput = document.getElementById('date_signed');

    // Set today's date as max for DOB and date signed
    const today = new Date().toISOString().split('T')[0];
    dobInput.setAttribute('max', today);
    dateSignedInput.value = today;

    // Real-time validation
    nameInput.addEventListener('blur', validateName);
    dobInput.addEventListener('blur', validateDOB);
    phoneInput.addEventListener('blur', validatePhone);
    emailInput.addEventListener('blur', validateEmail);
    ticketsInput.addEventListener('blur', validateTickets);
    signatureInput.addEventListener('blur', validateSignature);

    function validateName() {
        const name = nameInput.value.trim();
        if (name.length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
        } else {
            removeError(nameInput);
        }
    }

    function validateDOB() {
        const dob = new Date(dobInput.value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 13) {
            showError(dobInput, 'You must be at least 13 years old');
        } else {
            removeError(dobInput);
        }
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            showError(phoneInput, 'Please enter a valid phone number');
        } else {
            removeError(phoneInput);
        }
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(emailInput, 'Please enter a valid email address');
        } else {
            removeError(emailInput);
        }
    }

    function validateTickets() {
        const tickets = parseInt(ticketsInput.value);
        if (tickets < 1 || tickets > 10) {
            showError(ticketsInput, 'Tickets must be between 1 and 10');
        } else {
            removeError(ticketsInput);
        }
    }

    function validateSignature() {
        const signature = signatureInput.value.trim();
        if (signature.length < 2) {
            showError(signatureInput, 'Signature must be at least 2 characters');
        } else {
            removeError(signatureInput);
        }
    }

    function showError(input, message) {
        const errorSpan = document.createElement('span');
        errorSpan.style.color = 'red';
        errorSpan.style.fontSize = '12px';
        errorSpan.textContent = message;
        input.parentNode.appendChild(errorSpan);
        input.style.borderColor = 'red';
    }

    function removeError(input) {
        const errorSpan = input.parentNode.querySelector('span');
        if (errorSpan) {
            errorSpan.remove();
        }
        input.style.borderColor = '#bdc3c7';
    }

    // Form submission handler
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit Registration';
    submitButton.style.marginTop = '30px';
    form.appendChild(submitButton);

    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Trigger all validations
        validateName();
        validateDOB();
        validatePhone();
        validateEmail();
        validateTickets();
        validateSignature();

        // Check if there are any errors
        const errorSpans = form.querySelectorAll('span[style*="color: red"]');
        if (errorSpans.length === 0) {
            alert('Registration submitted successfully! Thank you for registering.');
        } else {
            alert('Please fix the errors in the form before submitting.');
        }
    });
});