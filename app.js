// Road Trip Explorer — app logic
const STORAGE_KEY = 'rte_v1';
const BOARD_SIZE = 5;
const FREE_INDEX = 12; // center of 5x5

let state = loadState();

// ---------------- Persistence ----------------

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------------- Board generation ----------------

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function poolForRegion(region) {
  return ITEMS.filter(i => i.regions.includes('any') || i.regions.includes(region));
}

function generateBingoBoard(region) {
  const pool = poolForRegion(region);
  const specific = shuffle(pool.filter(i => !i.regions.includes('any')));
  const anyItems = shuffle(pool.filter(i => i.regions.includes('any')));

  const chosen = [];
  const seen = new Set();
  for (const item of specific) {
    if (chosen.length >= 8) break;
    if (!seen.has(item.id)) { chosen.push(item); seen.add(item.id); }
  }
  for (const item of anyItems) {
    if (chosen.length >= 24) break;
    if (!seen.has(item.id)) { chosen.push(item); seen.add(item.id); }
  }
  // fallback if region pool is somehow small
  for (const item of shuffle(ITEMS)) {
    if (chosen.length >= 24) break;
    if (!seen.has(item.id)) { chosen.push(item); seen.add(item.id); }
  }

  const finalOrder = shuffle(chosen).slice(0, 24);
  const board = [];
  let ptr = 0;
  for (let i = 0; i < 25; i++) {
    if (i === FREE_INDEX) board.push('FREE');
    else board.push(finalOrder[ptr++].id);
  }
  return board;
}

function checklistItems(region) {
  const pool = poolForRegion(region);
  return pool.slice().sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.points - b.points;
  });
}

function itemById(id) {
  return ITEMS.find(i => i.id === id);
}

// ---------------- Setup screen ----------------

function populateRegionSelect(selectEl) {
  selectEl.innerHTML = '';
  REGIONS.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = `${r.emoji} ${r.name}`;
    selectEl.appendChild(opt);
  });
}

function initSetupScreen() {
  const regionSelect = document.getElementById('region-select');
  const regionDesc = document.getElementById('region-desc');
  populateRegionSelect(regionSelect);

  function updateDesc() {
    const r = REGIONS.find(r => r.id === regionSelect.value);
    regionDesc.textContent = r ? r.description : '';
  }
  regionSelect.addEventListener('change', updateDesc);
  updateDesc();

  document.getElementById('start-trip-btn').addEventListener('click', () => {
    const tripName = document.getElementById('trip-name').value.trim() || 'Road Trip';
    const region = regionSelect.value;

    state = {
      settings: { tripName, region },
      board: generateBingoBoard(region),
      found: [],
      routeProgress: { passed: [] },
    };
    saveState();
    showApp();
  });
}

// ---------------- Main app ----------------

let currentView = 'bingo';

function showApp() {
  if (!state.routeProgress) state.routeProgress = { passed: [] };
  document.getElementById('setup-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  document.getElementById('header-trip-name').textContent = state.settings.tripName;
  const r = REGIONS.find(r => r.id === state.settings.region);
  document.getElementById('header-region-badge').textContent = r ? `${r.emoji} ${r.name}` : '';
  renderBingo();
  renderChecklist();
  updateProgress();
  renderRouteMap();
}

function isFound(itemId) {
  return itemId === 'FREE' || state.found.includes(itemId);
}

function toggleFound(itemId) {
  if (itemId === 'FREE') return;
  const idx = state.found.indexOf(itemId);
  if (idx >= 0) state.found.splice(idx, 1);
  else state.found.push(itemId);
  saveState();
  renderBingo();
  renderChecklist();
  updateProgress();
  checkWin();
}

function updateProgress() {
  const total = checklistItems(state.settings.region).length;
  const found = state.found.length;
  const pct = total ? Math.round((found / total) * 100) : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = `${found} / ${total} found`;
}

// ---------------- Bingo rendering ----------------

function renderBingo() {
  const grid = document.getElementById('bingo-grid');
  grid.innerHTML = '';
  state.board.forEach((itemId, idx) => {
    const cell = document.createElement('div');
    cell.className = 'bingo-cell';

    if (itemId === 'FREE') {
      cell.classList.add('free', 'found');
      cell.innerHTML = `<div class="cell-emoji">⭐</div><div>FREE</div>`;
    } else {
      const item = itemById(itemId);
      cell.classList.add('points-' + item.points);
      if (isFound(itemId)) cell.classList.add('found');
      cell.innerHTML = `
        <span class="points-dot">${'★'.repeat(item.points === 1 ? 1 : item.points === 3 ? 2 : 3)}</span>
        <div class="cell-emoji">${item.emoji}</div>
        <div>${item.label}</div>
      `;
      cell.addEventListener('click', () => toggleFound(itemId));
    }
    grid.appendChild(cell);
  });
}

// ---------------- Checklist rendering ----------------

function renderChecklist() {
  const container = document.getElementById('checklist-container');
  container.innerHTML = '';
  const items = checklistItems(state.settings.region);
  const byCategory = {};
  items.forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });

  Object.keys(byCategory).forEach(cat => {
    const section = document.createElement('div');
    section.className = 'checklist-category';
    const h4 = document.createElement('h4');
    h4.textContent = cat;
    section.appendChild(h4);

    byCategory[cat].forEach(item => {
      const row = document.createElement('div');
      row.className = 'checklist-item' + (isFound(item.id) ? ' found' : '');
      row.innerHTML = `
        <div class="cell-emoji">${item.emoji}</div>
        <div class="item-info">
          <div class="item-label">${item.label}</div>
          ${item.fact ? `<div class="item-fact">${item.fact}</div>` : ''}
        </div>
        <span class="points-badge">${item.points} pt${item.points > 1 ? 's' : ''}</span>
        <div class="checkbox">${isFound(item.id) ? '✓' : ''}</div>
      `;
      row.addEventListener('click', () => toggleFound(item.id));
      section.appendChild(row);
    });
    container.appendChild(section);
  });
}

