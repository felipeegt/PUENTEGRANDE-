// ─────────────────────────────────────────────
//  PUENTEGRANDE — game.js
//  Top-down escape game — 3 levels
// ─────────────────────────────────────────────

const TILE = 32;

// ── Maps ──────────────────────────────────────
// 0=floor  1=wall  2=exit  3=ticket

const LEVEL_MAPS = [
  // ── Nivel 1 — La Fuga ──────────────────────
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1,3,0,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  // ── Nivel 2 — Pabellón Central ─────────────
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,0,1,0,1,0,1,1,0,1,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,1,3,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  // ── Nivel 3 — El Búnker ────────────────────
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,1],
    [1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,3,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,1],
    [1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
];

// Guard definitions per level  { tx, ty, axis:'h'|'v', minT, maxT }
const LEVEL_GUARD_DEFS = [
  // Nivel 1 — 4 guardias
  [
    { tx:7,  ty:2,  axis:'h', minT:7,  maxT:11 },
    { tx:9,  ty:8,  axis:'v', minT:2,  maxT:14 },
    { tx:3,  ty:11, axis:'h', minT:1,  maxT:12 },
    { tx:14, ty:5,  axis:'v', minT:2,  maxT:13 },
  ],
  // Nivel 2 — 6 guardias
  [
    { tx:7,  ty:7,  axis:'h', minT:1,  maxT:17 },
    { tx:5,  ty:5,  axis:'h', minT:1,  maxT:7  },
    { tx:9,  ty:3,  axis:'h', minT:9,  maxT:13 },
    { tx:11, ty:9,  axis:'h', minT:7,  maxT:15 },
    { tx:4,  ty:12, axis:'h', minT:1,  maxT:8  },
    { tx:15, ty:11, axis:'h', minT:13, maxT:17 },
  ],
  // Nivel 3 — 8 guardias
  [
    { tx:9,  ty:7,  axis:'h', minT:1,  maxT:17 },
    { tx:17, ty:5,  axis:'v', minT:1,  maxT:7  },
    { tx:5,  ty:3,  axis:'h', minT:1,  maxT:11 },
    { tx:11, ty:11, axis:'h', minT:7,  maxT:15 },
    { tx:3,  ty:9,  axis:'h', minT:1,  maxT:5  },
    { tx:15, ty:13, axis:'h', minT:11, maxT:17 },
    { tx:9,  ty:15, axis:'h', minT:1,  maxT:17 },
    { tx:1,  ty:11, axis:'v', minT:7,  maxT:15 },
  ],
];

const LEVEL_GUARD_SPEEDS  = [1.4, 1.8, 2.2];
const LEVEL_GUARD_VISIONS = [2.2 * TILE, 2.5 * TILE, 3.0 * TILE];
const LEVEL_NAMES = [
  'Nivel 1 — La Fuga',
  'Nivel 2 — Pabellón Central',
  'Nivel 3 — El Búnker',
];

const COLS = LEVEL_MAPS[0][0].length; // 19
const ROWS = LEVEL_MAPS[0].length;    // 17

// ── DOM ────────────────────────────────────────
const screens = {
  start:    document.getElementById('screen-start'),
  game:     document.getElementById('screen-game'),
  win:      document.getElementById('screen-win'),
  final:    document.getElementById('screen-final'),
  gameover: document.getElementById('screen-gameover'),
};
const canvas       = document.getElementById('canvas');
const ctx          = canvas.getContext('2d');
const hudTicket    = document.getElementById('hud-ticket');
const hudTime      = document.getElementById('hud-time');
const hudLevel     = document.getElementById('hud-level');
const hudScore     = document.getElementById('hud-score');
const winTitle     = document.getElementById('win-title');
const winMsg       = document.getElementById('win-msg');
const winTimePara  = document.getElementById('win-time');
const winScoreLine = document.getElementById('win-score-line');
const btnNextLevel = document.getElementById('btn-next-level');
const btnWin       = document.getElementById('btn-win');
const finalScore   = document.getElementById('final-score');
const gameoverMsg  = document.getElementById('gameover-msg');
const gameoverScore= document.getElementById('gameover-score');

