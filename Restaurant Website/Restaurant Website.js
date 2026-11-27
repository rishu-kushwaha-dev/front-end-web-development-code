(function () {
    "use strict";

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

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

    const navbar = $("#navbar");

    const onScroll = () => {
        const y = window.scrollY;
        navbar.classList.toggle("scrolled", y > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

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
            text: "An unforgettable evening. The butter chicken was the best I've ever had, and the service felt genuinely warm. Shree Hotel & Restaurant is now our go-to for special nights.",
            name: "Rahul Singh",
            role: "Food Enthusiast",
            img: "images/Rahul Singh.jfif",
        },
        {
            text: "Every dish was a work of art. The Hyderabadi biryani was pure comfort, and the gulab jamun is worth the visit alone. Impeccable from start to finish.",
            name: "Amit Kumar",
            role: "Regular Guest",
            img: "images/Amit Kumar.jfif",
        },
        {
            text: "The ambiance, the tandoor, the mocktails — everything is thoughtfully done. We celebrated our anniversary here and the team made it truly special. Five stars, easily.",
            name: "Neeraj Maurya",
            role: "Celebrates his Anniversary",
            img: "images/Neeraj Maurya.jfif",
        },
    ];

    const tText = $("#testimonialText");
    const tName = $("#authorName");
    const tRole = $("#authorRole");
    const tImg = $(".testimonial-author img");
    const tDots = $("#testimonialDots");
    let current = 0;
    let autoTimer = null;

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
            tImg.src = t.img;
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
        if (field.id === "resPhone" && v && !/^\d{10}$/.test(v)) {
            setError(field, "Enter a 10-digit phone number.");
            return false;
        }
        setError(field, "");
        return true;
    };

    if (form) {
        const phoneField = $("#resPhone");
        if (phoneField) {
            phoneField.addEventListener("input", () => {
                phoneField.value = phoneField.value.replace(/\D/g, "").slice(0, 10);
            });
        }
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