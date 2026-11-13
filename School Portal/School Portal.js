const teachers = [
    {
        name: "Mrs. Anita Sharma",
        role: "Principal",
        desc: "20+ years of educational leadership. M.A. (English), B.Ed.",
        stats: [{ value: "20+", label: "Years Exp" }, { value: "English", label: "Subject" }]
    },
    {
        name: "Mr. Rajesh Verma",
        role: "Vice Principal",
        desc: "M.Sc. (Physics), B.Ed. Specialist in senior secondary physics.",
        stats: [{ value: "18+", label: "Years Exp" }, { value: "Physics", label: "Subject" }]
    },
    {
        name: "Ms. Priya Singh",
        role: "PGT Mathematics",
        desc: "M.Sc. (Mathematics), B.Ed. Makes math fun and easy to understand.",
        stats: [{ value: "12+", label: "Years Exp" }, { value: "Maths", label: "Subject" }]
    },
    {
        name: "Mr. Amit Kumar",
        role: "TGT Science",
        desc: "M.Sc. (Chemistry), B.Ed. Passionate about practical science learning.",
        stats: [{ value: "10+", label: "Years Exp" }, { value: "Science", label: "Subject" }]
    },
    {
        name: "Mrs. Sunita Reddy",
        role: "PRT English",
        desc: "B.A. (English), NTT. Expert in primary level language development.",
        stats: [{ value: "8+", label: "Years Exp" }, { value: "English", label: "Subject" }]
    },
    {
        name: "Mr. Vikram Singh",
        role: "PGT Computer Science",
        desc: "M.Tech (CSE), B.Ed. Leads the computer lab and coding club.",
        stats: [{ value: "6+", label: "Years Exp" }, { value: "Computer", label: "Subject" }]
    }
];

const events = [
    {
        title: "Annual Sports Day",
        date: "15 Dec 2026",
        desc: "Inter-house sports competition with track and field events.",
        location: "School Ground"
    },
    {
        title: "Science Exhibition",
        date: "20 Jan 2027",
        desc: "Student science projects and working models display.",
        location: "School Auditorium"
    },
    {
        title: "Parent-Teacher Meeting",
        date: "05 Feb 2027",
        desc: "Discussion on student progress and academic performance.",
        location: "Respective Classrooms"
    },
    {
        title: "Cultural Fest",
        date: "10 Mar 2027",
        desc: "Dance, music, drama, and art performances by students.",
        location: "Open Air Theatre"
    },
    {
        title: "Final Examinations",
        date: "01 Mar 2027",
        desc: "Annual board and internal examinations for all classes.",
        location: "Examination Halls"
    },
    {
        title: "Result Declaration",
        date: "31 Mar 2027",
        desc: "Annual result declaration and prize distribution ceremony.",
        location: "School Auditorium"
    }
];

const sectionLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const tabBtns = document.querySelectorAll('.tab-btn');
const programContents = document.querySelectorAll('.program-content');
const teacherGrid = document.getElementById('teacherGrid');
const eventGrid = document.getElementById('eventGrid');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLogin = document.getElementById('closeLogin');
const closeRegister = document.getElementById('closeRegister');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const admissionForm = document.getElementById('admissionForm');
const contactForm = document.getElementById('contactForm');
let isLoggedIn = false;

function init() {
    renderTeachers();
    renderEvents();
    setupNavigation();
    setupTabs();
    setupModals();
    setupAuthForms();
    setupAdmissionForm();
    setupContactForm();
}

function setupNavigation() {
    sectionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            switchSection(targetSection);
            updateActiveNav(link);
            closeMobileMenu();
        });
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.querySelectorAll('.logo').forEach(logo => {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection('home');
            updateActiveNav(document.querySelector('.nav-link.active') || document.querySelector('[data-section="home"]'));
            closeMobileMenu();
        });
    });
}

function closeMobileMenu() {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
}

function switchSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateActiveNav(activeLink) {
    sectionLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function setupTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const program = btn.getAttribute('data-program');
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            programContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `program-${program}`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function renderTeachers() {
    teacherGrid.innerHTML = '';
    teachers.forEach(teacher => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <div class="profile-avatar">${teacher.name.charAt(0)}</div>
            <h3>${teacher.name}</h3>
            <p class="subtitle">${teacher.role}</p>
            <p class="desc">${teacher.desc}</p>
            <div style="display:flex; justify-content:center; gap:20px; padding-top:16px; border-top:1px solid var(--border);">
                ${teacher.stats.map(s => `<div style="text-align:center;"><span style="display:block;font-size:1.25rem;font-weight:700;color:var(--dark);">${s.value}</span><span style="font-size:0.75rem;color:var(--gray);text-transform:uppercase;letter-spacing:0.5px;">${s.label}</span></div>`).join('')}
            </div>
        `;
        teacherGrid.appendChild(card);
    });
}

function renderEvents() {
    eventGrid.innerHTML = '';
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-card-image">
                <i class="fa-solid fa-calendar-days"></i>
            </div>
            <div class="event-card-content">
                <span class="event-card-date">${event.date}</span>
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-desc">${event.desc}</p>
                <div class="event-card-footer">
                    <div class="event-card-location">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${event.location}</span>
                    </div>
                </div>
            </div>
        `;
        eventGrid.appendChild(card);
    });
}

function setupModals() {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });

    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(registerModal);
    });

    closeLogin.addEventListener('click', () => closeModal(loginModal));
    closeRegister.addEventListener('click', () => closeModal(registerModal));

    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === registerModal) closeModal(registerModal);
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function setupAuthForms() {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.getElementById('loginRole').value;
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        if (role && email && password) {
            isLoggedIn = true;
            closeModal(loginModal);
            loginForm.reset();
            showToast(`Welcome back, ${email.split('@')[0]}!`);
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        if (name && email && password && role) {
            isLoggedIn = true;
            closeModal(registerModal);
            registerForm.reset();
            showToast(`Account created for ${name}! Welcome to Central Academy.`);
        }
    });
}

function setupAdmissionForm() {
    admissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const stuName = document.getElementById('stuName').value;
        const stuClass = document.getElementById('stuClass').value;
        const parentName = document.getElementById('parentName').value;
        const mobile = document.getElementById('mobile').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        if (stuName && stuClass && parentName && mobile && email) {
            admissionForm.reset();
            showToast(`Admission enquiry submitted for ${stuName} (Class ${stuClass}). We will contact you soon!`);
        }
    });
}

function setupContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contName').value;
        const email = document.getElementById('contEmail').value;
        const subject = document.getElementById('contSubject').value;
        const message = document.getElementById('contMessage').value;
        if (name && email && subject && message) {
            contactForm.reset();
            showToast(`Thank you ${name}! Your message has been sent.`);
        }
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--dark);
        color: var(--white);
        padding: 14px 24px;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        font-size: 0.95rem;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = '1', 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);