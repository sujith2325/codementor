export const AboutPage = {
  template() {
    return `
      <section id="about-hero" style="padding: 120px 0 60px 0; text-align: center; background: linear-gradient(to bottom, rgba(139,92,246,0.03) 0%, transparent 100%);">
        <div class="container" style="max-width: 800px;">
          <span class="section-tag section-tag-purple">About Us</span>
          <h1 style="font-family: var(--font-display); font-size: 40px; font-weight: 900; margin-top: 12px; margin-bottom: 24px; color: #ffffff;">The CodeMentor Vision</h1>
          <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px;">
            CodeMentor was created to shift the software engineering interview prep model away from brute memorization. Instead of memorizing 100+ separate optimal structures, CodeMentor trains engineers in the underlying algorithmic patterns.
          </p>
          <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.7;">
            By translating messy coding prompts into structured scrollytelling engineering walkthroughs, our system demystifies graph search boundary limits, dynamic programming states tables, and doubly-linked list evictions.
          </p>
        </div>
      </section>

      <section id="about-details" style="padding: 40px 0 100px 0;">
        <div class="container" style="max-width: 800px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <div style="background: var(--card-glass); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px;">
            <h3 style="font-family: var(--font-display); font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 12px;">Technical Specs</h3>
            <ul style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; list-style-type: square; padding-left: 20px;">
              <li>Fuzzy search indexed over 1,500+ LeetCode problems.</li>
              <li>Fully interactive client-side sandbox player.</li>
              <li>Dual-Layout architecture splitting marketing/dashboard scopes.</li>
              <li>Lightweight in-memory search running at 60 FPS.</li>
            </ul>
          </div>

          <div style="background: var(--card-glass); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px;">
            <h3 style="font-family: var(--font-display); font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 12px;">Open Source</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
              CodeMentor is distributed under the MIT License. Contributions are welcome on GitHub.
            </p>
            <a href="https://github.com/amanattar/" target="_blank" class="btn btn-secondary" style="padding: 10px 16px; font-size: 12px; text-decoration: none; display: inline-block;">GitHub Profile</a>
          </div>
        </div>
      </section>
    `;
  },
  init() {},
  destroy() {}
};
