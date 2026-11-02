const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result');
let expr = '';
let memory = 0;
const history = [];

function format(v) { return Number.isFinite(v) ? (Math.abs(v) < 1e15 ? String(+v.toFixed(10)).replace(/\.?0+$/, '') : v.toExponential(6)) : 'Error'; }

function update() {
    exprEl.textContent = expr.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
    try {
        const v = expr ? eval(expr) : '';
        resultEl.textContent = v === '' ? '0' : format(v);
    } catch {
        resultEl.textContent = '…';
    }
}

function applyFn(f) {
    const cur = parseFloat(expr || resultEl.textContent) || 0;
    let r;
    if (f === 'sqrt') r = Math.sqrt(cur);
    else if (f === 'sq') r = cur * cur;
    else if (f === 'recip') r = 1 / cur;
    else if (f === 'sin') r = Math.sin(cur);
    else if (f === 'cos') r = Math.cos(cur);
    else if (f === 'tan') r = Math.tan(cur);
    else if (f === 'log') r = Math.log10(cur);
    else if (f === 'ln') r = Math.log(cur);
    else if (f === 'mem+') { memory += cur; return; }
    else if (f === 'mem-') { memory -= cur; return; }
    else if (f === 'memr') { expr = String(memory); update(); return; }
    if (r !== undefined) { expr = String(r); update(); }
}

document.querySelectorAll('.key').forEach(k => {
    k.addEventListener('click', () => {
        const v = k.dataset.v;
        const a = k.dataset.a;
        const f = k.dataset.f;
        if (f) { applyFn(f); return; }
        if (a === 'clear') { expr = ''; }
        else if (a === 'sign') { if (expr) expr = expr.startsWith('-') ? expr.slice(1) : '-' + expr; }
        else if (a === 'percent') { if (expr) expr = String(parseFloat(expr) / 100); }
        else if (a === 'equals') {
            try { const r = eval(expr); history.unshift(expr + ' = ' + r); if (history.length > 10) history.pop(); expr = String(r); }
            catch { expr = 'Error'; }
        } else if (v) {
            if (v === 'pi') { if (expr === 'Error') expr = ''; expr += Math.PI; update(); return; }
            if (expr === 'Error') expr = '';
            const last = expr.slice(-1);
            if ('+-*/'.includes(v) && '+-*/'.includes(last)) expr = expr.slice(0, -1) + v;
            else expr += v;
        }
        update();
    });
});

document.querySelectorAll('.tbtn').forEach(b => {
    b.addEventListener('click', async () => {
        const a = b.dataset.a;
        if (a === 'copy') { await navigator.clipboard.writeText(resultEl.textContent); b.textContent = 'Copied!'; setTimeout(() => b.textContent = 'Copy', 1200); }
        if (a === 'history') { alert(history.length ? history.join('\n') : 'No history yet'); }
    });
});

document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') document.querySelector(`[data-v="${e.key}"]`)?.click();
    else if (e.key === '.') document.querySelector('[data-v="."]')?.click();
    else if (e.key === 'Enter') document.querySelector('[data-a="equals"]')?.click();
    else if (e.key === 'Backspace') { expr = expr.slice(0, -1); update(); }
    else if (e.key === 'Escape') document.querySelector('[data-a="clear"]')?.click();
    else if (['+', '-', '*', '/'].includes(e.key)) document.querySelector(`[data-v="${e.key}"]`)?.click();
});