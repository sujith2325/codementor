export const VisualizersPage = {
  template() {
    return `
      <section id="viz-hero" style="padding: 120px 0 40px 0; text-align: center; background: linear-gradient(to bottom, rgba(6,182,212,0.05) 0%, transparent 100%);">
        <div class="container">
          <span class="section-tag section-tag-cyan">Interactive Lab</span>
          <h1 style="font-family: var(--font-display); font-size: 40px; font-weight: 900; margin-top: 12px; margin-bottom: 16px; color: #ffffff;">Visualizer Hub</h1>
          <p style="font-size: 15px; color: var(--text-secondary); max-width: 600px; margin: 0 auto; line-height: 1.6;">
            Manipulate input variables, place obstacles, and watch data structures execute step-by-step in real-time.
          </p>
        </div>
      </section>

      <section id="viz-content" style="padding: 20px 0 100px 0;">
        <div class="container" style="display: grid; grid-template-columns: 240px 1fr; gap: 40px; align-items: start;">
          
          <!-- Left Visualizer Tabs Navigator -->
          <div class="viz-sidebar-menu" style="display: flex; flex-direction: column; gap: 8px; background: var(--card-glass); border: 1px solid var(--border-color); border-radius: 16px; padding: 16px;">
            <button class="viz-menu-item active" id="btn-menu-binary" style="padding: 12px 16px; border-radius: 10px; border: none; background: transparent; color: #ffffff; font-family: var(--font-display); font-size: 13px; font-weight: 700; text-align: left; cursor: pointer; transition: var(--transition-fast);">1. Binary Search</button>
            <button class="viz-menu-item" id="btn-menu-pathfinder" style="padding: 12px 16px; border-radius: 10px; border: none; background: transparent; color: var(--text-muted); font-family: var(--font-display); font-size: 13px; font-weight: 700; text-align: left; cursor: pointer; transition: var(--transition-fast);">2. Maze Pathfinder (BFS)</button>
            <button class="viz-menu-item" id="btn-menu-dpgrid" style="padding: 12px 16px; border-radius: 10px; border: none; background: transparent; color: var(--text-muted); font-family: var(--font-display); font-size: 13px; font-weight: 700; text-align: left; cursor: pointer; transition: var(--transition-fast);">3. Knapsack DP Grid</button>
          </div>

          <!-- Right: Visualizer Active Frame -->
          <div class="viz-display-card" style="background: var(--card-glass); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; min-height: 400px; display: flex; flex-direction: column;">
            
            <!-- FRAME 1: BINARY SEARCH -->
            <div class="viz-frame active" id="frame-binary" style="display: none; flex-direction: column; gap: 24px; height: 100%;">
              <div>
                <h3 style="font-family: var(--font-display); font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 6px;">Binary Search Splitter</h3>
                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">Enter a target value, then click step buttons to search the sorted list.</p>
              </div>
              
              <div style="display: flex; gap: 16px; align-items: center; background: rgba(255,255,255,0.01); padding: 16px; border-radius: 16px; border: 1px solid var(--border-color); width: fit-content;">
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <label style="font-size: 11px; text-transform: uppercase; color: var(--text-muted);">Search Target</label>
                  <input type="number" id="binary-target-input" value="13" style="width: 100px; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.3); color: #fff; font-size: 13px; outline: none;">
                </div>
                <div style="display: flex; gap: 8px; align-self: flex-end;">
                  <button class="btn btn-primary" id="btn-binary-init" style="padding: 10px 16px; font-size: 12px;">Reset</button>
                  <button class="btn btn-secondary" id="btn-binary-step" style="padding: 10px 16px; font-size: 12px;">Step Forward</button>
                </div>
              </div>

              <div id="binary-board" style="display: flex; flex-direction: column; gap: 24px; margin-top: 12px; min-height: 120px; justify-content: center; align-items: center;">
                <!-- Loaded dynamically -->
              </div>
            </div>

            <!-- FRAME 2: PATHFINDER -->
            <div class="viz-frame" id="frame-pathfinder" style="display: none; flex-direction: column; gap: 24px;">
              <div>
                <h3 style="font-family: var(--font-display); font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 6px;">Maze Pathfinder (BFS)</h3>
                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">Click cells in the 10x10 grid to place wall obstacles (black), then click Run BFS to search the shortest path from start (green) to target (red).</p>
              </div>

              <div style="display: flex; gap: 12px; align-items: center;">
                <button class="btn btn-primary" id="btn-path-run" style="padding: 10px 16px; font-size: 12px;">Run BFS Pathfinder</button>
                <button class="btn btn-secondary" id="btn-path-clear" style="padding: 10px 16px; font-size: 12px;">Clear Grid</button>
                <span id="pathfinder-status" style="font-size: 12px; color: var(--text-muted); font-family: monospace;">Standby</span>
              </div>

              <div style="display: flex; justify-content: center; margin-top: 12px;">
                <div id="grid-canvas-board" style="display: grid; grid-template-columns: repeat(10, 32px); gap: 3px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; border: 1px solid var(--border-color);">
                  <!-- Loaded dynamically -->
                </div>
              </div>
            </div>

            <!-- FRAME 3: DP GRID -->
            <div class="viz-frame" id="frame-dpgrid" style="display: none; flex-direction: column; gap: 24px;">
              <div>
                <h3 style="font-family: var(--font-display); font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 6px;">Knapsack DP Matrix Solver</h3>
                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">Watch a 2D Knapsack DP Grid populate step-by-step. Cells values are computed from top-left dependencies based on max profit limits.</p>
              </div>

              <div style="display: flex; gap: 12px; align-items: center;">
                <button class="btn btn-primary" id="btn-dp-run" style="padding: 10px 16px; font-size: 12px;">Calculate Matrix</button>
                <button class="btn btn-secondary" id="btn-dp-reset" style="padding: 10px 16px; font-size: 12px;">Reset</button>
                <span id="dp-status" style="font-size: 12px; color: var(--text-muted); font-family: monospace;">Standby</span>
              </div>

              <div style="display: flex; justify-content: center; margin-top: 12px;">
                <div id="dp-matrix-container" style="display: grid; grid-template-columns: repeat(6, 48px); gap: 4px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; border: 1px solid var(--border-color);">
                  <!-- Loaded dynamically -->
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    `;
  },

  init() {
    this.activeFrame = 'binary';
    
    const btnMenuBinary = document.getElementById('btn-menu-binary');
    const btnMenuPath = document.getElementById('btn-menu-pathfinder');
    const btnMenuDP = document.getElementById('btn-menu-dpgrid');

    const frameBinary = document.getElementById('frame-binary');
    const framePath = document.getElementById('frame-pathfinder');
    const frameDP = document.getElementById('frame-dpgrid');

    const switchFrame = (frameId) => {
      this.activeFrame = frameId;
      [btnMenuBinary, btnMenuPath, btnMenuDP].forEach(btn => {
        if (!btn) return;
        if (btn.id === `btn-menu-${frameId}`) {
          btn.classList.add('active');
          btn.style.color = '#ffffff';
          btn.style.background = 'rgba(255, 255, 255, 0.04)';
        } else {
          btn.classList.remove('active');
          btn.style.color = 'var(--text-muted)';
          btn.style.background = 'transparent';
        }
      });

      [frameBinary, framePath, frameDP].forEach(f => {
        if (!f) return;
        if (f.id === `frame-${frameId}`) {
          f.style.display = 'flex';
        } else {
          f.style.display = 'none';
        }
      });
    };

    if (btnMenuBinary) btnMenuBinary.addEventListener('click', () => switchFrame('binary'));
    if (btnMenuPath) btnMenuPath.addEventListener('click', () => switchFrame('pathfinder'));
    if (btnMenuDP) btnMenuDP.addEventListener('click', () => switchFrame('dpgrid'));

    // Start with Binary frame active
    switchFrame('binary');

    // Init sub visualizers
    this.initBinarySearch();
    this.initPathfinder();
    this.initDPGrid();
  },

  // Binary Search Interactive implementation
  initBinarySearch() {
    const array = [2, 5, 8, 12, 16, 23, 38, 42, 56, 72, 91];
    let L = 0;
    let R = array.length - 1;
    let M = Math.floor((L + R) / 2);
    let isFound = false;

    const board = document.getElementById('binary-board');
    const btnReset = document.getElementById('btn-binary-init');
    const btnStep = document.getElementById('btn-binary-step');
    const inputTarget = document.getElementById('binary-target-input');

    const render = () => {
      if (!board) return;
      const targetVal = parseInt(inputTarget?.value || '23');
      
      board.innerHTML = `
        <div class="array-flex" style="display: flex; gap: 8px; justify-content: center;">
          ${array.map((val, i) => {
            let cls = 'array-node';
            let ptr = '';
            if (i === L && L <= R) {
              cls += ' left-pointer';
              ptr += '<span class="node-ptr-lbl ptr-purple" style="position:absolute; bottom:-14px; font-size:9px;">L</span>';
            }
            if (i === R && L <= R) {
              cls += ' right-pointer';
              ptr += '<span class="node-ptr-lbl ptr-amber" style="position:absolute; bottom:-14px; font-size:9px;">R</span>';
            }
            if (i === M && L <= R && !isFound) {
              cls += ' edge-window';
              ptr += '<span class="node-ptr-lbl ptr-cyan" style="position:absolute; bottom:-14px; font-size:9px;">M</span>';
            }
            if (val === targetVal && isFound && i === M) {
              cls = 'array-node found-node';
            }
            if (i < L || i > R) {
              cls += ' out-of-bounds';
            }
            return `<div class="${cls}" style="width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:6px; font-size:12px; font-weight:700; position:relative;">${val}${ptr}</div>`;
          }).join('')}
        </div>
        <div style="font-family: monospace; font-size: 11px; color: var(--text-secondary); display: flex; gap: 20px; margin-top: 12px;">
          <span>Left Index: ${L}</span>
          <span>Mid Index: ${M} (value = ${array[M]})</span>
          <span>Right Index: ${R}</span>
        </div>
        <div id="binary-status-text" style="font-size: 12px; color: var(--color-ai); font-family: monospace; font-weight: bold;">
          ${isFound ? `Found target ${targetVal} at index ${M}! 🎉` : L > R ? 'Target value not found in array.' : 'Press Step Forward to slice search range.'}
        </div>
      `;
    };

    const reset = () => {
      L = 0;
      R = array.length - 1;
      M = Math.floor((L + R) / 2);
      isFound = false;
      render();
    };

    const step = () => {
      if (isFound || L > R) return;
      const targetVal = parseInt(inputTarget?.value || '23');

      if (array[M] === targetVal) {
        isFound = true;
      } else {
        if (array[M] < targetVal) {
          L = M + 1;
        } else {
          R = M - 1;
        }
        M = Math.floor((L + R) / 2);
      }
      render();
    };

    if (btnReset) btnReset.addEventListener('click', reset);
    if (btnStep) btnStep.addEventListener('click', step);
    
    reset();
  },

  // 10x10 BFS Pathfinder implementation
  initPathfinder() {
    const board = document.getElementById('grid-canvas-board');
    const btnRun = document.getElementById('btn-path-run');
    const btnClear = document.getElementById('btn-path-clear');
    const statusTxt = document.getElementById('pathfinder-status');

    if (!board) return;

    let grid = Array(10).fill(null).map(() => Array(10).fill(0)); // 0 = empty, 1 = wall
    const start = [1, 1];
    const target = [8, 8];
    let isRunning = false;

    const renderGrid = () => {
      board.innerHTML = '';
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const cell = document.createElement('div');
          cell.id = `cell-${r}-${c}`;
          cell.style.cssText = 'width: 32px; height: 32px; border: 1px solid rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 9px; font-weight: bold; cursor: pointer; transition: all 0.2s;';
          
          if (r === start[0] && c === start[1]) {
            cell.innerText = 'S';
            cell.style.background = 'rgba(34,197,94,0.3)';
            cell.style.borderColor = 'var(--color-accepted)';
          } else if (r === target[0] && c === target[1]) {
            cell.innerText = 'T';
            cell.style.background = 'rgba(239,68,68,0.3)';
            cell.style.borderColor = '#ef4444';
          } else if (grid[r][c] === 1) {
            cell.style.background = '#000';
            cell.style.borderColor = '#111';
          } else {
            cell.style.background = 'rgba(255,255,255,0.01)';
          }

          cell.addEventListener('click', () => {
            if (isRunning) return;
            if ((r === start[0] && c === start[1]) || (r === target[0] && c === target[1])) return;
            grid[r][c] = grid[r][c] === 1 ? 0 : 1;
            renderGrid();
          });

          board.appendChild(cell);
        }
      }
    };

    const clearGrid = () => {
      if (isRunning) return;
      grid = Array(10).fill(null).map(() => Array(10).fill(0));
      statusTxt.innerText = 'Standby';
      renderGrid();
    };

    const runBFS = async () => {
      if (isRunning) return;
      isRunning = true;
      statusTxt.innerText = 'Running BFS Queue pulse...';

      // Clear old colors from cells
      renderGrid();

      const queue = [start];
      const parent = {};
      const visited = {};
      visited[`${start[0]},${start[1]}`] = true;
      let pathFound = false;

      while (queue.length > 0) {
        const curr = queue.shift();
        const [cr, cc] = curr;

        if (cr === target[0] && cc === target[1]) {
          pathFound = true;
          break;
        }

        // Draw active step
        if (!(cr === start[0] && cc === start[1])) {
          const activeCell = document.getElementById(`cell-${cr}-${cc}`);
          if (activeCell) {
            activeCell.style.background = 'rgba(139,92,246,0.25)';
            activeCell.style.borderColor = 'var(--color-ai)';
          }
        }

        await new Promise(r => setTimeout(r, 60));

        // Neighbor lookups (Up, Down, Left, Right)
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dr, dc] of dirs) {
          const nr = cr + dr;
          const nc = cc + dc;

          if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10 && grid[nr][nc] === 0) {
            const key = `${nr},${nc}`;
            if (!visited[key]) {
              visited[key] = true;
              parent[key] = curr;
              queue.push([nr, nc]);
              
              if (!(nr === target[0] && nc === target[1])) {
                const visitedCell = document.getElementById(`cell-${nr}-${nc}`);
                if (visitedCell) {
                  visitedCell.style.background = 'rgba(6,182,212,0.15)';
                  visitedCell.style.borderColor = 'rgba(6,182,212,0.4)';
                }
              }
            }
          }
        }
      }

      if (pathFound) {
        statusTxt.innerText = 'Path found! Backtracking...';
        let step = parent[`${target[0]},${target[1]}`];
        while (step && !(step[0] === start[0] && step[1] === start[1])) {
          const [sr, sc] = step;
          const pathCell = document.getElementById(`cell-${sr}-${sc}`);
          if (pathCell) {
            pathCell.style.background = 'rgba(34,197,94,0.2)';
            pathCell.style.borderColor = 'var(--color-accepted)';
            pathCell.style.boxShadow = '0 0 10px rgba(34,197,94,0.3)';
          }
          await new Promise(r => setTimeout(r, 80));
          step = parent[`${step[0]},${step[1]}`];
        }
        statusTxt.innerText = 'Shortest path mapped successfully! ✓';
      } else {
        statusTxt.innerText = 'BFS completed. Target unreachable due to obstacles. ✗';
      }

      isRunning = false;
    };

    if (btnRun) btnRun.addEventListener('click', runBFS);
    if (btnClear) btnClear.addEventListener('click', clearGrid);

    renderGrid();
  },

  // Interactive DP Grid Knapsack implementation
  initDPGrid() {
    const board = document.getElementById('dp-matrix-container');
    const btnRun = document.getElementById('btn-dp-run');
    const btnReset = document.getElementById('btn-dp-reset');
    const statusTxt = document.getElementById('dp-status');

    if (!board) return;

    const weights = [1, 2, 3, 4];
    const values = [10, 15, 40, 50];
    const W = 5;
    const itemsCount = weights.length;
    let isRunning = false;

    const renderMatrix = () => {
      board.innerHTML = '';
      // Row 0 shows Weight headers, Col 0 shows Item labels
      for (let r = 0; r <= itemsCount; r++) {
        for (let w = 0; w <= W; w++) {
          const cell = document.createElement('div');
          cell.id = `dp-cell-${r}-${w}`;
          cell.style.cssText = 'width: 48px; height: 36px; border: 1px solid rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border-radius: 4px; background: rgba(255,255,255,0.01); transition: all 0.3s;';
          cell.innerText = '0';
          board.appendChild(cell);
        }
      }
    };

    const runDP = async () => {
      if (isRunning) return;
      isRunning = true;
      renderMatrix();
      statusTxt.innerText = 'Computing dynamic optimal subproblems...';

      const dp = Array(itemsCount + 1).fill(null).map(() => Array(W + 1).fill(0));

      for (let i = 1; i <= itemsCount; i++) {
        const itemWeight = weights[i - 1];
        const itemValue = values[i - 1];

        for (let w = 1; w <= W; w++) {
          const cell = document.getElementById(`dp-cell-${i}-${w}`);
          if (cell) {
            cell.style.borderColor = 'var(--color-ai)';
            cell.style.background = 'rgba(139,92,246,0.1)';
          }

          await new Promise(r => setTimeout(r, 150));

          if (itemWeight <= w) {
            const exclude = dp[i - 1][w];
            const include = dp[i - 1][w - itemWeight] + itemValue;
            
            // Highlight dependencies
            const dep1 = document.getElementById(`dp-cell-${i-1}-${w}`);
            const dep2 = document.getElementById(`dp-cell-${i-1}-${w-itemWeight}`);
            if (dep1) dep1.style.background = 'rgba(6,182,212,0.15)';
            if (dep2) dep2.style.background = 'rgba(6,182,212,0.15)';

            dp[i][w] = Math.max(exclude, include);
            if (cell) cell.innerText = dp[i][w];

            await new Promise(r => setTimeout(r, 150));
            if (dep1) dep1.style.background = '';
            if (dep2) dep2.style.background = '';
          } else {
            dp[i][w] = dp[i - 1][w];
            if (cell) cell.innerText = dp[i][w];
          }

          if (cell) {
            cell.style.borderColor = 'rgba(255,255,255,0.03)';
            cell.style.background = 'rgba(34,197,94,0.1)';
          }
        }
      }

      statusTxt.innerText = 'Matrix populated! Max profit value: ' + dp[itemsCount][W];
      isRunning = false;
    };

    if (btnRun) btnRun.addEventListener('click', runDP);
    if (btnReset) btnReset.addEventListener('click', () => {
      if (isRunning) return;
      statusTxt.innerText = 'Standby';
      renderMatrix();
    });

    renderMatrix();
  },

  destroy() {
    // Cleanup if needed
  }
};
