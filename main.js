/* =========================================
   KALKIO WORKSPACE — Shared JavaScript
   main.js
   ========================================= */

/* =========================================
   NAVIGATION
   ========================================= */

const siteNav    = document.querySelector('.site-nav');
const hamburger  = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-mobile');

// Scroll → add .scrolled for frosted-glass effect
if (siteNav) {
  const onScroll = () => {
    siteNav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

// Hamburger toggle
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close menu when a link is tapped
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    });
  });
}

// Highlight the active nav link based on current page filename
(function highlightActiveLink() {
  const path     = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === filename ||
      (filename === '' && href === 'index.html') ||
      (filename === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
})();

/* =========================================
   CHATBOT FLOATING WIDGET
   ========================================= */

const chatLauncher = document.getElementById('chat-launcher');
const chatWidget   = document.getElementById('chat-widget');
const chatClose    = document.getElementById('chat-close');

function openChat() {
  chatWidget.classList.add('chat-open');
  chatLauncher.setAttribute('aria-expanded', 'true');
  chatLauncher.setAttribute('aria-label', 'Close chat');
}

function closeChat() {
  chatWidget.classList.remove('chat-open');
  chatLauncher.setAttribute('aria-expanded', 'false');
  chatLauncher.setAttribute('aria-label', 'Open chat');
}

if (chatLauncher && chatWidget) {
  chatLauncher.addEventListener('click', () => {
    chatWidget.classList.contains('chat-open') ? closeChat() : openChat();
  });

  if (chatClose) {
    chatClose.addEventListener('click', closeChat);
  }

  // Close on outside click
  document.addEventListener('click', e => {
    if (
      chatWidget.classList.contains('chat-open') &&
      !chatWidget.contains(e.target) &&
      !chatLauncher.contains(e.target)
    ) {
      closeChat();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && chatWidget.classList.contains('chat-open')) {
      closeChat();
      chatLauncher.focus();
    }
  });
}

/* =========================================
   FORM VALIDATION (shared)
   ========================================= */

/**
 * Validates a single field and toggles error state.
 * Returns true if the field passes, false if it fails.
 */
function validateField(field) {
  const group    = field.closest('.form-group');
  const errorMsg = group ? group.querySelector('.form-error-msg') : null;
  const val      = field.value.trim();

  // Clear previous state
  field.classList.remove('error');
  if (errorMsg) errorMsg.classList.remove('visible');

  // Required check
  if (field.hasAttribute('required') && !val) {
    field.classList.add('error');
    if (errorMsg) { errorMsg.textContent = 'This field is required.'; errorMsg.classList.add('visible'); }
    return false;
  }

  // Email format
  if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    field.classList.add('error');
    if (errorMsg) { errorMsg.textContent = 'Please enter a valid email address.'; errorMsg.classList.add('visible'); }
    return false;
  }

  // Phone format (basic)
  if (field.type === 'tel' && val && !/^[\d\s+\-()\\.]{7,20}$/.test(val)) {
    field.classList.add('error');
    if (errorMsg) { errorMsg.textContent = 'Please enter a valid phone number.'; errorMsg.classList.add('visible'); }
    return false;
  }

  return true;
}

/**
 * Validates all required/typed fields in a form.
 * Returns true if all pass.
 */
function validateForm(formEl) {
  let valid = true;
  formEl.querySelectorAll('input, select, textarea').forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

// Clear individual field errors on change/blur
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
  field.addEventListener('blur',  () => { if (field.value.trim()) validateField(field); });
  field.addEventListener('input', () => { if (field.classList.contains('error')) validateField(field); });
});

/* =========================================
   ENQUIRY FORM — index.html
   ========================================= */

const enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(enquiryForm)) return;

    // TODO: Replace with real form submission (Netlify Forms, Formspree, API endpoint, etc.)
    const successMsg = document.getElementById('enquiry-success');
    enquiryForm.reset();
    if (successMsg) {
      successMsg.textContent = 'Thanks! We\'ll be in touch shortly.';
      successMsg.classList.add('visible');
      setTimeout(() => successMsg.classList.remove('visible'), 6000);
    }
  });
}

/* =========================================
   BOOK A TOUR FORM — book-tour.html
   ========================================= */

const tourForm = document.getElementById('tour-form');
if (tourForm) {
  tourForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(tourForm)) return;

    // TODO: Replace with real form submission
    const successMsg = document.getElementById('tour-success');
    tourForm.reset();
    if (successMsg) {
      successMsg.textContent = 'Tour request received! We\'ll confirm your slot within 24 hours.';
      successMsg.classList.add('visible');
      setTimeout(() => successMsg.classList.remove('visible'), 6000);
    }
  });
}

/* =========================================
   SMOOTH SCROLL — anchor links
   ========================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = siteNav ? siteNav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =========================================
   INTERSECTION OBSERVER — fade-in on scroll
   ========================================= */

(function initFadeIn() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(18px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.feature-card, .location-card, .membership-card, .testimonial-card, ' +
    '.amenity-item, .event-space-card, .location-full-card, .tour-step'
  );

  if (!window.IntersectionObserver || !targets.length) return;

  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)')];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();
