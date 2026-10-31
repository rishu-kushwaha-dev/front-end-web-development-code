document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you! We will contact you soon.');
    this.reset();
});
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});
document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
});
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
    topBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
topBtn.style.display = 'none';
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('oName').value;
    const phone = document.getElementById('oPhone').value;
    const addr = document.getElementById('oAddr').value;
    const plan = document.getElementById('oPlan').value;
    const qty = document.getElementById('oQty').value;
    const msg = 'New Order:%0AName: ' + name + '%0APhone: ' + phone + '%0AAddress: ' + addr + '%0APlan: ' + plan + '%0AQty: ' + qty;
    window.open('https://wa.me/919569614016?text=' + msg, '_blank');
});
