import { PatternEngine } from '../engine/PatternEngine.js';
import { highlightPython } from '../engine/StoryEngine.js';

export const PatternsPage = {
  template() {
    const patterns = PatternEngine.getAllPatterns();
    return `
      <section id="patterns-hero" style="padding: 120px 0 60px 0; text-align: center; background: linear-gradient(to bottom, rgba(139,92,246,0.05) 0%, transparent 100%);">
        <div class="container">
          <span class="section-tag section-tag-purple">Pattern Library</span>
          <h1 style="font-family: var(--font-display); font-size: 44px; font-weight: 900; margin-top: 12px; margin-bottom: 16px; color: #ffffff;">Algorithmic Templates</h1>
          <p style="font-size: 16px; color: var(--text-secondary); max-width: 600px; margin: 0 auto; line-height: 1.6;">
            Stop memorizing ad-hoc code. Learn the core structural patterns that resolve 95% of LeetCode challenges.
          </p>
        </div>
      </section>

      <section id="patterns-grid-sec" style="padding: 40px 0 100px 0;">
        <div class="container" style="display: flex; flex-direction: column; gap: 60px;">
          ${patterns.map((p, idx) => `
            <div class="pattern-detail-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; border-bottom: 1px solid var(--border-color); padding-bottom: 60px;">
              
              <!-- Left: Description and Problems -->
              <div class="pattern-info-panel" style="display: flex; flex-direction: column; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-family: var(--font-display); font-size: 24px; font-weight: 800; color: var(--color-ai);">${String(idx + 1).padStart(2, '0')}.</span>
                  <h2 style="font-family: var(--font-display); font-size: 24px; font-weight: 800; color: #ffffff;">${p.name}</h2>
                </div>
                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0;">${p.concept}</p>
                
                <div class="complexity-capsule" style="display: flex; gap: 16px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color); width: fit-content; font-size: 12px;">
                  <span>Time Complexity: <strong style="color: var(--color-accepted);">${p.complexity.time}</strong></span>
                  <span style="color: rgba(255,255,255,0.1);">|</span>
                  <span>Space Complexity: <strong style="color: var(--color-analysis);">${p.complexity.space}</strong></span>
                </div>

                <div class="concept-template" style="display: flex; flex-direction: column; gap: 8px;">
                  <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; margin: 0;">Code Template</h4>
                  <pre style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; font-family: monospace; font-size: 11px; overflow-x: auto; color: #ffffff; line-height: 1.5; margin: 0;"><code>${highlightPython(p.template)}</code></pre>
                </div>

                <div class="common-problems-list" style="display: flex; flex-direction: column; gap: 8px;">
                  <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; margin: 0;">Common Challenges</h4>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${p.problems.map(prob => `
                      <div class="common-prob-badge" style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 8px 12px; font-size: 12px; cursor: pointer; transition: var(--transition-fast);" onclick="window.router.navigate('/learn')">
                        <span style="font-weight: 500; color: #ffffff;">#${prob.id} — ${prob.title}</span>
                        <span class="difficulty-tag ${prob.difficulty.toLowerCase()}">${prob.difficulty}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Right: Mini-Visualizer widget -->
              <div class="pattern-viz-panel" style="background: var(--card-glass); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); height: 100%; display: flex; flex-direction: column; gap: 16px;">
                <div class="viz-header flex-between" style="border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 12px; margin-bottom: 8px;">
                  <span style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Live Execution Trace</span>
                  <span class="spec-badge spec-blue" style="font-size: 10px;">ANIMATING</span>
                </div>
                <div class="viz-container" id="viz-${p.vizType}" style="min-height: 120px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px; flex: 1;">
                  <!-- Rendered dynamically -->
                </div>
              </div>

            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  init() {
    this._intervals = [];

    // Trigger visualizer animation runs
    this.runSlidingWindowViz();
    this.runBinarySearchViz();
    this.runTwoPointersViz();
    this.runBFSViz();
    this.runDFSViz();
    this.runDPGridViz();

    // Bind common problems click
    const badges = document.querySelectorAll('.common-prob-badge');
    badges.forEach(b => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        window.router.navigate('/learn');
      });
    });
  },

  runSlidingWindowViz() {
    const target = document.getElementById('viz-window');
    if (!target) return;

    const array = [1, 5, 2, 9, 3, 7, 4, 8];
    let windowSize = 3;
    let index = 0;

    const render = () => {
      if (!document.getElementById('viz-window')) return;
      target.innerHTML = `
        <div class="array-flex" style="display: flex; gap: 6px; margin-bottom: 12px;">
          ${array.map((val, i) => {
            let cls = 'array-node';
            let ptr = '';
            if (i >= index && i < index + windowSize) {
              if (i === index || i === index + windowSize - 1) {
                cls += ' edge-window';
              } else {
                cls += ' active-window';
              }
            }
            if (i === index) ptr = '<span class="node-ptr-lbl ptr-cyan" style="position:absolute; bottom:-12px; font-size:8px;">L</span>';
            if (i === index + windowSize - 1) ptr = '<span class="node-ptr-lbl ptr-amber" style="position:absolute; bottom:-12px; font-size:8px;">R</span>';
            return `<div class="${cls}" style="width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:6px; font-size:11px; font-weight:700; position:relative;">${val}${ptr}</div>`;
          }).join('')}
        </div>
        <div class="viz-footer-bar" style="display:flex; justify-content:space-between; width:100%; font-size:10px; color:var(--text-muted); font-family:monospace; margin-top:8px;">
          <span>Window Size: ${windowSize}</span>
          <span>Left Pointer: ${index}</span>
        </div>
      `;
      index = (index + 1) % (array.length - windowSize + 1);
    };

    render();
    const interval = setInterval(render, 1600);
    this._intervals.push(interval);
  },

  runBinarySearchViz() {
    const target = document.getElementById('viz-binary');
    if (!target) return;

    const array = [1, 3, 5, 7, 9, 11, 13, 15, 17];
    const targetVal = 13;
    let L = 0;
    let R = array.length - 1;
    let M = Math.floor((L + R) / 2);

    const render = () => {
      if (!document.getElementById('viz-binary')) return;
      target.innerHTML = `
        <div class="array-flex" style="display: flex; gap: 6px; margin-bottom: 12px;">
          ${array.map((val, i) => {
            let cls = 'array-node';
            let ptr = '';
            if (i === L) {
              cls += ' left-pointer';
              ptr += '<span class="node-ptr-lbl ptr-purple" style="position:absolute; bottom:-12px; font-size:8px;">L</span>';
            }
            if (i === R) {
              cls += ' right-pointer';
              ptr += '<span class="node-ptr-lbl ptr-amber" style="position:absolute; bottom:-12px; font-size:8px;">R</span>';
            }
            if (i === M) {
              cls += ' edge-window';
              ptr += '<span class="node-ptr-lbl ptr-cyan" style="position:absolute; bottom:-12px; font-size:8px;">M</span>';
            }
            if (val === targetVal && i === M) {
              cls = 'array-node found-node';
            }
            return `<div class="${cls}" style="width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:6px; font-size:11px; font-weight:700; position:relative;">${val}${ptr}</div>`;
          }).join('')}
        </div>
        <div class="viz-footer-bar" style="display:flex; justify-content:space-between; width:100%; font-size:10px; color:var(--text-muted); font-family:monospace; margin-top:8px;">
          <span>Left: ${L}</span>
          <span>Mid: ${M}</span>
          <span>Right: ${R}</span>
        </div>
      `;

      if (array[M] === targetVal) {
        L = 0;
        R = array.length - 1;
        M = Math.floor((L + R) / 2);
      } else {
        if (array[M] < targetVal) {
          L = M + 1;
        } else {
          R = M - 1;
        }
        M = Math.floor((L + R) / 2);
      }
    };

    render();
    const interval = setInterval(render, 1600);
    this._intervals.push(interval);
  },

  runTwoPointersViz() {
    const target = document.getElementById('viz-pointers');
    if (!target) return;

    const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    let L = 0;
    let R = heights.length - 1;

    const render = () => {
      if (!document.getElementById('viz-pointers')) return;
      
      const maxVal = Math.max(...heights);
      
      target.innerHTML = `
        <div style="display:flex; align-items:flex-end; gap:6px; height:60px; margin-bottom:12px;">
          ${heights.map((h, i) => {
            const hPx = (h / maxVal) * 50;
            let bg = 'rgba(255,255,255,0.05)';
            let border = 'rgba(255,255,255,0.1)';
            let ptr = '';
            
            if (i === L) {
              bg = 'rgba(139,92,246,0.3)';
              border = 'var(--color-ai)';
              ptr = '<span style="position:absolute; top:-12px; left:2px; font-size:8px; color:var(--color-ai); font-weight:bold;">L</span>';
            } else if (i === R) {
              bg = 'rgba(139,92,246,0.3)';
              border = 'var(--color-ai)';
              ptr = '<span style="position:absolute; top:-12px; left:2px; font-size:8px; color:var(--color-ai); font-weight:bold;">R</span>';
            } else if (i > L && i < R) {
              bg = 'rgba(6,182,212,0.1)';
              border = 'rgba(6,182,212,0.3)';
            }
            
            return `<div style="width:12px; height:${hPx}px; background:${bg}; border:1px solid ${border}; border-radius:2px 2px 0 0; position:relative;">
              ${ptr}
            </div>`;
          }).join('')}
        </div>
        <div class="viz-footer-bar" style="display:flex; justify-content:space-between; width:100%; font-size:10px; color:var(--text-muted); font-family:monospace; margin-top:8px;">
          <span>Left height: ${heights[L]}</span>
          <span>Right height: ${heights[R]}</span>
        </div>
      `;

      if (L >= R) {
        L = 0;
        R = heights.length - 1;
      } else {
        if (heights[L] < heights[R]) {
          L++;
        } else {
          R--;
        }
      }
    };

    render();
    const interval = setInterval(render, 1600);
    this._intervals.push(interval);
  },

  runBFSViz() {
    const target = document.getElementById('viz-bfs');
    if (!target) return;

    target.innerHTML = `
      <div class="bfs-tree-flow" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
        <div class="bfs-level" style="display:flex; gap:20px;">
          <div class="bfs-circle-node" id="patterns-bfs-n-1" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">1</div>
        </div>
        <div class="bfs-level" style="display:flex; gap:40px;">
          <div class="bfs-circle-node" id="patterns-bfs-n-2" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">2</div>
          <div class="bfs-circle-node" id="patterns-bfs-n-3" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">3</div>
        </div>
        <div class="bfs-level" style="display:flex; gap:20px;">
          <div class="bfs-circle-node" id="patterns-bfs-n-4" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">4</div>
          <div class="bfs-circle-node" id="patterns-bfs-n-5" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">5</div>
          <div class="bfs-circle-node" id="patterns-bfs-n-6" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">6</div>
          <div class="bfs-circle-node" id="patterns-bfs-n-7" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">7</div>
        </div>
      </div>
      <div class="viz-footer-bar" style="display:flex; justify-content:space-between; width:100%; font-size:10px; color:var(--text-muted); font-family:monospace; margin-top:8px;">
        <span id="patterns-bfs-queue">Queue: [ ]</span>
      </div>
    `;

    const order = [1, 2, 3, 4, 5, 6, 7];
    let step = 0;

    const tick = () => {
      if (!document.getElementById('viz-bfs')) return;
      document.querySelectorAll('#viz-bfs .bfs-circle-node').forEach(node => {
        node.className = 'bfs-circle-node';
        node.style.background = 'transparent';
        node.style.borderColor = 'rgba(255,255,255,0.15)';
      });

      const activeVal = order[step];
      
      for (let i = 0; i < step; i++) {
        const visitedNode = document.getElementById(`patterns-bfs-n-${order[i]}`);
        if (visitedNode) {
          visitedNode.style.background = 'rgba(34,197,94,0.15)';
          visitedNode.style.borderColor = 'var(--color-accepted)';
        }
      }

      const activeNode = document.getElementById(`patterns-bfs-n-${activeVal}`);
      if (activeNode) {
        activeNode.style.background = 'rgba(139,92,246,0.2)';
        activeNode.style.borderColor = 'var(--color-ai)';
      }

      const queue = order.slice(step + 1, step + 4);
      const queueText = document.getElementById('patterns-bfs-queue');
      if (queueText) {
        queueText.innerText = `Queue: [ ${queue.join(', ')} ]`;
      }

      step = (step + 1) % order.length;
    };

    tick();
    const interval = setInterval(tick, 1300);
    this._intervals.push(interval);
  },

  runDFSViz() {
    const target = document.getElementById('viz-dfs');
    if (!target) return;

    target.innerHTML = `
      <div class="dfs-tree-flow" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
        <div class="dfs-level" style="display:flex; gap:20px;">
          <div class="dfs-circle-node" id="patterns-dfs-n-1" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">1</div>
        </div>
        <div class="dfs-level" style="display:flex; gap:40px;">
          <div class="dfs-circle-node" id="patterns-dfs-n-2" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">2</div>
          <div class="dfs-circle-node" id="patterns-dfs-n-5" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">5</div>
        </div>
        <div class="dfs-level" style="display:flex; gap:20px;">
          <div class="dfs-circle-node" id="patterns-dfs-n-3" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">3</div>
          <div class="dfs-circle-node" id="patterns-dfs-n-4" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">4</div>
          <div class="dfs-circle-node" id="patterns-dfs-n-6" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">6</div>
          <div class="dfs-circle-node" id="patterns-dfs-n-7" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">7</div>
        </div>
      </div>
      <div class="viz-footer-bar" style="display:flex; justify-content:space-between; width:100%; font-size:10px; color:var(--text-muted); font-family:monospace; margin-top:8px;">
        <span id="patterns-dfs-stack">Stack: [ ]</span>
      </div>
    `;

    const order = [1, 2, 3, 4, 5, 6, 7];
    let step = 0;

    const tick = () => {
      if (!document.getElementById('viz-dfs')) return;
      document.querySelectorAll('#viz-dfs .dfs-circle-node').forEach(node => {
        node.style.background = 'transparent';
        node.style.borderColor = 'rgba(255,255,255,0.15)';
      });

      const activeVal = order[step];
      
      for (let i = 0; i < step; i++) {
        const visitedNode = document.getElementById(`patterns-dfs-n-${order[i]}`);
        if (visitedNode) {
          visitedNode.style.background = 'rgba(34,197,94,0.15)';
          visitedNode.style.borderColor = 'var(--color-accepted)';
        }
      }

      const activeNode = document.getElementById(`patterns-dfs-n-${activeVal}`);
      if (activeNode) {
        activeNode.style.background = 'rgba(139,92,246,0.2)';
        activeNode.style.borderColor = 'var(--color-ai)';
      }

      const stack = order.slice(0, step + 1);
      const stackText = document.getElementById('patterns-dfs-stack');
      if (stackText) {
        stackText.innerText = `Stack: [ ${stack.join(', ')} ]`;
      }

      step = (step + 1) % order.length;
    };

    tick();
    const interval = setInterval(tick, 1300);
    this._intervals.push(interval);
  },

  runDPGridViz() {
    const target = document.getElementById('viz-dp');
    if (!target) return;

    target.innerHTML = `
      <div id="patterns-dp-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:4px; max-width:140px;">
        <!-- Filled dynamically -->
      </div>
    `;

    const grid = document.getElementById('patterns-dp-grid');
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        grid.innerHTML += `<div id="patterns-dp-cell-${r}-${c}" style="width:24px; height:24px; border:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; font-size:9px; border-radius:3px; background:rgba(255,255,255,0.01); transition:var(--transition-fast);">0</div>`;
      }
    }

    let r = 0;
    let c = 0;

    const tick = () => {
      if (!document.getElementById('viz-dp')) return;
      document.querySelectorAll('#patterns-dp-grid div').forEach(cell => {
        cell.style.borderColor = 'rgba(255,255,255,0.06)';
        cell.style.boxShadow = 'none';
      });

      const cell = document.getElementById(`patterns-dp-cell-${r}-${c}`);
      if (cell) {
        if (r === 0 || c === 0) {
          cell.innerText = '1';
          cell.style.background = 'rgba(34,197,94,0.15)';
          cell.style.borderColor = 'var(--color-accepted)';
        } else {
          const up = document.getElementById(`patterns-dp-cell-${r-1}-${c}`);
          const left = document.getElementById(`patterns-dp-cell-${r}-${c-1}`);
          const val = parseInt(up?.innerText || '0') + parseInt(left?.innerText || '0');
          cell.innerText = val;
          cell.style.background = 'rgba(139,92,246,0.15)';
          cell.style.borderColor = 'var(--color-ai)';
          cell.style.boxShadow = '0 0 10px rgba(139,92,246,0.3)';
        }
      }

      c++;
      if (c >= 4) {
        c = 0;
        r++;
      }

      if (r >= 4) {
        r = 0;
        c = 0;
        setTimeout(() => {
          document.querySelectorAll('#patterns-dp-grid div').forEach(cell => {
            cell.innerText = '0';
            cell.style.background = 'rgba(255,255,255,0.01)';
            cell.style.borderColor = 'rgba(255,255,255,0.06)';
          });
        }, 1500);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    this._intervals.push(interval);
  },

  destroy() {
    this._intervals.forEach(i => clearInterval(i));
    this._intervals = [];
  }
};
