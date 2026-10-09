const CONFIG = {
    matrixChars: 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF@#$%&*',
    matrixFontSize: 14,
    matrixSpeed: 50,
    bootDelay: 30,
    typingSpeed: 20,
    scanInterval: 5000
};

// ============================================
// MATRIX RAIN EFFECT
// ============================================
class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.columns = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Array(Math.floor(this.canvas.width / CONFIG.matrixFontSize)).fill(1);
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = CONFIG.matrixFontSize + 'px monospace';

        for (let i = 0; i < this.columns.length; i++) {
            const char = CONFIG.matrixChars[Math.floor(Math.random() * CONFIG.matrixChars.length)];
            const x = i * CONFIG.matrixFontSize;
            const y = this.columns[i] * CONFIG.matrixFontSize;
            this.ctx.fillText(char, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.columns[i] = 0;
            }
            this.columns[i]++;
        }
    }

    start() {
        setInterval(() => this.draw(), CONFIG.matrixSpeed);
    }
}

// ============================================
// BOOT SEQUENCE
// ============================================
class BootSequence {
    constructor(onComplete) {
        this.bootText = document.getElementById('bootText');
        this.lines = [
            'CYBER_TERMINAL BIOS v3.7.1',
            'Memory Test: 640K OK',
            'Extended Memory: 1048576K OK',
            'Detecting hardware...',
            'Initializing neural interface...',
            'Loading encryption modules...',
            'Bypassing Security Protocols...',
            'Establishing secure connection...',
            '',
            '████████████████████████████████████████ 100%',
            '',
            'ACCESS GRANTED',
            'Welcome, Rishu the Great Hacker.',
            '',
            'Initializing terminal...'
        ];
        this.currentLine = 0;
        this.onComplete = onComplete;
    }

    start() {
        this.typeLine();
    }

    typeLine() {
        if (this.currentLine < this.lines.length) {
            const line = document.createElement('div');
            this.bootText.appendChild(line);

            let charIndex = 0;
            const text = this.lines[this.currentLine];

            const typeChar = () => {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(typeChar, CONFIG.bootDelay);
                } else {
                    this.currentLine++;
                    setTimeout(() => this.typeLine(), 100);
                }
            };

            typeChar();
        } else {
            setTimeout(() => this.onComplete(), 800);
        }
    }
}

// ============================================
// TERMINAL COMMAND SYSTEM
// ============================================
class Terminal {
    constructor() {
        this.output = document.getElementById('terminalOutput');
        this.input = document.getElementById('commandInput');
        this.commands = {};
        this.setupCommands();
        this.setupEventListeners();
    }

