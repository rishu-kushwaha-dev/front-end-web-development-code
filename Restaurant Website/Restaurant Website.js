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
    const menuMore = $("#menuMore");
    const viewFullBtn = $("#viewFullMenu");
    const SIGNATURE_LIMIT = 12;
    let fullMenu = false;

    const applyFilter = (filter) => {
        let visibleIndex = 0;
        menuCards.forEach((card) => {
            const match = filter === "all" || card.dataset.category === filter;
            const withinLimit =
                filter !== "all" || fullMenu || visibleIndex < SIGNATURE_LIMIT;
            const show = match && withinLimit;
            card.classList.toggle("hide", !show);
            if (match) visibleIndex++;
            if (show) {
                card.classList.remove("visible");
                void card.offsetWidth;
                card.classList.add("visible");
            }
        });
        if (menuMore) {
            menuMore.style.display = filter === "all" ? "" : "none";
        }
        if (viewFullBtn) {
            viewFullBtn.textContent = fullMenu ? "Show Signature Dishes" : "View Full Menu";
        }
    };

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            applyFilter(btn.dataset.filter);
        });
    });

    if (viewFullBtn) {
        viewFullBtn.addEventListener("click", () => {
            fullMenu = !fullMenu;
            applyFilter("all");
        });
    }

    applyFilter("all");

    const rupee = (n) => "\u20B9" + n;

    const parsePrice = (card) => {
        const priceEl = $(".menu-price", card);
        const digits = priceEl ? priceEl.textContent.replace(/[^\d]/g, "") : "";
        return parseInt(digits, 10) || 0;
    };

    const cart = [];
    const cartFab = $("#cartFab");
    const cartCount = $("#cartCount");
    const cartPanel = $("#cartPanel");
    const cartOverlay = $("#cartOverlay");
    const cartClose = $("#cartClose");
    const cartItems = $("#cartItems");
    const cartEmpty = $("#cartEmpty");
    const cartTotal = $("#cartTotal");
    const cartStatus = $("#cartStatus");
    const placeOrderBtn = $("#placeOrder");

    menuCards.forEach((card) => {
        const body = $(".menu-card-body", card);
        if (!body) return;
        const name = $("h3", body).textContent.trim();
        const price = parsePrice(card);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "add-order-btn";
        btn.textContent = "Add to Order";
        btn.addEventListener("click", () => addToCart(name, price));
        body.appendChild(btn);
    });

    const cartTotalValue = () =>
        cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const renderCart = () => {
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = String(count);
        cartItems.innerHTML = "";
        cartEmpty.style.display = cart.length ? "none" : "";

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = "cart-item";

            const info = document.createElement("div");
            info.className = "cart-item-info";
            const title = document.createElement("span");
            title.className = "cart-item-name";
            title.textContent = item.name;
            const price = document.createElement("span");
            price.className = "cart-item-price";
            price.textContent = rupee(item.price * item.qty);
            info.append(title, price);

            const qty = document.createElement("div");
            qty.className = "cart-item-qty";
            const minus = document.createElement("button");
            minus.type = "button";
            minus.textContent = "\u2212";
            minus.setAttribute("aria-label", "Decrease quantity");
            minus.addEventListener("click", () => changeQty(index, -1));
            const qtyNum = document.createElement("span");
            qtyNum.textContent = String(item.qty);
            const plus = document.createElement("button");
            plus.type = "button";
            plus.textContent = "+";
            plus.setAttribute("aria-label", "Increase quantity");
            plus.addEventListener("click", () => changeQty(index, 1));
            qty.append(minus, qtyNum, plus);

            li.append(info, qty);
            cartItems.appendChild(li);
        });

        cartTotal.textContent = rupee(cartTotalValue());
    };

    const addToCart = (name, price) => {
        const existing = cart.find((item) => item.name === name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, qty: 1 });
        }
        renderCart();
        openCart();
    };

    const changeQty = (index, delta) => {
        const item = cart[index];
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) cart.splice(index, 1);
        renderCart();
    };

    const openCart = () => {
        cartPanel.classList.add("open");
        cartOverlay.classList.add("open");
        cartPanel.setAttribute("aria-hidden", "false");
        if (cartStatus) cartStatus.textContent = "";
    };

    const closeCart = () => {
        cartPanel.classList.remove("open");
        cartOverlay.classList.remove("open");
        cartPanel.setAttribute("aria-hidden", "true");
    };

    if (cartFab) cartFab.addEventListener("click", openCart);
    if (cartClose) cartClose.addEventListener("click", closeCart);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", () => {
            if (!cart.length) return;
            const total = cartTotalValue();
            cartStatus.textContent =
                "Order placed! Total " + rupee(total) + ". We'll prepare it fresh for you.";
            cart.length = 0;
            renderCart();
        });
    }

    renderCart();

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
            role: "Celebrated his Anniversary",
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