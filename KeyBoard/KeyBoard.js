const output = document.getElementById('output');
const keyboard = document.getElementById('keyboard');

let shiftActive = false;
let capsLockActive = false;

const keyMap = {
    '`': { normal: '`', shift: '~' },
    '1': { normal: '1', shift: '!' },
    '2': { normal: '2', shift: '@' },
    '3': { normal: '3', shift: '#' },
    '4': { normal: '4', shift: '$' },
    '5': { normal: '5', shift: '%' },
    '6': { normal: '6', shift: '^' },
    '7': { normal: '7', shift: '&' },
    '8': { normal: '8', shift: '*' },
    '9': { normal: '9', shift: '(' },
    '0': { normal: '0', shift: ')' },
    '-': { normal: '-', shift: '_' },
    '=': { normal: '=', shift: '+' },
    '[': { normal: '[', shift: '{' },
    ']': { normal: ']', shift: '}' },
    '\\': { normal: '\\', shift: '|' },
    ';': { normal: ';', shift: ':' },
    "'": { normal: "'", shift: '"' },
    ',': { normal: ',', shift: '<' },
    '.': { normal: '.', shift: '>' },
    '/': { normal: '/', shift: '?' }
};

function getKeyChar(key) {
    if (keyMap[key]) {
        const useShift = shiftActive !== capsLockActive;
        return useShift ? keyMap[key].shift : keyMap[key].normal;
    }

    if (key.length === 1 && key.match(/[a-z]/i)) {
        const useShift = shiftActive !== capsLockActive;
        return useShift ? key.toUpperCase() : key.toLowerCase();
    }

    return key;
}

function insertText(text) {
    const start = output.selectionStart;
    const end = output.selectionEnd;
    const value = output.value;
    output.value = value.slice(0, start) + text + value.slice(end);
    output.selectionStart = output.selectionEnd = start + text.length;
    output.focus();
}

function handleBackspace() {
    const start = output.selectionStart;
    const end = output.selectionEnd;
    const value = output.value;

    if (start === end && start > 0) {
        output.value = value.slice(0, start - 1) + value.slice(end);
        output.selectionStart = output.selectionEnd = start - 1;
    } else if (start !== end) {
        output.value = value.slice(0, start) + value.slice(end);
        output.selectionStart = output.selectionEnd = start;
    }
    output.focus();
}

function handleKeyClick(key) {
    switch (key) {
        case 'backspace':
            handleBackspace();
            break;
        case 'tab':
            insertText('\t');
            break;
        case 'enter':
            insertText('\n');
            break;
        case 'shift':
            shiftActive = !shiftActive;
            updateModifierKeys();
            break;
        case 'capslock':
            capsLockActive = !capsLockActive;
            updateModifierKeys();
            break;
        case ' ':
            insertText(' ');
            break;
        case 'ctrl':
        case 'meta':
        case 'alt':
            break;
        default:
            insertText(getKeyChar(key));
            if (shiftActive && !capsLockActive) {
                shiftActive = false;
                updateModifierKeys();
            }
            break;
    }
}

function updateModifierKeys() {
    document.querySelectorAll('.key[data-key="shift"]').forEach(key => {
        key.classList.toggle('modifier-active', shiftActive);
    });
    document.querySelectorAll('.key[data-key="capslock"]').forEach(key => {
        key.classList.toggle('modifier-active', capsLockActive);
    });
}

keyboard.addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (key) {
        const keyValue = key.dataset.key;
        handleKeyClick(keyValue);
    }
});

output.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        insertText('\t');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        shiftActive = true;
        updateModifierKeys();
    }
    if (e.key === 'CapsLock') {
        capsLockActive = !capsLockActive;
        updateModifierKeys();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
        shiftActive = false;
        updateModifierKeys();
    }
});

output.focus();