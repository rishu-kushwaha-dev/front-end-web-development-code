// Matrix background effect
function createMatrixRain() {
    const matrixBg = document.getElementById('matrixBg');
    const chars = '01ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';

    for (let i = 0; i < 70; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDuration = (Math.random() * 3.5 + 1.8) + 's';
        char.style.animationDelay = Math.random() * 4 + 's';
        matrixBg.appendChild(char);
    }
}

// Update terminal time
function updateTime() {
    const timeEl = document.getElementById('terminalTime');
    const now = new Date();
    timeEl.textContent = now.toLocaleString();
}
setInterval(updateTime, 1000);
updateTime();

// Quick command runner
function runQuickCommand(cmd) {
    const terminalInput = document.getElementById('terminalInput');
    terminalInput.value = cmd;
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    terminalInput.dispatchEvent(event);
}

// Terminal functionality
const terminalBody = document.getElementById('terminalBody');
const terminalInput = document.getElementById('terminalInput');

const hackWords = [
    "ACCESS_GRANTED", "BYPASSING_FIREWALL", "INJECTING_PAYLOAD", "CRACKING_PASSWORD",
    "ESCALATING_PRIVILEGES", "DECRYPTING_FILES", "ROOT_ACCESS", "ESTABLISHING_SHELL",
    "SPOOFING_IP_ADDRESS", "BRUTE_FORCING_CREDS", "EXPLOITING_VULNERABILITY",
    "OVERWRITING_PERMISSIONS", "UPLOADING_BACKDOOR", "DOWNLOADING_DATA",
    "CLEARING_LOGS", "MASKING_IP", "HANDSHAKE_ACCEPTED", "AUTH_BYPASS",
    "BUFFER_OVERFLOW", "SQL_INJECTION", "REMOTE_CODE_EXECUTION", "SESSION_HIJACKED",
    "FIREWALL_DISABLED", "ENCRYPTION_BROKEN", "BRUTE_FORCE_SUCCESS", "PAYLOAD_DELIVERED",
    "BACKDOOR_INSTALLED", "SYSTEM_COMPROMISED", "TRACE_ERASED", "TUNNEL_ESTABLISHED",
    "KERNEL_EXPLOIT", "PRIVILEGE_ESCALATION", "DATA_EXFILTRATED", "CREDENTIALS_DUMPED",
    "ADMIN_ACCESS", "DOMAIN_CONTROLLER", "PTH_ATTACK", "GOLDEN_TICKET", "DCSYNC"
];

let autoTypingEnabled = true;

function autoTypeMeaningfulWord() {
    if (!autoTypingEnabled) return;

    const word = hackWords[Math.floor(Math.random() * hackWords.length)];
    const div = document.createElement('div');
    div.className = 'output-line';
    div.innerHTML = `<span class="prompt">[GHOSTNET]</span> <span class="success">[${word}]</span> <span class="output">...</span>`;
    terminalBody.appendChild(div);
    scrollToBottom();
}

// Trigger on ANY key press
document.addEventListener('keydown', function (e) {
    if (document.activeElement === terminalInput && e.key === 'Enter') {
        return;
    }
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'CapsLock' || e.key === 'Tab') {
        return;
    }
    autoTypeMeaningfulWord();
});

const fileSystem = {
    '/': ['home', 'root', 'etc', 'var', 'usr', 'bin'],
    '/root': ['operations', 'tools', 'exploits', 'payloads', 'wordlists', '.ssh', 'scripts'],
    '/root/operations': ['ghostfall', 'darktrace', 'blackout', 'logs'],
    '/root/operations/ghostfall': ['mission.txt', 'targets.json', 'scan_results.txt', 'loot', 'report.txt'],
    '/root/operations/ghostfall/loot': ['database.sql', 'credentials.txt', 'classified.zip', 'users.db'],
    '/root/tools': ['nmap', 'metasploit', 'hydra', 'sqlmap', 'john', 'hashcat', 'mimikatz', 'bloodhound'],
    '/root/exploits': ['eternalblue.py', 'bluekeep.c', 'heartbleed.rb', 'zerologon.py'],
    '/root/wordlists': ['rockyou.txt', 'common.txt', 'top5000.txt'],
    '/root/scripts': ['autopwn.sh', 'persist.ps1', 'enum.bat'],
    '/etc': ['hosts', 'passwd', 'shadow', 'network'],
    '/var/log': ['auth.log', 'syslog', 'access.log']
};

