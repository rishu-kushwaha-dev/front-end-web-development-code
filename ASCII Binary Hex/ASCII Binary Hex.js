let currentMode = 'text-to-code';

function setMode(mode) {
    currentMode = mode;

    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Show/hide modes
    document.getElementById('textToCodeMode').style.display = mode === 'text-to-code' ? 'block' : 'none';
    document.getElementById('codeToTextMode').style.display = mode === 'code-to-text' ? 'block' : 'none';

    // Clear outputs when switching modes
    if (mode === 'code-to-text') {
        document.getElementById('textOutput').value = '';
    }
}

function updateCharCount() {
    const textInput = document.getElementById('textInput').value;
    const count = textInput.length;
    document.getElementById('charCount').textContent = count === 1 ? '1 character' : count + ' characters';
}

function convertText() {
    updateCharCount();
    const textInput = document.getElementById('textInput').value;

    if (textInput === '') {
        document.getElementById('asciiOutput').value = '';
        document.getElementById('binaryOutput').value = '';
        document.getElementById('hexOutput').value = '';
        return;
    }

    let asciiOutput = '';
    let binaryOutput = '';
    let hexOutput = '';

    for (let i = 0; i < textInput.length; i++) {
        const char = textInput[i];
        const charCode = char.charCodeAt(0);

        // ASCII
        asciiOutput += charCode + ' ';

        // Binary (8-bit)
        binaryOutput += charCode.toString(2).padStart(8, '0') + ' ';

        // Hexadecimal
        hexOutput += charCode.toString(16).toUpperCase().padStart(2, '0') + ' ';
    }

    document.getElementById('asciiOutput').value = asciiOutput.trim();
    document.getElementById('binaryOutput').value = binaryOutput.trim();
    document.getElementById('hexOutput').value = hexOutput.trim();
}

function updateCodeHint() {
    const codeType = document.getElementById('codeType').value;
    const hint = document.getElementById('codeHint');

    if (codeType === 'ascii') {
        hint.textContent = 'Enter space or comma separated ASCII decimal values (e.g., 72, 101, 108, 108, 111)';
    } else if (codeType === 'binary') {
        hint.textContent = 'Enter space or comma separated 8-bit binary strings (e.g., 01001000 01100101)';
    } else if (codeType === 'hex') {
        hint.textContent = 'Enter space or comma separated hex values (e.g., 48 65 6C 6C 6F or 48656C6C6F)';
    }
}

function convertFromCode() {
    updateCodeHint();
    const codeInput = document.getElementById('codeInput').value.trim();
    const codeType = document.getElementById('codeType').value;
    const output = document.getElementById('textOutput');

    if (codeInput === '') {
        output.value = '';
        return;
    }

    try {
        // Split by whitespace or commas
        const tokens = codeInput.split(/[\s,]+/).filter(t => t !== '');
        let result = '';

        if (codeType === 'ascii') {
            for (let i = 0; i < tokens.length; i++) {
                const code = parseInt(tokens[i]);
                if (isNaN(code) || code < 0 || code > 1114111) {
                    throw new Error('Invalid ASCII code');
                }
                result += String.fromCharCode(code);
            }
        } else if (codeType === 'binary') {
            for (let i = 0; i < tokens.length; i++) {
                let bin = tokens[i].replace(/[^01]/g, '');
                if (bin === '') throw new Error('Invalid binary');
                // Handle both 8-bit groups and concatenated
                if (bin.length % 8 === 0 && bin.length > 8) {
                    // Split into 8-bit chunks
                    for (let j = 0; j < bin.length; j += 8) {
                        const chunk = bin.substr(j, 8);
                        result += String.fromCharCode(parseInt(chunk, 2));
                    }
                } else {
                    // Pad to 8 bits if needed
                    if (bin.length < 8) bin = bin.padStart(8, '0');
                    result += String.fromCharCode(parseInt(bin, 2));
                }
            }
        } else if (codeType === 'hex') {
            for (let i = 0; i < tokens.length; i++) {
                let hex = tokens[i].replace(/[^0-9A-Fa-f]/g, '');
                if (hex === '') throw new Error('Invalid hex');
                // Handle concatenated hex
                if (hex.length % 2 === 0 && hex.length > 2 && tokens.length === 1) {
                    for (let j = 0; j < hex.length; j += 2) {
                        const chunk = hex.substr(j, 2);
                        result += String.fromCharCode(parseInt(chunk, 16));
                    }
                } else {
                    if (hex.length === 1) hex = '0' + hex;
                    result += String.fromCharCode(parseInt(hex, 16));
                }
            }
        }

        output.value = result;
    } catch (e) {
        output.value = 'Error: Invalid input format';
    }
}

function copyToClipboard(elementId, button) {
    const textarea = document.getElementById(elementId);
    const text = textarea.value;

    if (text === '') {
        showToast('Nothing to copy');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied';
        button.classList.add('copied');

        showToast('Copied to clipboard!');

        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        // Fallback for older browsers
        textarea.select();
        document.execCommand('copy');
        showToast('Copied to clipboard!');
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function clearAll() {
    document.getElementById('textInput').value = '';
    document.getElementById('asciiOutput').value = '';
    document.getElementById('binaryOutput').value = '';
    document.getElementById('hexOutput').value = '';
    document.getElementById('codeInput').value = '';
    document.getElementById('textOutput').value = '';
    document.getElementById('charCount').textContent = '0 characters';
    updateCodeHint();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCharCount();
    updateCodeHint();
});