// ---------------- Bingo win detection ----------------

function checkWin() {
  const g = state.board.map(id => isFound(id));
  const lines = [];
  for (let r = 0; r < 5; r++) lines.push([0,1,2,3,4].map(c => r * 5 + c));
  for (let c = 0; c < 5; c++) lines.push([0,1,2,3,4].map(r => r * 5 + c));
  lines.push([0,6,12,18,24]);
  lines.push([4,8,12,16,20]);

  const hasBingo = lines.some(line => line.every(idx => g[idx]));
  const blackout = g.every(Boolean);

  if (blackout && !state.blackoutShown) {
    state.blackoutShown = true;
    saveState();
    showWinBanner('🏆', 'BLACKOUT! You found everything!');
  } else if (hasBingo && !state.bingoShown) {
    state.bingoShown = true;
    saveState();
    showWinBanner('🎉', 'BINGO!');
  }
}

function showWinBanner(emoji, text) {
  document.getElementById('win-emoji').textContent = emoji;
  document.getElementById('win-text').textContent = text;
  document.getElementById('win-banner').classList.remove('hidden');
  launchConfetti();
}

function launchConfetti() {
  const layer = document.getElementById('confetti-layer');
  const colors = ['#ffb703', '#4cc9f0', '#52b788', '#e63946', '#7b2cbf'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 4500);
  }
}

// ---------------- Tabs & view toggle ----------------

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  document.getElementById('view-bingo-btn').addEventListener('click', () => {
    currentView = 'bingo';
    document.getElementById('view-bingo-btn').classList.add('active');
    document.getElementById('view-checklist-btn').classList.remove('active');
    document.getElementById('bingo-view').classList.remove('hidden');
    document.getElementById('checklist-view').classList.add('hidden');
  });
  document.getElementById('view-checklist-btn').addEventListener('click', () => {
    currentView = 'checklist';
    document.getElementById('view-checklist-btn').classList.add('active');
    document.getElementById('view-bingo-btn').classList.remove('active');
    document.getElementById('checklist-view').classList.remove('hidden');
    document.getElementById('bingo-view').classList.add('hidden');
  });

  document.getElementById('win-close-btn').addEventListener('click', () => {
    document.getElementById('win-banner').classList.add('hidden');
  });
}

// ---------------- Route map (hardcoded, no external map API) ----------------

const SVG_NS = 'http://www.w3.org/2000/svg';

function maxPassedMile() {
  const passed = state.routeProgress.passed;
  let max = 0;
  ROUTE_STOPS.forEach(stop => {
    if (passed.includes(stop.id) && stop.mile > max) max = stop.mile;
  });
  return max;
}

function nextStop() {
  const currentMax = maxPassedMile();
  return ROUTE_STOPS.find(stop => stop.mile > currentMax) || null;
}

function toggleStopPassed(stopId) {
  const passed = state.routeProgress.passed;
  const idx = passed.indexOf(stopId);
  if (idx >= 0) passed.splice(idx, 1);
  else passed.push(stopId);
  saveState();
  renderRouteMap();
}

