import { Navbar } from '../components/Navbar.js';

export const MarketingLayout = {
  render(contentHtml) {
    return `
      ${Navbar.template()}
      <main id="marketing-container" style="min-height: 100vh; display: flex; flex-direction: column;">
        <div class="content-wrapper" style="flex: 1;">
          ${contentHtml}
        </div>
        
        <!-- Marketing Footer -->
        <footer id="footer">
          <div class="footer-cta-card">
            <h2>Stop Memorizing. Start Understanding.</h2>
            <p>Install the Codex skill to configure your local workspace, translating messy prompts into optimal coding solutions.</p>
            <div class="footer-actions">
              <button class="btn btn-primary" data-magnetic id="btn-launch-sandbox-footer">Launch Sandbox</button>
              <button class="btn btn-secondary" data-magnetic id="btn-explore-patterns-footer">Explore Patterns</button>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2026 CodeMentor. Designed by Aman Attar. MIT License.</span>
            <a href="https://github.com/amanattar/" target="_blank" data-magnetic>GitHub Profile</a>
          </div>
        </footer>
      </main>
    `;
  },

  init() {
    Navbar.init();
    
    // Bind footer buttons
    const btnLaunch = document.getElementById('btn-launch-sandbox-footer');
    const btnExplore = document.getElementById('btn-explore-patterns-footer');
    
    if (btnLaunch) {
      btnLaunch.addEventListener('click', () => {
        window.router.navigate('/learn');
      });
    }
    if (btnExplore) {
      btnExplore.addEventListener('click', () => {
        window.router.navigate('/patterns');
      });
    }
  },

  destroy() {
    Navbar.destroy();
  }
};
