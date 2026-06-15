import { SearchEngine } from '../engine/SearchEngine.js';
import { StoryEngine, highlightPython } from '../engine/StoryEngine.js';
import { TraceEngine } from '../engine/TraceEngine.js';
import { ExportEngine } from '../engine/ExportEngine.js';
import { ProblemSidebar } from '../components/ProblemSidebar.js';

export const ProblemPage = {
  template(params) {
    const prob = SearchEngine.getProblemBySlug(params.slug);
    if (!prob) return `<div style="padding:40px; text-align:center; color:#ffffff;">Problem not found.</div>`;
    
    return `
      <div class="sandbox-workspace" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; height: 100%;">
        
        <div class="sandbox-header-bar flex-between" style="border-bottom: 1px solid var(--border-color); padding: 16px 24px; background: rgba(15,17,28,0.2); flex-shrink: 0;">
          <div class="console-title-indicator">
            <span class="pulse-indicator-purple"></span>
            <span class="console-title-text" style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary);">CodeMentor Story Engine</span>
          </div>
          <div class="header-actions" style="display: flex; gap: 8px;">
            <button id="btn-toggle-mode" class="btn-copy btn-toggle-mode" data-magnetic>
              <span class="mode-indicator-dot"></span>
              <span class="mode-text">Normal View</span>
            </button>
            <button id="btn-copy-code" class="btn-copy" data-magnetic>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy Code Only</span>
            </button>
          </div>
        </div>

        <div class="sandbox-console" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;">
          <!-- Progress Bar -->
          <div class="console-progress-container" style="width: 100%; height: 2px; background: rgba(255,255,255,0.03); position: relative; z-index: 10;">
            <div class="console-progress-bar" id="console-progress-bar" style="width: 0%; height: 100%; background: var(--color-ai); transition: width 0.1s ease;"></div>
          </div>

          <!-- Sticky Context Bar -->
          <div class="console-context-bar" id="console-context-bar" style="padding: 10px 24px; background: rgba(9, 11, 16, 0.9); border-bottom: 1px solid var(--border-color); display: flex; gap: 12px; font-size: 11px; font-family: monospace; color: var(--text-muted); opacity: 0; pointer-events: none; transition: opacity 0.25s; position: absolute; top: 2px; left: 0; right: 0; z-index: 9;">
            <span id="context-problem-info">Problem #${prob.id} — ${prob.title}</span>
            <span class="context-divider">•</span>
            <span id="context-section-info">Section: Intro</span>
          </div>

          <div class="console-main-layout" style="display: flex; flex: 1; overflow: hidden; position: relative; width: 100%;">
            <!-- Streaming Body Content -->
            <div class="console-body" id="sandbox-stream-body" style="flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 40px; scroll-behavior: smooth;">
              <span class="placeholder-text" style="color: var(--text-muted); font-size: 13px; font-family: monospace;">// Click "Compile Solution" below to stream the LeetCode Story Engine...</span>
            </div>
            
            <!-- Sticky Right Table of Contents -->
            <nav class="console-toc" id="console-toc" style="width: 130px; border-left: 1px solid var(--border-color); padding: 24px 16px; display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; overflow-y: auto; background: rgba(9, 11, 16, 0.2);">
              <a href="#overview" class="toc-item" data-sec="overview">01 Overview</a>
              <a href="#breakdown" class="toc-item" data-sec="breakdown">02 Breakdown</a>
              <a href="#pattern" class="toc-item" data-sec="pattern">03 Pattern</a>
              <a href="#complexity" class="toc-item" data-sec="complexity">04 Complexity</a>
              <a href="#strategy" class="toc-item" data-sec="strategy">05 Strategy</a>
              <a href="#code" class="toc-item" data-sec="code">06 Code</a>
              <a href="#trace" class="toc-item" data-sec="trace">07 Trace</a>
              <a href="#explanation" class="toc-item" data-sec="explanation">08 Expl</a>
              <a href="#edges" class="toc-item" data-sec="edges">09 Edges</a>
              <a href="#mistakes" class="toc-item" data-sec="mistakes">10 Pitfalls</a>
              <a href="#followups" class="toc-item" data-sec="followups">11 Follow-Ups</a>
              <a href="#export" class="toc-item" data-sec="export">12 Export</a>
            </nav>
          </div>

          <div class="console-action-bar" style="padding: 16px 24px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: rgba(15,17,28,0.2); flex-shrink: 0;">
            <span class="console-status-label" id="console-status-label" style="font-size: 12px; font-family: monospace; display: flex; align-items: center; gap: 8px; color: var(--text-secondary);"><span class="pulse-indicator"></span> Standby</span>
            <button class="btn btn-primary btn-run-solve" id="btn-run-solve" data-magnetic style="padding: 10px 20px; font-size: 13px;">Compile Solution</button>
          </div>
        </div>

      </div>
    `;
  },

  init(params) {
    const prob = SearchEngine.getProblemBySlug(params.slug);
    if (!prob) {
      window.router.navigate('/learn');
      return;
    }

    this.problemKey = prob.key;
    this.problemData = StoryEngine.getOrSynthesizeProblemData(prob.key);
    this.isAiReadingMode = false;
    this.traceActiveStep = 0;
    this.playbackEngine = null;

    // Track active async resources to prevent leaks
    this.activeTimeouts = [];
    this.activeIntervals = [];
    this.activeAnimationFrames = [];
    this.isUnsupported = prob.key.startsWith('gen-') || prob.key.startsWith('seed-');

    this.trackTimeout = (fn, delay) => {
      const id = setTimeout(fn, delay);
      this.activeTimeouts.push(id);
      return id;
    };

    // Cache to recently viewed history list in localstorage (max 5 items)
    this.updateHistoryCache(prob.key);

    // Update selection highlight in Sidebar
    ProblemSidebar.renderList();

    // DOM selectors
    const btnRun = document.getElementById('btn-run-solve');
    const btnCopy = document.getElementById('btn-copy-code');
    const btnToggleMode = document.getElementById('btn-toggle-mode');
    this.streamBody = document.getElementById('sandbox-stream-body');
    this.progressBar = document.getElementById('console-progress-bar');
    this.statusLabel = document.getElementById('console-status-label');
    this.contextBar = document.getElementById('console-context-bar');
    
    // Bind compile button
    if (btnRun) {
      btnRun.addEventListener('click', () => this.runCompileStream());
    }

    // Bind copy button
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        ExportEngine.copyToClipboard(this.problemData.code, (ok) => {
          if (ok) {
            const originalText = btnCopy.querySelector('span').innerText;
            btnCopy.classList.add('copied');
            btnCopy.querySelector('span').innerText = 'Copied!';
            this.trackTimeout(() => {
              btnCopy.classList.remove('copied');
              btnCopy.querySelector('span').innerText = originalText;
            }, 1500);
          }
        });
      });
    }

    // Bind toggle mode
    if (btnToggleMode) {
      btnToggleMode.addEventListener('click', () => this.toggleAiReadingMode());
    }

    // Bind scroll tracker
    if (this.streamBody) {
      this._scrollHandler = () => this.handleScroll();
      this.streamBody.addEventListener('scroll', this._scrollHandler);
    }

    // Bind TOC click navigations
    const tocItems = document.querySelectorAll('.toc-item');
    tocItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        if (!item.classList.contains('enabled')) return;
        const targetId = item.getAttribute('data-sec');
        const targetEl = document.getElementById(targetId);
        if (targetEl && this.streamBody) {
          this.streamBody.scrollTop = targetEl.offsetTop - 45;
        }
      });
    });

    // Auto-run solver on load to simulate streaming compilation
    this.trackTimeout(() => {
      this.runCompileStream();
    }, 400);
  },

  updateHistoryCache(key) {
    try {
      let history = [];
      const raw = localStorage.getItem('codementor_history');
      if (raw) history = JSON.parse(raw);
      
      history = history.filter(k => k !== key);
      history.unshift(key);
      if (history.length > 5) history.pop();
      
      localStorage.setItem('codementor_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  },

  toggleAiReadingMode() {
    this.isAiReadingMode = !this.isAiReadingMode;
    const btnToggleMode = document.getElementById('btn-toggle-mode');
    
    if (this.isAiReadingMode) {
      btnToggleMode?.classList.add('ai-mode');
      btnToggleMode.querySelector('.mode-text').innerText = 'AI Reading Mode';
      
      // Hide sections
      document.querySelectorAll('.console-story-section').forEach(sec => {
        const secId = sec.getAttribute('id');
        if (['edges', 'mistakes', 'followups', 'export'].includes(secId)) {
          sec.classList.add('hidden-section');
        }
      });
      // Hide matching TOC
      document.querySelectorAll('.toc-item').forEach(item => {
        const sec = item.getAttribute('data-sec');
        if (['edges', 'mistakes', 'followups', 'export'].includes(sec)) {
          item.style.display = 'none';
        }
      });
    } else {
      btnToggleMode?.classList.remove('ai-mode');
      btnToggleMode.querySelector('.mode-text').innerText = 'Normal View';
      
      // Show sections
      document.querySelectorAll('.console-story-section').forEach(sec => {
        sec.classList.remove('hidden-section');
      });
      document.querySelectorAll('.toc-item').forEach(item => {
        item.style.display = 'block';
      });
    }
    
    this.handleScroll();
  },

  handleScroll() {
    if (!this.streamBody) return;
    const scrollTotal = this.streamBody.scrollHeight - this.streamBody.clientHeight;
    
    if (scrollTotal > 0) {
      const pct = Math.round((this.streamBody.scrollTop / scrollTotal) * 100);
      if (this.progressBar) this.progressBar.style.width = `${pct}%`;
    }

    if (this.streamBody.scrollTop > 30) {
      this.contextBar?.classList.add('visible');
    } else {
      this.contextBar?.classList.remove('visible');
    }

    // Active section check
    const sections = Array.from(this.streamBody.querySelectorAll('.console-story-section'));
    const viewportTop = this.streamBody.getBoundingClientRect().top + 50;
    let activeSecId = '';

    for (const sec of sections) {
      if (sec.classList.contains('hidden-section')) continue;
      const rect = sec.getBoundingClientRect();
      if (rect.top <= viewportTop + 20 && rect.bottom >= viewportTop) {
        activeSecId = sec.getAttribute('data-sec');
        break;
      }
    }

    if (activeSecId) {
      const contextSectionInfo = document.getElementById('context-section-info');
      const secLabelMap = {
        'overview': '01 Overview',
        'breakdown': '02 Breakdown',
        'pattern': '03 Pattern',
        'complexity': '04 Complexity',
        'strategy': '05 Strategy',
        'code': '06 Solution Code',
        'trace': '07 Execution Trace',
        'explanation': '08 Explanation',
        'edges': '09 Edge Cases',
        'mistakes': '10 Pitfalls',
        'followups': '11 Follow-Ups',
        'export': '12 Export Notes'
      };
      if (contextSectionInfo) {
        contextSectionInfo.innerText = `Section: ${secLabelMap[activeSecId] || activeSecId}`;
      }

      // Highlight active TOC item
      document.querySelectorAll('.toc-item').forEach(item => {
        if (item.getAttribute('data-sec') === activeSecId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  },

  async runCompileStream() {
    if (this._typingTimeout) clearTimeout(this._typingTimeout);
    if (this.playbackEngine) this.playbackEngine.stop();

    // Increment active generation ID to cancel previous streams
    if (window.router) {
      window.router.activeGenerationId++;
      this.generationId = window.router.activeGenerationId;
    } else {
      this.generationId = (this.generationId || 0) + 1;
    }
    const currentGen = this.generationId;

    // Clear old active timeouts
    if (this.activeTimeouts) {
      this.activeTimeouts.forEach(clearTimeout);
      this.activeTimeouts = [];
    }

    const btnRun = document.getElementById('btn-run-solve');
    if (btnRun) {
      btnRun.disabled = true;
      btnRun.innerText = 'PROCESSING...';
    }
    
    if (this.statusLabel) {
      this.statusLabel.innerHTML = `<span class="pulse-indicator"></span> SOLVING PROBLEM...`;
      this.statusLabel.className = 'console-status-label solving';
    }

    const data = this.problemData;
    this.streamBody.innerHTML = '';
    
    // Renders custom initial message
    const introEl = document.createElement('div');
    introEl.className = 'senior-intro-card';
    introEl.innerHTML = `<h3>How a Senior Engineer Thinks</h3><p id="intro-line-reveal">Analyzing target inputs... checking boundaries... mapping constraints...</p>`;
    this.streamBody.appendChild(introEl);
    
    await new Promise(r => this.trackTimeout(r, 400));
    if (currentGen !== this.generationId || (window.router && currentGen !== window.router.activeGenerationId)) return;

    const introText = introEl.querySelector('#intro-line-reveal');
    if (introText) {
      introText.innerHTML = `Candidates rush to write brute-force loops.<br>Experienced engineers stop to <strong>identify patterns</strong> and observe complexity limits first.`;
    }
    this.streamBody.scrollTop = this.streamBody.scrollHeight;
    
    await new Promise(r => this.trackTimeout(r, 400));
    if (currentGen !== this.generationId || (window.router && currentGen !== window.router.activeGenerationId)) return;

    const sections = [
      { id: 'overview', label: 'Problem Overview', html: `
        <div class="overview-grid">
          <div class="overview-stat"><span class="overview-stat-lbl">LeetCode ID</span><span class="overview-stat-val">#${data.id}</span></div>
          <div class="overview-stat"><span class="overview-stat-lbl">Difficulty</span><span class="difficulty-tag ${data.difficulty.toLowerCase()}">${data.difficulty}</span></div>
          <div class="overview-stat"><span class="overview-stat-lbl">Pattern</span><span class="overview-stat-val">${data.pattern}</span></div>
          <div class="overview-stat"><span class="overview-stat-lbl">Acceptance</span><span class="overview-stat-val">${data.acceptanceRate}</span></div>
          <div class="overview-companies">
            ${data.companies.map(c => `<span class="company-badge">${c}</span>`).join('')}
          </div>
        </div>
      `},
      { id: 'breakdown', label: 'Problem Breakdown', html: `<div class="story-card-wrapper">${this.isUnsupported ? 'Analysis and constraints mapping coming soon for this question node.' : data.analysis}</div>` },
      { id: 'pattern', label: 'Pattern Recognition', html: `
        <div class="story-card-wrapper">
          <div class="pattern-flow-chart">
            <div class="flow-node">Constraint limits: N &le; 10⁵</div>
            <div class="flow-arrow">↓</div>
            <div class="flow-node">Required timebound: O(N) linear</div>
            <div class="flow-arrow">↓</div>
            <div class="flow-node active-node">${data.pattern}</div>
          </div>
        </div>
      `},
      { id: 'complexity', label: 'Complexity Analysis', html: `
        <div class="complexity-cards-grid">
          <div class="complexity-visual-card">
            <h5>Time Complexity</h5>
            <div class="complexity-bar-wrapper">
              <div class="complexity-bar-label"><span>Brute Force</span><span>${data.complexity.altTime}</span></div>
              <div class="complexity-bar-outer"><div class="complexity-bar-inner bad" style="width:${data.complexity.altTimePct}%"></div></div>
            </div>
            <div class="complexity-bar-wrapper">
              <div class="complexity-bar-label"><span>Optimal</span><span>${data.complexity.time}</span></div>
              <div class="complexity-bar-outer"><div class="complexity-bar-inner good" style="width:${data.complexity.timePct}%"></div></div>
            </div>
          </div>
          <div class="complexity-visual-card">
            <h5>Space Complexity</h5>
            <div class="complexity-bar-wrapper">
              <div class="complexity-bar-label"><span>Max Auxiliary Space</span><span>${data.complexity.space}</span></div>
              <div class="complexity-bar-outer"><div class="complexity-bar-inner good" style="width:${data.complexity.timePct}%"></div></div>
            </div>
          </div>
        </div>
      `},
      { id: 'strategy', label: 'Optimal Strategy', html: `<div class="story-card-wrapper">${this.isUnsupported ? 'Pattern-specific solution strategies are currently being generated for this node.' : data.strategy}</div>` },
      { id: 'code', label: 'Optimal Code Solution', html: this.isUnsupported ? `
        <div class="unsupported-solution-card" style="padding:32px; background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.1); border-radius:16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px;">
          <div style="font-size:24px;">✏️</div>
          <h4 style="font-family:var(--font-display); font-size:15px; font-weight:800; color:#ffffff; margin:0;">Solution Coming Soon</h4>
          <div style="font-size:12px; color:var(--text-secondary); max-width:400px; margin:0; line-height:1.6; text-align:left; background:rgba(0,0,0,0.2); padding:16px; border-radius:12px; border:1px solid var(--border-color);">
            Problem #${data.id}<br>
            Difficulty: ${data.difficulty}<br>
            Pattern: ${data.pattern}<br><br>
            Status: Solution coming soon.
          </div>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <span class="difficulty-tag ${data.difficulty.toLowerCase()}">${data.difficulty}</span>
            <span class="spec-badge spec-blue">${data.pattern}</span>
          </div>
        </div>
      ` : `
        <div class="code-story-container">
          <div class="code-story-header">
            <span>optimal_solution.py</span>
            <button class="btn-expand-code" id="btn-toggle-expand">Expand</button>
          </div>
          <div class="code-story-viewport collapsed" id="code-story-viewport">
            ${data.code.split('\n').map((lineText, idx) => {
              const lineNum = idx + 1;
              return `<div class="code-line" data-line="${lineNum}">
                <div class="code-line-num">${lineNum}</div>
                <div class="code-line-content">${highlightPython(lineText)}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      `},
      { id: 'trace', label: 'Interactive Execution Trace', html: this.isUnsupported ? `
        <div style="padding:24px; text-align:center; color:var(--text-muted); font-size:12px; font-family:monospace; border:1px solid var(--border-color); border-radius:12px;">
          &gt; Trace simulation not available for this problem yet.
        </div>
      ` : `
        <div class="trace-container">
          <div class="trace-controls">
            <button class="trace-btn" id="btn-trace-prev" disabled>Prev</button>
            <button class="trace-btn" id="btn-trace-play">Play</button>
            <button class="trace-btn" id="btn-trace-replay">Replay</button>
            <button class="trace-btn" id="btn-trace-next">Next</button>
            <div class="trace-scrubber-wrapper">
              <input type="range" class="trace-slider" min="0" max="${data.trace.length - 1}" value="0">
              <span class="trace-step-badge">Step 1 of ${data.trace.length}</span>
            </div>
          </div>
          <div class="trace-visualizer">
            <div class="trace-viz-variables"></div>
            <div class="trace-viz-graphics" style="display: flex; justify-content: center; align-items: center; min-height: 50px;"></div>
            <div class="trace-log-msg">&gt; Standby</div>
          </div>
        </div>
      `},
      { id: 'explanation', label: 'Line-by-Line Explanation', html: this.isUnsupported ? `
        <div style="padding:16px; color:var(--text-muted); font-size:12px; font-style:italic; text-align:center;">
          Line-by-line breakdown will be rendered once the solution compiler finishes verification.
        </div>
      ` : `
        <div class="explanation-story-list">
          ${data.explanation.map(item => `
            <div class="exp-line" data-line="${item.line}">
              <div class="exp-line-header">Line ${item.line}</div>
              <div class="exp-line-body">${item.text}</div>
            </div>
          `).join('')}
        </div>
      `},
      { id: 'edges', label: 'Edge Case Validation', html: this.isUnsupported ? `
        <div style="padding:16px; color:var(--text-muted); font-size:12px; font-style:italic; text-align:center;">
          Edge case assertions are currently offline for this node.
        </div>
      ` : `
        <div class="edges-passes-list">
          ${data.edgeCases.map(item => `
            <div class="edge-pass-item">
              <span class="edge-pass-check">✓</span>
              <span class="edge-pass-input">${item.input}</span>
              <span class="edge-pass-result">${item.result}</span>
            </div>
          `).join('')}
        </div>
      `},
      { id: 'mistakes', label: 'Common Mistakes', html: this.isUnsupported ? `
        <div style="padding:16px; color:var(--text-muted); font-size:12px; font-style:italic; text-align:center;">
          Common mistakes and pitfalls analysis coming soon.
        </div>
      ` : `
        <div class="mistakes-grid">
          ${data.commonMistakes.map(item => `
            <div class="mistake-warning-card">
              <span class="warn-icon">⚠</span>
              <div>
                <h5>${item.title}</h5>
                <p>${item.p}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `},
      { id: 'followups', label: 'Interview Follow-Ups', html: this.isUnsupported ? `
        <div style="padding:16px; color:var(--text-muted); font-size:12px; font-style:italic; text-align:center;">
          Follow-up interview discussions coming soon.
        </div>
      ` : `
        <div class="followups-story-list">
          ${data.followUps.map(item => `
            <div class="followup-story-item">
              <div class="followup-q">Q: ${item.q}</div>
              <div class="followup-a">A: ${item.a}</div>
            </div>
          `).join('')}
        </div>
      `},
      { id: 'export', label: 'Study Export Center', html: this.isUnsupported ? `
        <div class="export-options-grid">
          <button class="export-btn" id="btn-export-code-val" disabled style="opacity:0.5; cursor:not-allowed;">Copy Code</button>
          <button class="export-btn" id="btn-export-notes-val" disabled style="opacity:0.5; cursor:not-allowed;">Export Study Notes (.md)</button>
        </div>
      ` : `
        <div class="export-options-grid">
          <button class="export-btn" id="btn-export-code-val">Copy Code</button>
          <button class="export-btn" id="btn-export-notes-val">Export Study Notes (.md)</button>
        </div>
      `}
    ];

    for (let i = 0; i < sections.length; i++) {
      if (currentGen !== this.generationId || (window.router && currentGen !== window.router.activeGenerationId)) return;
      if (!document.getElementById('btn-run-solve')) return; // Check if user navigated away
      const sec = sections[i];
      
      const secEl = document.createElement('section');
      secEl.className = 'console-story-section';
      secEl.setAttribute('id', sec.id);
      secEl.setAttribute('data-sec', sec.id);

      if (this.isAiReadingMode && ['edges', 'mistakes', 'followups', 'export'].includes(sec.id)) {
        secEl.classList.add('hidden-section');
      }

      secEl.innerHTML = `
        <div class="story-sec-title">
          <span class="sec-num">${String(i + 1).padStart(2, '0')}</span>
          <span>${sec.label}</span>
        </div>
        <div class="story-sec-content">${sec.html}</div>
      `;

      this.streamBody.appendChild(secEl);

      const pct = Math.round(((i + 1) / sections.length) * 100);
      if (this.progressBar) this.progressBar.style.width = `${pct}%`;

      if (sec.id === 'code' && !this.isUnsupported) {
        const btnExpand = secEl.querySelector('#btn-toggle-expand');
        const viewport = secEl.querySelector('#code-story-viewport');
        if (btnExpand && viewport) {
          btnExpand.addEventListener('click', () => {
            if (viewport.classList.contains('collapsed')) {
              viewport.classList.remove('collapsed');
              btnExpand.innerText = 'Collapse';
            } else {
              viewport.classList.add('collapsed');
              btnExpand.innerText = 'Expand';
            }
          });
        }
      }

      if (sec.id === 'trace' && !this.isUnsupported) {
        this.initInteractiveTracePlayer(secEl);
      }

      if (sec.id === 'export' && !this.isUnsupported) {
        const btnExpCode = secEl.querySelector('#btn-export-code-val');
        const btnExpNotes = secEl.querySelector('#btn-export-notes-val');
        
        btnExpCode?.addEventListener('click', () => {
          ExportEngine.copyToClipboard(data.code, (ok) => {
            if (ok) alert('Solution code copied to clipboard!');
          });
        });

        btnExpNotes?.addEventListener('click', () => {
          ExportEngine.downloadMarkdownNotes(data);
        });
      }

      this.streamBody.scrollTop = this.streamBody.scrollHeight;
      await new Promise(r => this.trackTimeout(r, 60)); // reveal speed
    }

    // Enable TOC clicking
    document.querySelectorAll('.toc-item').forEach(item => {
      item.classList.add('enabled');
    });

    if (!this.isUnsupported) {
      this.bindHoverLinkages();
    }

    if (btnRun) {
      btnRun.disabled = false;
      btnRun.innerText = 'Compile Solution';
    }
    if (this.statusLabel) {
      this.statusLabel.innerHTML = `<span class="pulse-indicator"></span> SOLUTION ACCEPTED`;
      this.statusLabel.className = 'console-status-label done';
    }

    // Save progress to localstorage
    try {
      const raw = localStorage.getItem('codementor_story_progress') || '{}';
      const progress = JSON.parse(raw);
      progress[this.problemKey] = 100;
      localStorage.setItem('codementor_story_progress', JSON.stringify(progress));
    } catch (e) {}
  },

  initInteractiveTracePlayer(secEl) {
    if (this.isUnsupported) return;
    const slider = secEl.querySelector('.trace-slider');
    const btnPrev = secEl.querySelector('#btn-trace-prev');
    const btnNext = secEl.querySelector('#btn-trace-next');
    const btnPlay = secEl.querySelector('#btn-trace-play');
    const btnReplay = secEl.querySelector('#btn-trace-replay');
    const varBox = secEl.querySelector('.trace-viz-variables');
    const graphicsBox = secEl.querySelector('.trace-viz-graphics');
    const logBox = secEl.querySelector('.trace-log-msg');

    const updateUIFrame = (stepIdx) => {
      this.traceActiveStep = stepIdx;
      const frame = this.problemData.trace[stepIdx];

      if (slider) slider.value = stepIdx;
      
      const badge = secEl.querySelector('.trace-step-badge');
      if (badge) badge.innerText = `Step ${stepIdx + 1} of ${this.problemData.trace.length}`;

      if (varBox) {
        varBox.innerHTML = Object.entries(frame.variables)
          .map(([k, v]) => `<span class="trace-var"><span class="trace-var-name">${k}</span> = <span class="trace-var-val">${v}</span></span>`)
          .join('');
      }

      if (logBox) logBox.innerHTML = `&gt; ${frame.log}`;

      // Highlight python lines
      document.querySelectorAll('.code-line').forEach(line => {
        const lineNum = parseInt(line.getAttribute('data-line'));
        if (frame.highlightLines.includes(lineNum)) {
          line.classList.add('active-hl');
        } else {
          line.classList.remove('active-hl');
        }
      });

      // Graphics visual trace
      if (graphicsBox) {
        graphicsBox.innerHTML = '';
        const key = this.problemKey;

        if (key === 'two-sum') {
          const arr = frame.array;
          const active = frame.activeIdx;
          const matched = frame.matchedIdx;
          
          graphicsBox.innerHTML = `
            <div style="display:flex; gap:8px;">
              ${arr.map((val, i) => {
                let bg = 'rgba(255,255,255,0.02)';
                let border = 'rgba(255,255,255,0.06)';
                if (i === active) { bg = 'rgba(139,92,246,0.15)'; border = 'var(--color-ai)'; }
                else if (i === matched) { bg = 'rgba(34,197,94,0.15)'; border = 'var(--color-accepted)'; }
                return `<div style="width:28px; height:28px; display:flex; align-items:center; justify-content:center; background:${bg}; border:1px solid ${border}; border-radius:6px; font-weight:700; position:relative; font-size:11px;">
                  ${val}
                </div>`;
              }).join('')}
            </div>
          `;
        }
        else if (key === 'valid-parentheses') {
          const chars = frame.chars;
          const active = frame.activeIdx;
          const stack = frame.stack;
          
          graphicsBox.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
              <div style="display:flex; gap:6px;">
                ${chars.map((char, i) => {
                  let color = i === active ? 'var(--color-ai)' : 'var(--text-secondary)';
                  return `<span style="font-family:monospace; font-size:12px; color:${color};">${char}</span>`;
                }).join('')}
              </div>
              <div style="display:flex; flex-direction:column-reverse; width:80px; border:2px solid rgba(255,255,255,0.06); border-top:none; border-radius:0 0 6px 6px; padding:3px; min-height:30px; align-items:center; gap:3px; background:rgba(0,0,0,0.25);">
                ${stack.length === 0 ? '<span style="font-size:7px; color:var(--text-muted);">STACK EMPTY</span>' : stack.map(x => `<div style="width:100%; height:12px; background:rgba(139,92,246,0.15); border:1px solid rgba(139,92,246,0.3); border-radius:2px; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:8px;">${x}</div>`).join('')}
              </div>
            </div>
          `;
        }
        else if (key === 'longest-substring') {
          const s = frame.s;
          const left = frame.left;
          const right = frame.right;
          
          graphicsBox.innerHTML = `
            <div style="display:flex; gap:3px;">
              ${s.split('').map((char, i) => {
                let isWindow = (i >= left && i <= right);
                let bg = isWindow ? 'rgba(6,182,212,0.1)' : 'transparent';
                let border = isWindow ? 'rgba(6,182,212,0.3)' : 'transparent';
                if (i === right) border = 'var(--color-analysis)';
                return `<div style="width:18px; height:18px; display:flex; align-items:center; justify-content:center; background:${bg}; border:1px solid ${border}; border-radius:3px; font-family:monospace; font-size:10px;">${char}</div>`;
              }).join('')}
            </div>
          `;
        }
        else {
          graphicsBox.innerHTML = `<span style="font-size:10px; color:var(--text-muted);">[Trace visualizer active]</span>`;
        }
      }

      if (btnPrev) btnPrev.disabled = (stepIdx === 0);
      if (btnNext) btnNext.disabled = (stepIdx === this.problemData.trace.length - 1);
    };

    // Instantiate Playback state engine
    this.playbackEngine = TraceEngine.createPlaybackState(this.problemData, updateUIFrame);
    
    // Bind controls
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.playbackEngine.stop();
        if (btnPlay) btnPlay.innerText = 'Play';
        this.playbackEngine.updateToFrame(parseInt(e.target.value));
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        this.playbackEngine.stop();
        if (btnPlay) btnPlay.innerText = 'Play';
        this.playbackEngine.prev();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.playbackEngine.stop();
        if (btnPlay) btnPlay.innerText = 'Play';
        this.playbackEngine.next();
      });
    }

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (this.playbackEngine.isPlaying()) {
          this.playbackEngine.stop();
          btnPlay.innerText = 'Play';
        } else {
          btnPlay.innerText = 'Pause';
          this.playbackEngine.play(() => {
            btnPlay.innerText = 'Play';
          });
        }
      });
    }

    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.playbackEngine.stop();
        if (btnPlay) btnPlay.innerText = 'Play';
        this.playbackEngine.replay();
      });
    }

    // Load first frame
    this.playbackEngine.updateToFrame(0);
  },

  bindHoverLinkages() {
    const codeLines = this.streamBody.querySelectorAll('.code-line');
    const expLines = this.streamBody.querySelectorAll('.exp-line');
    
    codeLines.forEach(line => {
      line.addEventListener('mouseenter', () => {
        const lineNum = line.getAttribute('data-line');
        line.classList.add('active-hl');
        const targetExp = this.streamBody.querySelector(`.exp-line[data-line="${lineNum}"]`);
        if (targetExp) targetExp.classList.add('active-hl');
      });
      
      line.addEventListener('mouseleave', () => {
        const lineNum = line.getAttribute('data-line');
        line.classList.remove('active-hl');
        const targetExp = this.streamBody.querySelector(`.exp-line[data-line="${lineNum}"]`);
        if (targetExp) targetExp.classList.remove('active-hl');
      });
    });
    
    expLines.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const lineNum = item.getAttribute('data-line');
        item.classList.add('active-hl');
        const targetLine = this.streamBody.querySelector(`.code-line[data-line="${lineNum}"]`);
        if (targetLine) targetLine.classList.add('active-hl');
      });
      
      item.addEventListener('mouseleave', () => {
        const lineNum = item.getAttribute('data-line');
        item.classList.remove('active-hl');
        const targetLine = this.streamBody.querySelector(`.code-line[data-line="${lineNum}"]`);
        if (targetLine) targetLine.classList.remove('active-hl');
      });
    });
  },

  destroy() {
    if (this._scrollHandler && this.streamBody) {
      this.streamBody.removeEventListener('scroll', this._scrollHandler);
    }
    
    // Clear timeouts
    if (this.activeTimeouts) {
      this.activeTimeouts.forEach(clearTimeout);
      this.activeTimeouts = [];
    }
    if (this._typingTimeout) clearTimeout(this._typingTimeout);
    
    // Clear intervals
    if (this.activeIntervals) {
      this.activeIntervals.forEach(clearInterval);
      this.activeIntervals = [];
    }

    // Clear animation frames
    if (this.activeAnimationFrames) {
      this.activeAnimationFrames.forEach(cancelAnimationFrame);
      this.activeAnimationFrames = [];
    }

    // Clear GSAP ScrollTriggers
    if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }

    if (this.playbackEngine) this.playbackEngine.stop();
  }
};
