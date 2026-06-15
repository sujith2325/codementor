import { SearchEngine } from '../engine/SearchEngine.js';

export const CommandPalette = {
  init() {
    if (this.isInitialized) {
      this.destroy();
    }
    this.isInitialized = true;
    this.isOpen = false;
    this.activeIndex = 0;
    this.results = [];

    // Inject palette markup to body if not already present
    if (!document.getElementById('command-palette')) {
      const el = document.createElement('div');
      el.id = 'command-palette';
      el.className = 'command-palette';
      el.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(4, 5, 8, 0.7); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); z-index: 999999; display: flex; align-items: flex-start; justify-content: center; padding-top: 15vh; opacity: 0; pointer-events: none; transition: opacity 0.25s ease;';
      el.innerHTML = `
        <div class="command-card" style="width: 500px; background: rgba(15, 17, 28, 0.85); border: 1px solid var(--border-color); border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); overflow: hidden; display: flex; flex-direction: column;">
          <div style="padding: 16px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.25);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="command-search-input" placeholder="Type a command or search problems..." style="flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 13px; font-family: var(--font-body);">
            <kbd style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; font-size: 10px; color: var(--text-muted); font-family: monospace;">ESC</kbd>
          </div>
          <div id="command-results-list" style="max-height: 300px; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px;">
            <!-- Rendered dynamically -->
          </div>
        </div>
      `;
      document.body.appendChild(el);
    }

    this.palette = document.getElementById('command-palette');
    this.searchInput = document.getElementById('command-search-input');
    this.resultsList = document.getElementById('command-results-list');

    // Bind keyboard shortcut Ctrl + K (or Cmd + K)
    this._keydownHandler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
      } else if (this.isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.moveActive(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.moveActive(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.triggerActive();
        }
      }
    };
    window.addEventListener('keydown', this._keydownHandler);

    // Bind close click
    this.palette.addEventListener('click', (e) => {
      if (e.target === this.palette) {
        this.close();
      }
    });

    // Bind input search
    this.searchInput.addEventListener('input', () => {
      this.activeIndex = 0;
      this.updateResults();
    });

    // Render initial list
    this.updateResults();
  },

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  },

  open() {
    this.isOpen = true;
    this.palette.style.opacity = '1';
    this.palette.style.pointerEvents = 'auto';
    this.activeIndex = 0;
    this.updateResults();
    setTimeout(() => {
      this.searchInput.focus();
      this.searchInput.value = '';
    }, 50);
  },

  close() {
    this.isOpen = false;
    this.palette.style.opacity = '0';
    this.palette.style.pointerEvents = 'none';
    this.searchInput.blur();
  },

  updateResults() {
    const query = this.searchInput.value.toLowerCase().trim();
    this.results = [];

    // Core static navigation items
    const staticPages = [
      { type: 'action', title: 'Go to Overview', path: '/' },
      { type: 'action', title: 'Go to Sandbox Dashboard', path: '/learn' },
      { type: 'action', title: 'Go to Pattern Library', path: '/patterns' },
      { type: 'action', title: 'Go to Visualizer Hub', path: '/visualizers' },
      { type: 'action', title: 'Go to Roadmap', path: '/roadmap' },
      { type: 'action', title: 'Go to About Us', path: '/about' }
    ];

    if (!query) {
      // Show static navigation list and bookmarks by default
      this.results = [...staticPages];
      
      // Load bookmarks
      try {
        const raw = localStorage.getItem('codementor_bookmarks');
        if (raw) {
          const bookmarks = JSON.parse(raw);
          const bookmarkedProblems = bookmarks.map(key => {
            const prob = SearchEngine.getProblemByKey(key);
            if (prob) {
              return { type: 'problem', title: `${prob.id}. ${prob.title} (★ Bookmarked)`, problem: prob };
            }
            return null;
          }).filter(x => !!x);
          this.results = [...this.results, ...bookmarkedProblems];
        }
      } catch (e) {}
    } else {
      // Filter pages
      const matchedPages = staticPages.filter(p => p.title.toLowerCase().includes(query));
      
      // Filter problems
      const matchedProblems = SearchEngine.searchProblems(query).map(prob => ({
        type: 'problem',
        title: `${prob.id}. ${prob.title} (${prob.difficulty})`,
        problem: prob
      }));

      this.results = [...matchedPages, ...matchedProblems];
    }

    this.render();
  },

  render() {
    this.resultsList.innerHTML = '';
    
    if (this.results.length === 0) {
      this.resultsList.innerHTML = `<span style="font-size:11px; color:var(--text-muted); text-align:center; padding:12px 0;">No matching actions or problems found.</span>`;
      return;
    }

    this.results.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = `command-item${idx === this.activeIndex ? ' active' : ''}`;
      row.style.cssText = `padding: 10px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all 0.15s; display: flex; justify-content: space-between; align-items: center; color: ${idx === this.activeIndex ? '#ffffff' : 'var(--text-secondary)'}; background: ${idx === this.activeIndex ? 'rgba(255,255,255,0.05)' : 'transparent'}; border: 1px solid ${idx === this.activeIndex ? 'rgba(255,255,255,0.05)' : 'transparent'};`;
      
      let indicator = '⚡';
      if (item.type === 'problem') {
        indicator = '✏️';
        if (item.title.includes('Bookmarked')) indicator = '★';
      }

      row.innerHTML = `
        <span style="display:flex; align-items:center; gap:8px;">
          <span>${indicator}</span>
          <span>${item.title}</span>
        </span>
        <span style="font-size:10px; color:var(--text-muted); font-family:monospace;">${idx === this.activeIndex ? 'ENTER ↵' : ''}</span>
      `;

      row.addEventListener('click', () => {
        this.activeIndex = idx;
        this.triggerActive();
      });

      this.resultsList.appendChild(row);
    });
  },

  moveActive(direction) {
    if (this.results.length === 0) return;
    this.activeIndex = (this.activeIndex + direction + this.results.length) % this.results.length;
    
    // Scroll active item into view if out of bounds
    this.render();
    const activeEl = this.resultsList.querySelector('.command-item.active');
    if (activeEl) {
      const top = activeEl.offsetTop;
      const bottom = top + activeEl.clientHeight;
      const viewTop = this.resultsList.scrollTop;
      const viewBottom = viewTop + this.resultsList.clientHeight;

      if (top < viewTop) {
        this.resultsList.scrollTop = top;
      } else if (bottom > viewBottom) {
        this.resultsList.scrollTop = bottom - this.resultsList.clientHeight;
      }
    }
  },

  triggerActive() {
    const activeItem = this.results[this.activeIndex];
    if (!activeItem) return;

    this.close();

    if (activeItem.type === 'action') {
      window.router.navigate(activeItem.path);
    } else if (activeItem.type === 'problem') {
      const slug = SearchEngine.getSlugForProblem(activeItem.problem);
      window.router.navigate(`/learn/problem/${slug}`);
    }
  },

  destroy() {
    if (this._keydownHandler) {
      window.removeEventListener('keydown', this._keydownHandler);
    }
    const el = document.getElementById('command-palette');
    if (el) el.remove();
    this.isInitialized = false;
  }
};
