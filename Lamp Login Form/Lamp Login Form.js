document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(Draggable);

    // DOM Elements
    const body = document.body;
    const cordBead = document.getElementById("cordBead");
    const cordHit = document.getElementById("cordHit");
    const elasticCord = document.getElementById("elasticCord");
    const shadeAssembly = document.getElementById("shadeAssembly");
    const soundToggle = document.getElementById("soundToggle");
    const soundOnIcon = soundToggle.querySelector(".sound-on");
    const soundOffIcon = soundToggle.querySelector(".sound-off");

    // Form Elements
    const loginCard = document.getElementById("loginCard");
    const tabSignIn = document.getElementById("tabSignIn");
    const tabRegister = document.getElementById("tabRegister");
    const authTabs = document.querySelector(".auth-tabs");
    const cardTitle = document.querySelector(".card-title");
    const cardSubtitle = document.querySelector(".card-subtitle");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnSpinner = document.getElementById("btnSpinner");
    const btnSuccess = document.getElementById("btnSuccess");
    const btnArrow = submitBtn.querySelector(".btn-arrow");
    const eyeToggle = document.getElementById("eyeToggle");
    const passField = document.getElementById("passField");
    const eyeShow = eyeToggle.querySelector(".eye-show");
    const eyeHide = eyeToggle.querySelector(".eye-hide");
    const successOverlay = document.getElementById("successOverlay");
    const resetDemoBtn = document.getElementById("resetDemoBtn");

    // Validation Elements
    const userField = document.getElementById("userField");
    const userWrapper = document.getElementById("userWrapper");
    const userError = document.getElementById("userError");
    const passWrapper = document.getElementById("passWrapper");
    const passError = document.getElementById("passError");

    // Forgot Modal
    const forgotLink = document.getElementById("forgotLink");
    const forgotModal = document.getElementById("forgotModal");
    const modalClose = document.getElementById("modalClose");
    const resetEmail = document.getElementById("resetEmail");
    const resetWrapper = document.getElementById("resetWrapper");
    const resetError = document.getElementById("resetError");
    const sendResetBtn = document.getElementById("sendResetBtn");
    const resetSuccess = document.getElementById("resetSuccess");

    // Mail Login Modal
    const mailBtn = document.getElementById("mailBtn");
    const mailLoginModal = document.getElementById("mailLoginModal");
    const mailModalClose = document.getElementById("mailModalClose");
    const mailEmail = document.getElementById("mailEmail");
    const mailPass = document.getElementById("mailPass");
    const mailEmailWrapper = document.getElementById("mailEmailWrapper");
    const mailPassWrapper = document.getElementById("mailPassWrapper");
    const mailEmailError = document.getElementById("mailEmailError");
    const mailPassError = document.getElementById("mailPassError");
    const mailLoginBtn = document.getElementById("mailLoginBtn");
    const mailMsg = document.getElementById("mailMsg");

    // Google Login Modal
    const googleBtn = document.getElementById("googleBtn");
    const googleLoginModal = document.getElementById("googleLoginModal");
    const googleModalClose = document.getElementById("googleModalClose");
    const googleEmail = document.getElementById("googleEmail");
    const googlePass = document.getElementById("googlePass");
    const googleEmailWrapper = document.getElementById("googleEmailWrapper");
    const googlePassWrapper = document.getElementById("googlePassWrapper");
    const googleEmailError = document.getElementById("googleEmailError");
    const googlePassError = document.getElementById("googlePassError");
    const googleLoginBtn = document.getElementById("googleLoginBtn");
    const googleMsg = document.getElementById("googleMsg");

    // GitHub Login Modal
    const githubBtn = document.getElementById("githubBtn");
    const githubLoginModal = document.getElementById("githubLoginModal");
    const githubModalClose = document.getElementById("githubModalClose");
    const githubEmail = document.getElementById("githubEmail");
    const githubPass = document.getElementById("githubPass");
    const githubEmailWrapper = document.getElementById("githubEmailWrapper");
    const githubPassWrapper = document.getElementById("githubPassWrapper");
    const githubEmailError = document.getElementById("githubEmailError");
    const githubPassError = document.getElementById("githubPassError");
    const githubLoginBtn = document.getElementById("githubLoginBtn");
    const githubMsg = document.getElementById("githubMsg");

    // State
    let isOn = false;
    let isSoundEnabled = true;
    let activeTab = "signin";
    let isSimulatingPull = false;

    // Elastic String Geometry
    const ANCHOR_X = 245;
    const ANCHOR_Y = 212;
    const REST_X = 245;
    const REST_Y = 300;
    const MAX_STRETCH = 120;
    const TRIGGER_PULL = 32;

    gsap.set(cordBead, { x: REST_X, y: REST_Y });

    let twangAmp = 0;
    let twangStartTime = 0;

    function renderElasticString(curX, curY) {
        let twangOffset = 0;
        if (twangAmp > 0.05) {
            const elapsed = performance.now() - twangStartTime;
            twangOffset = Math.sin(elapsed * 0.05) * twangAmp;
        }

        const midX = (ANCHOR_X + curX) / 2 + twangOffset;
        const midY = (ANCHOR_Y + curY) / 2;

        // Dynamic rubber cord thinning as it stretches
        const stretchRatio = Math.max(1, (curY - ANCHOR_Y) / (REST_Y - ANCHOR_Y));
        const strokeWidth = Math.max(1.6, 2.6 / Math.sqrt(stretchRatio));

        elasticCord.setAttribute("d", `M ${ANCHOR_X} ${ANCHOR_Y} Q ${midX} ${midY} ${curX} ${curY}`);
        elasticCord.setAttribute("stroke-width", strokeWidth.toFixed(2));
    }

    // Web Audio Synthesizer
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    function playElasticPluckSound(pullDist, turningOn) {
        if (!isSoundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;

            const now = audioCtx.currentTime;

            // Pluck tone
            const osc = audioCtx.createOscillator();
            const oscGain = audioCtx.createGain();
            osc.type = "triangle";

            const startFreq = 480 + Math.min(260, pullDist * 3);
            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

            oscGain.gain.setValueAtTime(0.4, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            osc.connect(oscGain);
            oscGain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.15);

            // Switch snap
            if (pullDist >= TRIGGER_PULL) {
                const snap = audioCtx.createOscillator();
                const snapGain = audioCtx.createGain();
                snap.type = "sine";
                snap.frequency.setValueAtTime(turningOn ? 1800 : 1500, now + 0.02);
                snap.frequency.exponentialRampToValueAtTime(320, now + 0.06);

                snapGain.gain.setValueAtTime(0.35, now + 0.02);
                snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

                snap.connect(snapGain);
                snapGain.connect(audioCtx.destination);
                snap.start(now + 0.02);
                snap.stop(now + 0.07);

                // Power hum
                if (turningOn) {
                    const hum = audioCtx.createOscillator();
                    const humGain = audioCtx.createGain();
                    hum.type = "sine";
                    hum.frequency.setValueAtTime(120, now + 0.05);
                    humGain.gain.setValueAtTime(0.001, now);
                    humGain.gain.linearRampToValueAtTime(0.06, now + 0.08);
                    humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                    hum.connect(humGain);
                    humGain.connect(audioCtx.destination);
                    hum.start(now + 0.05);
                    hum.stop(now + 0.38);
                }
            }
        } catch (e) {
            console.warn("AudioContext error:", e);
        }
    }

    // Sound Toggle
    soundToggle.addEventListener("click", () => {
        isSoundEnabled = !isSoundEnabled;
        soundOnIcon.classList.toggle("hidden", !isSoundEnabled);
        soundOffIcon.classList.toggle("hidden", isSoundEnabled);
        if (isSoundEnabled) initAudio();
    });

    function playColorSwitchSound() {
        if (!isSoundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1320, now + 0.05);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.07);
        } catch (e) { }
    }

    // Color Palette Switcher
    const colorDots = document.querySelectorAll(".color-dot-btn");
    let currentColor = "amber";

    colorDots.forEach((btn) => {
        btn.addEventListener("click", () => {
            const selectedColor = btn.getAttribute("data-color");
            if (selectedColor === currentColor) return;

            colorDots.forEach((d) => d.classList.remove("active"));
            btn.classList.add("active");

            currentColor = selectedColor;
            body.setAttribute("data-color", currentColor);
            activeParticleTheme = particleThemes[currentColor] || particleThemes.amber;

            playColorSwitchSound();

            if (isOn) {
                gsap.fromTo(".svg-light-beam, .ambient-glow",
                    { opacity: 0.65 },
                    {
                        opacity: 1,
                        duration: 0.45,
                        ease: "power1.out",
                        onComplete: () => {
                            gsap.set([".svg-light-beam", ".ambient-glow"], { clearProps: "opacity,visibility" });
                        }
                    }
                );
            }
        });
    });

    // Elastic Cord Draggable Interaction
    Draggable.create(cordBead, {
        type: "x,y",
        bounds: {
            minY: REST_Y,
            maxY: REST_Y + MAX_STRETCH,
            minX: REST_X - 45,
            maxX: REST_X + 45,
        },
        cursor: "grab",
        activeCursor: "grabbing",
        onPress() {
            initAudio();
            twangAmp = 0;
        },
        onDrag() {
            renderElasticString(this.x, this.y);

            // Shade tilts slightly under tension
            const pullDist = this.y - REST_Y;
            const shadeTilt = (pullDist / MAX_STRETCH) * 1.8;
            gsap.set(shadeAssembly, {
                rotation: shadeTilt,
                transformOrigin: "215px 175px"
            });
        },
        onRelease() {
            handleElasticRelease(this.x, this.y);
        }
    });

    function handleElasticRelease(curX, curY) {
        const pullDist = curY - REST_Y;
        const isTriggered = pullDist >= TRIGGER_PULL;

        if (isTriggered) {
            toggleLamp();
        }

        playElasticPluckSound(pullDist, isOn);

        // Bead rebound snap
        gsap.to(cordBead, {
            x: REST_X,
            y: REST_Y,
            duration: 1.15,
            ease: "elastic.out(2.2, 0.16)",
            onUpdate: () => {
                const bx = gsap.getProperty(cordBead, "x");
                const by = gsap.getProperty(cordBead, "y");
                renderElasticString(bx, by);
            }
        });

        // String twang vibration
        twangAmp = (curX - REST_X) * 0.4 + (pullDist * 0.3);
        twangStartTime = performance.now();
        gsap.to({ val: twangAmp }, {
            val: 0,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: function () {
                twangAmp = this.targets()[0].val;
            }
        });

        // Shade bounce back
        gsap.to(shadeAssembly, {
            rotation: 0,
            duration: 0.7,
            ease: "back.out(2.2)",
            transformOrigin: "215px 175px"
        });
    }

    // Pull cord click trigger
    cordHit.addEventListener("click", () => {
        if (isSimulatingPull) return;
        performSimulatedPull();
    });

    function performSimulatedPull() {
        isSimulatingPull = true;
        initAudio();

        gsap.to(cordBead, {
            y: REST_Y + 50,
            duration: 0.22,
            ease: "power2.in",
            onUpdate: () => {
                const by = gsap.getProperty(cordBead, "y");
                renderElasticString(REST_X, by);
            },
            onComplete: () => {
                handleElasticRelease(REST_X, REST_Y + 50);
                setTimeout(() => {
                    isSimulatingPull = false;
                }, 500);
            }
        });

        gsap.to(shadeAssembly, {
            rotation: 1.8,
            duration: 0.22,
            ease: "power2.in",
            transformOrigin: "230px 188px"
        });
    }

    // Lamp State Controller
    function toggleLamp() {
        setLampState(!isOn);
    }

    function setLampState(targetState) {
        isOn = targetState;
        body.setAttribute("data-on", isOn ? "true" : "false");

        gsap.killTweensOf([
            ".bulb-glow-core",
            ".bulb-filament",
            ".svg-light-beam",
            ".ambient-glow",
            ".shade-reflector-on",
            loginCard,
            "#loginCard *"
        ]);

        gsap.set([".svg-light-beam", ".ambient-glow", ".shade-reflector-on"], { clearProps: "opacity,visibility" });

        const filament = document.querySelector(".bulb-filament");
        const bulbGlow = document.querySelector(".bulb-glow-core");

        if (isOn) {
            // Lamp ON
            gsap.timeline()
                .to(filament, { stroke: "#fff", duration: 0.05 })
                .to(bulbGlow, { opacity: 0.95, duration: 0.1, ease: "power2.out" });

            gsap.fromTo(loginCard,
                { y: 24, scale: 0.96, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
            );

            gsap.fromTo(
                ".card-header, .auth-tabs, .form-group, .options-row, .submit-btn, .auth-divider, .social-row",
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power2.out", delay: 0.08 }
            );
        } else {
            // Lamp OFF
            gsap.set(bulbGlow, { opacity: 0, clearProps: "opacity" });
            gsap.set(filament, { stroke: "#555", filter: "none", clearProps: "all" });

            gsap.to(loginCard, {
                y: 16,
                opacity: 0,
                scale: 0.96,
                duration: 0.22,
                ease: "power2.in",
                onComplete: () => {
                    gsap.set(loginCard, { clearProps: "all" });
                }
            });

            gsap.set(loginCard, { rotateX: 0, rotateY: 0 });
        }
    }

    // Canvas Dust Particles
    const canvas = document.getElementById("dustCanvas");
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 60;

    const particleThemes = {
        amber: { fill: "255, 205, 120", glow: "255, 185, 80" },
        cyan: { fill: "140, 245, 255", glow: "0, 240, 255" },
        rose: { fill: "255, 160, 200", glow: "255, 51, 133" },
        mint: { fill: "160, 255, 200", glow: "0, 230, 118" },
        moonlight: { fill: "220, 235, 255", glow: "200, 220, 255" }
    };
    let activeParticleTheme = particleThemes.amber;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 2 + 0.6;
            this.vx = (Math.random() - 0.4) * 0.35;
            this.vy = -Math.random() * 0.4 - 0.15;
            this.alpha = Math.random() * 0.6 + 0.2;
            this.pulseSpeed = Math.random() * 0.03 + 0.01;
            this.pulse = Math.random() * Math.PI;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += this.pulseSpeed;
            if (this.y < 0) this.y = height;
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
        }
        draw() {
            const currentAlpha = (Math.sin(this.pulse) * 0.3 + 0.7) * this.alpha;
            const factor = isOn ? 1 : 0.08;
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${activeParticleTheme.fill}, ${currentAlpha * factor})`;
            if (isOn) {
                ctx.shadowBlur = 7;
                ctx.shadowColor = `rgba(${activeParticleTheme.glow}, 0.5)`;
            }
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function renderParticles() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(renderParticles);
    }
    renderParticles();

    // Form Tabs & Controls
    tabSignIn.addEventListener("click", () => switchTab("signin"));
    tabRegister.addEventListener("click", () => switchTab("register"));

    function switchTab(tab) {
        if (activeTab === tab) return;
        activeTab = tab;
        authTabs.setAttribute("data-active", tab);

        tabSignIn.classList.toggle("active", tab === "signin");
        tabRegister.classList.toggle("active", tab === "register");

        if (tab === "signin") {
            cardTitle.textContent = "Welcome";
            cardSubtitle.textContent = "Log in to continue to your account";
            btnText.textContent = "Log In";
        } else {
            cardTitle.textContent = "Sign Up";
            cardSubtitle.textContent = "Create an account to get started";
            btnText.textContent = "Create Account";
        }

        gsap.fromTo(".card-title, .card-subtitle",
            { opacity: 0.6, y: -4 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
    }

    function clearErrors() {
        userWrapper.classList.remove("error");
        passWrapper.classList.remove("error");
        userError.textContent = "";
        passError.textContent = "";
        loginCard.classList.remove("shake");
    }

    function validateForm() {
        clearErrors();
        let valid = true;
        const userVal = userField.value.trim();
        const passVal = passField.value.trim();

        if (userVal === "") {
            userWrapper.classList.add("error");
            userError.textContent = "Username or email is required";
            valid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (userVal.includes("@") && !emailRegex.test(userVal)) {
                userWrapper.classList.add("error");
                userError.textContent = "Enter a valid email address";
                valid = false;
            }
        }

        if (passVal === "") {
            passWrapper.classList.add("error");
            passError.textContent = "Password is required";
            valid = false;
        } else if (passVal.length < 6) {
            passWrapper.classList.add("error");
            passError.textContent = "Password must be at least 6 characters";
            valid = false;
        }

        if (!valid) {
            loginCard.classList.add("shake");
            setTimeout(() => loginCard.classList.remove("shake"), 400);
        }

        return valid;
    }

    userField.addEventListener("input", clearErrors);
    passField.addEventListener("input", clearErrors);

    // Enter key support
    [userField, passField].forEach((field) => {
        field.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                submitBtn.click();
            }
        });
    });

    // Submit Button
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!isOn) {
            performSimulatedPull();
            return;
        }

        if (!validateForm()) {
            return;
        }

        // Save username if remember me checked
        const rememberMe = document.getElementById("rememberMe");
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem("lampLoginUser", userField.value.trim());
        } else {
            localStorage.removeItem("lampLoginUser");
        }

        btnText.classList.add("hidden");
        btnArrow.classList.add("hidden");
        btnSpinner.classList.remove("hidden");
        submitBtn.style.pointerEvents = "none";

        setTimeout(() => {
            btnSpinner.classList.add("hidden");
            btnSuccess.classList.remove("hidden");

            setTimeout(() => {
                successOverlay.classList.remove("hidden");
                btnText.classList.remove("hidden");
                btnArrow.classList.remove("hidden");
                btnSuccess.classList.add("hidden");
                submitBtn.style.pointerEvents = "auto";

                // Confetti on success
                if (typeof confetti === "function") {
                    confetti({
                        particleCount: 90,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#ffab3d", "#ffe194", "#ffffff"]
                    });
                }
            }, 600);
        }, 900);
    });

    // Forgot Password Modal
    forgotLink.addEventListener("click", () => {
        forgotModal.classList.remove("hidden");
        resetEmail.value = "";
        resetError.textContent = "";
        resetWrapper.classList.remove("error");
        resetSuccess.classList.add("hidden");
        sendResetBtn.style.display = "block";
        setTimeout(() => resetEmail.focus(), 200);
    });

    modalClose.addEventListener("click", () => {
        forgotModal.classList.add("hidden");
    });

    forgotModal.addEventListener("click", (e) => {
        if (e.target === forgotModal) {
            forgotModal.classList.add("hidden");
        }
    });

    sendResetBtn.addEventListener("click", () => {
        resetError.textContent = "";
        resetWrapper.classList.remove("error");
        const emailVal = resetEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal === "" || !emailRegex.test(emailVal)) {
            resetWrapper.classList.add("error");
            resetError.textContent = "Enter a valid email address";
            return;
        }
        sendResetBtn.style.display = "none";
        resetSuccess.classList.remove("hidden");
    });

    resetEmail.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendResetBtn.click();
        }
    });

    // Reset Demo Modal
    resetDemoBtn.addEventListener("click", () => {
        successOverlay.classList.add("hidden");
        userField.value = "";
        passField.value = "";
        clearErrors();
        activeTab = "signin";
        authTabs.setAttribute("data-active", "signin");
        tabSignIn.classList.add("active");
        tabRegister.classList.remove("active");
        cardTitle.textContent = "Welcome";
        cardSubtitle.textContent = "Log in to continue to your account";
        btnText.textContent = "Log In";
    });

    // Prefill remembered user
    const savedUser = localStorage.getItem("lampLoginUser");
    if (savedUser) {
        userField.value = savedUser;
        const rememberMe = document.getElementById("rememberMe");
        if (rememberMe) rememberMe.checked = true;
    }

    // Mail Login Handlers
    function clearMailErrors() {
        mailEmailWrapper.classList.remove("error");
        mailPassWrapper.classList.remove("error");
        mailEmailError.textContent = "";
        mailPassError.textContent = "";
        mailMsg.style.display = "none";
        mailMsg.textContent = "";
    }

    mailBtn.addEventListener("click", () => {
        clearMailErrors();
        mailEmail.value = "";
        mailPass.value = "";
        mailLoginModal.classList.remove("hidden");
        setTimeout(() => mailEmail.focus(), 200);
    });

    mailModalClose.addEventListener("click", () => {
        mailLoginModal.classList.add("hidden");
    });

    mailLoginModal.addEventListener("click", (e) => {
        if (e.target === mailLoginModal) {
            mailLoginModal.classList.add("hidden");
        }
    });

    mailLoginBtn.addEventListener("click", () => {
        clearMailErrors();
        let valid = true;
        const emailVal = mailEmail.value.trim();
        const passVal = mailPass.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailVal === "" || !emailRegex.test(emailVal)) {
            mailEmailWrapper.classList.add("error");
            mailEmailError.textContent = "Enter a valid email address";
            valid = false;
        }

        if (passVal === "") {
            mailPassWrapper.classList.add("error");
            mailPassError.textContent = "Password is required";
            valid = false;
        }

        if (!valid) return;

        mailMsg.style.display = "block";
        mailMsg.textContent = "Logging in...";
        mailLoginBtn.style.pointerEvents = "none";

        setTimeout(() => {
            mailLoginModal.classList.add("hidden");
            mailMsg.style.display = "none";
            mailLoginBtn.style.pointerEvents = "auto";
            // Redirect back to the website after login
            window.location.href = window.location.origin + window.location.pathname;
        }, 900);
    });

    // Social login helper
    function openSocialModal(btn, modal, input) {
        btn.addEventListener("click", () => {
            modal.classList.remove("hidden");
            setTimeout(() => input.focus(), 200);
        });
    }

    function closeSocialModal(closeBtn, modal) {
        closeBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    }

    function modalClickOutside(modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
            }
        });
    }

    function clearSocialErrors(eWrapper, pWrapper, eError, pError, msg) {
        eWrapper.classList.remove("error");
        pWrapper.classList.remove("error");
        eError.textContent = "";
        pError.textContent = "";
        msg.style.display = "none";
        msg.textContent = "";
    }

    function handleSocialLogin(emailId, passId, eWrapperId, pWrapperId, eErrorId, pErrorId, btnId, msgId, modalId) {
        const emailField = document.getElementById(emailId);
        const passField = document.getElementById(passId);
        const eWrapper = document.getElementById(eWrapperId);
        const pWrapper = document.getElementById(pWrapperId);
        const eError = document.getElementById(eErrorId);
        const pError = document.getElementById(pErrorId);
        const btn = document.getElementById(btnId);
        const msg = document.getElementById(msgId);
        const modal = document.getElementById(modalId);

        btn.addEventListener("click", () => {
            clearSocialErrors(eWrapper, pWrapper, eError, pError, msg);
            let valid = true;
            const emailVal = emailField.value.trim();
            const passVal = passField.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailVal === "" || !emailRegex.test(emailVal)) {
                eWrapper.classList.add("error");
                eError.textContent = "Enter a valid email address";
                valid = false;
            }

            if (passVal === "") {
                pWrapper.classList.add("error");
                pError.textContent = "Password is required";
                valid = false;
            }

            if (!valid) return;

            msg.style.display = "block";
            msg.textContent = "Logging in...";
            btn.style.pointerEvents = "none";

            setTimeout(() => {
                modal.classList.add("hidden");
                msg.style.display = "none";
                btn.style.pointerEvents = "auto";
                // Redirect back to the website after login
                window.location.href = window.location.origin + window.location.pathname;
            }, 900);
        });
    }

    // Google
    openSocialModal(googleBtn, googleLoginModal, googleEmail);
    closeSocialModal(googleModalClose, googleLoginModal);
    modalClickOutside(googleLoginModal);
    handleSocialLogin("googleEmail", "googlePass", "googleEmailWrapper", "googlePassWrapper",
        "googleEmailError", "googlePassError", "googleLoginBtn", "googleMsg", "googleLoginModal");

    // GitHub
    openSocialModal(githubBtn, githubLoginModal, githubEmail);
    closeSocialModal(githubModalClose, githubLoginModal);
    modalClickOutside(githubLoginModal);
    handleSocialLogin("githubEmail", "githubPass", "githubEmailWrapper", "githubPassWrapper",
        "githubEmailError", "githubPassError", "githubLoginBtn", "githubMsg", "githubLoginModal");

    formStage.addEventListener("mousemove", (e) => {
        if (!isOn) return;
        const rect = formStage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, {
            rotateX: -(y / rect.height) * 9,
            rotateY: (x / rect.width) * 9,
            duration: 0.5,
            ease: "power1.out",
            transformPerspective: 900
        });
    });

    formStage.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.7,
            ease: "power2.out"
        });
    });

    // Render initial string
    renderElasticString(REST_X, REST_Y);
});
