/* ============================================
   Shree Hotel & Restaurant — Restaurant Website
   Interactivity & UX enhancements
   ============================================ */
(function () {
    "use strict";

    /* ---------- Helpers ---------- */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ---------- Mobile navigation ---------- */
    const navToggle = $("#navToggle");
    const navLinks = $("#navLinks");

    const closeNav = () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.classList.toggle("open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    $$(".nav-link, .nav-cta", navLinks).forEach((link) =>
        link.addEventListener("click", closeNav)
    );

    document.addEventListener("click", (e) => {
        if (
            navLinks.classList.contains("open") &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)
        ) {
            closeNav();
        }
    });

    /* ---------- Navbar scroll state ---------- */
    const navbar = $("#navbar");
    const backToTop = $("#backToTop");

    const onScroll = () => {
        const y = window.scrollY;
        navbar.classList.toggle("scrolled", y > 30);
        backToTop.classList.toggle("show", y > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------- Active nav link on scroll ---------- */
    const sections = $$("main section[id]");
    const navAnchors = $$(".nav-link");

    const spy = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navAnchors.forEach((a) =>
                        a.classList.toggle("active", a.getAttribute("href") === "#" + id)
                    );
                }
            });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));

    /* ---------- Reveal on scroll ---------- */
    const revealEls = $$(".reveal");
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const revealObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        revealEls.forEach((el, i) => {
            el.style.transitionDelay = (i % 4) * 0.08 + "s";
            revealObserver.observe(el);
        });
    } else {
        revealEls.forEach((el) => el.classList.add("visible"));
    }

    const filterBtns = $$(".filter-btn");
    const menuCards = $$(".menu-card");

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;

            menuCards.forEach((card) => {
                const match = filter === "all" || card.dataset.category === filter;
                card.classList.toggle("hide", !match);
                if (match) {
                    card.classList.remove("visible");
                    void card.offsetWidth;
                    card.classList.add("visible");
                }
            });
        });
    });

    const testimonials = [
        {
            text: "An unforgettable evening. The wood-fired ribeye was the best steak I've ever had, and the service felt genuinely warm. Shree Hotel & Restaurant is now our go-to for special nights.",
            name: "Amelia R.",
            role: "Food Enthusiast",
            img: "images/guest-amelia.jpg",
        },
        {
            text: "Every dish was a work of art. The wild mushroom risotto was pure comfort, and the dark chocolate fondant is worth the visit alone. Impeccable from start to finish.",
            name: "Marcus T.",
            role: "Regular Guest",
            img: "images/guest-marcus.jpg",
        },
        {
            text: "The ambiance, the menu, the cocktails — everything is thoughtfully done. We celebrated our anniversary here and the team made it truly special. Five stars, easily.",
            name: "Priya S.",
            role: "Celebrating an Anniversary",
            img: "images/guest-priya.jpg",
        },
    ];

    const tText = $("#testimonialText");
    const tName = $("#authorName");
    const tRole = $("#authorRole");
    const tImg = $(".testimonial-author img");
    const tDots = $("#testimonialDots");
    let current = 0;
    let autoTimer = null;

    const authorImg = $(".testimonial-author img");

    const renderDot = (i) => {
        const dot = document.createElement("span");
        dot.className = "dot" + (i === current ? " active" : "");
        dot.setAttribute("role", "button");
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.addEventListener("click", () => {
            goTo(i);
            restartAuto();
        });
        tDots.appendChild(dot);
    };

    testimonials.forEach((_, i) => renderDot(i));

    const goTo = (index) => {
        current = (index + testimonials.length) % testimonials.length;
        const t = testimonials[current];
        tText.classList.add("fade");
        window.setTimeout(() => {
            tText.textContent = "\u201C" + t.text + "\u201D";
            tName.textContent = t.name;
            tRole.textContent = t.role;
            authorImg.src = t.img;
            $$(".dot", tDots).forEach((d, i) =>
                d.classList.toggle("active", i === current)
            );
            tText.classList.remove("fade");
        }, 260);
    };

    const startAuto = () => {
        autoTimer = window.setInterval(() => goTo(current + 1), 6000);
    };
    const restartAuto = () => {
        window.clearInterval(autoTimer);
        startAuto();
    };

    if (tText) {
        startAuto();
        const wrap = $(".testimonial-wrap");
        wrap.addEventListener("mouseenter", () => window.clearInterval(autoTimer));
        wrap.addEventListener("mouseleave", restartAuto);
    }

    const form = $("#reservationForm");
    const statusEl = $("#formStatus");

    const setError = (field, message) => {
        const wrap = field.closest(".form-field");
        const err = $(".field-error", wrap);
        wrap.classList.toggle("invalid", Boolean(message));
        if (err) err.textContent = message || "";
    };

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const validateField = (field) => {
        const v = field.value.trim();
        if (field.required && !v) {
            setError(field, "This field is required.");
            return false;
        }
        if (field.type === "email" && v && !isEmail(v)) {
            setError(field, "Enter a valid email address.");
            return false;
        }
        setError(field, "");
        return true;
    };

    if (form) {
        const requiredFields = $$("input[required], select[required]", form);
        requiredFields.forEach((f) => {
            f.addEventListener("blur", () => validateField(f));
            f.addEventListener("input", () => {
                if (f.closest(".form-field").classList.contains("invalid")) {
                    validateField(f);
                }
            });
        });

        const dateInput = $("#resDate");
        if (dateInput) {
            const today = new Date().toISOString().split("T")[0];
            dateInput.min = today;
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            statusEl.textContent = "";
            statusEl.className = "form-status";

            let valid = true;
            requiredFields.forEach((f) => {
                if (!validateField(f)) valid = false;
            });

            if (!valid) {
                statusEl.textContent = "Please fix the highlighted fields.";
                statusEl.classList.add("error");
                return;
            }

            const data = Object.fromEntries(new FormData(form).entries());
            statusEl.textContent = "Reserving your table...";
            const submitBtn = $('button[type="submit"]', form);
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";

            window.setTimeout(() => {
                statusEl.textContent =
                    "Thank you, " +
                    data.name.split(" ")[0] +
                    "! Your table for " +
                    data.guests +
                    " on " +
                    data.date +
                    " at " +
                    data.time +
                    " is confirmed.";
                statusEl.classList.add("success");
                submitBtn.disabled = false;
                submitBtn.textContent = "Confirm Reservation";
                form.reset();
                $$(".field-error", form).forEach((el) => (el.textContent = ""));
                $$(".form-field", form).forEach((el) =>
                    el.classList.remove("invalid")
                );
            }, 1100);
        });
    }

    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();