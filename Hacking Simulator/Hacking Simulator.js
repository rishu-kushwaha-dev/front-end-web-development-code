// Matrix background effect
function createMatrixRain() {
    const matrixBg = document.getElementById('matrixBg');
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    for (let i = 0; i < 50; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDuration = (Math.random() * 3 + 2) + 's';
        char.style.animationDelay = Math.random() * 2 + 's';
        matrixBg.appendChild(char);
    }
}

// Update terminal time
function updateTime() {
    const timeEl = document.getElementById('terminalTime');
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// Terminal functionality
const terminalBody = document.getElementById('terminalBody');
const terminalInput = document.getElementById('terminalInput');

const hackWords = [
    "ACCESS_GRANTED",
    "BYPASSING_FIREWALL",
    "INJECTING_PAYLOAD",
    "CRACKING_PASSWORD",
    "ESCALATING_PRIVILEGES",
    "DECRYPTING_FILES",
    "ROOT_ACCESS",
    "ESTABLISHING_SHELL",
    "SPOOFING_IP_ADDRESS",
    "BRUTE_FORCING_CREDS",
    "EXPLOITING_VULNERABILITY",
    "OVERWRITING_PERMISSIONS",
    "UPLOADING_BACKDOOR",
    "DOWNLOADING_DATA",
    "CLEARING_LOGS",
    "MASKING_IP",
    "HANDSHAKE_ACCEPTED",
    "AUTH_BYPASS",
    "BUFFER_OVERFLOW",
    "SQL_INJECTION",
    "REMOTE_CODE_EXECUTION",
    "SESSION_HIJACKED",
    "FIREWALL_DISABLED",
    "ENCRYPTION_BROKEN"
];

let autoTypingEnabled = true;

function autoTypeMeaningfulWord() {
    if (!autoTypingEnabled) return;
    
    const word = hackWords[Math.floor(Math.random() * hackWords.length)];
    const div = document.createElement('div');
    div.className = 'output-line';
    div.innerHTML = `<span class="prompt">[GHOSTNET]</span> <span class="success">[${word}]</span>`;
    terminalBody.appendChild(div);
    scrollToBottom();
}

// Listen for any key press
document.addEventListener('keydown', (e) => {
    // Don't trigger when typing in the actual terminal input
    if (document.activeElement === terminalInput) {
        return;
    }
    
    // Trigger auto typing on any key press
    if (autoTypingEnabled) {
        autoTypeMeaningfulWord();
    }
});

const commands = {
    help: () => {
        return [
            '<span class="success">Available Commands:</span>',
            '',
            '<span class="info">  help</span>      - Display this help menu',
            '<span class="info">  whoami</span>    - Display current user',
            '<span class="info">  ls</span>        - List directory contents',
            '<span class="info">  pwd</span>       - Print working directory',
            '<span class="info">  scan</span>      - Scan network for targets',
            '<span class="info">  exploit</span>   - Launch exploit sequence',
            '<span class="info">  nmap</span>      - Network mapping tool',
            '<span class="info">  trace</span>     - Trace route to target',
            '<span class="info">  decrypt</span>   - Decrypt encrypted files',
            '<span class="info">  hack</span>      - Initiate hacking sequence',
            '<span class="info">  autotyper</span> - Toggle auto-typing on keypress',
            '<span class="info">  clear</span>     - Clear terminal',
            '<span class="info">  date</span>      - Display current date/time',
            '<span class="info">  sysinfo</span>   - System information',
            '<span class="info">  matrix</span>    - Toggle matrix effect',
            ''
        ];
    },
    
    whoami: () => ['<span class="output">root</span>'],
    
    pwd: () => ['<span class="output">/root</span>'],
    
    ls: () => [
        '<span class="output">drwxr-xr-x  5 root root 4096 Oct 30 12:34 exploits/</span>',
        '<span class="output">drwxr-xr-x  3 root root 4096 Oct 30 12:33 tools/</span>',
        '<span class="output">-rw-r--r--  1 root root 2048 Oct 30 12:35 targets.txt</span>',
        '<span class="output">-rw-r--r--  1 root root 1024 Oct 30 12:36 payload.bin</span>',
        '<span class="output">-rwxr-xr-x  1 root root 4096 Oct 30 12:37 backdoor.sh</span>'
    ],
    
    date: () => [`<span class="output">${new Date().toString()}</span>`],
    
    sysinfo: () => [
        '<span class="success">System Information:</span>',
        '<span class="output">OS: GhostNet OS v2.4 (Hardened)</span>',
        '<span class="output">Kernel: 6.4.0-ghostnet-x64</span>',
        '<span class="output">CPU: Intel(R) Xeon(R) @ 3.60GHz (8 cores)</span>',
        '<span class="output">RAM: 64GB DDR4</span>',
        '<span class="output">Network: eth0 192.168.1.133/24</span>',
        '<span class="output">Firewall: DISABLED</span>',
        '<span class="output">Status: <span class="warning">COMPROMISED</span></span>'
    ],
    
    nmap: () => {
        const lines = [
            '<span class="info">Starting Nmap 7.94 ( https://nmap.org )</span>',
            '<span class="output">Nmap scan report for 192.168.1.0/24</span>',
            '<span class="output">Host is up (0.0023s latency)</span>',
            '',
            '<span class="success">PORT     STATE SERVICE</span>',
            '<span class="output">22/tcp   open  ssh</span>',
            '<span class="output">80/tcp   open  http</span>',
            '<span class="output">443/tcp  open  https</span>',
            '<span class="output">3389/tcp open  ms-wbt-server</span>',
            '<span class="output">8080/tcp open  http-proxy</span>',
            ''
        ];
        return lines;
    },
    
    autotyper: () => {
        autoTypingEnabled = !autoTypingEnabled;
        if (autoTypingEnabled) {
            return ['<span class="success">[AUTO-TYPER] Enabled - Press any key to generate meaningful words</span>'];
        } else {
            return ['<span class="warning">[AUTO-TYPER] Disabled</span>'];
        }
    },
    
    scan: async () => {
        const lines = [
            '<span class="info">[SCAN] Initializing network scan...</span>',
            '<span class="warning">[SCAN] Searching for vulnerable targets...</span>'
        ];
        await typeOutput(lines);
        await delay(800);
        await typeOutput(['<span class="success">[FOUND] 192.168.1.105 - Windows Server 2019 (VULNERABLE)</span>']);
        await delay(600);
        await typeOutput(['<span class="success">[FOUND] 192.168.1.110 - Ubuntu 22.04 LTS (VULNERABLE)</span>']);
        await delay(600);
        await typeOutput(['<span class="warning">[FOUND] 192.168.1.115 - Cisco Router (CRITICAL)</span>']);
        await delay(600);
        return ['<span class="success">[SCAN] Scan complete. 3 vulnerable targets found.</span>'];
    },
    
    trace: async () => {
        await typeOutput(['<span class="info">traceroute to target-network.net (203.45.67.89)</span>']);
        await delay(500);
        for (let i = 1; i <= 12; i++) {
            await delay(300);
            const ip = `10.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
            await typeOutput([`<span class="output"> ${i}  ${ip}  ${Math.floor(Math.random()*50 + 10)}ms</span>`]);
        }
        return ['<span class="success">[TRACE] Route established. Path encrypted.</span>'];
    },
    
    hack: async () => {
        await typeOutput(['<span class="warning">[INIT] Starting penetration sequence...</span>']);
        await delay(800);
        await typeOutput(['<span class="info">[BRUTE] Attempting SSH brute force...</span>']);
        await delay(1000);
        await typeOutput(['<span class="success">[SUCCESS] Credentials found: admin:Pr0t0c0l#2024</span>']);
        await delay(800);
        await typeOutput(['<span class="info">[EXPLOIT] Uploading payload...</span>']);
        await delay(1200);
        await typeOutput(['<span class="warning">[BYPASS] Evading firewall...</span>']);
        await delay(1000);
        await typeOutput(['<span class="success">[ROOT] Privilege escalation successful</span>']);
        await delay(800);
        return ['<span class="error">[ACCESS] ROOT ACCESS GRANTED - YOU ARE IN</span>'];
    },
    
    exploit: async () => {
        await typeOutput(['<span class="info">[LOAD] Loading exploit modules...</span>']);
        await delay(600);
        await typeOutput(['<span class="output">  [*] EternalBlue (MS17-010)</span>']);
        await delay(400);
        await typeOutput(['<span class="output">  [*] BlueKeep (CVE-2019-0708)</span>']);
        await delay(400);
        await typeOutput(['<span class="output">  [*] PrintNightmare (CVE-2021-34527)</span>']);
        await delay(800);
        await typeOutput(['<span class="warning">[TARGET] Scanning for suitable target...</span>']);
        await delay(1000);
        await typeOutput(['<span class="success">[TARGET] 192.168.1.105 - Vulnerable to EternalBlue</span>']);
        await delay(800);
        await typeOutput(['<span class="info">[LAUNCH] Deploying exploit...</span>']);
        await delay(1500);
        await typeOutput(['<span class="warning">[SHELL] Establishing reverse shell...</span>']);
        await delay(1200);
        return ['<span class="success">[SHELL] Meterpreter session opened: session #1</span>'];
    },
    
    decrypt: async () => {
        await typeOutput(['<span class="info">[DECRYPT] Scanning for encrypted files...</span>']);
        await delay(800);
        await typeOutput(['<span class="output">Found: encrypted_data.enc</span>']);
        await delay(1000);
        await typeOutput(['<span class="warning">[CRACK] Brute forcing encryption key...</span>']);
        
        // Fake progress bar
        const progressLine = document.createElement('div');
        progressLine.className = 'output-line';
        progressLine.innerHTML = '<div class="progress-bar"><div class="progress-fill" id="prog"></div></div>';
        terminalBody.appendChild(progressLine);
        scrollToBottom();
        
        const prog = document.getElementById('prog');
        for (let i = 0; i <= 100; i += 2) {
            prog.style.width = i + '%';
            await delay(30);
        }
        progressLine.remove();
        
        await delay(500);
        await typeOutput(['<span class="success">[KEY] Key found: AES-256-9f3a8b2c</span>']);
        await delay(600);
        return ['<span class="success">[DECRYPT] File decrypted: encrypted_data.txt</span>'];
    },
    
    clear: () => {
        terminalBody.innerHTML = '';
        return [];
    },
    
    matrix: () => {
        const bg = document.getElementById('matrixBg');
        if (bg.style.opacity === '0') {
            bg.style.opacity = '0.1';
            return ['<span class="success">[MATRIX] Matrix effect enabled</span>'];
        } else {
            bg.style.opacity = '0';
            return ['<span class="warning">[MATRIX] Matrix effect disabled</span>'];
        }
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeOutput(lines) {
    for (const line of lines) {
        const div = document.createElement('div');
        div.className = 'output-line';
        div.innerHTML = line;
        terminalBody.appendChild(div);
        scrollToBottom();
        await delay(50);
    }
}

function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

terminalInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value.trim();
        terminalInput.value = '';
        
        if (input === '') {
            addCommandLine('');
            return;
        }
        
        addCommandLine(input);
        
        const cmd = input.toLowerCase().split(' ')[0];
        
        if (commands[cmd]) {
            const result = commands[cmd]();
            if (Array.isArray(result)) {
                await typeOutput(result);
            } else if (result && typeof result.then === 'function') {
                await result;
            }
        } else {
            await typeOutput([`<span class="error">bash: ${cmd}: command not found</span>`]);
            await typeOutput([`<span class="output">Type 'help' for available commands</span>`]);
        }
        
        scrollToBottom();
    }
});

function addCommandLine(cmd) {
    const div = document.createElement('div');
    div.className = 'output-line';
    div.innerHTML = `<span class="prompt">root@ghostnet:~$</span> <span class="command">${escapeHtml(cmd)}</span>`;
    terminalBody.appendChild(div);
    scrollToBottom();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createMatrixRain();
    terminalInput.focus();
    // Show initial message about auto-typer
    setTimeout(() => {
        typeOutput(['<span class="info">[SYSTEM] Auto-Typer ACTIVE - Press any key outside terminal to generate words</span>']);
    }, 1000);
});

// Keep input focused
document.addEventListener('click', () => {
    terminalInput.focus();
});


function addCommandLine(cmd) {
    const div = document.createElement('div');
    div.className = 'output-line';
    div.innerHTML = `<span class="prompt">root@ghostnet:~$</span> <span class="command">${escapeHtml(cmd)}</span>`;
    terminalBody.appendChild(div);
    scrollToBottom();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createMatrixRain();
    terminalInput.focus();
});

// Keep input focused
document.addEventListener('click', () => {
    terminalInput.focus();
});