    setupCommands() {
        this.commands = {
            'help': () => this.showHelp(),
            'clear': () => this.clear(),
            'scan': () => this.scanNetwork(),
            'crack': (args) => this.crackPassword(args),
            'inject': () => this.injectPayload(),
            'trace': () => this.traceRoute(),
            'decrypt': () => this.decryptFiles(),
            'exploit': (args) => this.exploitVulnerability(args),
            'status': () => this.showStatus(),
            'whoami': () => this.print('root@cyberdeck', 'text-cyan'),
            'date': () => this.print(new Date().toString(), 'text-green'),
            'neofetch': () => this.showNeofetch(),
            'matrix': () => this.toggleMatrix(),
            'hack': () => this.startHackSimulation(),
            'exit': () => this.print('Nice try. There is no escape.', 'text-red')
        };
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim();
                this.executeCommand(command);
                this.input.value = '';
            }
        });

        document.addEventListener('click', () => {
            if (!document.getElementById('mainTerminal').classList.contains('hidden')) {
                this.input.focus();
            }
        });
    }

    executeCommand(cmd) {
        const [command, ...args] = cmd.toLowerCase().split(' ');
        const argString = args.join(' ');

        this.print(`<span class="prompt">root@cyberdeck:~#</span> ${cmd}`, '');

        if (this.commands[command]) {
            setTimeout(() => {
                this.commands[command](argString);
            }, 200);
        } else if (cmd) {
            this.print(`Command not found: ${command}. Type 'help' for available commands.`, 'text-red');
        }
    }

    print(text, className = 'text-green') {
        const line = document.createElement('div');
        line.className = className;
        line.innerHTML = text;
        this.output.appendChild(line);
        this.scrollToBottom();
    }

    scrollToBottom() {
        const body = document.getElementById('terminalBody');
        body.scrollTop = body.scrollHeight;
    }

    clear() {
        this.output.innerHTML = '';
    }

    showHelp() {
        const helpText = `
╔══════════════════════════════════════════╗
║       AVAILABLE COMMANDS                 ║
╠══════════════════════════════════════════╣
║  help          - Show this menu          ║
║  clear         - Clear terminal          ║
║  scan          - Scan network targets    ║
║  crack <ip>    - Crack password          ║
║  inject        - Inject payload          ║
║  trace         - Trace route             ║
║  decrypt       - Decrypt files           ║
║  exploit <ip>  - Exploit vulnerability   ║
║  status        - System status           ║
║  neofetch      - System info             ║
║  hack          - Start hack simulation   ║
║  matrix        - Toggle matrix rain      ║
╚══════════════════════════════════════════╝`;
        this.print(helpText);
    }

    showNeofetch() {
        const info = `
<span class="text-cyan">       ___       </span>  <span class="text-yellow">root@cyberdeck</span>
<span class="text-cyan">      /   \\      </span>  <span class="text-green">──────────────</span>
<span class="text-cyan">     /     \\     </span>  <span class="text-green">OS:</span> CyberOS 3.7.1
<span class="text-cyan">    /       \\    </span>  <span class="text-green">Host:</span> CyberDeck X1
<span class="text-cyan">   /  /\\   /\\   </span>  <span class="text-green">Kernel:</span> 5.15.0-hack
<span class="text-cyan">  /  /  \\ /  \\  </span>  <span class="text-green">Shell:</span> cyber-shell
<span class="text-cyan"> /__/    V    \\ </span>  <span class="text-green">CPU:</span> Quantum Core i9
<span class="text-cyan">                </span>  <span class="text-green">GPU:</span> RTX 4090
                         <span class="text-green">RAM:</span> 32GB
                         <span class="text-green">Theme:</span> Green Phosphor`;
        this.print(info);
    }

    scanNetwork() {
        this.print('<span class="text-yellow">Initiating network scan...</span>');
        setTimeout(() => this.print('Scanning subnet 192.168.1.0/24...'), 500);
        setTimeout(() => this.print('Found 14 active hosts'), 1200);
        setTimeout(() => this.print('192.168.1.1  - Gateway [SECURED]'), 1600);
        setTimeout(() => this.print('192.168.1.105 - Target Alpha [VULNERABLE]'), 1900);
        setTimeout(() => this.print('192.168.1.110 - Target Beta [VULNERABLE]'), 2200);
        setTimeout(() => this.print('10.0.0.42    - Server Node [OPEN PORTS: 22, 80, 443]'), 2500);
        setTimeout(() => this.print('<span class="text-green">Scan complete. 2 vulnerable targets identified.</span>'), 3000);
    }

    crackPassword(ip) {
        if (!ip) {
            this.print('Usage: crack <target-ip>', 'text-red');
            return;
        }
        this.print(`<span class="text-yellow">Initiating password crack on ${ip}...</span>`);
        setTimeout(() => this.print('Loading dictionary: /usr/share/wordlists/rockyou.txt'), 400);
        setTimeout(() => this.print('Brute-force mode activated'), 800);
        setTimeout(() => this.print('Testing: admin123...'), 1200);
        setTimeout(() => this.print('Testing: password...'), 1600);
        setTimeout(() => this.print('Testing: 123456...'), 2000);
        setTimeout(() => this.print('<span class="text-red">SUCCESS! Password found: admin@cyber#2024</span>'), 2600);
        setTimeout(() => this.print('<span class="text-green">Credentials saved to /root/.credentials</span>'), 3000);
    }

    injectPayload() {
        this.print('<span class="text-yellow">Preparing payload injection...</span>');
        setTimeout(() => this.print('Payload: shell_reverse_tcp.exe'), 400);
        setTimeout(() => this.print('Encoding payload with XOR cipher...'), 800);
        setTimeout(() => this.print('Injecting into target process...'), 1200);
        setTimeout(() => this.print('<span class="text-green">Payload injected successfully!</span>'), 1600);
        setTimeout(() => this.print('<span class="text-cyan">Reverse shell established on port 4444</span>'), 2000);
    }

    traceRoute() {
        this.print('<span class="text-yellow">Tracing route to target...</span>');
        const hops = [
            '192.168.1.1  (1ms)',
            '10.0.0.1     (3ms)',
            '172.16.0.1   (7ms)',
            '203.0.113.1  (15ms)',
            '198.51.100.1 (23ms)',
            'Target       (31ms)'
        ];
        hops.forEach((hop, i) => {
            setTimeout(() => this.print(hop), (i + 1) * 400);
        });
    }

    decryptFiles() {
        this.print('<span class="text-yellow">Scanning for encrypted files...</span>');
        setTimeout(() => this.print('Found 47 encrypted files'), 600);
        setTimeout(() => this.print('Applying AES-256 decryption...'), 1000);
        setTimeout(() => this.print('Decrypting file_001.enc...'), 1400);
        setTimeout(() => this.print('Decrypting file_002.enc...'), 1800);
        setTimeout(() => this.print('<span class="text-green">All files decrypted successfully</span>'), 2400);
    }

    exploitVulnerability(ip) {
        if (!ip) {
            this.print('Usage: exploit <target-ip>', 'text-red');
            return;
        }
        this.print(`<span class="text-yellow">Scanning ${ip} for vulnerabilities...</span>`);
        setTimeout(() => this.print('CVE-2024-1234 detected: Buffer Overflow'), 800);
        setTimeout(() => this.print('CVE-2024-5678 detected: SQL Injection'), 1200);
        setTimeout(() => this.print('Exploiting CVE-2024-1234...'), 1600);
        setTimeout(() => this.print('<span class="text-red">ACCESS GRANTED</span>'), 2200);
        setTimeout(() => this.print('<span class="text-green">Root shell obtained on ' + ip + '</span>'), 2600);
    }

    showStatus() {
        this.print('═══════════════════════════════════');
        this.print('  SYSTEM STATUS: OPERATIONAL');
        this.print('  UPTIME: 99.97%');
        this.print('  CONNECTION: SECURE');
        this.print('  ENCRYPTION: AES-256-GCM');
        this.print('  PROXY: ACTIVE (7 NODES)');
        this.print('═══════════════════════════════════');
    }

    toggleMatrix() {
        const canvas = document.getElementById('matrixCanvas');
        canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
        this.print(canvas.style.display === 'none' ? 'Matrix rain disabled' : 'Matrix rain enabled');
    }

    startHackSimulation() {
        this.print('<span class="text-red">⚠ WARNING: UNAUTHORIZED HACKING DETECTED ⚠</span>');
        setTimeout(() => this.print('Initiating full system penetration...'), 300);
        setTimeout(() => this.print('[1/5] Bypassing firewall...'), 800);
        setTimeout(() => this.print('[2/5] Cracking encryption...'), 1600);
        setTimeout(() => this.print('[3/5] Injecting malware...'), 2400);
        setTimeout(() => this.print('[4/5] Extracting data...'), 3200);
        setTimeout(() => this.print('[5/5] Covering tracks...'), 4000);
        setTimeout(() => {
            this.print('<span class="text-red">████████████████████████████████████████</span>');
            this.print('<span class="text-red">█ SYSTEM COMPROMISED - FULL ACCESS GRANTED █</span>');
            this.print('<span class="text-red">████████████████████████████████████████</span>');
            document.body.classList.add('glitch');
            setTimeout(() => document.body.classList.remove('glitch'), 500);
        }, 4800);
    }
}

