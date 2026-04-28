function initTheme() {
  const saved = localStorage.getItem('wg-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = saved === 'dark' ? '☀' : '☾';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('wg-theme', next);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = next === 'dark' ? '☀' : '☾';
}

function initNavbar() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
  });

  document.addEventListener('click', event => {
    if (!toggle.contains(event.target) && !menu.contains(event.target)) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('nav .dropdown > a').forEach(link => {
    link.addEventListener('click', event => {
      if (window.innerWidth <= 768) {
        event.preventDefault();
        const menuPanel = link.nextElementSibling;
        if (menuPanel) menuPanel.style.display = menuPanel.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  });
}

function initSearch() {
  const form = document.getElementById('heroSearch');
  const input = document.getElementById('searchInput');
  if (!form || !input) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    window.location.href = `pages/destinations.html?search=${encodeURIComponent(query)}`;
  });
}

function filterDestinations(category) {
  document.querySelectorAll('.filter-btn').forEach(button => button.classList.remove('active'));
  const activeButton = document.querySelector(`[data-filter="${category}"]`);
  if (activeButton) activeButton.classList.add('active');

  document.querySelectorAll('.card[data-category]').forEach(card => {
    card.style.display = category === 'all' || card.dataset.category === category ? 'flex' : 'none';
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    const error = field.parentElement.querySelector('.field-error');
    if (!field.value.trim()) {
      valid = false;
      field.style.borderColor = 'var(--brand-accent-color)';
      if (error) error.style.display = 'block';
    } else if (field.type === 'email' && !validateEmail(field.value)) {
      valid = false;
      field.style.borderColor = 'var(--brand-accent-color)';
      if (error) {
        error.textContent = 'Please enter a valid email.';
        error.style.display = 'block';
      }
    } else {
      field.style.borderColor = '';
      if (error) error.style.display = 'none';
    }
  });

  return valid;
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('wg-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'wg-toast';
    document.body.appendChild(toast);
  }

  toast.style.background = type === 'success' ? '#2e7d9a' : type === 'error' ? '#e05c2a' : '#1a3c5e';
  toast.textContent = message;
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
  }, 3500);
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(target => observer.observe(target));
}

function animateCounter(element, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start = Math.min(start + step, target);
    element.textContent = Math.floor(start).toLocaleString();
    if (start < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(element => {
    const target = parseInt(element.dataset.counter, 10);
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(element, target);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(element);
  });
}

function initTableSelect() {
  document.querySelectorAll('table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('table tbody tr').forEach(item => item.classList.remove('table-row-selected'));
      row.classList.toggle('table-row-selected');
    });
  });
}

function handleLogin(event) {
  event.preventDefault();
  if (!validateForm('loginForm')) return;
  showToast('Welcome back! Redirecting...');
  setTimeout(() => {
    window.location.href = '../pages/dashboard.html';
  }, 1600);
}

function handleSignup(event) {
  event.preventDefault();
  const password = document.getElementById('signupPassword')?.value;
  const confirm = document.getElementById('signupPassword2')?.value;
  if (password !== confirm) {
    showToast('Passwords do not match.', 'error');
    return;
  }
  if (!validateForm('signupForm')) return;
  showToast('Account created! Welcome to WanderGuide.');
  setTimeout(() => {
    window.location.href = '../pages/dashboard.html';
  }, 1800);
}

function handleContact(event) {
  event.preventDefault();
  if (!validateForm('contactForm')) return;
  showToast("Message sent! We'll reply within 24 hours.");
  event.target.reset();
}

function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = body.style.maxHeight;
      document.querySelectorAll('.accordion-body').forEach(item => {
        item.style.maxHeight = '';
      });
      document.querySelectorAll('.accordion-header').forEach(item => {
        item.classList.remove('active');
      });
      if (!isOpen) {
        body.style.maxHeight = `${body.scrollHeight}px`;
        header.classList.add('active');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initSearch();
  initScrollReveal();
  initCounters();
  initTableSelect();
  initAccordion();

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const contactForm = document.getElementById('contactForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (signupForm) signupForm.addEventListener('submit', handleSignup);
  if (contactForm) contactForm.addEventListener('submit', handleContact);
});