canvas.width  = COLS * TILE;
canvas.height = ROWS * TILE;

// ── State ──────────────────────────────────────
let currentLevel, totalScore, currentMap;
let player, guards, hasTicket, startTime, rafId, keys;

// ── Helpers ────────────────────────────────────
function deepCopyMap(lvl) {
  return LEVEL_MAPS[lvl].map(row => [...row]);
}

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function tileAt(px, py) {
  const col = Math.floor(px / TILE);
  const row = Math.floor(py / TILE);
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return 1;
  return currentMap[row][col];
}

function isSolid(t) { return t === 1; }

function calcScore(seconds) {
  return Math.max(500, 3000 - seconds * 20) + (currentLevel + 1) * 1000;
}

// Collision: move object with wall checks
function moveWithCollision(obj, dx, dy) {
  const r  = obj.radius;
  const nx = obj.x + dx;
  const ny = obj.y + dy;
  const offsets = [[-r,-r],[r,-r],[-r,r],[r,r]];
  let canX = true, canY = true;
  for (const [ox, oy] of offsets) {
    if (isSolid(tileAt(nx + ox, obj.y + oy))) canX = false;
    if (isSolid(tileAt(obj.x + ox, ny + oy))) canY = false;
  }
  if (canX) obj.x = nx;
  if (canY) obj.y = ny;
}

// ── Init ───────────────────────────────────────
function initGame(levelIndex) {
  keys      = {};
  hasTicket = false;
  currentMap = deepCopyMap(levelIndex);

  player = {
    x: 1 * TILE + TILE / 2,
    y: 1 * TILE + TILE / 2,
    speed: 2.5,
    radius: TILE * 0.38,
  };

  const spd = LEVEL_GUARD_SPEEDS[levelIndex];
  const vis = LEVEL_GUARD_VISIONS[levelIndex];

  guards = LEVEL_GUARD_DEFS[levelIndex].map(d => ({
    x:    d.tx * TILE + TILE / 2,
    y:    d.ty * TILE + TILE / 2,
    radius: TILE * 0.38,
    speed: spd,
    axis:  d.axis,
    minPx: d.minT * TILE + TILE / 2,
    maxPx: d.maxT * TILE + TILE / 2,
    dir: 1,
    visionRadius: vis,
  }));

  startTime = Date.now();
  updateHUD();
}

// ── Controls ───────────────────────────────────
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup',   e => { keys[e.key] = false; });

// ── Update ─────────────────────────────────────
function update() {
  // Player movement
  let dx = 0, dy = 0;
  if (keys['ArrowUp']    || keys['w'] || keys['W']) dy -= player.speed;
  if (keys['ArrowDown']  || keys['s'] || keys['S']) dy += player.speed;
  if (keys['ArrowLeft']  || keys['a'] || keys['A']) dx -= player.speed;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += player.speed;
  if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
  moveWithCollision(player, dx, dy);

  // Pick up ticket
  if (!hasTicket) {
    const col = Math.floor(player.x / TILE);
    const row = Math.floor(player.y / TILE);
    if (currentMap[row] && currentMap[row][col] === 3) {
      hasTicket = true;
      currentMap[row][col] = 0;
    }
  }

  // Reach exit
  if (hasTicket) {
    const col = Math.floor(player.x / TILE);
    const row = Math.floor(player.y / TILE);
    if (currentMap[row] && currentMap[row][col] === 2) {
      levelWin();
      return;
    }
  }

  // Move guards & detect catch
  for (const g of guards) {
    if (g.axis === 'h') {
      g.x += g.speed * g.dir;
      if (g.x >= g.maxPx || g.x <= g.minPx) g.dir *= -1;
    } else {
      g.y += g.speed * g.dir;
      if (g.y >= g.maxPx || g.y <= g.minPx) g.dir *= -1;
    }
    if (Math.hypot(g.x - player.x, g.y - player.y) < g.visionRadius) {
      gameOver();
      return;
    }
  }

  updateHUD();
}

