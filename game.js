// ─────────────────────────────────────────────
//  PUENTEGRANDE — game.js
//  Top-down escape game (HTML Canvas)
// ─────────────────────────────────────────────

const TILE = 32; // px per tile

// ── Mapa de la cárcel ──────────────────────────
// 0=pasillo  1=pared  2=salida  3=ticket
const MAP = [
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
];

const COLS = MAP[0].length;
const ROWS = MAP.length;

// ── DOM ────────────────────────────────────────
const screens = {
  start:    document.getElementById('screen-start'),
  game:     document.getElementById('screen-game'),
  win:      document.getElementById('screen-win'),
  gameover: document.getElementById('screen-gameover'),
};
const canvas  = document.getElementById('canvas');
const ctx     = canvas.getContext('2d');
const hudTicket = document.getElementById('hud-ticket');
const hudTime   = document.getElementById('hud-time');
const winTime   = document.getElementById('win-time');

canvas.width  = COLS * TILE;
canvas.height = ROWS * TILE;

// ── Estado del juego ───────────────────────────
let player, guards, hasTicket, startTime, rafId, keys;

function initGame() {
  keys      = {};
  hasTicket = false;

  // Jugador: posición inicial en tile (1,1)
  player = {
    x: 1 * TILE + TILE / 2,
    y: 1 * TILE + TILE / 2,
    speed: 2.5,
    radius: TILE * 0.38,
  };

  // Guardias: posición, dirección y ruta de patrulla
  guards = [
    makeGuard(7, 2,  'h', 7, 11),
    makeGuard(9, 8,  'v', 2, 14),
    makeGuard(3, 11, 'h', 1, 12),
    makeGuard(14, 5, 'v', 2, 13),
  ];

  startTime = Date.now();
  updateHUD();
}

function makeGuard(tileX, tileY, axis, min, max) {
  return {
    x:    tileX * TILE + TILE / 2,
    y:    tileY * TILE + TILE / 2,
    radius: TILE * 0.38,
    speed: 1.4,
    axis,                          // 'h' horizontal  'v' vertical
    minPx: min * TILE + TILE / 2,
    maxPx: max * TILE + TILE / 2,
    dir: 1,
    visionRadius: TILE * 2.2,
  };
}

// ── Navegación entre pantallas ─────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

document.getElementById('btn-start').addEventListener('click', () => {
  showScreen('game');
  initGame();
  if (rafId) cancelAnimationFrame(rafId);
  loop();
});

document.getElementById('btn-win').addEventListener('click', () => {
  showScreen('start');
});

document.getElementById('btn-retry').addEventListener('click', () => {
  showScreen('game');
  initGame();
  if (rafId) cancelAnimationFrame(rafId);
  loop();
});

// ── Entrada ────────────────────────────────────
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup',   e => { keys[e.key] = false; });

// ── Utilidades ────────────────────────────────
function tileAt(px, py) {
  const col = Math.floor(px / TILE);
  const row = Math.floor(py / TILE);
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return 1;
  return MAP[row][col];
}

function isSolid(tile) { return tile === 1; }

// Colisión círculo–mapa
function moveWithCollision(obj, dx, dy) {
  const r = obj.radius;
  const nx = obj.x + dx;
  const ny = obj.y + dy;

  // Check 4 corners of a square around the circle
  const offsets = [
    { ox: -r, oy: -r }, { ox: r, oy: -r },
    { ox: -r, oy:  r }, { ox: r, oy:  r },
  ];

  let canX = true, canY = true;
  for (const { ox, oy } of offsets) {
    if (isSolid(tileAt(nx + ox, obj.y + oy))) canX = false;
    if (isSolid(tileAt(obj.x + ox, ny + oy))) canY = false;
  }

  if (canX) obj.x = nx;
  if (canY) obj.y = ny;
}

