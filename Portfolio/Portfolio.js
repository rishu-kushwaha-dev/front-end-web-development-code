document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-links a');
  const revealElements = document.querySelectorAll('.glass-card, .project-card, .skill-card, .contact-card, .detail-card');
  const skillFills = document.querySelectorAll('.skill-fill');
  const statNums = document.querySelectorAll('.stat-num');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const projectCards = document.querySelectorAll('.project-card');

  function createBgParticles() {
    var container = document.getElementById('bgParticles');
    if (!container) return;
    var count = window.innerWidth < 768 ? 25 : 50;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'bg-particle';
      p.style.top = Math.random() * 100 + '%';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 15 + 12) + 's';
      p.style.animationDelay = (Math.random() * 15) + 's';
      container.appendChild(p);
    }
  }

  createBgParticles();

  let lastScrollY = 0;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    var backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      if (window.scrollY < lastScrollY && window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
    lastScrollY = window.scrollY;
  });

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinkItems.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  function applySkillFill(fill) {
    var width = fill.getAttribute('data-width');
    fill.style.width = width + '%';
    var percent = fill.parentNode.parentNode.querySelector('.skill-percent');
    if (percent) percent.textContent = width + '%';
  }

  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(function (fill) {
          applySkillFill(fill);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }

  skillFills.forEach(function (fill) {
    applySkillFill(fill);
  });

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  var aboutSection = document.getElementById('about');
  if (aboutSection) {
    statsObserver.observe(aboutSection);
  }

  function animateCounters(container) {
    var nums = container.querySelectorAll('.stat-num');
    nums.forEach(function (num) {
      var target = parseInt(num.getAttribute('data-count'), 10);
      var current = 0;
      var increment = target / 40;
      var timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        num.textContent = Math.floor(current);
      }, 30);
    });
  }

  contactForm.addEventListener('submit', function (e) {
    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var subject = document.getElementById('subject').value.trim();
    var message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields.');
      return;
    }

    contactForm.reset();
    showToast('Message sent successfully!');
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  }

  projectCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var url = card.getAttribute('data-url');
      if (url) {
        var absoluteUrl = new URL(url, window.location.href).href;
        window.location.href = absoluteUrl;
      }
    });
  });
});