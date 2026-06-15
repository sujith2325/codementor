export const RoadmapPage = {
  template() {
    const nodes = [
      { step: '01', title: 'Arrays & Hashing', desc: 'Master complement lookups, anagram hashing, and sliding bounds.', status: 'COMPLETED' },
      { step: '02', title: 'Two Pointers', desc: 'Traverse sorted list boundaries, trapping rain pools, and palindrome checks.', status: 'IN_PROGRESS' },
      { step: '03', title: 'Sliding Window', desc: 'Identify longest unique subarrays and window matches dynamically.', status: 'LOCKED' },
      { step: '04', title: 'Stacks & Queues', desc: 'Handle bracket nestings, evictions, and expression evaluations.', status: 'LOCKED' },
      { step: '05', title: 'Binary Search', desc: 'Divide sorted search limits and Rotated arrays logarithmically.', status: 'LOCKED' },
      { step: '06', title: 'Trees (DFS/BFS)', desc: 'Explore level-order queues, BST nodes verification, and paths traversal.', status: 'LOCKED' },
      { step: '07', title: 'Graphs & Matrix Maze', desc: 'Place boundaries, compute islands count, and BFS shortest paths.', status: 'LOCKED' },
      { step: '08', title: 'Dynamic Programming', desc: 'Cache recurring subproblems and Knapsack grid fills.', status: 'LOCKED' }
    ];

    return `
      <section id="roadmap-hero" style="padding: 120px 0 40px 0; text-align: center; background: linear-gradient(to bottom, rgba(245,158,11,0.05) 0%, transparent 100%);">
        <div class="container">
          <span class="section-tag section-tag-amber">Curriculum</span>
          <h1 style="font-family: var(--font-display); font-size: 40px; font-weight: 900; margin-top: 12px; margin-bottom: 16px; color: #ffffff;">Algorithmic Roadmap</h1>
          <p style="font-size: 15px; color: var(--text-secondary); max-width: 600px; margin: 0 auto; line-height: 1.6;">
            A structured path through data structures and algorithmic families. Master one node to unlock the next.
          </p>
        </div>
      </section>

      <section id="roadmap-tree" style="padding: 40px 0 100px 0;">
        <div class="container" style="max-width: 800px; position: relative;">
          <!-- Vertical Line connecting nodes -->
          <div class="roadmap-line" style="position: absolute; top: 0; bottom: 0; left: 40px; width: 2px; background: linear-gradient(to bottom, var(--color-accepted) 10%, var(--color-ai) 25%, rgba(255,255,255,0.03) 60%); pointer-events: none;"></div>

          <div style="display: flex; flex-direction: column; gap: 40px;">
            ${nodes.map(node => {
              let dotBg = 'rgba(255,255,255,0.05)';
              let dotBorder = 'rgba(255,255,255,0.1)';
              let shadow = 'none';
              let badgeColor = 'var(--text-muted)';
              
              if (node.status === 'COMPLETED') {
                dotBg = 'rgba(34, 197, 94, 0.15)';
                dotBorder = 'var(--color-accepted)';
                shadow = '0 0 12px rgba(34, 197, 94, 0.3)';
                badgeColor = 'var(--color-accepted)';
              } else if (node.status === 'IN_PROGRESS') {
                dotBg = 'rgba(139, 92, 246, 0.15)';
                dotBorder = 'var(--color-ai)';
                shadow = '0 0 12px rgba(139, 92, 246, 0.3)';
                badgeColor = 'var(--color-ai)';
              }

              return `
                <div class="roadmap-node-row" style="display: flex; gap: 32px; align-items: start; position: relative; z-index: 2;">
                  
                  <!-- Node dot indicator -->
                  <div style="width: 80px; display: flex; justify-content: center; flex-shrink: 0;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: ${dotBg}; border: 2px solid ${dotBorder}; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #ffffff; box-shadow: ${shadow};">
                      ${node.step}
                    </div>
                  </div>

                  <!-- Node content card -->
                  <div class="roadmap-card" style="background: var(--card-glass); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; flex: 1; display: flex; justify-content: space-between; align-items: center; gap: 20px; transition: var(--transition-fast);">
                    <div>
                      <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${badgeColor};">${node.status.replace('_', ' ')}</span>
                      <h3 style="font-family: var(--font-display); font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 4px; margin-bottom: 6px;">${node.title}</h3>
                      <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0;">${node.desc}</p>
                    </div>
                    ${node.status !== 'LOCKED' ? `
                      <button class="btn btn-secondary" style="padding: 8px 14px; font-size: 11px; flex-shrink: 0;" onclick="window.router.navigate('/learn')">Explore Node</button>
                    ` : `
                      <span style="font-size: 16px; color: var(--text-muted); padding-right: 12px;">🔒</span>
                    `}
                  </div>

                </div>
              `;
            }).join('')}
          </div>

        </div>
      </section>
    `;
  },

  init() {
    // Setup roadmap card hover effects
    const cards = document.querySelectorAll('.roadmap-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'rgba(255,255,255,0.15)';
        card.style.transform = 'translateY(-2px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.borderColor = '';
        card.style.transform = '';
      });
    });
  },

  destroy() {
    // Cleanup if needed
  }
};
