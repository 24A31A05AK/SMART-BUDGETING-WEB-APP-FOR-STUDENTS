/* ═══════════════════════════════════════════════════════
   SMART BUDGET — app.js
═══════════════════════════════════════════════════════ */

/* ── TAB SWITCH ── */
function switchTab(tab) {
  document.getElementById('login-view').style.display  = tab === 'login'  ? 'block' : 'none';
  document.getElementById('signup-view').style.display = tab === 'signup' ? 'block' : 'none';
}

/* ── SIGN UP ── */
function doSignUp() {
  const firstName = document.getElementById('su-fname').value.trim();
  const lastName  = document.getElementById('su-lname').value.trim();
  const email     = document.getElementById('su-email').value.trim();
  const university= document.getElementById('su-university').value.trim();
  const password  = document.getElementById('su-password').value;
  const confirm   = document.getElementById('su-confirm').value;

  if (!firstName || !lastName || !email || !university || !password || !confirm) {
    showAuthError('signup', 'Please fill in all fields.');
    return;
  }
  if (password.length < 8) {
    showAuthError('signup', 'Password must be at least 8 characters.');
    return;
  }
  if (password !== confirm) {
    showAuthError('signup', 'Passwords do not match.');
    return;
  }

  const user = { firstName, lastName, email, university, password };
  localStorage.setItem('sb_user', JSON.stringify(user));

  showAuthSuccess('signup', 'Account created! Please sign in.');
  setTimeout(() => switchTab('login'), 1500);
}

/* ── LOGIN ── */
function doLogin() {
  const email    = document.getElementById('li-email').value.trim();
  const password = document.getElementById('li-password').value;

  if (!email || !password) {
    showAuthError('login', 'Please enter email and password.');
    return;
  }

  const stored = JSON.parse(localStorage.getItem('sb_user') || 'null');

  if (!stored) {
    showAuthError('login', 'No account found. Please sign up first.');
    return;
  }
  if (stored.email !== email || stored.password !== password) {
    showAuthError('login', 'Invalid email or password.');
    return;
  }

  loadApp(stored);
}

/* ── AUTH MESSAGES ── */
function showAuthError(form, msg) {
  const el = document.getElementById(form + '-msg');
  if (!el) return;
  el.textContent = msg;
  el.className = 'auth-msg error';
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function showAuthSuccess(form, msg) {
  const el = document.getElementById(form + '-msg');
  if (!el) return;
  el.textContent = msg;
  el.className = 'auth-msg success';
  el.style.display = 'block';
}

/* ── LOAD APP WITH USER DATA ── */
function loadApp(user) {
  const fullName = user.firstName + ' ' + user.lastName;
  const initials = (user.firstName[0] + user.lastName[0]).toUpperCase();

  /* Topbar */
  const uname = document.getElementById('topbar-uname');
  const uavatar = document.getElementById('topbar-avatar');
  if (uname)   uname.textContent = fullName;
  if (uavatar) uavatar.textContent = initials;

  /* Profile page */
  const profName    = document.getElementById('prof-name');
  const profEmail   = document.getElementById('prof-email');
  const profCollege = document.getElementById('prof-college');
  const profAvatar  = document.getElementById('prof-avatar');
  const profInitial = document.getElementById('prof-initial');

  if (profName)    profName.textContent    = fullName;
  if (profEmail)   profEmail.textContent   = user.email;
  if (profCollege) profCollege.textContent = '🎓 ' + user.university;
  if (profAvatar)  profAvatar.textContent  = initials;
  if (profInitial) profInitial.textContent = initials;

  document.getElementById('auth-screen').style.display = 'none';
  const shell = document.getElementById('app-shell');
  shell.style.display = 'flex';
  navigate('dashboard');
  setTimeout(initCharts, 100);
}

/* ── GOOGLE SIGN-IN (demo) ── */
function googleAuth() {
  const mockUser = {
    firstName: 'Google',
    lastName:  'User',
    email:     'user@gmail.com',
    university: 'Demo University',
    password:  ''
  };
  loadApp(mockUser);
}

/* ── LOGOUT ── */
function logout() {
  document.getElementById('app-shell').style.display  = 'none';
  document.getElementById('auth-screen').style.display = 'block';
  /* clear inputs */
  document.getElementById('li-email').value    = '';
  document.getElementById('li-password').value = '';
}

/* ── NAVIGATION ── */
const PAGES = ['dashboard', 'add', 'transactions', 'budget', 'reports', 'profile'];

function navigate(page) {
  PAGES.forEach(p => {
    const el  = document.getElementById('page-' + p);
    const nav = document.getElementById('nav-' + p);
    if (el)  el.classList.toggle('active', p === page);
    if (nav) nav.classList.toggle('active', p === page);
  });
  document.querySelector('.main-area').scrollTop = 0;
  if (page === 'reports') setTimeout(initReportCharts, 80);
  if (page === 'budget')  setTimeout(initDonut, 80);
}

/* ── TRANSACTION TYPE TOGGLE ── */
let txnType = 'expense';

function setTxnType(type) {
  txnType = type;
  document.getElementById('btn-exp').className = 'ttype' + (type === 'expense' ? ' exp-active' : '');
  document.getElementById('btn-inc').className = 'ttype' + (type === 'income'  ? ' inc-active' : '');
}

/* ── ADD TRANSACTION ── */
function addTransaction() {
  const title  = document.getElementById('txn-title').value.trim();
  const amount = document.getElementById('txn-amount').value;
  if (!title || !amount) {
    alert('Please fill in Title and Amount.');
    return;
  }
  const toast = document.getElementById('success-toast');
  toast.style.display = 'flex';
  document.getElementById('txn-title').value  = '';
  document.getElementById('txn-amount').value = '';
  setTimeout(() => { toast.style.display = 'none'; }, 3500);
}

/* ── FILTER TABLE ── */
function filterTable(btn, cat) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tbl-row').forEach(row => {
    const rowCat = row.getAttribute('data-cat') || '';
    row.style.display = (cat === 'all' || rowCat === cat) ? '' : 'none';
  });
}

