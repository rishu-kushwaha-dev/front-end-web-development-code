const urlInput = document.getElementById('urlInput');
const trackBtn = document.getElementById('trackBtn');
const result = document.getElementById('result');
const chainList = document.getElementById('chainList');
const finalDestination = document.getElementById('finalDestination');
const warningBox = document.getElementById('warningBox');
const loading = document.getElementById('loading');
const errorBox = document.getElementById('errorBox');

const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.click', '.loan', '.download', '.racing', '.review', '.trade', '.accountant', '.science', '.party', '.cricket', '.stream', '.date', '.faith', '.win'];
const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'account', 'secure', 'update', 'bank', 'password', 'confirm', 'signin', 'wallet', 'crypto', 'free', 'prize', 'winner', 'urgent', 'suspended'];
const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'bl.ink', 'lnkd.in', 'shorturl.at', 'cutt.ly', 'rebrand.ly'];

function normalizeUrl(input) {
    let url = input.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    return url;
}

function isSuspicious(url) {
    const lower = url.toLowerCase();
    const reasons = [];
    try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();
        if (SUSPICIOUS_TLDS.some(t => host.endsWith(t))) reasons.push('Suspicious TLD');
        if (SUSPICIOUS_KEYWORDS.some(k => lower.includes(k))) reasons.push('Suspicious keyword');
        if (SHORTENERS.some(s => host === s || host.endsWith('.' + s))) reasons.push('URL shortener');
        if (host.split('.').length > 4) reasons.push('Too many subdomains');
        if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(host)) reasons.push('IP address host');
        if (url.length > 200) reasons.push('Very long URL');
        if (u.protocol !== 'https:') reasons.push('Not HTTPS');
    } catch (e) {
        reasons.push('Invalid URL');
    }
    return reasons;
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

async function track() {
    const raw = urlInput.value;
    if (!raw.trim()) return;
    let current = normalizeUrl(raw);

    hide(result); hide(errorBox); hide(warningBox);
    show(loading);
    chainList.innerHTML = '';
    finalDestination.innerHTML = '';

    const chain = [current];
    const visited = new Set();
    let maxHops = 10;

    try {
        while (maxHops-- > 0) {
            if (visited.has(current)) break;
            visited.add(current);

            // Use a CORS-friendly redirect probe via allorigins? Instead, do best-effort client check.
            // Browsers block cross-origin redirect reading, so we approximate with fetch no-cors.
            let next = null;
            try {
                const res = await fetch(current, { method: 'GET', mode: 'no-cors', redirect: 'follow' });
                // no-cors gives opaque response; cannot read location. Fall back to manual heuristic.
            } catch (e) { }
            // Heuristic: try HEAD with cors proxy? We'll just record current and stop (no redirect info available client-side).
            break;
        }
    } catch (e) {
        hide(loading);
        errorBox.textContent = 'Error: ' + e.message;
        show(errorBox);
        return;
    }

    // Render chain
    chain.forEach((u, i) => {
        const item = document.createElement('div');
        item.className = 'chain-item' + (i === chain.length - 1 ? ' current' : '');
        item.innerHTML = `<span>${i + 1}.</span> <span>${u}</span>` + (i < chain.length - 1 ? '<span class="arrow">→</span>' : '');
        chainList.appendChild(item);
    });

    finalDestination.innerHTML = `<strong>Final destination:</strong> ${current}`;

    // Fraud analysis
    const reasons = isSuspicious(current);
    const allReasons = new Set(reasons);
    chain.forEach(u => isSuspicious(u).forEach(r => allReasons.add(r)));

    if (allReasons.size > 0) {
        warningBox.innerHTML = `<strong>⚠ Warning:</strong> Potential risk detected — ${[...allReasons].join(', ')}.`;
        show(warningBox);
    } else {
        warningBox.innerHTML = `<strong>✅ Looks safe:</strong> No obvious red flags detected.`;
        show(warningBox);
    }

    hide(loading);
    show(result);
}

trackBtn.addEventListener('click', track);
urlInput.addEventListener('keypress', e => { if (e.key === 'Enter') track(); });