function renderRouteMap() {
  const segmentsG = document.getElementById('route-segments');
  const markersG = document.getElementById('route-markers');
  segmentsG.innerHTML = '';
  markersG.innerHTML = '';

  const currentMax = maxPassedMile();

  // Segments between consecutive stops
  for (let i = 0; i < ROUTE_STOPS.length - 1; i++) {
    const a = ROUTE_STOPS[i];
    const b = ROUTE_STOPS[i + 1];
    const traveled = b.mile <= currentMax;
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', a.x);
    line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x);
    line.setAttribute('y2', b.y);
    line.setAttribute('class', 'route-segment' + (traveled ? ' traveled' : ''));
    segmentsG.appendChild(line);
  }

  // City markers
  ROUTE_STOPS.forEach(stop => {
    const passed = state.routeProgress.passed.includes(stop.id);
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'route-marker' + (passed ? ' passed' : ''));
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', stop.name + (passed ? ' (passed)' : ''));

    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', stop.x);
    circle.setAttribute('cy', stop.y);
    circle.setAttribute('r', 11);
    g.appendChild(circle);

    if (passed) {
      const check = document.createElementNS(SVG_NS, 'text');
      check.setAttribute('x', stop.x);
      check.setAttribute('y', stop.y);
      check.setAttribute('class', 'marker-check');
      check.textContent = '✓';
      g.appendChild(check);
    }

    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('x', stop.x);
    label.setAttribute('y', stop.y - 16);
    label.setAttribute('class', 'marker-label');
    label.textContent = stop.name.split(',')[0];
    g.appendChild(label);

    g.addEventListener('click', () => toggleStopPassed(stop.id));
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleStopPassed(stop.id); }
    });
    markersG.appendChild(g);
  });

  // Progress bar + status text
  const pct = Math.round((currentMax / ROUTE_TOTAL_MILES) * 100);
  document.getElementById('route-progress-fill').style.width = pct + '%';
  document.getElementById('route-progress-label').textContent = `${currentMax} / ${ROUTE_TOTAL_MILES} miles`;

  const upcoming = nextStop();
  const statusEl = document.getElementById('route-status');
  if (!upcoming) {
    statusEl.textContent = "🏁 You made it to Tawas City! Trip complete!";
  } else {
    const milesToGo = upcoming.mile - currentMax;
    statusEl.textContent = `Next stop: ${upcoming.name} (about ${milesToGo} miles to go)`;
  }

  // Tap-friendly list beneath the map
  const listEl = document.getElementById('route-stop-list');
  listEl.innerHTML = '';
  ROUTE_STOPS.forEach(stop => {
    const passed = state.routeProgress.passed.includes(stop.id);
    const row = document.createElement('div');
    row.className = 'checklist-item route-list-item' + (passed ? ' found' : '');
    row.innerHTML = `
      <div class="cell-emoji">${passed ? '🚗' : '📍'}</div>
      <div class="item-info">
        <div class="item-label">${stop.name}</div>
        <div class="item-fact">Mile ${stop.mile} of ${ROUTE_TOTAL_MILES}</div>
      </div>
      <div class="checkbox">${passed ? '✓' : ''}</div>
    `;
    row.addEventListener('click', () => toggleStopPassed(stop.id));
    listEl.appendChild(row);
  });
}

// ---------------- Settings modal ----------------

function openSettings() {
  populateRegionSelect(document.getElementById('s-region-select'));
  document.getElementById('s-trip-name').value = state.settings.tripName;
  document.getElementById('s-region-select').value = state.settings.region;
  document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettings() {
  document.getElementById('settings-modal').classList.add('hidden');
}

function initSettings() {
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.getElementById('settings-cancel-btn').addEventListener('click', closeSettings);

  document.getElementById('settings-save-btn').addEventListener('click', () => {
    const newRegion = document.getElementById('s-region-select').value;
    const regionChanged = newRegion !== state.settings.region;

    state.settings.tripName = document.getElementById('s-trip-name').value.trim() || 'Road Trip';
    state.settings.region = newRegion;

    if (regionChanged) {
      state.board = generateBingoBoard(newRegion);
      state.found = [];
      state.bingoShown = false;
      state.blackoutShown = false;
    }
    saveState();
    closeSettings();
    showApp();
  });

  document.getElementById('new-board-btn').addEventListener('click', () => {
    if (!confirm('Shuffle a new bingo board? Your found progress on the board will reset.')) return;
    state.board = generateBingoBoard(state.settings.region);
    state.found = [];
    state.bingoShown = false;
    state.blackoutShown = false;
    saveState();
    closeSettings();
    showApp();
  });

  document.getElementById('reset-route-btn').addEventListener('click', () => {
    if (!confirm('Reset your route progress? All checkpoints will be marked unpassed again.')) return;
    state.routeProgress = { passed: [] };
    saveState();
    closeSettings();
    renderRouteMap();
  });

  document.getElementById('reset-trip-btn').addEventListener('click', () => {
    if (!confirm('Reset the entire trip? This clears everything and starts over.')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = null;
    closeSettings();
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
  });
}

// ---------------- Init ----------------

document.addEventListener('DOMContentLoaded', () => {
  initSetupScreen();
  initTabs();
  initSettings();

  if (state && state.settings) {
    showApp();
  }
});
