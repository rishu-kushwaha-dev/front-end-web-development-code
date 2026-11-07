document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1;
    const totalSteps = 4;

    const steps = document.querySelectorAll(".form-step");
    const circles = document.querySelectorAll(".step-circle");

    circles.forEach((circle, index) => {
        circle.addEventListener("click", () => {
            currentStep = index + 1;
            updateForm();
        });
    });
    const progressBar = document.getElementById("progressBar");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const form = document.getElementById("multiStepForm");

    document.getElementById("deadline").min = new Date().toISOString().split('T')[0];

    const card = document.querySelector(".form-card");
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });

    function updateForm() {
        steps.forEach((step, index) => {
            step.classList.toggle("active-step", index === currentStep - 1);
        });

        circles.forEach((circle, index) => {
            circle.classList.toggle("active", index < currentStep);
        });

        const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = progressWidth + "%";

        prevBtn.style.display = currentStep === 1 ? "none" : "block";
        if (currentStep === totalSteps) {
            nextBtn.innerText = "Submit Enquiry";
            nextBtn.style.background = "#16a34a";
        } else {
            nextBtn.innerText = "Continue";
            nextBtn.style.background = "#2563eb";
        }
    }

    const validators = {
        name: (val) => val.trim().length >= 3 ? "" : "Name must be at least 3 characters.",
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Please enter a valid email address.",
        phone: (val) => /^\d{10}$/.test(val) ? "" : "Phone number must be exactly 10 digits.",
        projectType: (val) => val ? "" : "Please select a project type.",
        description: () => "",
        hearAbout: (val) => val ? "" : "Please select how you heard about us.",
        contactTime: (val) => val ? "" : "Please select a preferred contact time.",
        additionalNotes: (val) => val.trim().length >= 0 ? "" : ""
    };

    function validateField(fieldId) {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}Error`);
        if (!input || !validators[fieldId]) return true;

        const errorMsg = validators[fieldId](input.value);
        if (errorMsg) {
            errorEl.innerText = errorMsg;
            input.classList.add("input-error");
            return false;
        } else {
            errorEl.innerText = "";
            input.classList.remove("input-error");
            return true;
        }
    }

    ["name", "email"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => validateField(id));
    });
    document.getElementById("phone").addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
        validateField("phone");
    });
    document.getElementById("description").addEventListener("input", (e) => {
        validateField("description");
        document.getElementById("charCount").innerText = e.target.value.length;
    });

    document.getElementById("hearAbout").addEventListener("change", () => validateField("hearAbout"));
    document.getElementById("additionalNotes").addEventListener("input", (e) => {
        validateField("additionalNotes");
        document.getElementById("notesCharCount").innerText = e.target.value.length;
    });

    function isStepValid() {
        if (currentStep === 1) {
            return validateField("name") & validateField("email") & validateField("phone");
        }
        if (currentStep === 2) {
            return validateField("projectType");
        }
        if (currentStep === 3) {
            return true;
        }
        if (currentStep === 4) {
            return validateField("hearAbout") & validateField("contactTime");
        }
        return true;
    }

    nextBtn.addEventListener("click", () => {
        if (!isStepValid()) return;

        if (currentStep < totalSteps) {
            currentStep++;
            updateForm();
        } else {
            handleFormSubmit();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep--;
            updateForm();
        }
    });

    const radioCards = document.querySelectorAll(".radio-card");
    const projectTypeInput = document.getElementById("projectType");
    const contactTimeInput = document.getElementById("contactTime");
    const descLabel = document.getElementById("descLabel");

    radioCards.forEach(card => {
        card.addEventListener("click", () => {
            const parent = card.closest(".input-group");
            const siblings = parent.querySelectorAll(".radio-card");
            siblings.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");

            const selectedValue = card.getAttribute("data-value");
            const hiddenInput = parent.querySelector('input[type="hidden"]');
            if (hiddenInput) hiddenInput.value = selectedValue;

            if (descLabel) descLabel.innerText = `Describe your ${selectedValue} project`;
            if (hiddenInput === projectTypeInput) validateField("projectType");
            if (hiddenInput === contactTimeInput) validateField("contactTime");
        });
    });

    const budgetInput = document.getElementById("budget");
    budgetInput.addEventListener("input", (e) => {
        document.getElementById("budgetValue").innerText = `₹${e.target.value}+`;
    });

    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("fileInput");
    const fileError = document.getElementById("fileError");
    const dropzoneText = document.getElementById("dropzoneText");

    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileValidation();
        }
    });

    fileInput.addEventListener("change", handleFileValidation);

    function handleFileValidation() {
        const file = fileInput.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            fileError.innerText = "File size must be less than 5MB.";
            dropzoneText.innerText = "Drag & Drop or Click to Upload";
            fileInput.value = "";
        } else if (file) {
            fileError.innerText = "";
            dropzoneText.innerText = `Selected: ${file.name}`;
        }
    }

    function handleFormSubmit() {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const projectType = document.getElementById("projectType").value;
        const description = document.getElementById("description").value;
        const budget = document.getElementById("budget").value;
        const deadline = document.getElementById("deadline").value;
        const hearAbout = document.getElementById("hearAbout").value;
        const contactTime = document.getElementById("contactTime").value;
        const additionalNotes = document.getElementById("additionalNotes").value;

        const message = [
            "*New Enquiry*",
            "",
            `*Name:* ${name}`,
            `*Email:* ${email}`,
            `*Phone:* +91 ${phone}`,
            `*Project Type:* ${projectType}`,
            description.trim() ? `*Description:* ${description.trim()}` : null,
            `*Budget:* ₹${budget}+`,
            deadline ? `*Deadline:* ${deadline}` : null,
            `*Heard By:* ${hearAbout}`,
            contactTime ? `*Contact Time:* ${contactTime}` : null,
            additionalNotes.trim() ? `*Special Request:* ${additionalNotes.trim()}` : null
        ].filter(Boolean).join("\n");

        const BOT_TOKEN = "9243295772:AAFh0CWNbaMEjG6dG_JvD-iHZ12fRN7ORRg";
        const CHAT_ID = "8452810767";

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        })
        .then(res => res.ok ? Promise.resolve() : Promise.reject(res.statusText))
        .then(() => {
            form.style.display = "none";
            document.querySelector(".progress-container").style.display = "none";
            document.getElementById("successMessage").innerText = `Thank you, ${name}. Your details have been sent to Telegram.`;
            document.getElementById("successScreen").style.display = "block";
        })
        .catch(err => {
            alert("Telegram send failed. Check BOT_TOKEN and CHAT_ID in script.");
            nextBtn.disabled = false;
            nextBtn.innerText = "Submit Enquiry";
        });
    }
});