// ── Update ─────────────────────────────────────
function update() {
  // Movimiento del jugador
  let dx = 0, dy = 0;
  if (keys['ArrowUp']    || keys['w'] || keys['W']) dy -= player.speed;
  if (keys['ArrowDown']  || keys['s'] || keys['S']) dy += player.speed;
  if (keys['ArrowLeft']  || keys['a'] || keys['A']) dx -= player.speed;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += player.speed;

  // Diagonal normalization
  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  moveWithCollision(player, dx, dy);

  // Recoger ticket
  const playerTile = tileAt(player.x, player.y);
  if (!hasTicket) {
    const col = Math.floor(player.x / TILE);
    const row = Math.floor(player.y / TILE);
    if (MAP[row] && MAP[row][col] === 3) {
      hasTicket = true;
      MAP[row][col] = 0; // retirar del mapa
      updateHUD();
    }
  }

  // Verificar salida
  if (hasTicket) {
    const col = Math.floor(player.x / TILE);
    const row = Math.floor(player.y / TILE);
    if (MAP[row] && MAP[row][col] === 2) {
      gameWin();
      return;
    }
  }

  // Mover guardias
  for (const g of guards) {
    if (g.axis === 'h') {
      g.x += g.speed * g.dir;
      if (g.x >= g.maxPx || g.x <= g.minPx) g.dir *= -1;
    } else {
      g.y += g.speed * g.dir;
      if (g.y >= g.maxPx || g.y <= g.minPx) g.dir *= -1;
    }

    // Detección: distancia entre guardia y jugador
    const dist = Math.hypot(g.x - player.x, g.y - player.y);
    if (dist < g.visionRadius) {
      gameOver();
      return;
    }
  }

  updateHUD();
}

function updateHUD() {
  hudTicket.textContent = hasTicket ? '🎫 Ticket: SÍ ✓' : '🎫 Ticket: NO';
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  hudTime.textContent   = `⏱ ${elapsed}s`;
}

// ── Draw ───────────────────────────────────────
const COLORS = {
  wall:    '#1e1e3a',
  floor:   '#0d0d18',
  exit:    '#1a3a1a',
  ticket:  '#3a3010',
  border:  '#2a2a5a',
  player:  '#4ecb71',
  guard:   '#e05050',
  vision:  'rgba(220,80,80,0.08)',
  ticketIcon: '#c8a84b',
  exitIcon:   '#4ecb71',
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mapa
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const tile = MAP[row][col];
      const x = col * TILE;
      const y = row * TILE;

      if (tile === 1) {
        // Pared
        ctx.fillStyle = COLORS.wall;
        ctx.fillRect(x, y, TILE, TILE);
        ctx.strokeStyle = '#141428';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
      } else {
        // Suelo base
        ctx.fillStyle = COLORS.floor;
        ctx.fillRect(x, y, TILE, TILE);

        if (tile === 2) {
          // Salida
          ctx.fillStyle = COLORS.exit;
          ctx.fillRect(x, y, TILE, TILE);
          ctx.fillStyle = COLORS.exitIcon;
          ctx.font = `${TILE * 0.6}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🚪', x + TILE / 2, y + TILE / 2);
        } else if (tile === 3) {
          // Ticket
          ctx.fillStyle = COLORS.ticket;
          ctx.fillRect(x, y, TILE, TILE);
          ctx.fillStyle = COLORS.ticketIcon;
          ctx.font = `${TILE * 0.6}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🎫', x + TILE / 2, y + TILE / 2);
        }
      }
    }
  }

  // Visión de guardias
  for (const g of guards) {
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.visionRadius, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.vision;
    ctx.fill();
  }

  // Guardias
  for (const g of guards) {
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.guard;
    ctx.fill();
    // Icono
    ctx.font = `${TILE * 0.5}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👮', g.x, g.y);
  }

  // Jugador
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

// ── Fin de partida ─────────────────────────────
function gameWin() {
  cancelAnimationFrame(rafId);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  winTime.textContent = `Tiempo: ${elapsed} segundos`;
  showScreen('win');
}

function gameOver() {
  cancelAnimationFrame(rafId);
  showScreen('gameover');
}