// ============================================
// SYSTEM MONITOR
// ============================================
class SystemMonitor {
    constructor() {
        this.bars = {
            cpu: document.getElementById('cpuBar'),
            ram: document.getElementById('ramBar'),
            net: document.getElementById('netBar'),
            fw: document.getElementById('fwBar')
        };
        this.values = {
            cpu: document.getElementById('cpuVal'),
            ram: document.getElementById('ramVal'),
            net: document.getElementById('netVal'),
            fw: document.getElementById('fwVal')
        };
    }

    update() {
        Object.keys(this.bars).forEach(key => {
            const val = Math.floor(Math.random() * 60) + 20;
            this.bars[key].style.width = val + '%';
            this.values[key].textContent = val + '%';
        });
    }

    start() {
        setInterval(() => this.update(), 2000);
    }
}

// ============================================
// LOG STREAM
// ============================================
class LogStream {
    constructor() {
        this.logStream = document.getElementById('logStream');
        this.messages = [
            'Packet captured from 192.168.1.105',
            'Firewall rule #4521 bypassed',
            'SSH handshake initiated',
            'TLS 1.3 certificate validated',
            'Memory dump: 0x7FFF4A2B',
            'Brute-force attempt detected and logged',
            'Proxy chain established: 7 nodes',
            'Encryption key exchanged: AES-256',
            'Database query executed: SELECT * FROM users',
            'File access: /etc/passwd',
            'Network packet forwarded',
            'DNS resolution: target.com → 203.0.113.5',
            'Cookie intercepted: session_id=abc123',
            'SQL injection payload sent',
            'Buffer overflow attempt blocked',
            'Rootkit installed: /dev/shm/.hidden'
        ];
    }

