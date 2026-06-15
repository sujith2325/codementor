import '../style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { Router } from './router.js';
import { CommandPalette } from './components/CommandPalette.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================
// 1. LENIS SMOOTH SCROLL
// ==========================================
let lenis;
if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}
window.lenis = lenis;

// ==========================================
// 2. VELOCITY CURSOR & MAGNETIC SNAPPING
// ==========================================
const cursorDot      = document.getElementById('custom-cursor');
const cursorFollower = document.getElementById('custom-cursor-follower');

if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorFollower && !prefersReducedMotion) {
  gsap.set([cursorDot, cursorFollower], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
  const pos   = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mouse = { x: pos.x, y: pos.y };
  const dt = 0.15;
  let activeSnapTarget = null;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    gsap.set(cursorDot, { x: mouse.x, y: mouse.y });
  });

  gsap.ticker.add(() => {
    if (activeSnapTarget) {
      const rect = activeSnapTarget.getBoundingClientRect();
      pos.x += (rect.left + rect.width / 2 - pos.x) * 0.25;
      pos.y += (rect.top + rect.height / 2 - pos.y) * 0.25;
      gsap.set(cursorFollower, { x: pos.x, y: pos.y, width: rect.width + 12, height: rect.height + 12, scaleX: 1, scaleY: 1, rotation: 0 });
    } else {
      const vx = mouse.x - pos.x;
      const vy = mouse.y - pos.y;
      pos.x += vx * dt;
      pos.y += vy * dt;
      const speed   = Math.sqrt(vx * vx + vy * vy);
      const stretch = 1 + Math.min(speed / 90, 0.45);
      const squash  = 1 - Math.min(speed / 90, 0.35);
      gsap.set(cursorFollower, { x: pos.x, y: pos.y, width: 32, height: 32, scaleX: stretch, scaleY: squash, rotation: Math.atan2(vy, vx) * 180 / Math.PI });
    }
  });

  window.setupMagneticSnaps = () => {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      if (el.dataset.magneticBound) return;
      el.dataset.magneticBound = 'true';

      el.addEventListener('mouseenter', () => {
        activeSnapTarget = el;
        cursorDot.classList.add('magnet-locked');
        cursorFollower.classList.add('magnet-locked');
        gsap.to(cursorFollower, { borderRadius: window.getComputedStyle(el).borderRadius, duration: 0.3, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        activeSnapTarget = null;
        cursorDot.classList.remove('magnet-locked');
        cursorFollower.classList.remove('magnet-locked');
        gsap.to(cursorFollower, { borderRadius: '50%', duration: 0.3, ease: 'power2.out' });
        gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: 'power3.out' });
      });
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
      });
    });
  };
  window.setupMagneticSnaps();
} else {
  if (cursorDot)      cursorDot.style.display      = 'none';
  if (cursorFollower) cursorFollower.style.display  = 'none';
  window.setupMagneticSnaps = () => {};
}

// ==========================================
// 3. AUTH MODAL — CREDENTIAL-BASED ROLE
// ==========================================
// Admin credentials (hardcoded for demo)
const ADMIN_EMAIL    = 'admin@codementor.com';
const ADMIN_PASSWORD = 'admin123';
const SESSION_KEY    = 'codementor_user_session';

const authModal        = document.getElementById('auth-modal');
const btnAuthClose     = document.getElementById('btn-auth-close');
const authPanelsSlider = document.getElementById('auth-panels-slider');
const linkGoSignup     = document.getElementById('link-go-signup');
const linkGoSignin     = document.getElementById('link-go-signin');

// ------ Helpers ------
function closeAuthModal() {
  authModal?.classList.remove('active');
}
function showError(inputEl, errorEl, msg) {
  if (inputEl) inputEl.style.borderColor = '#ef4444';
  if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('active'); }
}
function resetAuthErrors() {
  document.querySelectorAll('.auth-card input').forEach(i => { i.style.borderColor = ''; });
  document.querySelectorAll('.auth-card .error-msg').forEach(e => { e.textContent = ''; e.classList.remove('active'); });
}
function shakeCard() {
  const card = document.querySelector('.auth-card');
  if (!card) return;
  card.classList.add('shake');
  setTimeout(() => card.classList.remove('shake'), 400);
}

/**
 * Determines role from credentials.
 * Admin:  email === ADMIN_EMAIL AND password === ADMIN_PASSWORD
 * User:   any other valid email + password combination
 */
function resolveRole(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) return 'admin';
  return 'user';
}

/**
 * Called after any successful login — saves session, updates navbar, redirects.
 */
function handleSuccessfulLogin(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  // Update navbar avatar/state
  if (typeof window.updateNavAuthState === 'function') {
    window.updateNavAuthState(user);
  }

  closeAuthModal();

  // Redirect: admin → /admin, user → /learn
  setTimeout(() => {
    if (user.role === 'admin') {
      window.router.navigate('/admin');
    } else {
      window.router.navigate('/learn');
    }
  }, 300);
}

// ------ Close / keyboard ------
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAuthModal(); });
btnAuthClose?.addEventListener('click', closeAuthModal);
authModal?.addEventListener('click', (e) => { if (e.target === authModal) closeAuthModal(); });