/* ── BUDGET SLIDERS ── */
function updateLimit(id, val) {
  const el = document.getElementById(id + '-lim');
  if (el) el.textContent = parseInt(val).toLocaleString('en-IN');
}

function updateTotalBudget(val) {
  const el = document.getElementById('total-bud-disp');
  if (el) el.textContent = '₹' + (parseInt(val) || 0).toLocaleString('en-IN');
}

function saveBudget() {
  alert('✅ Budget saved successfully!');
}

/* ── MONTH TAB ── */
function switchMonth(btn) {
  document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ═══════════════════════════════════════════════════════
   CANVAS CHARTS
═══════════════════════════════════════════════════════ */

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPie() {
  const canvas = document.getElementById('pieChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const data   = [40, 20, 15, 10, 15];
  const colors = ['#00f5a0', '#00d9f5', '#ffb347', '#7c5cfc', '#ff64c8'];
  const cx = 75, cy = 75, outerR = 68, innerR = 42;
  let startAngle = -Math.PI / 2;
  ctx.clearRect(0, 0, 150, 150);
  data.forEach((val, i) => {
    const slice = (val / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR + 1, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.strokeStyle = '#f4f6f9';
    ctx.lineWidth = 2;
    ctx.stroke();
    startAngle += slice;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = '#1a2332';
  ctx.font = 'bold 13px Syne, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₹3,000', cx, cy - 7);
  ctx.fillStyle = '#8892a4';
  ctx.font = '10px DM Sans, sans-serif';
  ctx.fillText('Expenses', cx, cy + 10);
}

function drawLine() {
  const canvas = document.getElementById('lineChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const months = ['Jan', 'Feb', 'Mar', 'Apr'];
  const values = [2000, 2600, 2400, 3200];
  const maxV   = 4000;
  const padL = 45, padR = 20, padT = 20, padB = 32;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  [0, 1000, 2000, 3000, 4000].forEach(v => {
    const y = padT + chartH - (v / maxV) * chartH;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 1;
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '10px DM Sans';
    ctx.textAlign = 'right';
    ctx.fillText(v === 0 ? '0' : (v / 1000) + 'k', padL - 6, y + 4);
  });
  months.forEach((m, i) => {
    const x = padL + (i / (months.length - 1)) * chartW;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText(m, x, H - 4);
  });
  const pts = values.map((v, i) => ({
    x: padL + (i / (values.length - 1)) * chartW,
    y: padT + chartH - (v / maxV) * chartH
  }));
  const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
  grad.addColorStop(0, 'rgba(46,125,94,0.15)');
  grad.addColorStop(1, 'rgba(46,125,94,0)');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, H - padB);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, H - padB);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#2e7d5e';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
  pts.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#2e7d5e';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function drawMiniBar() {
  const canvas = document.getElementById('miniBar');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const cats   = ['Food', 'Travel', 'Shop', 'Study', 'Ent'];
  const vals   = [1200, 600, 450, 300, 450];
  const colors = ['#00f5a0', '#00d9f5', '#ffb347', '#7c5cfc', '#ff64c8'];
  const maxV   = 1500;
  const barW   = 32, gap = (W - cats.length * barW) / (cats.length + 1);
  cats.forEach((cat, i) => {
    const bh = (vals[i] / maxV) * (H - 20);
    const x  = gap + i * (barW + gap);
    const y  = H - bh - 16;
    const g  = ctx.createLinearGradient(0, y, 0, H);
    g.addColorStop(0, colors[i]);
    g.addColorStop(1, colors[i] + '44');
    roundRect(ctx, x, y, barW, bh, 5);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.font = '9px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText(cat, x + barW / 2, H - 2);
  });
}

function initDonut() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 65, cy = 65, outerR = 58, innerR = 40;
  const slices = [
    { val: 50, color: '#00f5a0' },
    { val: 50, color: 'rgba(255,255,255,0.06)' }
  ];
  let angle = -Math.PI / 2;
  ctx.clearRect(0, 0, 130, 130);
  slices.forEach(s => {
    const arc = (s.val / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, angle, angle + arc);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    angle += arc;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
  ctx.fillStyle = '#080c14';
  ctx.fill();
  ctx.fillStyle = '#2e7d5e';
  ctx.font = 'bold 15px Syne, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('50%', cx, cy - 6);
  ctx.fillStyle = '#8892a4';
  ctx.font = '9px DM Sans';
  ctx.fillText('Used', cx, cy + 10);
}

function drawBarChart() {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const vals   = [2000, 2600, 2400, 3200, 0, 0];
  const maxV   = 4000;
  const padL = 50, padR = 20, padT = 20, padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barW   = (chartW / months.length) * 0.55;
  [0, 1000, 2000, 3000, 4000].forEach(v => {
    const y = padT + chartH - (v / maxV) * chartH;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 1;
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '10px DM Sans';
    ctx.textAlign = 'right';
    ctx.fillText(v === 0 ? '0' : (v / 1000) + 'k', padL - 6, y + 4);
  });
  months.forEach((m, i) => {
    const slotW = chartW / months.length;
    const x = padL + i * slotW + (slotW - barW) / 2;
    const v = vals[i];
    const bh = (v / maxV) * chartH;
    const y  = padT + chartH - bh;
    if (v > 0) {
      const isActive = m === 'Apr';
      const g = ctx.createLinearGradient(0, y, 0, padT + chartH);
      g.addColorStop(0, isActive ? '#2e7d5e' : 'rgba(46,125,94,0.25)');
      g.addColorStop(1, isActive ? '#2563a8' : 'rgba(37,99,168,0.08)');
      roundRect(ctx, x, y, barW, bh, 6);
      ctx.fillStyle = g;
      ctx.fill();
      if (isActive) {
        ctx.shadowColor = 'rgba(46,125,94,0.3)';
        ctx.shadowBlur  = 12;
        roundRect(ctx, x, y, barW, bh, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = isActive ? '#2e7d5e' : '#94a3b8';
      ctx.font = '10px DM Sans';
      ctx.textAlign = 'center';
      ctx.fillText('₹' + (v / 1000).toFixed(1) + 'k', x + barW / 2, y - 5);
    } else {
      roundRect(ctx, x, padT + 10, barW, chartH - 10, 6);
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = '#64748b';
    ctx.font = '11px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText(m, x + barW / 2, H - 4);
  });
}

function drawWeeklyChart() {
  const canvas = document.getElementById('weeklyChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const vals  = [780, 1050, 640, 1100];
  const maxV  = 1400;
  const padL = 45, padR = 20, padT = 16, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  [0, 500, 1000, 1400].forEach(v => {
    const y = padT + chartH - (v / maxV) * chartH;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '9px DM Sans';
    ctx.textAlign = 'right';
    ctx.fillText(v > 0 ? '₹' + v : '0', padL - 5, y + 4);
  });
  const pts = vals.map((v, i) => ({
    x: padL + (i / (vals.length - 1)) * chartW,
    y: padT + chartH - (v / maxV) * chartH
  }));
  const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
  grad.addColorStop(0, 'rgba(37,99,168,0.15)');
  grad.addColorStop(1, 'rgba(37,99,168,0)');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, H - padB);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, H - padB);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#2563a8';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#2563a8';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#2563a8';
    ctx.font = 'bold 10px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText('₹' + vals[i], p.x, p.y - 10);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px DM Sans';
    ctx.fillText(weeks[i], p.x, H - 4);
  });
}

function renderTopCats() {
  const cats = [
    { name: 'Food & Dining',   amt: 1200, color: '#00f5a0', pct: 85 },
    { name: 'Travel',          amt: 600,  color: '#00d9f5', pct: 50 },
    { name: 'Entertainment',   amt: 450,  color: '#ff64c8', pct: 38 },
    { name: 'Shopping',        amt: 399,  color: '#ffb347', pct: 33 },
    { name: 'Study Materials', amt: 300,  color: '#7c5cfc', pct: 25 },
  ];
  const container = document.getElementById('top-cats');
  if (!container) return;
  container.innerHTML = cats.map((c, i) => `
    <div class="tc-item">
      <div class="tc-rank">${i + 1}</div>
      <div class="tc-bar-wrap">
        <div class="tc-name">${c.name}</div>
        <div class="tc-bar" style="width:${c.pct}%;background:${c.color};"></div>
      </div>
      <div class="tc-amt">₹${c.amt.toLocaleString('en-IN')}</div>
    </div>
  `).join('');
}

function initCharts() {
  drawPie();
  drawLine();
  drawMiniBar();
}

function initReportCharts() {
  drawBarChart();
  drawWeeklyChart();
  renderTopCats();
}

/* ── TOGGLE SWITCH ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-sw').forEach(sw => {
    sw.addEventListener('click', () => sw.classList.toggle('on'));
  });
});
