import { Navbar } from '../components/Navbar.js';
import { ProblemSidebar } from '../components/ProblemSidebar.js';

export const LearnLayout = {
  render(contentHtml) {
    return `
      ${Navbar.template()}
      <div class="learn-layout-wrapper" style="display: flex; height: calc(100vh - 65px); margin-top: 65px; overflow: hidden; position: relative; width: 100%;">
        <div class="sidebar-backdrop" id="sidebar-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(4,5,8,0.6); backdrop-filter: blur(4px); z-index: 99; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;"></div>
        
        <!-- Sidebar Problems Navigator -->
        ${ProblemSidebar.template()}
        
        <!-- Workspace Window -->
        <div class="learn-workspace-container" style="flex: 1; overflow: hidden; background: #090b10; position: relative; display: flex; flex-direction: column; width: 100%;">
          <button class="btn-mobile-sidebar-toggle" id="btn-mobile-sidebar-toggle" aria-expanded="false" aria-controls="sandbox-sidebar" aria-label="Toggle target questions sidebar" style="display: none; position: absolute; top: 12px; left: 16px; width: 36px; height: 36px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; color: #ffffff; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; z-index: 90;">☰</button>
          <div class="learn-content-inner" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; height: 100%; width: 100%;">
            ${contentHtml}
          </div>
        </div>
      </div>
    `;
  },

  init() {
    Navbar.init();
    ProblemSidebar.init();

    const toggleBtn = document.getElementById('btn-mobile-sidebar-toggle');
    const sidebar = document.getElementById('sandbox-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (toggleBtn && sidebar && backdrop) {
      const openDrawer = () => {
        sidebar.classList.add('mobile-open');
        backdrop.classList.add('mobile-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        sidebar.focus();
      };

      const closeDrawer = () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('mobile-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      };

      toggleBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('mobile-open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });

      backdrop.addEventListener('click', closeDrawer);

      this._escHandler = (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
          closeDrawer();
          toggleBtn.focus();
        }
      };
      window.addEventListener('keydown', this._escHandler);
    }
  },

  destroy() {
    Navbar.destroy();
    ProblemSidebar.destroy();
    if (this._escHandler) {
      window.removeEventListener('keydown', this._escHandler);
    }
  }
};
