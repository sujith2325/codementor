import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { highlightPython } from '../engine/StoryEngine.js';

export const HomePage = {
  template() {
    return `
      <!-- SECTION 1: HERO -->
      <section id="hero">
        <div class="container hero-container">
          <!-- Header Text -->
          <div class="hero-header-text">
            <div class="hero-badge">Awwwards Honorable Skill</div>
            <h1 class="hero-title">
              Solve LeetCode<br>
              <span>Like a Senior Engineer.</span>
            </h1>
            <p class="hero-desc">
              CodeMentor identifies patterns, explains reasoning, and generates optimal solutions step-by-step.
            </p>
            <div class="hero-ctas">
              <button id="btn-launch-sandbox" class="btn btn-primary" data-magnetic>Launch Sandbox</button>
              <button id="btn-explore-patterns" class="btn btn-secondary" data-magnetic>Explore Patterns</button>
            </div>
          </div>

          <!-- Centerpiece Browser Mockup -->
          <div class="hero-mockup-wrap">
            <div class="floating-tag tag-1" data-magnetic>Accepted ✓</div>
            <div class="floating-tag tag-2" data-magnetic>Hash Map</div>
            <div class="floating-tag tag-3" data-magnetic>Sliding Window</div>
            <div class="floating-tag tag-4" data-magnetic>Binary Search</div>
            <div class="floating-tag tag-5" data-magnetic>O(n)</div>
            <div class="floating-tag tag-6" data-magnetic>Edge Cases Checked</div>
            <div class="floating-tag tag-7" data-magnetic>AI Verified</div>

            <div class="browser-mockup" data-tilt>
              <div class="browser-header">
                <div class="browser-dots">
                  <span class="dot-red"></span>
                  <span class="dot-yellow"></span>
                  <span class="dot-green"></span>
                </div>
                <div class="browser-url">codementor.ai/playground/two-sum</div>
              </div>
              
              <div class="browser-body">
                <div class="mockup-sidebar">
                  <div class="sidebar-item active">Two Sum</div>
                  <div class="sidebar-item">Valid Parentheses</div>
                  <div class="sidebar-item">Longest Substring</div>
                </div>
                <div class="mockup-console">
                  <div class="mockup-console-header flex-between">
                    <span class="console-tag-status"><span class="pulse-indicator-purple"></span> Stream Solving...</span>
                    <div class="mockup-console-specs">
                      <span class="spec-badge spec-blue">Hash Map</span>
                      <span class="spec-badge spec-green">O(n) Time</span>
                    </div>
                  </div>
                  <div class="mockup-console-body" id="hero-console-stream">
                    <!-- Typewriting streamed dynamically on load -->
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 2: THE PROBLEM (SCROLLYTELLING HEADINGS) -->
      <section id="problem-sec">
        <div class="problem-scroll-container">
          <div class="problem-panel panel-memorize">
            <h2 class="display-text text-muted-gradient">
              "Most candidates memorize solutions."
            </h2>
          </div>
          <div class="problem-panel panel-patterns">
            <h2 class="display-text text-glow-purple">
              "Top engineers recognize patterns."
            </h2>
          </div>
        </div>
      </section>

      <!-- SECTION 3: AI REASONING TIMELINE -->
      <section id="timeline-sec">
        <div class="scroll-line-container">
          <svg class="scroll-line-svg">
            <path id="scroll-path" d="M 2 0 L 2 1000" stroke="url(#line-grad)" stroke-width="2" fill="none" />
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="var(--color-ai)" />
                <stop offset="50%" stop-color="var(--color-analysis)" />
                <stop offset="100%" stop-color="var(--color-accepted)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="section-header">
          <span class="section-tag section-tag-purple">Cognitive Stream</span>
          <h2 class="section-title">AI Reasoning Timeline</h2>
          <p class="section-desc">How CodeMentor dissects interview questions systematically.</p>
        </div>

        <div class="timeline-nodes-wrap">
          <div class="timeline-node" id="node-1">
            <div class="node-indicator border-purple">01</div>
            <div class="node-content">
              <h4>Analyze Problem Details</h4>
              <p>Deconstructs parameter structures, constraints, bounds, and output specifications from raw prompts.</p>
            </div>
          </div>

          <div class="timeline-node" id="node-2">
            <div class="node-indicator border-cyan">02</div>
            <div class="node-content">
              <h4>Detect Algorithmic Pattern</h4>
              <p>Aligns constraints to target data structure patterns (e.g. Monotonic Stack, Sliding Window, DP).</p>
            </div>
          </div>

          <div class="timeline-node" id="node-3">
            <div class="node-indicator border-amber">03</div>
            <div class="node-content">
              <h4>Generate Alternative Approaches</h4>
              <p>Drafts multiple candidate ideas from brute-force benchmarks up to optimal linear algorithms.</p>
            </div>
          </div>

          <div class="timeline-node" id="node-4">
            <div class="node-indicator border-purple">04</div>
            <div class="node-content">
              <h4>Compare Complexity Metrics</h4>
              <p>Presents clear Big-O tradeoffs to confirm the runtime meets interview standards.</p>
            </div>
          </div>

          <div class="timeline-node" id="node-5">
            <div class="node-indicator border-cyan">05</div>
            <div class="node-content">
              <h4>Select Optimal Solution</h4>
              <p>Generates clean, type-hinted LeetCode-class Python solutions matching required method signatures.</p>
            </div>
          </div>

          <div class="timeline-node" id="node-6">
            <div class="node-indicator border-green">06</div>
            <div class="node-content">
              <h4>Dry Run State Validation</h4>
              <p>Simulates variable bounds and pointer traversals inside a step-by-step state trace table.</p>
            </div>
          </div>

          <div class="timeline-node" id="node-7">
            <div class="node-indicator border-purple">07</div>
            <div class="node-content">
              <h4>Explain Code Line-by-Line</h4>
              <p>Walks through the logic statement by statement, teaching the structural concepts of the solution.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 8: VISUAL ARCHITECTURE SHOWCASE -->
      <section id="architecture-sec">
        <div class="section-header">
          <span class="section-tag section-tag-purple">System Design</span>
          <h2 class="section-title">Visual Architecture</h2>
          <p class="section-desc">The internal pipelines translating input prompts into validated optimal coding solutions.</p>
        </div>

        <div class="arch-container" style="position: relative;">
          <canvas class="arch-svg-canvas" id="arch-canvas" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;"></canvas>

          <div class="arch-nodes-grid" style="position: relative; z-index: 2;">
            <div class="arch-node-card" id="arch-n-1" data-tilt>
              <div class="arch-icon"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6M12 19h8"/></svg></div>
              <h4>Problem Input</h4>
              <p>Parses prompt description variables and limits.</p>
            </div>

            <div class="arch-node-card" id="arch-n-2" data-tilt>
              <div class="arch-icon"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <h4>Pattern Engine</h4>
              <p>Maps bounds to major DS/Algo families.</p>
            </div>

            <div class="arch-node-card" id="arch-n-3" data-tilt>
              <div class="arch-icon"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg></div>
              <h4>Reasoning Layer</h4>
              <p>Synthesizes steps and alternative complexity ideas.</p>
            </div>

            <div class="arch-node-card" id="arch-n-4" data-tilt>
              <div class="arch-icon"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></div>
              <h4>Solution Generator</h4>
              <p>Compiles optimized, type-hinted code signatures.</p>
            </div>

            <div class="arch-node-card" id="arch-n-5" data-tilt>
              <div class="arch-icon"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="12"></line><line x1="12" y1="12" x2="16" y2="14"></line></svg></div>
              <h4>Complexity Analyzer</h4>
              <p>Audits final Big-O runtimes and space footprint.</p>
            </div>

            <div class="arch-node-card" id="arch-n-6" data-tilt>
              <div class="arch-icon"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
              <h4>Explanation Engine</h4>
              <p>Assembles line annotations and dry runs.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 7: METRICS -->
      <section id="metrics-sec">
        <div class="container metrics-container">
          <div class="metric-item">
            <div class="metric-val" id="metric-problems" data-val="2000">0</div>
            <div class="metric-lbl">Problems Supported</div>
          </div>
          <div class="metric-item">
            <div class="metric-val" id="metric-patterns" data-val="50">0</div>
            <div class="metric-lbl">Patterns Recognized</div>
          </div>
          <div class="metric-item">
            <div class="metric-val" id="metric-speed" data-val="95">0</div>
            <div class="metric-lbl">Speed Up %</div>
          </div>
          <div class="metric-item">
            <div class="metric-val" id="metric-complexity" data-val="1">O(n)</div>
            <div class="metric-lbl">Preferred Complexity</div>
          </div>
        </div>
      </section>

      <!-- SECTION 9: TESTIMONIALS -->
      <section id="testimonials-sec" class="container">
        <div class="section-header">
          <span class="section-tag section-tag-cyan">Feedback</span>
          <h2 class="section-title">Developer Reviews</h2>
          <p class="section-desc">What engineers are saying about CodeMentor's structural pattern mappings.</p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card" data-tilt>
            <p>"The Dry Run tables are amazing. Seeing exactly how pointers move step-by-step made graph DFS/BFS completely intuitive."</p>
            <div class="user-meta">
              <h5>Sarah Jenkins</h5>
              <span>Staff Engineer @ Stripe</span>
            </div>
          </div>
          <div class="testimonial-card" data-tilt>
            <p>"CodeMentor transformed my interview prep. Instead of just copying solutions, it teaches the core patterns. Passed my Meta loop!"</p>
            <div class="user-meta">
              <h5>Devon Carter</h5>
              <span>Senior Software Engineer</span>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  init() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Bind CTA buttons to router navigate
    document.getElementById('btn-launch-sandbox')?.addEventListener('click', () => {
      window.router.navigate('/learn');
    });
    document.getElementById('btn-explore-patterns')?.addEventListener('click', () => {
      window.router.navigate('/patterns');
    });

    // 1. Hero console stream logic
    this.initHeroConsoleStream();

    // 2. Scrollytelling text reveal
    if (!prefersReducedMotion) {
      const panelMemorize = document.querySelector('.panel-memorize');
      const panelPatterns = document.querySelector('.panel-patterns');

      const trigger = ScrollTrigger.create({
        trigger: '#problem-sec',
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      });
      this._triggers = [trigger];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#problem-sec',
          start: 'top top',
          end: '+=150%',
          scrub: true,
        }
      })
      .to(panelMemorize, { opacity: 0, yPercent: -15, ease: 'none' })
      .fromTo(panelPatterns, 
        { opacity: 0, yPercent: 15 },
        { opacity: 1, yPercent: 0, ease: 'none' }
      );
      this._timelines = [tl];
    }

    // 3. AI timeline tracing
    this.initTimelineTracing();

    // 4. Visual architecture canvas connections
    this.initArchitectureCanvas();

    // 5. Metrics counting
    this.initMetricsCounter();

    // 6. Tilt hover card effects
    this.initTiltEffects();
  },

  initHeroConsoleStream() {
    const heroStreamContainer = document.getElementById('hero-console-stream');
    if (!heroStreamContainer) return;

    const heroTwoSumOutput = `[ANALYZING INPUTS]
Input: nums = [2, 7, 11, 15], target = 9
Constraints: N <= 10^4, O(n) required.

[PATTERN DETECTED]
Complement lookup mapping using a Hash Table.

[GENERATING SOLUTION]
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            need = target - num
            if need in seen:
                return [seen[need], i]
            seen[num] = i
        return []

[RUNNING STATE DRY RUN]
| Step | val | need | seen before check | Action |
|------|-----|------|-------------------|--------|
| 1    | 2   | 7    | {}                | Store 2:0 |
| 2    | 7   | 2    | {2: 0}            | Found 2! Return [0, 1] |

[VERIFICATION SUCCESSFUL]
Status: Accepted ✓`;

    let index = 0;
    const charsPerTick = 12;
    
    const tick = () => {
      if (!document.getElementById('hero-console-stream')) return; // Check if still on DOM
      if (index < heroTwoSumOutput.length) {
        index += charsPerTick;
        const sub = heroTwoSumOutput.substring(0, index);
        
        let html = sub
          .replace(/\n/g, '<br>')
          .replace(/\[(.*?)\]/g, '<span class="lbl-cyan">[$1]</span>');
          
        if (html.includes('class Solution:')) {
          const parts = html.split('class Solution:');
          const before = parts[0];
          const codeAndAfter = 'class Solution:' + parts[1];
          
          if (codeAndAfter.includes('[RUNNING STATE')) {
            const subparts = codeAndAfter.split('[RUNNING STATE');
            const code = subparts[0];
            const after = '[RUNNING STATE' + subparts[1];
            html = before + highlightPython(code.replace(/<br>/g, '\n')).replace(/\n/g, '<br>') + after;
          } else {
            html = before + highlightPython(codeAndAfter.replace(/<br>/g, '\n')).replace(/\n/g, '<br>');
          }
        }

        if (html.includes('Accepted ✓')) {
          html = html.replace('Accepted ✓', '<span class="status-success" style="font-weight:800; font-size:14px; text-shadow:0 0 10px rgba(34,197,94,0.4)">Accepted ✓</span>');
        }

        heroStreamContainer.innerHTML = html;
        heroStreamContainer.scrollTop = heroStreamContainer.scrollHeight;
        this._heroStreamTimeout = setTimeout(tick, 12);
      }
    };
    
    this._heroStreamTimeout = setTimeout(tick, 600);
  },

  initTimelineTracing() {
    const scrollPath = document.getElementById('scroll-path');
    const timelineSec = document.getElementById('timeline-sec');
    const timelineNodes = document.querySelectorAll('.timeline-node');
    if (!scrollPath || !timelineSec) return;

    const updateScrollPathHeight = () => {
      if (!document.getElementById('scroll-path')) return;
      const sectionHeight = timelineSec.clientHeight;
      scrollPath.setAttribute('d', `M 2 0 L 2 ${sectionHeight - 140}`);
      
      const pathLength = scrollPath.getTotalLength();
      scrollPath.style.strokeDasharray = pathLength;
      scrollPath.style.strokeDashoffset = pathLength;
      
      const tracingTrigger = ScrollTrigger.create({
        trigger: timelineSec,
        start: 'top 30%',
        end: 'bottom 80%',
        scrub: true,
        animation: gsap.to(scrollPath, { strokeDashoffset: 0, ease: 'none' }),
        invalidateOnRefresh: true
      });
      if (this._triggers) this._triggers.push(tracingTrigger);
    };

    window.addEventListener('resize', updateScrollPathHeight);
    this._resizeHandler = updateScrollPathHeight;
    setTimeout(updateScrollPathHeight, 150);

    // Node highlights
    timelineNodes.forEach(node => {
      const nodeTrigger = ScrollTrigger.create({
        trigger: node,
        start: 'top 60%',
        end: 'bottom 40%',
        toggleClass: { targets: node, className: 'highlighted' }
      });
      if (this._triggers) this._triggers.push(nodeTrigger);
    });
  },

  initArchitectureCanvas() {
    const canvas = document.getElementById('arch-canvas');
    if (!canvas || window.innerWidth <= 768) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const links = [
      { from: 'arch-n-1', to: 'arch-n-2' },
      { from: 'arch-n-2', to: 'arch-n-3' },
      { from: 'arch-n-3', to: 'arch-n-4' },
      { from: 'arch-n-4', to: 'arch-n-5' },
      { from: 'arch-n-5', to: 'arch-n-6' },
    ];

    const draw = () => {
      if (!document.getElementById('arch-canvas')) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const canvasRect = canvas.getBoundingClientRect();

      links.forEach(link => {
        const fromEl = document.getElementById(link.from);
        const toEl = document.getElementById(link.to);
        if (!fromEl || !toEl) return;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = (fromRect.left + fromRect.width / 2) - canvasRect.left;
        const y1 = (fromRect.top + fromRect.height / 2) - canvasRect.top;
        const x2 = (toRect.left + toRect.width / 2) - canvasRect.left;
        const y2 = (toRect.top + toRect.height / 2) - canvasRect.top;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 + (x2 - x1) / 2, y1, x1 + (x2 - x1) / 2, y2, x2, y2);
        
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    };

    setTimeout(draw, 300);

    const resizeCanvas = () => {
      if (!document.getElementById('arch-canvas')) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      draw();
    };
    window.addEventListener('resize', resizeCanvas);
    this._canvasResizeHandler = resizeCanvas;
  },

  initMetricsCounter() {
    const metrics = document.querySelectorAll('.metric-val');
    metrics.forEach(metric => {
      const targetVal = parseInt(metric.getAttribute('data-val'));
      if (isNaN(targetVal)) return;

      const trigger = ScrollTrigger.create({
        trigger: metric,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: targetVal,
            duration: 2,
            ease: 'power3.out',
            onUpdate: () => {
              metric.innerText = Math.floor(counter.val) + (metric.id === 'metric-problems' ? '+' : metric.id === 'metric-speed' ? '%' : '');
            }
          });
        }
      });
      if (this._triggers) this._triggers.push(trigger);
    });
  },

  initTiltEffects() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -y / 15;
        const rotateY = x / 15;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          y: -5,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    });
  },

  destroy() {
    // Clear timeouts
    if (this._heroStreamTimeout) clearTimeout(this._heroStreamTimeout);

    // Clean listeners
    if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    if (this._canvasResizeHandler) window.removeEventListener('resize', this._canvasResizeHandler);

    // Kill GSAP scroll triggers
    if (this._triggers) {
      this._triggers.forEach(t => t.kill());
      this._triggers = [];
    }
    if (this._timelines) {
      this._timelines.forEach(tl => tl.kill());
      this._timelines = [];
    }
  }
};
