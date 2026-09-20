/**
 * Immediate Mode Canvas 2D Renderer / Процедурний рендеринг у Canvas Immediate Mode.
 */

/**
 * Draws the 2D procedural vehicle / Рендеринг полігональної 2D моделі.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context / Контекст рендерингу
 * @param {number} x - Interpolated X position / Інтерпольована координата X
 * @param {number} y - Interpolated Y position / Інтерпольована координата Y
 * @param {number} angle - Interpolated angle in radians / Інтерпольований кут у радіанах
 * @param {boolean} thrust - Thrust activation flag / Прапорець активації тяги
 */
export function drawCar(ctx, x, y, angle, thrust) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Thrust exhaust effects / Візуалізація реактивного струменя
  if (thrust) {
    ctx.save();
    const flicker = 0.8 + Math.random() * 0.4;
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 10;
    ctx.fillRect(-23, -2, 3, 4);

    ctx.fillStyle = "#fde047";
    ctx.shadowColor = "#eab308";
    ctx.shadowBlur = 6;
    for (let i = 0; i < 3; i++) {
      const sparkX = -24 - Math.random() * 16 * flicker;
      const sparkY = (Math.random() - 0.5) * 8;
      ctx.fillRect(sparkX, sparkY, 2, 2);
    }
    ctx.restore();
  }

  // 2. Suspension wishbones / Силові кріплення колісних осей
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(13, -11);
  ctx.moveTo(8, 0);
  ctx.lineTo(13, 11);
  ctx.moveTo(-10, 0);
  ctx.lineTo(-14, -12);
  ctx.moveTo(-10, 0);
  ctx.lineTo(-14, 12);
  ctx.stroke();

  // 3. Wheels & contact patches / Колісні блоки та плями контакту
  const wheels = [
    { x: 9, y: -15, w: 10, h: 5 },
    { x: 9, y: 10, w: 10, h: 5 },
    { x: -19, y: -16, w: 12, h: 6 },
    { x: -19, y: 10, w: 12, h: 6 },
  ];

  wheels.forEach((w) => {
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(w.x, w.y, w.w, w.h, 2);
    ctx.fill();

    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // 4. Aerodynamic wings / Переднє та заднє антикрила
  ctx.fillStyle = "#09111e";
  ctx.beginPath();
  ctx.roundRect(18, -13, 5, 26, 2);
  ctx.fill();

  ctx.fillStyle = "#eab308";
  ctx.fillRect(17, -14, 6, 2);
  ctx.fillRect(17, 12, 6, 2);

  ctx.fillStyle = "#09111e";
  ctx.fillRect(-22, -13, 5, 26);

  ctx.fillStyle = "#dc2626";
  ctx.fillRect(-20, -11, 2, 22);

  // 5. Main monocoque body / Полігональний монокок
  ctx.fillStyle = "#0c182b";
  ctx.beginPath();
  ctx.moveTo(23, 0);
  ctx.lineTo(15, -4);
  ctx.lineTo(4, -8);
  ctx.lineTo(-12, -8);
  ctx.lineTo(-18, -4);
  ctx.lineTo(-18, 4);
  ctx.lineTo(-12, 8);
  ctx.lineTo(4, 8);
  ctx.lineTo(15, 4);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1;
  ctx.stroke();

  // 6. Livery accents & cockpit / Графічні лінії та захисна капсула
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(23, 0);
  ctx.lineTo(17, -2.5);
  ctx.lineTo(17, 2.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#dc2626";
  ctx.fillRect(5, -1.5, 10, 3);

  ctx.fillStyle = "#020617";
  ctx.fillRect(3, -7, 4, 3);
  ctx.fillRect(3, 4, 4, 3);

  ctx.fillStyle = "#dc2626";
  ctx.fillRect(-6, -8, 8, 1.5);
  ctx.fillRect(-6, 6.5, 8, 1.5);

  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(-1, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#dc2626";
  ctx.fillRect(-1.5, -1, 3, 2);

  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(1, 0, 4, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(5, 0);
  ctx.lineTo(1, 0);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws spatial coordinate grid and boundary kerbs.
 * Відображення координатної сітки та граничних зон треку.
 */
export function drawTrackGrid(ctx, width, height, cellSize = 80) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  for (let x = 0; x < width; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y < height; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  const kerbSize = 20;
  for (let x = 0; x < width; x += kerbSize * 2) {
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(x, 0, kerbSize, 4);
    ctx.fillRect(x, height - 4, kerbSize, 4);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(x + kerbSize, 0, kerbSize, 4);
    ctx.fillRect(x + kerbSize, height - 4, kerbSize, 4);
  }
}

export const drawGrid = drawTrackGrid;

let domHud = null;

function getDomHud() {
  if (domHud !== null) return domHud;
  if (typeof document === "undefined") return null;

  const panel = document.getElementById("hud");
  if (!panel) return null;

  domHud = {
    panel,
    simRate: document.getElementById("stat-sim-rate"),
    fps: document.getElementById("stat-fps"),
    frameTime: document.getElementById("stat-frametime"),
    speed: document.getElementById("stat-speed"),
    alpha: document.getElementById("stat-alpha"),
    alphaFill: document.getElementById("hud-alpha-fill"),
    tagThrottle: document.getElementById("input-indicator-throttle"),
    tagSteerLeft: document.getElementById("input-indicator-steer-left"),
    tagSteerRight: document.getElementById("input-indicator-steer-right"),
  };
  return domHud;
}

/**
 * Updates telemetry HUD (DOM overlay or Canvas fallback).
 * Оновлення телеметричного інтерфейсу (DOM оверлей або Canvas fallback).
 */
export function drawHud(ctx, stats, alpha, car = null, input = null) {
  const dom = getDomHud();
  if (dom && dom.simRate) {
    dom.simRate.textContent = stats.stepsPerSecond.toFixed(1);
    dom.fps.textContent = stats.framesPerSecond.toFixed(1);
    dom.frameTime.textContent = stats.frameTime.toFixed(2);
    dom.alpha.textContent = alpha.toFixed(3);
    if (dom.alphaFill) {
      dom.alphaFill.style.width = `${Math.min(Math.max(alpha * 100, 0), 100).toFixed(1)}%`;
    }
    if (dom.speed && car) {
      const speedKmh = Math.round(Math.hypot(car.vx, car.vy) * 0.45);
      dom.speed.textContent = `${speedKmh}`;
    }

    if (input) {
      const isThrottle = input.isDown("KeyW") || input.isDown("ArrowUp") || input.isDown("Space");
      const isLeft = input.isDown("KeyA") || input.isDown("ArrowLeft");
      const isRight = input.isDown("KeyD") || input.isDown("ArrowRight");

      if (dom.tagThrottle) dom.tagThrottle.classList.toggle("active", isThrottle);
      if (dom.tagSteerLeft) dom.tagSteerLeft.classList.toggle("active", isLeft);
      if (dom.tagSteerRight) dom.tagSteerRight.classList.toggle("active", isRight);
    }
    return;
  }

  // Canvas Fallback HUD / Резервний рендеринг HUD прямо на полотні
  ctx.save();
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.fillStyle = "rgba(9, 14, 24, 0.88)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(20, 20, 310, 150, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(32, 32, 4, 18);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 13px ui-monospace, monospace";
  ctx.fillText("REDAPEX GP // TELEMETRY", 44, 46);

  ctx.font = "11px ui-monospace, monospace";
  const metrics = [
    ["SIM RATE", `${stats.stepsPerSecond.toFixed(1)} steps/s`],
    ["RENDER FPS", `${stats.framesPerSecond.toFixed(1)} fps`],
    ["FRAME TIME", `${stats.frameTime.toFixed(2)} ms`],
    ["LERP ALPHA", alpha.toFixed(3)],
  ];

  metrics.forEach(([label, value], i) => {
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(label, 32, 74 + i * 18);
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(value, 180, 74 + i * 18);
  });

  ctx.fillStyle = "#38bdf8";
  ctx.fillText("[W/▲] Throttle  |  [A/D/◄/►] Steer", 32, 154);
  ctx.restore();
}
