const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
    links.classList.toggle('active');
    toggle.setAttribute('aria-expanded', links.classList.contains('active'));
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        links.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    });
});

const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = 'Message Sent!';
        btn.style.background = '#48bb78';
        form.reset();
        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
            btn.style.background = '';
        }, 2000);
    }, 1000);
});

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 40) {
        nav.style.padding = '0.75rem 2rem';
        nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
    } else {
        nav.style.padding = '1.25rem 2rem';
        nav.style.boxShadow = 'none';
    }
});