// ------ Panel switching ------
linkGoSignup?.addEventListener('click', (e) => {
  e.preventDefault();
  authPanelsSlider.style.transform = 'translateX(-50%)';
  resetAuthErrors();
});
linkGoSignin?.addEventListener('click', (e) => {
  e.preventDefault();
  authPanelsSlider.style.transform = 'translateX(0%)';
  resetAuthErrors();
});

// ==========================================
// SIGN IN FORM
// ==========================================
const formSignin      = document.getElementById('form-signin');
const btnSigninSubmit = document.getElementById('btn-signin-submit');

formSignin?.addEventListener('submit', (e) => {
  e.preventDefault();
  resetAuthErrors();

  const emailEl    = document.getElementById('signin-email');
  const passwordEl = document.getElementById('signin-password');
  const errEmail   = document.getElementById('err-signin-email');
  const errPass    = document.getElementById('err-signin-password');

  const email    = emailEl?.value.trim()  || '';
  const password = passwordEl?.value      || '';
  let hasError   = false;

  if (!email) {
    showError(emailEl, errEmail, 'Email is required'); hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(emailEl, errEmail, 'Enter a valid email address'); hasError = true;
  }

  if (!password) {
    showError(passwordEl, errPass, 'Password is required'); hasError = true;
  } else if (password.length < 6) {
    showError(passwordEl, errPass, 'Password must be at least 6 characters'); hasError = true;
  }

  if (hasError) { shakeCard(); return; }

  btnSigninSubmit?.classList.add('loading');

  setTimeout(() => {
    btnSigninSubmit?.classList.remove('loading');
    const role = resolveRole(email, password);
    handleSuccessfulLogin({
      name:  email === ADMIN_EMAIL ? 'Admin' : email.split('@')[0],
      email,
      role
    });
    if (emailEl)    emailEl.value    = '';
    if (passwordEl) passwordEl.value = '';
  }, 1200);
});

// ==========================================
// SIGN UP FORM
// ==========================================
const formSignup      = document.getElementById('form-signup');
const btnSignupSubmit = document.getElementById('btn-signup-submit');

formSignup?.addEventListener('submit', (e) => {
  e.preventDefault();
  resetAuthErrors();

  const nameEl    = document.getElementById('signup-name');
  const emailEl   = document.getElementById('signup-email');
  const passEl    = document.getElementById('signup-password');
  const confEl    = document.getElementById('signup-confirm-password');
  const errName   = document.getElementById('err-signup-name');
  const errEmail  = document.getElementById('err-signup-email');
  const errPass   = document.getElementById('err-signup-password');
  const errConf   = document.getElementById('err-signup-confirm-password');

  const name     = nameEl?.value.trim()  || '';
  const email    = emailEl?.value.trim() || '';
  const password = passEl?.value         || '';
  const confirm  = confEl?.value         || '';
  let hasError   = false;

  if (!name)  { showError(nameEl,  errName,  'Full name is required'); hasError = true; }

  if (!email) {
    showError(emailEl, errEmail, 'Email is required'); hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(emailEl, errEmail, 'Enter a valid email address'); hasError = true;
  }

  if (!password) {
    showError(passEl, errPass, 'Password is required'); hasError = true;
  } else if (password.length < 6) {
    showError(passEl, errPass, 'Password must be at least 6 characters'); hasError = true;
  }

  if (!confirm) {
    showError(confEl, errConf, 'Please confirm your password'); hasError = true;
  } else if (confirm !== password) {
    showError(confEl, errConf, 'Passwords do not match'); hasError = true;
  }

  if (hasError) { shakeCard(); return; }

  btnSignupSubmit?.classList.add('loading');

  setTimeout(() => {
    btnSignupSubmit?.classList.remove('loading');
    // Registration always creates a regular user role
    // (admin account can't be registered — it's a hardcoded credential)
    handleSuccessfulLogin({ name, email, role: 'user' });
    if (nameEl)  nameEl.value  = '';
    if (emailEl) emailEl.value = '';
    if (passEl)  passEl.value  = '';
    if (confEl)  confEl.value  = '';
  }, 1200);
});

// ==========================================
// OAUTH BUTTONS (mock → always user role)
// ==========================================
const socialLogins = [
  { id: 'btn-oauth-google-in', name: 'Google Developer', email: 'dev@gmail.com' },
  { id: 'btn-oauth-github-in', name: 'GitHub Wizard',    email: 'wizard@github.com' },
  { id: 'btn-oauth-google-up', name: 'Google Developer', email: 'dev@gmail.com' },
  { id: 'btn-oauth-github-up', name: 'GitHub Wizard',    email: 'wizard@github.com' },
];

socialLogins.forEach(social => {
  const btn = document.getElementById(social.id);
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    btn.style.opacity = '0.6';
    btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.style.opacity = '';
      btn.style.pointerEvents = '';
      handleSuccessfulLogin({ name: social.name, email: social.email, role: 'user' });
    }, 800);
  });
});

// ==========================================
// 4. ROUTER & COMMAND PALETTE
// ==========================================
CommandPalette.init();
window.router = new Router();
window.router.resolveRoute();
