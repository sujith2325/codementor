import { SearchEngine } from '../engine/SearchEngine.js';

export const ProblemSidebar = {
  template() {
    return `
      <div class="sandbox-sidebar" id="sandbox-sidebar" tabindex="-1" style="width: 320px; border-right: 1px solid var(--border-color); background: rgba(15, 17, 28, 0.4); display: flex; flex-direction: column; height: 100%; overflow: hidden; flex-shrink: 0; outline: none;">
        <div class="sidebar-header" style="padding: 16px; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-display); font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; color: #ffffff;">
            <span>Target Questions</span>
            <span class="questions-count-badge" style="font-size: 10px; background: var(--color-ai); padding: 2px 6px; border-radius: 6px; color: #ffffff;">1,500+</span>
          </h3>
          <div class="search-box-wrapper" style="position: relative;">
            <input type="text" id="problem-search" placeholder="Search 1,500+ questions... (e.g. 5, LRU, Hard)" style="width: 100%; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01); color: #ffffff; font-size: 12px; outline: none; transition: var(--transition-fast);">
          </div>
        </div>
        
        <!-- Sidebar Navigation Tabs -->
        <div class="sidebar-tabs" style="display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid var(--border-color); font-size: 11px; font-weight: 600; text-align: center;">
          <div class="sidebar-tab active" id="tab-problems" style="padding: 12px 0; cursor: pointer; color: #ffffff; border-bottom: 2px solid var(--color-ai); transition: var(--transition-fast);">Problems</div>
          <div class="sidebar-tab" id="tab-bookmarks" style="padding: 12px 0; cursor: pointer; color: var(--text-muted); border-bottom: 2px solid transparent; transition: var(--transition-fast);">Bookmarks</div>
          <div class="sidebar-tab" id="tab-history" style="padding: 12px 0; cursor: pointer; color: var(--text-muted); border-bottom: 2px solid transparent; transition: var(--transition-fast);">History</div>
        </div>
 
        <!-- Scrollable lists container -->
        <div class="sandbox-problems-list" id="sandbox-problems-list" style="flex: 1; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; padding: 16px;">
          <!-- Loaded dynamically -->
        </div>
      </div>
    `;
  },

  init() {
    this.activeTab = 'problems';
    this.searchQuery = '';
    
    const inputSearch = document.getElementById('problem-search');
    const tabProblems = document.getElementById('tab-problems');
    const tabBookmarks = document.getElementById('tab-bookmarks');
    const tabHistory = document.getElementById('tab-history');

    if (inputSearch) {
      inputSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderList();
      });
    }

    const setTab = (tabId) => {
      this.activeTab = tabId;
      [tabProblems, tabBookmarks, tabHistory].forEach(tab => {
        if (!tab) return;
        if (tab.id === `tab-${tabId}`) {
          tab.classList.add('active');
          tab.style.color = '#ffffff';
          tab.style.borderBottomColor = 'var(--color-ai)';
        } else {
          tab.classList.remove('active');
          tab.style.color = 'var(--text-muted)';
          tab.style.borderBottomColor = 'transparent';
        }
      });
      this.renderList();
    };

    if (tabProblems) tabProblems.addEventListener('click', () => setTab('problems'));
    if (tabBookmarks) tabBookmarks.addEventListener('click', () => setTab('bookmarks'));
    if (tabHistory) tabHistory.addEventListener('click', () => setTab('history'));

    // Initial render
    this.renderList();
  },

  getBookmarks() {
    try {
      const raw = localStorage.getItem('codementor_bookmarks');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  getHistory() {
    try {
      const raw = localStorage.getItem('codementor_history');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  renderList() {
    const listContainer = document.getElementById('sandbox-problems-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    // Get full matched list from SearchEngine
    let problems = SearchEngine.searchProblems(this.searchQuery);
    
    // Filter based on active tab
    if (this.activeTab === 'bookmarks') {
      const bookmarks = this.getBookmarks();
      problems = problems.filter(p => bookmarks.includes(p.key));
    } else if (this.activeTab === 'history') {
      const history = this.getHistory();
      problems = history
        .map(key => problems.find(p => p.key === key))
        .filter(p => !!p);
    }

    if (problems.length === 0) {
      listContainer.innerHTML = `<span style="font-size:11px; color:var(--text-muted); text-align:center; padding:20px 0; font-family:var(--font-body);">No questions found in ${this.activeTab}.</span>`;
      return;
    }

    const limit = 40;
    const toRender = problems.slice(0, limit);
    
    // Get active problem from path
    let activeKey = '';
    const match = window.location.pathname.match(/\/learn\/problem\/(.+)$/);
    if (match) {
      const prob = SearchEngine.getProblemBySlug(match[1]);
      if (prob) activeKey = prob.key;
    }

    toRender.forEach(prob => {
      const card = document.createElement('div');
      card.className = `problem-option-card${prob.key === activeKey ? ' active' : ''}`;
      card.setAttribute('data-problem', prob.key);
      
      const bookmarks = this.getBookmarks();
      const isStarred = bookmarks.includes(prob.key);
      
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
          <span class="difficulty-tag ${prob.difficulty.toLowerCase()}">${prob.difficulty}</span>
          <span class="star-icon" style="color: ${isStarred ? 'var(--color-complexity)' : 'var(--text-muted)'}; cursor: pointer; font-size: 13px;">★</span>
        </div>
        <h4 style="font-family: var(--font-display); font-size: 13px; font-weight: 800; margin-top: 4px; margin-bottom: 4px; color: #ffffff;">${prob.id}. ${prob.title}</h4>
        <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.3; margin: 0; font-family: var(--font-body);">${prob.desc}</p>
      `;
      
      const star = card.querySelector('.star-icon');
      if (star) {
        star.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleBookmark(prob.key);
          this.renderList();
        });
      }

      card.addEventListener('click', () => {
        const slug = SearchEngine.getSlugForProblem(prob);
        window.router.navigate(`/learn/problem/${slug}`);
      });
      
      listContainer.appendChild(card);
    });

    if (problems.length > limit) {
      const truncated = document.createElement('div');
      truncated.style.cssText = 'font-size: 9.5px; color: var(--text-muted); text-align: center; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.02); font-family: var(--font-body);';
      truncated.innerText = `Showing 40 of ${problems.length} results...`;
      listContainer.appendChild(truncated);
    }
  },

  toggleBookmark(key) {
    let bookmarks = this.getBookmarks();
    if (bookmarks.includes(key)) {
      bookmarks = bookmarks.filter(k => k !== key);
    } else {
      bookmarks.push(key);
    }
    bookmarks = [...new Set(bookmarks)];
    localStorage.setItem('codementor_bookmarks', JSON.stringify(bookmarks));
  },

  destroy() {
    // Cleanup if needed
  }
};
