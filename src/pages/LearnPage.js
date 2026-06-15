export const LearnPage = {
  template() {
    let completedCount = 0;
    try {
      const raw = localStorage.getItem('codementor_story_progress');
      if (raw) {
        const progress = JSON.parse(raw);
        completedCount = Object.values(progress).filter(pct => pct === 100).length;
      }
    } catch (e) {}

    let bookmarksCount = 0;
    try {
      const raw = localStorage.getItem('codementor_bookmarks');
      if (raw) {
        bookmarksCount = JSON.parse(raw).length;
      }
    } catch (e) {}

    return `
      <div class="learn-dashboard" style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1; padding: 40px; text-align: center; gap: 32px; height: 100%;">
        
        <div style="max-width: 500px;">
          <h2 style="font-family: var(--font-display); font-size: 26px; font-weight: 900; color: #ffffff; margin-bottom: 12px;">Welcome to CodeMentor Workspace</h2>
          <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
            Select any challenge from the target questions list on the left to start compiling optimal Python solutions and streaming the LeetCode Story Engine.
          </p>
        </div>

        <div class="stats-overview" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; width: 100%; max-width: 600px;">
          <div style="background: var(--card-glass); border: 1px solid var(--border-color); padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: bold;">Completed</span>
            <span style="font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--color-accepted);">${completedCount}</span>
          </div>
          <div style="background: var(--card-glass); border: 1px solid var(--border-color); padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: bold;">Bookmarks</span>
            <span style="font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--color-complexity);">${bookmarksCount}</span>
          </div>
          <div style="background: var(--card-glass); border: 1px solid var(--border-color); padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 4px;">
            <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: bold;">Keyboard Help</span>
            <span style="font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--color-analysis);">Ctrl + K</span>
          </div>
        </div>

        <div style="font-size: 11px; color: var(--text-muted); font-family: monospace;">
          Press <kbd style="background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px; color:#ffffff;">Ctrl</kbd> + <kbd style="background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px; color:#ffffff;">K</kbd> to launch the Command Palette search console.
        </div>
      </div>
    `;
  },
  init() {},
  destroy() {}
};
