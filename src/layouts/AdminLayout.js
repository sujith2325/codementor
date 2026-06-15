import { Navbar } from '../components/Navbar.js';

export const AdminLayout = {
  render(contentHtml) {
    return `
      ${Navbar.template()}
      <main id="admin-main" style="min-height: 100vh;">
        <div class="content-wrapper">
          ${contentHtml}
        </div>
      </main>
    `;
  },

  init() {
    Navbar.init();
  },

  destroy() {
    Navbar.destroy();
  }
};