let currentDir = '/root/operations/ghostfall';

const commands = {
    help: () => {
        return [
            '<span class="success">=== GHOSTNET COMMAND REFERENCE - ALL ENABLED ===</span>',
            '',
            '<span class="info">[NAVIGATION]</span>',
            '<span class="info">  ls [dir]</span>      - List directory contents',
            '<span class="info">  cd [dir]</span>      - Change directory',
            '<span class="info">  pwd</span>           - Print working directory',
            '<span class="info">  cat [file]</span>    - Display file contents',
            '<span class="info">  find [name]</span>   - Find files',
            '',
            '<span class="info">[RECONNAISSANCE]</span>',
            '<span class="info">  whoami</span>        - Current user',
            '<span class="info">  id</span>            - User identity',
            '<span class="info">  sysinfo</span>       - System information',
            '<span class="info">  nmap [target]</span>  - Port scanner',
            '<span class="info">  netstat</span>       - Network connections',
            '<span class="info">  ifconfig</span>      - Network interfaces',
            '<span class="info">  ping [host]</span>   - Test connectivity',
            '<span class="info">  route</span>         - Routing table',
            '<span class="info">  arp</span>           - ARP table',
            '',
            '<span class="info">[EXPLOITATION]</span>',
            '<span class="info">  scan</span>          - Network vulnerability scan',
            '<span class="info">  exploit</span>       - Launch exploit framework',
            '<span class="info">  brute</span>         - Brute force attacks',
            '<span class="info">  sqlmap</span>        - SQL injection tool',
            '<span class="info">  metasploit</span>    - Metasploit framework',
            '<span class="info">  zerologon</span>     - Zerologon exploit',
            '<span class="info">  smbexec</span>       - SMB exploitation',
            '',
            '<span class="info">[POST-EXPLOIT]</span>',
            '<span class="info">  hashcrack</span>     - Crack password hashes',
            '<span class="info">  decrypt</span>       - Decrypt encrypted files',
            '<span class="info">  mimikatz</span>      - Credential dumping',
            '<span class="info">  exfiltrate</span>    - Exfiltrate data',
            '<span class="info">  backdoor</span>      - Install backdoor',
            '<span class="info">  persist</span>       - Establish persistence',
            '<span class="info">  clearlogs</span>     - Clear system logs',
            '<span class="info">  wipe</span>          - Secure wipe traces',
            '',
            '<span class="info">[UTILITY]</span>',
            '<span class="info">  mission</span>       - View current mission',
            '<span class="info">  tools</span>         - List available tools',
            '<span class="info">  date</span>          - Current date/time',
            '<span class="info">  clear</span>         - Clear terminal',
            '<span class="info">  autotyper</span>     - Toggle auto-typer',
            '<span class="info">  matrix</span>        - Toggle matrix effect',
            ''
        ];
    },

    mission: () => [
        '<span class="success">=== ACTIVE MISSION ===</span>',
        '<span class="info">OPERATION: GHOSTFALL</span>',
        '<span class="output">Status: IN_PROGRESS</span>',
        '<span class="output">Target: SecureCorp Industries (203.45.67.89)</span>',
        '<span class="output">Objective: Gain root access and exfiltrate database</span>',
        '<span class="warning">Progress: [=======>   ] 65%</span>',
        '<span class="output">Steps Completed: Reconnaissance, Port Scanning, Exploitation</span>',
        '<span class="output">Next: Post-Exploitation & Data Exfiltration</span>',
        ''
    ],

    tools: () => [
        '<span class="success">=== AVAILABLE TOOLS ===</span>',
        '<span class="info">[SCANNING]</span> nmap, masscan, zmap',
        '<span class="info">[EXPLOIT]</span> metasploit, exploit-db, searchsploit',
        '<span class="info">[CRACKING]</span> hydra, john, hashcat, aircrack-ng',
        '<span class="info">[WEB]</span> sqlmap, burpsuite, nikto',
        '<span class="info">[POST]</span> mimikatz, bloodhound, powersploit',
        '<span class="info">[PRIVESC]</span> winpeas, linpeas, seatbelt',
        ''
    ],

    whoami: () => ['<span class="output">root (uid=0 gid=0)</span>'],
    id: () => ['<span class="output">uid=0(root) gid=0(root) groups=0(root)</span>'],

    pwd: () => [`<span class="output">${currentDir}</span>`],

    date: () => [`<span class="output">${new Date().toString()}</span>`],

    route: () => [
        '<span class="success">Kernel IP routing table</span>',
        '<span class="output">Destination     Gateway         Genmask         Flags Metric Ref    Use Iface</span>',
        '<span class="output">default         10.8.0.1        0.0.0.0         UG    0      0        0 tun0</span>',
        '<span class="output">10.8.0.0        0.0.0.0         255.255.255.0   U     0      0        0 tun0</span>',
        '<span class="output">192.168.1.0     0.0.0.0         255.255.255.0   U     0      0        0 eth0</span>',
        ''
    ],

    arp: () => [
        '<span class="success">ARP table</span>',
        '<span class="output">Address         HWtype  HWaddress           Flags Mask            Iface</span>',
        '<span class="output">10.8.0.1        ether   00:11:22:33:44:55   C                     tun0</span>',
        '<span class="output">192.168.1.1     ether   aa:bb:cc:dd:ee:ff   C                     eth0</span>',
        '<span class="output">203.45.67.89    ether   11:22:33:44:55:66   C                     tun0</span>',
        ''
    ],

    sysinfo: () => [
        '<span class="success">=== SYSTEM INFORMATION ===</span>',
        '<span class="output">OS: GHOSTNET OS v3.7 (Hardened Pentest Distro)</span>',
        '<span class="output">Kernel: 6.6.0-ghostnet-amd64</span>',
        '<span class="output">Hostname: ghostnet-node-07</span>',
        '<span class="output">CPU: AMD Ryzen 9 7950X (16 cores)</span>',
        '<span class="output">RAM: 128GB DDR5</span>',
        '<span class="output">GPU: NVIDIA RTX 4090 (8GB)</span>',
        '<span class="output">Network: tun0 10.8.0.133/24 (TOR)</span>',
        '<span class="output">Firewall: BYPASSED</span>',
        '<span class="output">IDS/IPS: EVADING</span>',
        '<span class="output">AV: DISABLED</span>',
        '<span class="output">Status: <span class="error">OPERATIONAL - UNDETECTED</span></span>',
        ''
    ],

    ls: (args) => {
        const dir = args[1] ? args[1] : currentDir;
        let path = dir;
        if (!dir.startsWith('/')) {
            path = currentDir === '/' ? '/' + dir : currentDir + '/' + dir;
        }
        if (fileSystem[path]) {
            return fileSystem[path].map(f => {
                if (fileSystem[path + '/' + f] || ['operations', 'tools', 'exploits', 'payloads', 'wordlists', 'logs', 'loot', 'scripts', '.ssh'].includes(f)) {
                    return `<span class="info">drwxr-xr-x  root root 4096 Oct 30 ${f}/</span>`;
                }
                if (f.endsWith('.py') || f.endsWith('.sh') || f.endsWith('.rb') || f.endsWith('.c') || f.endsWith('.ps1') || f.endsWith('.bat')) {
                    return `<span class="success">-rwxr-xr-x  root root 4096 Oct 30 ${f}</span>`;
                }
                if (f.endsWith('.txt') || f.endsWith('.json') || f.endsWith('.sql') || f.endsWith('.log') || f.endsWith('.db') || f.endsWith('.zip')) {
                    return `<span class="output">-rw-r--r--  root root 2048 Oct 30 ${f}</span>`;
                }
                return `<span class="warning">-rwx------  root root 1024 Oct 30 ${f}</span>`;
            });
        }
        return [`<span class="error">ls: cannot access '${dir}': No such file or directory</span>`];
    },

    cd: (args) => {
        if (!args[1] || args[1] === '~') {
            currentDir = '/root/operations/ghostfall';
            return [];
        }
        if (args[1] === '..') {
            const parts = currentDir.split('/').filter(p => p);
            if (parts.length > 0) parts.pop();
            currentDir = parts.length === 0 ? '/' : '/' + parts.join('/');
            return [];
        }
        if (args[1] === '/') {
            currentDir = '/';
            return [];
        }
        if (args[1].startsWith('/')) {
            if (fileSystem[args[1]]) {
                currentDir = args[1];
                return [];
            }
        } else {
            const newPath = currentDir === '/' ? '/' + args[1] : currentDir + '/' + args[1];
            if (fileSystem[newPath]) {
                currentDir = newPath;
                return [];
            }
        }
        return [`<span class="error">cd: ${args[1]}: No such file or directory</span>`];
    },

    find: (args) => {
        if (!args[1]) return [`<span class="error">find: missing argument</span>`];
        return [
            `<span class="output">/root/operations/ghostfall/loot/database.sql</span>`,
            `<span class="output">/root/exploits/eternalblue.py</span>`,
            `<span class="output">/root/tools/mimikatz</span>`,
            ''
        ];
    },

    cat: (args) => {
        if (!args[1]) return [`<span class="error">cat: missing file operand</span>`];
        if (args[1] === 'mission.txt') {
            return [
                '<span class="info">=== OPERATION GHOSTFALL ===</span>',
                '<span class="output">Target: Corporate Mainframe - SecureCorp Industries</span>',
                '<span class="output">Objective: Gain root access and exfiltrate database</span>',
                '<span class="output">Priority: HIGH | Clearance: LEVEL-5</span>',
                '<span class="warning">Authorization: VALID</span>',
                ''
            ];
        }
        if (args[1] === '/etc/hosts') {
            return [
                '<span class="output">127.0.0.1 localhost</span>',
                '<span class="output">203.45.67.89 target.securecorp.local</span>',
                '<span class="output">10.8.0.1 ghostnet-gateway</span>',
                ''
            ];
        }
        if (args[1] === 'targets.json') {
            return [
                '<span class="output">{</span>',
                '<span class="output">  "primary": {"ip": "203.45.67.89", "status": "compromised"},</span>',
                '<span class="output">  "secondary": {"ip": "192.168.1.105", "status": "accessible"}</span>',
                '<span class="output">}</span>',
                ''
            ];
        }
        return [`<span class="error">cat: ${args[1]}: Permission denied or file not found</span>`];
    },

    ifconfig: () => [
        '<span class="success">tun0:</span> <span class="output">flags=4305&lt;UP,POINTOPOINT,RUNNING,NOARP,MULTICAST&gt; mtu 1500</span>',
        '<span class="output">        inet 10.8.0.133 netmask 255.255.255.0 destination 10.8.0.1</span>',
        '<span class="output">        UP POINTOPOINT RUNNING NOARP MULTICAST MTU:1500</span>',
        '<span class="success">eth0:</span> <span class="output">flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt; mtu 1500</span>',
        '<span class="output">        inet 192.168.1.133 netmask 255.255.255.0 broadcast 192.168.1.255</span>',
        '<span class="output">        ether 00:1a:2b:3c:4d:5e</span>',
        ''
    ],

    netstat: () => [
        '<span class="success">Active Internet connections</span>',
        '<span class="output">Proto Recv-Q Send-Q Local Address           Foreign Address         State</span>',
        '<span class="output">tcp   0      0   10.8.0.133:4444        203.45.67.89:49158    ESTABLISHED</span>',
        '<span class="output">tcp   0      0   10.8.0.133:8080        185.220.101.45:9001   ESTABLISHED</span>',
        '<span class="output">tcp   0      0   127.0.0.1:9050         0.0.0.0:*             LISTEN</span>',
        '<span class="output">tcp   0      0   10.8.0.133:31337       185.220.101.45:443    ESTABLISHED</span>',
        ''
    ],

    ping: async (args) => {
        if (!args[1]) return [`<span class="error">ping: usage error: Destination address required</span>`];
        await typeOutput([`<span class="output">PING ${args[1]} (${args[1]}) 56(84) bytes of data.</span>`]);
        for (let i = 0; i < 4; i++) {
            await delay(600);
            await typeOutput([`<span class="output">64 bytes from ${args[1]}: icmp_seq=${i + 1} ttl=64 time=${(Math.random() * 20 + 10).toFixed(1)} ms</span>`]);
        }
        return [`<span class="output">--- ${args[1]} ping statistics ---</span>`, `<span class="output">4 packets transmitted, 4 received, 0% packet loss</span>`, ''];
    },

    nmap: async (args) => {
        const target = args[1] || '203.45.67.89';
        await typeOutput([`<span class="info">Starting Nmap 7.94 at ${new Date().toLocaleTimeString()}</span>`]);
        await delay(500);
        await typeOutput([`<span class="output">Nmap scan report for ${target}</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">Host is up (0.015s latency).</span>`]);
        await delay(600);
        await typeOutput([`<span class="success">PORT     STATE SERVICE       VERSION</span>`]);
        await delay(400);
        await typeOutput([`<span class="output">80/tcp   open  http          Microsoft IIS httpd 10.0</span>`]);
        await delay(400);
        await typeOutput([`<span class="output">443/tcp  open  https         Microsoft IIS httpd 10.0</span>`]);
        await delay(400);
        await typeOutput([`<span class="warning">445/tcp  open  microsoft-ds  Windows Server 2022</span>`]);
        await delay(400);
        await typeOutput([`<span class="warning">3389/tcp open  ms-wbt-server Microsoft Terminal Services</span>`]);
        await delay(400);
        await typeOutput([`<span class="error">1433/tcp open  ms-sql-s      Microsoft SQL Server 2019</span>`]);
        await delay(800);
        return [`<span class="success">Nmap done: 1 IP address (1 host up) scanned</span>`, `<span class="warning">[VULNERABLE] Potential exploits detected</span>`, ''];
    },

    scan: async () => {
        await typeOutput([`<span class="info">[RECON] Starting comprehensive vulnerability scan...</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[SCANNING] Port 445 - SMB Service</span>`]);
        await delay(700);
        await typeOutput([`<span class="warning">[VULN] MS17-010 EternalBlue - CRITICAL (CVSS 9.3)</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[SCANNING] Port 3389 - RDP</span>`]);
        await delay(700);
        await typeOutput([`<span class="warning">[VULN] BlueKeep - HIGH (CVSS 8.5)</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[SCANNING] Port 1433 - MSSQL</span>`]);
        await delay(700);
        await typeOutput([`<span class="error">[VULN] Weak Authentication - CRITICAL (CVSS 9.8)</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[SCANNING] Port 80/443 - Web Apps</span>`]);
        await delay(700);
        await typeOutput([`<span class="warning">[VULN] SQL Injection - HIGH (CVSS 8.1)</span>`]);
        await delay(800);
        return [`<span class="success">[SCAN COMPLETE] 4 Critical/High vulnerabilities found</span>`, `<span class="warning">Use 'exploit' or 'sqlmap' to attempt exploitation</span>`, ''];
    },

    exploit: async () => {
        await typeOutput([`<span class="info">[FRAMEWORK] Initializing Metasploit Framework v6.3...</span>`]);
        await delay(1000);
        await typeOutput([`<span class="success">[LOADED] 2347 exploit modules</span>`]);
        await delay(600);
        await typeOutput([`<span class="success">[LOADED] 1123 auxiliary modules</span>`]);
        await delay(600);
        await typeOutput([`<span class="info">[SELECTING] Finding best exploit for target...</span>`]);
        await delay(1000);
        await typeOutput([`<span class="warning">[SELECTED] exploit/windows/smb/ms17_010_eternalblue</span>`]);
        await delay(800);
        await typeOutput([`<span class="info">[CONFIG] Setting RHOSTS=203.45.67.89</span>`]);
        await delay(600);
        await typeOutput([`<span class="info">[EXPLOIT] Launching exploit...</span>`]);
        await delay(1500);
        await typeOutput([`<span class="success">[EXPLOIT] Exploit completed successfully</span>`]);
        await delay(800);
        await typeOutput([`<span class="success">[SESSION] Meterpreter session 1 opened (10.8.0.133:4444 -> 203.45.67.89:49158)</span>`]);
        await delay(1000);
        return [`<span class="error">[ROOT ACCESS] SYSTEM COMPROMISED - NT AUTHORITY\\SYSTEM</span>`, ''];
    },

    brute: async () => {
        await typeOutput([`<span class="info">[HYDRA] Starting brute force attack...</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[TARGET] 203.45.67.89:3389 (RDP)</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[WORDLIST] Using /root/wordlists/rockyou.txt</span>`]);
        await delay(1000);
        for (let i = 0; i < 8; i++) {
            await delay(400);
            const user = ['admin', 'administrator', 'user'][Math.floor(Math.random() * 3)];
            await typeOutput([`<span class="output">[ATTEMPT] ${user}:password${i} - <span class="error">FAILED</span></span>`]);
        }
        await delay(600);
        await typeOutput([`<span class="output">[ATTEMPT] Administrator:Summer2023! - <span class="success">SUCCESS</span></span>`]);
        await delay(800);
        return [`<span class="success">[CRACKED] Credentials found: Administrator / Summer2023!</span>`, `<span class="warning">[ACCESS] RDP access granted</span>`, ''];
    },

    sqlmap: async () => {
        await typeOutput([`<span class="info">[SQLMAP] Starting SQL injection testing...</span>`]);
        await delay(1000);
        await typeOutput([`<span class="output">[URL] http://target.securecorp.local/login.php?id=1</span>`]);
        await delay(800);
        await typeOutput([`<span class="warning">[DETECTED] MySQL >= 5.0.12</span>`]);
        await delay(800);
        await typeOutput([`<span class="success">[VULNERABLE] Parameter 'id' is injectable</span>`]);
        await delay(1000);
        await typeOutput([`<span class="info">[DUMP] Extracting database names...</span>`]);
        await delay(1200);
        await typeOutput([`<span class="output">[DATABASE] securecorp_db</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[DATABASE] information_schema</span>`]);
        await delay(800);
        await typeOutput([`<span class="info">[DUMP] Extracting tables...</span>`]);
        await delay(1200);
        await typeOutput([`<span class="output">[TABLE] users, customers, transactions, admin, payroll</span>`]);
        await delay(1000);
        return [`<span class="success">[SQLMAP] Database dumped successfully - 450000 records</span>`, `<span class="warning">[DATA] Sensitive customer data retrieved</span>`, ''];
    },

    zerologon: async () => {
        await typeOutput([`<span class="info">[CVE-2020-1472] Zerologon exploit starting...</span>`]);
        await delay(1000);
        await typeOutput([`<span class="output">[TARGET] Domain Controller 203.45.67.89</span>`]);
        await delay(800);
        await typeOutput([`<span class="warning">[ATTACK] Setting machine account password to empty</span>`]);
        await delay(1200);
        await typeOutput([`<span class="success">[SUCCESS] Domain admin privileges obtained</span>`]);
        await delay(1000);
        return [`<span class="error">[DOMAIN] DOMAIN CONTROLLER COMPROMISED</span>`, `<span class="success">[ACCESS] Domain Admin access granted</span>`, ''];
    },

    smbexec: async () => {
        await typeOutput([`<span class="info">[SMBEXEC] Executing via SMB...</span>`]);
        await delay(1000);
        await typeOutput([`<span class="output">[AUTH] Using harvested credentials</span>`]);
        await delay(800);
        await typeOutput([`<span class="success">[SHELL] SYSTEM shell obtained</span>`]);
        await delay(800);
        return [`<span class="error">[ROOT] C:\\Windows\\System32> - SYSTEM SHELL</span>`, ''];
    },

    metasploit: async () => {
        await typeOutput([`<span class="info">msf6 ></span> <span class="output">use exploit/windows/smb/ms17_010_eternalblue</span>`]);
        await delay(600);
        await typeOutput([`<span class="info">msf6 exploit(windows/smb/ms17_010_eternalblue) ></span> <span class="output">set RHOSTS 203.45.67.89</span>`]);
        await delay(600);
        await typeOutput([`<span class="info">msf6 exploit(windows/smb/ms17_010_eternalblue) ></span> <span class="output">exploit</span>`]);
        await delay(1500);
        await typeOutput([`<span class="success">[*] Meterpreter session 2 opened</span>`]);
        await delay(800);
        return [`<span class="error">[*] You are now in meterpreter shell as NT AUTHORITY\\SYSTEM</span>`, ''];
    },

    mimikatz: async () => {
        await typeOutput([`<span class="info">[MIMIKATZ] Loading mimikatz...</span>`]);
        await delay(1000);
        await typeOutput([`<span class="output">mimikatz # privilege::debug</span>`]);
        await delay(600);
        await typeOutput([`<span class="success">Privilege '20' OK</span>`]);
        await delay(600);
        await typeOutput([`<span class="output">mimikatz # sekurlsa::logonpasswords</span>`]);
        await delay(1200);
        await typeOutput([`<span class="success">Authentication Id : 0 ; 999999</span>`]);
        await delay(400);
        await typeOutput([`<span class="warning">Domain : SECURECORP</span>`]);
        await delay(400);
        await typeOutput([`<span class="warning">User : Administrator</span>`]);
        await delay(400);
        await typeOutput([`<span class="success">Password : P@ssw0rd123!</span>`]);
        await delay(800);
        return [`<span class="success">[MIMIKATZ] Credentials dumped successfully</span>`, `<span class="warning">[CREDS] Domain Admin credentials obtained</span>`, ''];
    },

    hashcrack: async () => {
        await typeOutput([`<span class="info">[HASHCAT] Starting hash cracking...</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[HASH] $2y$10$XOPbrlUPQdwdJUpSrIF6X.O6ElxEUpolwHSUkjYAmcs9tWoQuDydi</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[TYPE] bcrypt</span>`]);
        await delay(800);
        await typeOutput([`<span class="info">[WORDLIST] rockyou.txt | [RULES] best64.rule</span>`]);
        await delay(1000);
        const progressLine = document.createElement('div');
        progressLine.className = 'output-line';
        progressLine.innerHTML = '<div class="progress-bar"><div class="progress-fill" id="hashprog"></div></div>';
        terminalBody.appendChild(progressLine);
        scrollToBottom();
        const prog = document.getElementById('hashprog');
        for (let i = 0; i <= 100; i += 5) {
            prog.style.width = i + '%';
            await delay(70);
        }
        progressLine.remove();
        await delay(600);
        await typeOutput([`<span class="success">[CRACKED] Password: Password123!</span>`]);
        await delay(800);
        return [`<span class="success">[HASHCAT] 1 hash cracked in 8.2 seconds</span>`, ''];
    },

    decrypt: async () => {
        await typeOutput([`<span class="info">[GPG] Decrypting encrypted files...</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[FILE] loot/database_backup.sql.gpg</span>`]);
        await delay(1000);
        await typeOutput([`<span class="warning">[CRACK] Attempting to brute force passphrase...</span>`]);
        await delay(1200);
        await typeOutput([`<span class="success">[KEY] Passphrase found: ghostfall2023</span>`]);
        await delay(800);
        await typeOutput([`<span class="info">[DECRYPT] Decrypting with AES-256...</span>`]);
        await delay(1000);
        return [`<span class="success">[DECRYPTED] database_backup.sql (2.4 GB)</span>`, `<span class="warning">[DATA] Contains 450000 customer records</span>`, ''];
    },

    exfiltrate: async () => {
        await typeOutput([`<span class="info">[EXFIL] Starting data exfiltration...</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[DEST] Uploading to C2 server: 185.220.101.45:443</span>`]);
        await delay(1000);
        await typeOutput([`<span class="output">[FILE] database.sql (2.4 GB) + credentials.txt</span>`]);
        await delay(800);
        const progressLine = document.createElement('div');
        progressLine.className = 'output-line';
        progressLine.innerHTML = '<div class="progress-bar"><div class="progress-fill" id="exfilprog"></div></div>';
        terminalBody.appendChild(progressLine);
        scrollToBottom();
        const prog = document.getElementById('exfilprog');
        for (let i = 0; i <= 100; i += 3) {
            prog.style.width = i + '%';
            await delay(50);
        }
        progressLine.remove();
        await delay(800);
        await typeOutput([`<span class="success">[EXFIL] Transfer complete - 2.7 GB uploaded</span>`]);
        await delay(600);
        return [`<span class="error">[MISSION] DATA EXFILTRATED SUCCESSFULLY</span>`, `<span class="success">[STATUS] OPERATION GHOSTFALL - 95% COMPLETE</span>`, ''];
    },

    backdoor: async () => {
        await typeOutput([`<span class="info">[BACKDOOR] Installing persistent backdoor...</span>`]);
        await delay(1000);
        await typeOutput([`<span class="output">[COPY] Deploying to C:\\Windows\\System32\\mshelper.exe</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[REGISTRY] Adding to startup keys</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[FIREWALL] Creating exception rule</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[SERVICE] Creating Windows service: UpdateHelper</span>`]);
        await delay(1000);
        return [`<span class="success">[BACKDOOR] Installed successfully</span>`, `<span class="warning">[PERSISTENCE] Survives reboots - Auto-reconnect enabled</span>`, ''];
    },

    persist: async () => {
        await typeOutput([`<span class="info">[PERSIST] Establishing multiple persistence mechanisms...</span>`]);
        await delay(1000);
        await typeOutput([`<span class="output">[1] Scheduled Task - GhostTask</span>`]);
        await delay(600);
        await typeOutput([`<span class="output">[2] WMI Event Subscription</span>`]);
        await delay(600);
        await typeOutput([`<span class="output">[3] Registry Run Keys</span>`]);
        await delay(600);
        await typeOutput([`<span class="output">[4] Service Creation</span>`]);
        await delay(800);
        return [`<span class="success">[PERSIST] 4 persistence mechanisms installed</span>`, `<span class="warning">[REDUNDANCY] Multiple fallback methods active</span>`, ''];
    },

    clearlogs: async () => {
        await typeOutput([`<span class="info">[LOGS] Clearing system logs...</span>`]);
        await delay(800);
        await typeOutput([`<span class="output">[CLEAR] Clearing Security Event Log</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[CLEAR] Clearing System Event Log</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[CLEAR] Clearing Application Event Log</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[CLEAR] Clearing bash history</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[CLEAR] Wiping auth logs</span>`]);
        await delay(800);
        return [`<span class="success">[LOGS] All traces wiped</span>`, `<span class="warning">[TRACE] Forensic evidence removed</span>`, ''];
    },

    wipe: async () => {
        await typeOutput([`<span class="info">[WIPE] Securely wiping attack traces...</span>`]);
        await delay(1000);
        await typeOutput([`<span class="output">[WIPE] Shredding temporary files</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[WIPE] Clearing process history</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[WIPE] Removing session artifacts</span>`]);
        await delay(700);
        await typeOutput([`<span class="output">[WIPE] Overwriting memory dumps</span>`]);
        await delay(800);
        return [`<span class="success">[WIPE] All traces securely erased</span>`, `<span class="error">[OPSEC] Maximum OPSEC maintained</span>`, ''];
    },

    autotyper: () => {
        autoTypingEnabled = !autoTypingEnabled;
        if (autoTypingEnabled) {
            return ['<span class="success">[AUTO-TYPER] ENABLED - Press ANY key to generate words</span>'];
        } else {
            return ['<span class="warning">[AUTO-TYPER] DISABLED</span>'];
        }
    },

    clear: () => {
        terminalBody.innerHTML = '';
        return [];
    },

    matrix: () => {
        const bg = document.getElementById('matrixBg');
        if (bg.style.opacity === '0') {
            bg.style.opacity = '0.08';
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
        await delay(35);
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

        const args = input.split(/\s+/);
        const cmd = args[0].toLowerCase();

        if (commands[cmd]) {
            const result = commands[cmd](args);
            if (Array.isArray(result)) {
                await typeOutput(result);
            } else if (result && typeof result.then === 'function') {
                await result;
            }
        } else {
            await typeOutput([`<span class="error">bash: ${cmd}: command not found</span>`]);
            await typeOutput([`<span class="output">Type 'help' for all available commands</span>`]);
        }

        scrollToBottom();
    }
});

function addCommandLine(cmd) {
    const div = document.createElement('div');
    div.className = 'output-line';
    div.innerHTML = `<span class="prompt">root@ghostnet:~/operations/ghostfall$</span> <span class="command">${escapeHtml(cmd)}</span>`;
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
    setTimeout(() => {
        typeOutput(['<span class="info">[SYSTEM] Auto-Typer ACTIVE - Press ANY key anywhere to generate words</span>']);
        typeOutput(['<span class="warning">[WARNING] This is a simulation for educational purposes only</span>']);
        typeOutput(['<span class="success">[READY] All systems online - Type \'help\' for commands</span>']);
    }, 1500);
});

// Keep input focused
document.addEventListener('click', () => {
    terminalInput.focus();
});
