export const AdminPage = {
  template() {
    return `
      <div class="admin-dashboard" style="
        min-height: 100vh;
        background: var(--bg-dark);
        padding: 40px 32px;
        font-family: var(--font-body);
        position: relative;
        z-index: 5;
      ">

        <!-- Admin Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:40px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
              <div style="
                width:36px; height:36px; border-radius:10px;
                background: linear-gradient(135deg, #f59e0b, #dc2626);
                display:flex; align-items:center; justify-content:center;
                box-shadow: 0 0 20px rgba(245,158,11,0.4);
              ">
                <svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h1 style="
                font-family: var(--font-display);
                font-size: 24px; font-weight: 900;
                background: linear-gradient(90deg, #f59e0b, #fbbf24);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0;
              ">Admin Dashboard</h1>
              <span style="
                font-size:9px; font-weight:800; text-transform:uppercase;
                letter-spacing:1.5px; padding:3px 8px; border-radius:6px;
                background: rgba(245,158,11,0.15); color:#f59e0b;
                border: 1px solid rgba(245,158,11,0.3);
              ">LIVE</span>
            </div>
            <p style="color:var(--text-muted); font-size:13px; margin:0;">
              Manage users, monitor activity, and control the CodeMentor platform.
            </p>
          </div>
          <button id="admin-goto-sandbox" style="
            padding: 10px 20px; border-radius: 12px;
            border: 1px solid var(--border-color);
            background: var(--bg-card); color: var(--text-primary);
            font-size: 13px; font-weight: 600; cursor: pointer;
            display: flex; align-items: center; gap: 8px;
            transition: all 0.25s ease;
            font-family: var(--font-body);
          ">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M4 17l6-6-6-6M12 19h8"/>
            </svg>
            Go to Sandbox
          </button>
        </div>

        <!-- Stats Grid -->
        <div style="
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        ">
          ${[
            { label: 'Total Users',     val: '1,524',  sub: '+12 today',    color: '#8b5cf6', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' },
            { label: 'Problems',        val: '1,520',  sub: '12 detailed',   color: '#06b6d4', icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
            { label: 'Daily Sessions',  val: '8,421',  sub: '+842 vs yday',  color: '#22c55e', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
            { label: 'Problems Solved', val: '42.1k',  sub: 'All time',      color: '#f59e0b', icon: '<polyline points="20 6 9 17 4 12"/>' },
          ].map(s => `
            <div style="
              background: var(--bg-card);
              border: 1px solid var(--border-color);
              border-radius: 18px; padding: 24px;
              transition: border-color 0.25s ease, box-shadow 0.25s ease;
              cursor: default;
            " class="admin-stat-card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                <div style="
                  width:38px; height:38px; border-radius:10px;
                  background: ${s.color}18; border: 1px solid ${s.color}30;
                  display:flex; align-items:center; justify-content:center;
                ">
                  <svg width="16" height="16" fill="none" stroke="${s.color}" stroke-width="2" viewBox="0 0 24 24">
                    ${s.icon}
                  </svg>
                </div>
              </div>
              <div style="font-family:var(--font-display); font-size:28px; font-weight:900; color:${s.color}; line-height:1; margin-bottom:4px;">
                ${s.val}
              </div>
              <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted);">${s.label}</div>
              <div style="font-size:11px; color:${s.color}; margin-top:4px; opacity:0.8;">${s.sub}</div>
            </div>
          `).join('')}
        </div>

        <!-- Main Grid: Users table + Activity -->
        <div style="display:grid; grid-template-columns:1fr 340px; gap:16px; margin-bottom:16px;">

          <!-- Users Table -->
          <div style="
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 18px; padding: 24px;
          ">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
              <h3 style="font-family:var(--font-display); font-size:15px; font-weight:800; color:var(--text-primary); margin:0;">
                Recent Users
              </h3>
              <span style="font-size:10px; color:var(--text-muted); background:var(--bg-card); border:1px solid var(--border-color); padding:3px 8px; border-radius:6px;">
                Showing 6 of 1,524
              </span>
            </div>

            <!-- Table -->
            <div style="overflow:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
                <thead>
                  <tr style="border-bottom:1px solid var(--border-color);">
                    ${['User', 'Email', 'Role', 'Solved', 'Status'].map(h =>
                      `<th style="text-align:left; padding:8px 12px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted);">${h}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${[
                    { name: 'Sarah Jenkins',  email: 'sarah@stripe.com',     role: 'user',  solved: 142, active: true },
                    { name: 'Devon Carter',   email: 'devon@meta.com',       role: 'user',  solved: 89,  active: true },
                    { name: 'Alex Liu',       email: 'alex@google.com',      role: 'user',  solved: 231, active: false },
                    { name: 'Priya Shah',     email: 'priya@amazon.com',     role: 'user',  solved: 67,  active: true },
                    { name: 'James Walker',   email: 'james@microsoft.com',  role: 'user',  solved: 310, active: false },
                    { name: 'admin',          email: 'admin@codementor.com', role: 'admin', solved: '—', active: true },
                  ].map(u => `
                    <tr style="border-bottom:1px solid var(--border-color); transition:background 0.2s ease;" class="admin-user-row">
                      <td style="padding:12px; color:var(--text-primary); font-weight:600; display:flex; align-items:center; gap:10px; white-space:nowrap;">
                        <div style="
                          width:28px; height:28px; border-radius:50%; flex-shrink:0;
                          background: linear-gradient(135deg, ${u.role === 'admin' ? '#f59e0b, #dc2626' : '#8b5cf6, #06b6d4'});
                          display:flex; align-items:center; justify-content:center;
                          font-size:10px; font-weight:800; color:#fff;
                        ">${u.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div>
                        ${u.name}
                      </td>
                      <td style="padding:12px; color:var(--text-secondary);">${u.email}</td>
                      <td style="padding:12px;">
                        <span style="
                          font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;
                          padding:2px 7px; border-radius:5px;
                          background: ${u.role==='admin' ? 'rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1)'};
                          color: ${u.role==='admin' ? '#f59e0b' : '#8b5cf6'};
                          border: 1px solid ${u.role==='admin' ? 'rgba(245,158,11,0.3)' : 'rgba(139,92,246,0.3)'};
                        ">${u.role}</span>
                      </td>
                      <td style="padding:12px; color:var(--text-primary); font-weight:700; font-family:var(--font-display);">${u.solved}</td>
                      <td style="padding:12px;">
                        <span style="display:flex; align-items:center; gap:4px; font-size:10px; font-weight:700; color:${u.active ? '#22c55e' : 'var(--text-muted)'};">
                          <span style="width:6px; height:6px; border-radius:50%; background:${u.active ? '#22c55e' : 'var(--text-muted)'}; display:inline-block; ${u.active ? 'box-shadow: 0 0 6px #22c55e;' : ''}"></span>
                          ${u.active ? 'Online' : 'Offline'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right column: Quick Actions + Recent Activity -->
          <div style="display:flex; flex-direction:column; gap:16px;">

            <!-- Quick Actions -->
            <div style="
              background: var(--bg-card);
              border: 1px solid var(--border-color);
              border-radius: 18px; padding: 24px;
            ">
              <h3 style="font-family:var(--font-display); font-size:15px; font-weight:800; color:var(--text-primary); margin:0 0 16px;">
                Quick Actions
              </h3>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${[
                  { label: 'Manage Users',       color: '#8b5cf6', msg: 'User Management Panel (Demo)' },
                  { label: 'Analytics Dashboard', color: '#06b6d4', msg: 'Analytics Dashboard (Demo)' },
                  { label: 'Problem Settings',    color: '#22c55e', msg: 'Problem Settings (Demo)' },
                  { label: 'Broadcast Message',   color: '#f59e0b', msg: 'Broadcast to all users (Demo)' },
                ].map(a => `
                  <button onclick="alert('${a.msg}')" style="
                    width:100%; padding:10px 14px; border-radius:10px;
                    border: 1px solid ${a.color}20;
                    background: ${a.color}08;
                    color: ${a.color};
                    font-size:12px; font-weight:700; cursor:pointer;
                    text-align:left; display:flex; align-items:center; gap:8px;
                    transition: all 0.2s ease;
                    font-family:var(--font-body);
                  " class="admin-quick-btn">
                    <span style="width:6px;height:6px;border-radius:50%;background:${a.color};flex-shrink:0;"></span>
                    ${a.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Recent Activity Feed -->
            <div style="
              background: var(--bg-card);
              border: 1px solid var(--border-color);
              border-radius: 18px; padding: 24px;
              flex:1;
            ">
              <h3 style="font-family:var(--font-display); font-size:15px; font-weight:800; color:var(--text-primary); margin:0 0 16px;">
                Live Activity
              </h3>
              <div style="display:flex; flex-direction:column; gap:10px;" id="admin-activity-feed">
                ${[
                  { icon:'👤', text:'New user registered', sub:'sarah@stripe.com', color:'#8b5cf6', time:'2m ago' },
                  { icon:'✅', text:'Problem solved: Two Sum', sub:'devon@meta.com', color:'#22c55e', time:'5m ago' },
                  { icon:'📖', text:'Story Engine completed', sub:'alex@google.com', color:'#06b6d4', time:'8m ago' },
                  { icon:'⭐', text:'Problem bookmarked', sub:'priya@amazon.com', color:'#f59e0b', time:'12m ago' },
                  { icon:'🔐', text:'Admin login detected', sub:'admin@codementor.com', color:'#f59e0b', time:'just now' },
                ].map(a => `
                  <div style="display:flex; align-items:flex-start; gap:10px;">
                    <div style="
                      width:30px; height:30px; border-radius:8px; flex-shrink:0;
                      background: ${a.color}12; border:1px solid ${a.color}25;
                      display:flex; align-items:center; justify-content:center;
                      font-size:13px;
                    ">${a.icon}</div>
                    <div style="flex:1; min-width:0;">
                      <div style="font-size:11.5px; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${a.text}</div>
                      <div style="font-size:10px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${a.sub}</div>
                    </div>
                    <div style="font-size:9px; color:var(--text-muted); white-space:nowrap; margin-top:2px;">${a.time}</div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        </div>

        <!-- System Status Bar -->
        <div style="
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 18px; padding: 20px 24px;
          display: flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
        ">
          <span style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">
            System Status
          </span>
          ${[
            { name: 'API Server',     status: 'Operational', color: '#22c55e' },
            { name: 'Story Engine',   status: 'Operational', color: '#22c55e' },
            { name: 'Search Engine',  status: 'Operational', color: '#22c55e' },
            { name: 'Trace Engine',   status: 'Operational', color: '#22c55e' },
            { name: 'Export Engine',  status: 'Operational', color: '#22c55e' },
          ].map(s => `
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="width:7px;height:7px;border-radius:50%;background:${s.color};box-shadow:0 0 8px ${s.color};animation:pulseLight 2s infinite;"></span>
              <span style="font-size:11px; color:var(--text-secondary); font-weight:600;">${s.name}</span>
              <span style="font-size:10px; color:${s.color};">${s.status}</span>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  },

  init() {
    // Go to Sandbox button
    const btnSandbox = document.getElementById('admin-goto-sandbox');
    if (btnSandbox) {
      btnSandbox.addEventListener('click', () => window.router.navigate('/learn'));
      btnSandbox.addEventListener('mouseenter', () => {
        btnSandbox.style.borderColor = 'var(--color-ai)';
        btnSandbox.style.background = 'rgba(139,92,246,0.06)';
      });
      btnSandbox.addEventListener('mouseleave', () => {
        btnSandbox.style.borderColor = 'var(--border-color)';
        btnSandbox.style.background = 'var(--bg-card)';
      });
    }

    // Hover effects for stat cards
    document.querySelectorAll('.admin-stat-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'rgba(245,158,11,0.3)';
        card.style.boxShadow = '0 8px 24px rgba(245,158,11,0.08)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.borderColor = 'var(--border-color)';
        card.style.boxShadow = 'none';
      });
    });

    // Hover effects for user table rows
    document.querySelectorAll('.admin-user-row').forEach(row => {
      row.addEventListener('mouseenter', () => { row.style.background = 'rgba(255,255,255,0.02)'; });
      row.addEventListener('mouseleave', () => { row.style.background = 'transparent'; });
    });

    // Hover for quick action buttons
    document.querySelectorAll('.admin-quick-btn').forEach(btn => {
      const originalBg = btn.style.background;
      const originalBorder = btn.style.border;
      btn.addEventListener('mouseenter', () => {
        btn.style.opacity = '0.85';
        btn.style.transform = 'translateX(4px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateX(0)';
      });
    });

    // Live activity ticker (simulate new entries every 5s)
    this._tickInterval = setInterval(() => {
      const feed = document.getElementById('admin-activity-feed');
      if (!feed) { clearInterval(this._tickInterval); return; }
      const events = [
        { icon:'💡', text:'Pattern recognized: Sliding Window', sub:'new.user@gmail.com', color:'#06b6d4', time:'just now' },
        { icon:'✅', text:'Problem solved: Valid Parentheses', sub:'coder@meta.com', color:'#22c55e', time:'just now' },
        { icon:'👤', text:'New user registered', sub:'fresh@dev.io', color:'#8b5cf6', time:'just now' },
        { icon:'📊', text:'Trace engine completed', sub:'algo@google.com', color:'#f59e0b', time:'just now' },
      ];
      const ev = events[Math.floor(Math.random() * events.length)];
      const el = document.createElement('div');
      el.style.cssText = 'display:flex; align-items:flex-start; gap:10px; opacity:0; transition:opacity 0.4s ease;';
      el.innerHTML = `
        <div style="width:30px;height:30px;border-radius:8px;flex-shrink:0;background:${ev.color}12;border:1px solid ${ev.color}25;display:flex;align-items:center;justify-content:center;font-size:13px;">${ev.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:11.5px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ev.text}</div>
          <div style="font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ev.sub}</div>
        </div>
        <div style="font-size:9px;color:var(--text-muted);white-space:nowrap;margin-top:2px;">${ev.time}</div>
      `;
      feed.prepend(el);
      setTimeout(() => { el.style.opacity = '1'; }, 50);
      // Remove last item if more than 6
      while (feed.children.length > 6) feed.removeChild(feed.lastChild);
    }, 5000);
  },

  destroy() {
    if (this._tickInterval) clearInterval(this._tickInterval);
  }
};
