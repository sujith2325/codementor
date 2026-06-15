import { gsap } from 'gsap';

export const Navbar = {
  template() {
    return `
      <header id="header">
        <div class="logo" data-magnetic id="nav-logo" style="cursor: pointer;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          CODEMENTOR
        </div>
        <nav class="nav-links-container">
          <div class="nav-active-pill" id="nav-active-pill"></div>
          <a href="/" class="nav-link" data-link data-magnetic>Overview</a>
          <a href="/learn" class="nav-link" data-link data-magnetic>Sandbox</a>
          <a href="/patterns" class="nav-link" data-link data-magnetic>Patterns</a>
          <a href="/visualizers" class="nav-link" data-link data-magnetic>Visualizers</a>
          <a href="/roadmap" class="nav-link" data-link data-magnetic>Roadmap</a>
          <a href="/about" class="nav-link" data-link data-magnetic>About</a>
        </nav>
        <div class="header-right-actions" style="display: flex; align-items: center; gap: 12px;">

          <!-- Theme Toggle Button -->
          <button class="btn-theme-toggle" id="btn-theme-toggle" title="Toggle Light/Dark Mode" aria-label="Toggle theme">
            <!-- Sun icon (visible in light mode) -->
            <svg class="icon-sun" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <!-- Moon icon (visible in dark mode) -->
            <svg class="icon-moon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <button class="btn-signin-nav" id="btn-signin-nav" data-magnetic>Sign In</button>
          
          <div class="user-avatar-wrap" id="user-avatar-wrap" style="display: none; position: relative;">
            <div class="user-avatar" id="user-avatar" style="position:relative;"></div>
            <div class="user-dropdown" id="user-dropdown">
              <div class="user-dropdown-header">
                <span class="user-dropdown-name" id="user-dropdown-name"></span>
                <span class="user-dropdown-email" id="user-dropdown-email"></span>
                <span class="user-dropdown-role" id="user-dropdown-role" style="font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-top:4px; color: var(--color-ai);"></span>
              </div>
              <!-- Admin Panel (shown for admin users) -->
              <div class="admin-panel-card" id="admin-panel" style="display:none;">
                <h4>
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Admin Panel
                </h4>
                <div class="admin-stat-row">
                  <div class="admin-stat">
                    <span class="admin-stat-label">Users</span>
                    <span class="admin-stat-val" id="admin-stat-users">1,524</span>
                  </div>
                  <div class="admin-stat">
                    <span class="admin-stat-label">Problems</span>
                    <span class="admin-stat-val">1,520</span>
                  </div>
                  <div class="admin-stat">
                    <span class="admin-stat-label">Sessions</span>
                    <span class="admin-stat-val">8.4k</span>
                  </div>
                  <div class="admin-stat">
                    <span class="admin-stat-label">Solved</span>
                    <span class="admin-stat-val">42.1k</span>
                  </div>
                </div>
                <div class="admin-actions-row">
                  <button class="admin-action-btn" onclick="alert('User Management (Demo)')">Manage Users</button>
                  <button class="admin-action-btn" onclick="alert('Analytics Dashboard (Demo)')">Analytics</button>
                </div>
              </div>
              <button class="user-dropdown-item" id="btn-logout" style="width: 100%; border: none; background: transparent; text-align: left; cursor: pointer; color: #fca5a5;">Sign Out</button>
            </div>
          </div>

          <button class="nav-cta" id="btn-install-skill" data-magnetic>
            Install Skill
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="8 17 12 21 16 17"></polyline>
              <line x1="12" y1="12" x2="12" y2="21"></line>
              <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
            </svg>
          </button>
        </div>
      </header>
    `;
  },

  init() {
    const sessionKey = 'codementor_user_session';
    const header = document.getElementById('header');
    
    // Header scrolled styling
    const scrollHandler = () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', scrollHandler);
    this._scrollHandler = scrollHandler;

    // Logo navigation
    const logo = document.getElementById('nav-logo');
    if (logo) {
      logo.addEventListener('click', () => {
        window.router.navigate('/');
      });
    }

    // Active nav indicator pill slide
    const navContainer = document.querySelector('.nav-links-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const navActivePill = document.getElementById('nav-active-pill');

    if (navContainer && navActivePill) {
      const currentPath = window.location.pathname;
      navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        const isActive = (linkPath === '/' && currentPath === '/') || 
                         (linkPath !== '/' && currentPath.startsWith(linkPath));
                         
        if (isActive) {
          link.classList.add('active');
          setTimeout(() => {
            const linkRect = link.getBoundingClientRect();
            const containerRect = navContainer.getBoundingClientRect();
            gsap.set(navActivePill, {
              x: linkRect.left - containerRect.left,
              width: linkRect.width,
              opacity: 1
            });
          }, 100);
        } else {
          link.classList.remove('active');
        }

        link.addEventListener('mouseenter', () => {
          const linkRect = link.getBoundingClientRect();
          const containerRect = navContainer.getBoundingClientRect();
          gsap.to(navActivePill, {
            x: linkRect.left - containerRect.left,
            width: linkRect.width,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });

      navContainer.addEventListener('mouseleave', () => {
        const activeLink = navContainer.querySelector('.nav-link.active');
        if (activeLink) {
          const linkRect = activeLink.getBoundingClientRect();
          const containerRect = navContainer.getBoundingClientRect();
          gsap.to(navActivePill, {
            x: linkRect.left - containerRect.left,
            width: linkRect.width,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          gsap.to(navActivePill, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    }

    // ==========================================
    // THEME TOGGLE
    // ==========================================
    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        try { localStorage.setItem('codementor_theme', next); } catch(e) {}

        // Animate toggle button
        gsap.fromTo(btnTheme, 
          { rotate: 0, scale: 1 },
          { rotate: 360, scale: 1.15, duration: 0.5, ease: 'back.out(2)', 
            onComplete: () => gsap.to(btnTheme, { scale: 1, duration: 0.2 }) }
        );
      });
    }

    // ==========================================
    // AUTH STATE - WITH ROLE SUPPORT
    // ==========================================
    const getInitials = (name) => {
      if (!name) return 'CM';
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const updateAuthState = (user) => {
      const btnSigninNav = document.getElementById('btn-signin-nav');
      const userAvatarWrap = document.getElementById('user-avatar-wrap');
      const userAvatar = document.getElementById('user-avatar');
      const userDropdownName = document.getElementById('user-dropdown-name');
      const userDropdownEmail = document.getElementById('user-dropdown-email');
      const userDropdownRole = document.getElementById('user-dropdown-role');
      const adminPanel = document.getElementById('admin-panel');
      
      if (user) {
        if (btnSigninNav) btnSigninNav.style.display = 'none';
        if (userAvatarWrap) userAvatarWrap.style.display = 'block';
        if (userAvatar) {
          userAvatar.textContent = getInitials(user.name);
          // Style avatar based on role
          if (user.role === 'admin') {
            userAvatar.classList.add('admin');
          } else {
            userAvatar.classList.remove('admin');
          }
          // Role indicator dot
          let indicator = userAvatar.querySelector('.role-indicator');
          if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'role-indicator';
            userAvatar.appendChild(indicator);
          }
          indicator.className = `role-indicator ${user.role || 'user'}`;
        }
        if (userDropdownName) userDropdownName.textContent = user.name;
        if (userDropdownEmail) userDropdownEmail.textContent = user.email;
        if (userDropdownRole) {
          userDropdownRole.textContent = user.role === 'admin' ? '⚡ Administrator' : '● Member';
          userDropdownRole.style.color = user.role === 'admin' ? '#f59e0b' : 'var(--color-accepted)';
        }
        // Show admin panel in dropdown only for admins
        if (adminPanel) adminPanel.style.display = user.role === 'admin' ? 'flex' : 'none';
      } else {
        if (btnSigninNav) btnSigninNav.style.display = 'block';
        if (userAvatarWrap) userAvatarWrap.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'none';
      }
    };

    const storedSession = localStorage.getItem(sessionKey);
    if (storedSession) {
      try {
        const user = JSON.parse(storedSession);
        updateAuthState(user);
      } catch (e) {
        localStorage.removeItem(sessionKey);
        updateAuthState(null);
      }
    }

    // Expose globally so main.js auth forms can call it after login
    window.updateNavAuthState = updateAuthState;

    // Bind auth click trigger — just opens modal
    const btnSignin = document.getElementById('btn-signin-nav');
    if (btnSignin) {
      btnSignin.addEventListener('click', () => {
        const modal = document.getElementById('auth-modal');
        if (modal) {
          // Always open to Sign In panel
          const slider = document.getElementById('auth-panels-slider');
          if (slider) slider.style.transform = 'translateX(0%)';
          modal.classList.add('active');
        }
      });
    }

    // Bind logout trigger
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem(sessionKey);
        updateAuthState(null);
      });
    }

    // Install skill trigger mock
    const btnInstall = document.getElementById('btn-install-skill');
    if (btnInstall) {
      btnInstall.addEventListener('click', () => {
        alert('CodeMentor local IDE skill helper installation package download starting... (Mockup)');
      });
    }

    this.setupMagnetLocks();
  },

  setupMagnetLocks() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const pullX = e.clientX - rect.left - rect.width / 2;
        const pullY = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(el, {
          x: pullX * 0.3,
          y: pullY * 0.3,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: 'power3.out' });
      });
    });
  },

  destroy() {
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler);
    }
  }
};