function updateHUD() {
  hudTicket.textContent = hasTicket ? '🎫 Ticket: SÍ ✓' : '🎫 Ticket: NO';
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  hudTime.textContent  = `⏱ ${elapsed}s`;
  hudLevel.textContent = LEVEL_NAMES[currentLevel];
  hudScore.textContent = `⭐ ${totalScore}`;
}

// ── Draw ───────────────────────────────────────
const COLORS = {
  wall:       '#1e1e3a',
  floor:      '#0d0d18',
  exit:       '#1a3a1a',
  ticket:     '#3a3010',
  player:     '#4ecb71',
  guard:      '#e05050',
  vision:     'rgba(220,80,80,0.08)',
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Tiles
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const tile = currentMap[row][col];
      const x = col * TILE, y = row * TILE;

      if (tile === 1) {
        ctx.fillStyle = COLORS.wall;
        ctx.fillRect(x, y, TILE, TILE);
        ctx.strokeStyle = '#141428';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
      } else {
        ctx.fillStyle = COLORS.floor;
        ctx.fillRect(x, y, TILE, TILE);
        if (tile === 2) {
          ctx.fillStyle = COLORS.exit;
          ctx.fillRect(x, y, TILE, TILE);
          ctx.font = `${TILE * 0.6}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🚪', x + TILE / 2, y + TILE / 2);
        } else if (tile === 3) {
          ctx.fillStyle = COLORS.ticket;
          ctx.fillRect(x, y, TILE, TILE);
          ctx.font = `${TILE * 0.6}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🎫', x + TILE / 2, y + TILE / 2);
        }
      }
    }
  }

  // Guard vision circles
  for (const g of guards) {
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.visionRadius, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.vision;
    ctx.fill();
  }

  // Guards
  for (const g of guards) {
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.guard;
    ctx.fill();
    ctx.font = `${TILE * 0.5}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👮', g.x, g.y);
  }

  // Player
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.player;
  ctx.fill();
  ctx.font = `${TILE * 0.5}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏃', player.x, player.y);
}

// ── Game loop ──────────────────────────────────
function loop() {
  update();
  draw();
  rafId = requestAnimationFrame(loop);
}

function startLoop() {
  if (rafId) cancelAnimationFrame(rafId);
  loop();
}

// ── End conditions ────────────────────────────
function levelWin() {
  cancelAnimationFrame(rafId);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const levelScore = calcScore(elapsed);
  totalScore += levelScore;

  winTitle.textContent     = currentLevel < 2 ? '🎉 ¡NIVEL SUPERADO!' : '🔓 ¡ESCAPASTE!';
  winMsg.textContent       = `Completaste: ${LEVEL_NAMES[currentLevel]}`;
  winTimePara.textContent  = `Tiempo: ${elapsed}s`;
  winScoreLine.textContent = `+${levelScore} pts  |  Total: ${totalScore} pts`;

  if (currentLevel < 2) {
    btnNextLevel.style.display = 'block';
    btnWin.style.display       = 'none';
  } else {
    btnNextLevel.style.display = 'none';
    btnWin.style.display       = 'block';
  }
  showScreen('win');
}

function gameOver() {
  cancelAnimationFrame(rafId);
  gameoverMsg.textContent   = `Te atraparon en ${LEVEL_NAMES[currentLevel]}.`;
  gameoverScore.textContent = totalScore > 0 ? `Puntaje acumulado: ${totalScore} pts` : '';
  showScreen('gameover');
}

// ── Button listeners ──────────────────────────
document.getElementById('btn-start').addEventListener('click', () => {
  currentLevel = 0;
  totalScore   = 0;
  showScreen('game');
  initGame(currentLevel);
  startLoop();
});

btnNextLevel.addEventListener('click', () => {
  currentLevel++;
  showScreen('game');
  initGame(currentLevel);
  startLoop();
});

btnWin.addEventListener('click', () => {
  finalScore.textContent = `🏆 Puntaje total: ${totalScore} pts`;
  showScreen('final');
});

document.getElementById('btn-final').addEventListener('click', () => {
  showScreen('start');
});

document.getElementById('btn-retry').addEventListener('click', () => {
  showScreen('game');
  initGame(currentLevel);
  startLoop();
});

document.getElementById('btn-menu').addEventListener('click', () => {
  showScreen('start');
});