    addLog() {
        const msg = this.messages[Math.floor(Math.random() * this.messages.length)];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        const line = document.createElement('div');
        line.innerHTML = `<span style="color: #006600">[${time}]</span> ${msg}`;
        this.logStream.appendChild(line);
        this.logStream.scrollTop = this.logStream.scrollHeight;

        if (this.logStream.children.length > 50) {
            this.logStream.removeChild(this.logStream.firstChild);
        }
    }

    start() {
        setInterval(() => this.addLog(), 1500);
    }
}

// ============================================
// NETWORK MAP ANIMATION
// ============================================
class NetworkMap {
    constructor() {
        this.svg = document.getElementById('mapSvg');
        this.nodes = document.querySelectorAll('.map-node');
        this.connections = [
            { from: 0, to: 1 },
            { from: 0, to: 2 },
            { from: 0, to: 3 },
            { from: 1, to: 2 }
        ];
        this.drawConnections();
    }

    drawConnections() {
        const svgRect = this.svg.getBoundingClientRect();
        this.svg.setAttribute('viewBox', `0 0 ${svgRect.width} ${svgRect.height}`);

        this.connections.forEach((conn, i) => {
            const from = this.nodes[conn.from].getBoundingClientRect();
            const to = this.nodes[conn.to].getBoundingClientRect();
            const svgRect = this.svg.getBoundingClientRect();

            const x1 = from.left + from.width / 2 - svgRect.left;
            const y1 = from.top + from.height / 2 - svgRect.top;
            const x2 = to.left + to.width / 2 - svgRect.left;
            const y2 = to.top + to.height / 2 - svgRect.top;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#003b00');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '5,5');
            this.svg.appendChild(line);
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const matrix = new MatrixRain('matrixCanvas');
    matrix.start();

    const bootComplete = () => {
        document.getElementById('bootScreen').classList.add('hidden');
        document.getElementById('mainTerminal').classList.remove('hidden');
        document.getElementById('sidePanel').classList.remove('hidden');

        const terminal = new Terminal();
        terminal.print('<span class="text-cyan">╔══════════════════════════════════════════╗</span>');
        terminal.print('<span class="text-cyan">║</span>  WELCOME TO CYBER TERMINAL v3.7.1      <span class="text-cyan">║</span>');
        terminal.print('<span class="text-cyan">║</span>  Type <span class="text-yellow">"help"</span> for commands              <span class="text-cyan">║</span>');
        terminal.print('<span class="text-cyan">╚══════════════════════════════════════════╝</span>');
        terminal.print('');
        terminal.print('<span class="text-yellow">⚠ AUTHORIZED ACCESS ONLY ⚠</span>');
        terminal.print('');

        const monitor = new SystemMonitor();
        monitor.start();

        const logs = new LogStream();
        logs.start();

        setTimeout(() => {
            new NetworkMap();
        }, 100);
    };

    const boot = new BootSequence(bootComplete);
    setTimeout(() => boot.start(), 500);
});