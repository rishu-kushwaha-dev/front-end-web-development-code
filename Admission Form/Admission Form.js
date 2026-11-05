let currentStep = 1;
const totalSteps = 3;

function switchStep(step) {
    currentStep = step;
    updateFormView();
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateFormView();
    } else {
        alert("Admission form submitted successfully!");
    }
}

function updateFormView() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step-${currentStep}`).classList.add('active');

    // Update tab highlights
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, index) => {
        if (index + 1 === currentStep) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update button text & indicator
    const nextBtn = document.getElementById('nextBtn');
    if (currentStep === totalSteps) {
        nextBtn.textContent = 'Submit';
    } else {
        nextBtn.textContent = 'Next';
    }

    document.getElementById('stepIndicator').textContent = `${currentStep} / ${totalSteps}`;
}