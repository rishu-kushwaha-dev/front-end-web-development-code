// ===== Theme Management =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// ===== Cart Management =====
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = cartSidebar.querySelector('.cart-close');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <p>Your cart is empty</p>
                <a href="#menu" class="btn" onclick="closeCart()">Browse Menu</a>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            count += item.quantity;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.img}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} each</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-index="${index}" aria-label="Remove ${item.name} from cart">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    cartTotal.textContent = `₹${total}`;
    cartCount.textContent = count;
}

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    cartClose.focus();
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

cartItemsContainer.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (target) {
        const index = parseInt(target.dataset.index);
        const action = target.dataset.action;
        if (action === 'increase') {
            cart[index].quantity++;
        } else if (action === 'decrease') {
            cart[index].quantity--;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }
        saveCart();
    }

    const removeBtn = e.target.closest('.cart-item-remove');
    if (removeBtn) {
        const index = parseInt(removeBtn.dataset.index);
        cart.splice(index, 1);
        saveCart();
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        alert(`Order placed! Total: ${cartTotal.textContent}\nThank you for choosing Shree Ice-Cream Parlour!`);
        cart = [];
        saveCart();
        closeCart();
    }
});

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-card');
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);
        const img = card.dataset.img;

        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, img, quantity: 1 });
        }
        saveCart();
        openCart();

        // Animation feedback
        btn.textContent = 'Added!';
        btn.style.background = '#27ae60';
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.style.background = '';
        }, 1500);
    });
});

// ===== Carousel =====
const carouselTrack = document.getElementById('carousel-track');
const carouselSlides = carouselTrack.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dotsContainer = document.getElementById('carousel-dots');

let currentSlide = 0;
const slideCount = carouselSlides.length;

function createDots() {
    carouselSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.setAttribute('aria-selected', index === 0);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.carousel-dots button').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
        dot.setAttribute('aria-selected', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = (index + slideCount) % slideCount;
    updateCarousel();
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto-play carousel
let carouselInterval = setInterval(nextSlide, 5000);

carouselTrack.addEventListener('mouseenter', () => clearInterval(carouselInterval));
carouselTrack.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(nextSlide, 5000);
});

// Keyboard navigation for carousel
carouselTrack.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

createDots();

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('.reveal, section, .menu-card, .testimonial-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ===== Smooth Scroll & Navigation =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.textContent = isOpen ? '✕' : '☰';
});

hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            navLinks.classList.remove('active');
            hamburger.textContent = '☰';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

// ===== Contact Form Validation =====
const contactForm = document.getElementById('contact-form');
const formStatus = contactForm.querySelector('.form-status');

const validators = {
    name: (value) => value.trim().length >= 2 || 'Name must be at least 2 characters',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address',
    phone: (value) => !value || /^[\d\s\-+()]{10,}$/.test(value) || 'Please enter a valid phone number',
    message: (value) => value.trim().length >= 10 || 'Message must be at least 10 characters'
};

function showError(input, message) {
    input.classList.add('error');
    const errorEl = input.parentElement.querySelector('.error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }
}

function clearError(input) {
    input.classList.remove('error');
    const errorEl = input.parentElement.querySelector('.error-message');
    if (errorEl) {
        errorEl.classList.remove('visible');
    }
}

function validateField(input) {
    const validator = validators[input.name];
    if (validator) {
        const result = validator(input.value);
        if (result !== true) {
            showError(input, result);
            return false;
        }
    }
    clearError(input);
    return true;
}

contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validateField(input);
        }
    });
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        if (!validateField(input)) isValid = false;
    });

    if (!isValid) return;

    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    formStatus.hidden = false;
    formStatus.className = 'form-status success';
    formStatus.textContent = 'Message sent successfully! We\'ll get back to you soon.';
    contactForm.reset();

    setTimeout(() => {
        formStatus.hidden = true;
        formStatus.className = 'form-status';
    }, 5000);

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
});

// ===== Header Scroll Effect =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('header');

    if (currentScroll > 100) {
        header.style.boxShadow = 'var(--shadow)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }

    lastScroll = currentScroll;
});

// ===== Keyboard Navigation for Cart =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
        closeCart();
    }
});

// ===== Initialize =====
initTheme();
updateCartUI();

// Add reveal class to sections for animation
document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal');
});
revealElements.forEach(el => revealObserver.observe(el));