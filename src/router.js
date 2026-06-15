import { MarketingLayout } from './layouts/MarketingLayout.js';
import { LearnLayout } from './layouts/LearnLayout.js';
import { AdminLayout } from './layouts/AdminLayout.js';

import { HomePage } from './pages/HomePage.js';
import { PatternsPage } from './pages/PatternsPage.js';
import { VisualizersPage } from './pages/VisualizersPage.js';
import { RoadmapPage } from './pages/RoadmapPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { LearnPage } from './pages/LearnPage.js';
import { ProblemPage } from './pages/ProblemPage.js';
import { AdminPage } from './pages/AdminPage.js';

const routes = [
  { path: '/',                      layout: MarketingLayout, page: HomePage },
  { path: '/patterns',              layout: MarketingLayout, page: PatternsPage },
  { path: '/visualizers',           layout: MarketingLayout, page: VisualizersPage },
  { path: '/roadmap',               layout: MarketingLayout, page: RoadmapPage },
  { path: '/about',                 layout: MarketingLayout, page: AboutPage },
  { path: '/learn',                 layout: LearnLayout,     page: LearnPage },
  { path: '/learn/problem/:slug',   layout: LearnLayout,     page: ProblemPage },
  { path: '/admin',                 layout: AdminLayout,     page: AdminPage },
];

export class Router {
  constructor() {
    this.routes = routes.map(route => {
      const regexPath = route.path
        .replace(/\/:[^\/]+/g, '/([^/]+)')
        .replace(/\//g, '\\/');
      return {
        ...route,
        regex: new RegExp(`^${regexPath}$`),
        paramNames: (route.path.match(/\/:[^\/]+/g) || []).map(p => p.slice(2))
      };
    });

    this.currentLayout = null;
    this.currentPage   = null;
    this.activeGenerationId = 0;

    // Intercept client link clicks for SPA navigation
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });

    // Handle browser back / forward
    window.addEventListener('popstate', () => this.resolveRoute());
  }

  navigate(url) {
    history.pushState(null, '', url);
    this.resolveRoute();
  }

  resolveRoute() {
    this.activeGenerationId++;
    const path = window.location.pathname;
    let match = null;

    for (const route of this.routes) {
      const result = path.match(route.regex);
      if (result) {
        const params = {};
        route.paramNames.forEach((name, idx) => {
          params[name] = result[idx + 1];
        });
        match = { route, params };
        break;
      }
    }

    // 404 → redirect home
    if (!match) {
      this.navigate('/');
      return;
    }

    // Guard /admin — must be logged in as admin
    if (match.route.path === '/admin') {
      try {
        const session = JSON.parse(localStorage.getItem('codementor_user_session') || 'null');
        if (!session || session.role !== 'admin') {
          this.navigate('/');
          return;
        }
      } catch(e) {
        this.navigate('/');
        return;
      }
    }

    this.renderPage(match.route, match.params);
  }

  renderPage(route, params) {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;

    // Destroy old page
    if (this.currentPage && typeof this.currentPage.destroy === 'function') {
      this.currentPage.destroy();
    }

    const pageContentHtml = route.page.template(params);
    this.currentPage = route.page;

    // Layout transition if crossing boundary
    if (this.currentLayout !== route.layout) {
      if (this.currentLayout && typeof this.currentLayout.destroy === 'function') {
        this.currentLayout.destroy();
      }
      this.currentLayout = route.layout;
      appRoot.innerHTML = route.layout.render(pageContentHtml);
      if (typeof route.layout.init === 'function') route.layout.init();
    } else {
      const wrapper =
        document.querySelector('.content-wrapper') ||
        document.querySelector('.learn-content-inner') ||
        document.querySelector('.learn-workspace-container');
      if (wrapper) {
        wrapper.innerHTML = pageContentHtml;
      } else {
        appRoot.innerHTML = route.layout.render(pageContentHtml);
        if (typeof route.layout.init === 'function') route.layout.init();
      }
    }

    // Bootstrap page JS
    if (typeof route.page.init === 'function') {
      route.page.init(params);
    }
  }
}
