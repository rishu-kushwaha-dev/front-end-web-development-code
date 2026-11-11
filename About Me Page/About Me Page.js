const themeToggle = document.getElementById("theme-toggle");
const mobileToggle = document.getElementById("mobile-toggle");
const navLinks = document.getElementById("nav-links");
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const yearEl = document.getElementById("year");

const savedTheme = localStorage.getItem("theme");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && systemDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.querySelector(".theme-icon").textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        themeToggle.querySelector(".theme-icon").textContent = "🌙";
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.querySelector(".theme-icon").textContent = "☀️";
    }
});

mobileToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("open");
    if (isOpen) {
        navLinks.classList.remove("open");
        mobileToggle.classList.remove("open");
    } else {
        navLinks.classList.add("open");
        mobileToggle.classList.add("open");
    }
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        mobileToggle.classList.remove("open");
    });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    if (window.scrollY > 300) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const progress = entry.target.querySelector(".skill-progress");
            if (progress && progress.dataset.width) {
                progress.style.width = progress.dataset.width;
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(".skill-item").forEach((item) => {
    observer.observe(item);
});

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    formMessage.textContent = "";
    formMessage.className = "form-message";

    if (!name || !email) {
        formMessage.textContent = "Please fill in all required fields.";
        formMessage.classList.add("error");
        return;
    }

    const btn = contactForm.querySelector(".btn-submit");
    const originalText = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;

    setTimeout(() => {
        formMessage.textContent = "Thanks " + name + "! Your message has been sent.";
        formMessage.classList.add("success");
        contactForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        setTimeout(() => {
            formMessage.textContent = "";
            formMessage.className = "form-message";
        }, 5000);
    }, 1200);
});

yearEl.textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (targetId && targetId.length > 1) {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
});