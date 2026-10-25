const inp = document.getElementById("inp");
const eyeBtn = document.getElementById("eyeBtn");
const eyeIcon = eyeBtn.querySelector("i");

const pStatus = document.getElementById("pStatus");
const range = document.querySelector(".rangeStatus");
const strengthIcon = document.querySelector("#strengthIcon i");

// Show Hide Password Logic
eyeBtn.addEventListener("click", () => {
    if (inp.type === "password") {
        inp.type = "text";
        eyeIcon.classList.replace("ri-eye-line", "ri-eye-off-line");
    } else {
        inp.type = "password";
        eyeIcon.classList.replace("ri-eye-off-line", "ri-eye-line");
    }
});

// Clear
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
    inp.value = "";
    inp.dispatchEvent(new Event("input"));
});

// Generator settings toggle
const settingsHeader = document.getElementById("settingsHeader");
const settingsBody = document.getElementById("settingsBody");
const settingsIcon = document.getElementById("settingsIcon");
settingsHeader.addEventListener("click", () => {
    settingsBody.classList.toggle("open");
    settingsIcon.classList.toggle("ri-arrow-up-s-line");
    settingsIcon.classList.toggle("ri-arrow-down-s-line");
});

// Length slider
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

// Common passwords list
const commonPasswords = new Set([
    "password", "123456", "12345678", "qwerty", "abc123", "monkey", "123456789",
    "letmein", "trustno1", "dragon", "baseball", "iloveyou", "master", "sunshine",
    "ashley", "bailey", "passw0rd", "shadow", "123123", "654321", "superman",
    "qazwsx", "michael", "football", "password1", "password123"
]);

function calcEntropy(value) {
    let pool = 0;
    if (/[a-z]/.test(value)) pool += 26;
    if (/[A-Z]/.test(value)) pool += 26;
    if (/[0-9]/.test(value)) pool += 10;
    if (/[^A-Za-z0-9]/.test(value)) pool += 32;
    if (pool === 0) return 0;
    return value.length * Math.log2(pool);
}

function formatCrackTime(seconds) {
    if (seconds < 1) return "Instant";
    const units = [
        { name: "years", val: 31536000 },
        { name: "days", val: 86400 },
        { name: "hours", val: 3600 },
        { name: "minutes", val: 60 },
        { name: "seconds", val: 1 }
    ];
    for (const u of units) {
        if (seconds >= u.val) {
            const n = Math.floor(seconds / u.val);
            return n + " " + u.name;
        }
    }
    return seconds.toFixed(2) + " seconds";
}

// Password check
inp.addEventListener("input", () => {
    const value = inp.value;

    let abc = /[a-z]/.test(value);
    let ABC = /[A-Z]/.test(value);
    let numChar = /[0-9]/.test(value);
    let special = /[^A-Za-z0-9]/.test(value);
    let inpLen = value.length >= 8;

    // Update Requirements Function
    updateRequirements("chars", inpLen);
    updateRequirements("AtoZ", ABC);
    updateRequirements("atoz", abc);
    updateRequirements("num", numChar);
    updateRequirements("speChar", special);

    // Calculate Strength
    const score = [inpLen, ABC, abc, numChar, special].filter(Boolean).length;

    updateStrength(score);

    // Entropy
    const entropy = calcEntropy(value);
    document.getElementById("entropyValue").textContent = entropy.toFixed(1) + " bits";
    document.getElementById("entropyTag").textContent = value.length + " chars";

    // Crack time (assume 1e9 guesses/sec)
    const guesses = Math.pow(2, entropy);
    const seconds = guesses / 1e9;
    document.getElementById("crackTime").textContent = value.length ? formatCrackTime(seconds) : "—";

    // Common password warning
    const warning = document.getElementById("commonWarning");
    if (value && commonPasswords.has(value.toLowerCase())) {
        warning.style.display = "flex";
    } else {
        warning.style.display = "none";
    }
});

// Requirements UI
function updateRequirements(id, valid) {
    const element = document.getElementById(id);

    if (valid) {
        element.classList.add("valid");
    } else {
        element.classList.remove("valid");
    }
}

// Strength UI
function updateStrength(score) {
    if (score <= 1) {
        pStatus.innerText = "Weak";
        pStatus.style.color = "#ef4444";

        range.style.width = "20%";
        range.style.background = "#ef4444";

        strengthIcon.className = "ri-shield-line";
        strengthIcon.parentElement.style.color = "#ef4444";
        strengthIcon.parentElement.style.background = "rgba(239, 68, 68, 0.1)";

    } else if (score <= 3) {
        pStatus.innerText = "Medium";
        pStatus.style.color = "#f59e0b";

        range.style.width = "65%";
        range.style.background = "#f59e0b";

        strengthIcon.className = "ri-shield-check-line";
        strengthIcon.parentElement.style.color = "#f59e0b";
        strengthIcon.parentElement.style.background = "rgba(245, 158, 11, 0.1)";

    } else {
        pStatus.innerText = "Strong";
        pStatus.style.color = "#22c55e";

        range.style.width = "100%";
        range.style.background = "#22c55e";

        strengthIcon.className = "ri-shield-check-fill";
        strengthIcon.parentElement.style.color = "#22c55e";
        strengthIcon.parentElement.style.background = "rgba(34, 197, 94, 0.1)";

    }
}

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

generateBtn.addEventListener("click", () => {
    const length = parseInt(lengthSlider.value, 10);
    let chars = "";
    if (document.getElementById("optUpper").checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (document.getElementById("optLower").checked) chars += "abcdefghijklmnopqrstuvwxyz";
    if (document.getElementById("optNum").checked) chars += "0123456789";
    if (document.getElementById("optSym").checked) chars += "@#$!%*?&";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    inp.value = password;
    inp.type = "text";
    eyeIcon.classList.replace("ri-eye-line", "ri-eye-off-line");
    inp.dispatchEvent(new Event("input"));
});

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(inp.value);
        copyBtn.innerHTML = '<i class="ri-check-line"></i> Copied';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="ri-clipboard-line"></i> Copy';
        }, 1500);
    } catch (e) { }
});