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
    const menuSearch = $("#menuSearch");
    const vegToggle = $("#vegToggle");
    const vegBtns = vegToggle ? $$(".veg-btn", vegToggle) : [];
    const SIGNATURE_LIMIT = 12;
    let fullMenu = false;
    let vegFilter = "all";
    let searchTerm = "";

    const NONVEG = new Set([
        "Butter Chicken",
        "Hyderabadi Biryani",
        "Chicken Tikka",
        "Seekh Kabab",
        "Amritsari Fish",
        "Chicken 65",
        "Chicken Curry",
        "Mutton Rogan Josh",
        "Mutton Korma",
        "Chicken Tikka Masala",
        "Fish Curry",
        "Lucknowi Biryani",
    ]);

    menuCards.forEach((card) => {
        const name = $("h3", card).textContent.trim();
        card.dataset.veg = NONVEG.has(name) ? "nonveg" : "veg";
    });

    const matchesSearch = (card) => {
        if (!searchTerm) return true;
        return card.textContent.toLowerCase().includes(searchTerm);
    };

    const matchesVeg = (card) => {
        if (vegFilter === "all") return true;
        return card.dataset.veg === vegFilter;
    };

    const applyFilter = (filter) => {
        const isFiltering = filter !== "all" || vegFilter !== "all" || searchTerm;
        let visibleIndex = 0;
        menuCards.forEach((card) => {
            const match =
                (filter === "all" || card.dataset.category === filter) &&
                matchesVeg(card) &&
                matchesSearch(card);
            const withinLimit =
                isFiltering || fullMenu || visibleIndex < SIGNATURE_LIMIT;
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
            menuMore.style.display =
                filter === "all" && vegFilter === "all" && !searchTerm ? "" : "none";
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

    vegBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            vegBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            vegFilter = btn.dataset.veg;
            applyFilter($(".filter-btn.active").dataset.filter);
        });
    });

    if (menuSearch) {
        menuSearch.addEventListener("input", () => {
            searchTerm = menuSearch.value.trim().toLowerCase();
            applyFilter($(".filter-btn.active").dataset.filter);
        });
    }

    if (viewFullBtn) {
        viewFullBtn.addEventListener("click", () => {
            fullMenu = !fullMenu;
            applyFilter("all");
        });
    }

    applyFilter("all");

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

        const purposeSelect = $("#resPurpose");
        const peopleField = $("#functionPeopleField");
        const typeField = $("#functionTypeField");
        const toggleFunctionFields = () => {
            const isFn = purposeSelect && purposeSelect.value === "function";
            if (peopleField) peopleField.style.display = isFn ? "" : "none";
            if (typeField) typeField.style.display = isFn ? "" : "none";
        };
        const guestsSelect = $("#resGuests");
        const guestsCustom = $("#resGuestsCustom");
        const toggleGuestsCustom = () => {
            if (!guestsSelect || !guestsCustom) return;
            const show = guestsSelect.value === "6+";
            guestsCustom.style.display = show ? "" : "none";
            guestsCustom.required = show;
            if (!show) guestsCustom.value = "";
        };
        if (guestsSelect) {
            guestsSelect.addEventListener("change", toggleGuestsCustom);
            toggleGuestsCustom();
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
                const ref = "SHR-" + Math.random().toString(36).slice(2, 8).toUpperCase();
                showBookingModal(data, ref);
                showToast("Table reserved successfully!");
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

    const toast = $("#toast");
    let toastTimer = null;
    const showToast = (msg) => {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
    };

    const bookingModal = $("#bookingModal");
    const modalOverlay = $("#modalOverlay");
    const modalClose = $("#modalClose");
    const modalDone = $("#modalDone");
    const modalSummary = $("#modalSummary");
    const modalDetails = $("#modalDetails");
    const modalRef = $("#modalRef");

    const prettyDate = (iso) => {
        const parts = iso.split("-");
        if (parts.length !== 3) return iso;
        return parts[2] + " - " + parts[1] + " - " + parts[0];
    };

    const prettyTime = (t) => {
        const [h, m] = t.split(":");
        const hour = parseInt(h, 10);
        const suffix = hour >= 12 ? "PM" : "AM";
        const display = ((hour + 11) % 12) + 1;
        return display + ":" + m + " " + suffix;
    };

    const showBookingModal = (data, ref) => {
        if (!bookingModal) return;
        modalSummary.textContent =
            "Thank you, " + data.name.split(" ")[0] + "! We look forward to hosting you.";
        modalDetails.innerHTML = "";
        const rows = [
            ["Name", data.name],
            ["Guests", data.guests],
            ["Date", prettyDate(data.date)],
            ["Time", prettyTime(data.time)],
        ];
        rows.forEach(([label, value]) => {
            const li = document.createElement("li");
            const k = document.createElement("span");
            k.textContent = label;
            const v = document.createElement("strong");
            v.textContent = value;
            li.append(k, v);
            modalDetails.appendChild(li);
        });
        modalRef.textContent = ref;
        bookingModal.classList.add("open");
        bookingModal.setAttribute("aria-hidden", "false");
    };

    const closeBookingModal = () => {
        if (!bookingModal) return;
        bookingModal.classList.remove("open");
        bookingModal.setAttribute("aria-hidden", "true");
    };

    if (modalClose) modalClose.addEventListener("click", closeBookingModal);
    if (modalDone) modalDone.addEventListener("click", closeBookingModal);
    if (modalOverlay) modalOverlay.addEventListener("click", closeBookingModal);

    const lightbox = $("#lightbox");
    const lightboxImg = $("#lightboxImg");
    const lightboxCaption = $("#lightboxCaption");
    const lightboxClose = $("#lightboxClose");
    const lightboxPrev = $("#lightboxPrev");
    const lightboxNext = $("#lightboxNext");
    const galleryItems = $$(".gallery-item");
    let galleryIndex = 0;

    const renderLightbox = () => {
        const item = galleryItems[galleryIndex];
        if (!item) return;
        const img = $("img", item);
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt;
    };

    const openLightbox = (index) => {
        galleryIndex = index;
        renderLightbox();
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
    };

    const closeLightbox = () => {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
    };

    const stepLightbox = (delta) => {
        galleryIndex = (galleryIndex + delta + galleryItems.length) % galleryItems.length;
        renderLightbox();
    };

    galleryItems.forEach((item, i) => {
        item.style.cursor = "pointer";
        item.addEventListener("click", () => openLightbox(i));
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", () => stepLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener("click", () => stepLightbox(1));
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeLightbox();
            closeBookingModal();
        }
        if (lightbox && lightbox.classList.contains("open")) {
            if (e.key === "ArrowLeft") stepLightbox(-1);
            if (e.key === "ArrowRight") stepLightbox(1);
        }
    });

    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();