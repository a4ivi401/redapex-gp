/**
 * Immediate Mode Canvas 2D Renderer / Процедурний рендеринг у Canvas Immediate Mode.
 */

/**
 * Draws a modern 2D Formula 1 bolide / Високодеталізований рендеринг сучасного 2D боліда Формули-1.
 *
 * Includes ground-effect floor, sculpted sidepods with undercuts, double-wishbone suspension,
 * 18" low-profile slick tires with Pirelli-style color bands & aero wheel covers,
 * multi-tier swept front & rear wings with DRS actuator, titanium Halo structure,
 * driver cockpit with helmet/visor/steering display, dorsal shark fin, and supersonic thrust plume.
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

  // ---------------------------------------------------------------------------
  // 1. Aerodynamic Ground Shadow & Ambient Occlusion / Тінь під днищем
  // ---------------------------------------------------------------------------
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
  ctx.beginPath();
  ctx.ellipse(0, 1.5, 34, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.roundRect(11, -17.5, 14, 7, 3);
  ctx.roundRect(11, 10.5, 14, 7, 3);
  ctx.roundRect(-25.5, -18.5, 15, 8.5, 3);
  ctx.roundRect(-25.5, 10, 15, 8.5, 3);
  ctx.fill();
  ctx.restore();

  // ---------------------------------------------------------------------------
  // 2. Thrust Exhaust Jet / Реактивний струмінь ERS та турбо-полум'я
  // ---------------------------------------------------------------------------
  if (thrust) {
    ctx.save();
    const time = typeof performance !== "undefined" ? performance.now() * 0.02 : Date.now() * 0.02;
    const flicker = 0.85 + Math.sin(time * 3) * 0.15 + (Math.random() - 0.5) * 0.2;
    const flameLength = (16 + Math.random() * 9) * flicker;

    // Outer plasma cone
    const outerFlameGrad = ctx.createLinearGradient(-28, 0, -28 - flameLength, 0);
    outerFlameGrad.addColorStop(0, "rgba(239, 68, 68, 0.95)");
    outerFlameGrad.addColorStop(0.35, "rgba(249, 115, 22, 0.85)");
    outerFlameGrad.addColorStop(0.7, "rgba(234, 179, 8, 0.45)");
    outerFlameGrad.addColorStop(1, "rgba(239, 68, 68, 0)");

    ctx.fillStyle = outerFlameGrad;
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(-27, -3.5);
    ctx.lineTo(-28 - flameLength, 0);
    ctx.lineTo(-27, 3.5);
    ctx.closePath();
    ctx.fill();

    // Inner superheated cyan-white core
    const coreLength = flameLength * 0.55;
    const coreGrad = ctx.createLinearGradient(-27, 0, -27 - coreLength, 0);
    coreGrad.addColorStop(0, "#ffffff");
    coreGrad.addColorStop(0.3, "#38bdf8");
    coreGrad.addColorStop(0.7, "#06b6d4");
    coreGrad.addColorStop(1, "rgba(6, 182, 212, 0)");

    ctx.fillStyle = coreGrad;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-27, -1.8);
    ctx.lineTo(-27 - coreLength, 0);
    ctx.lineTo(-27, 1.8);
    ctx.closePath();
    ctx.fill();

    // Shock diamonds
    ctx.fillStyle = "#ffffff";
    for (let d = 1; d <= 2; d++) {
      const dx = -27 - d * (coreLength * 0.35);
      ctx.beginPath();
      ctx.ellipse(dx, 0, 1.6, 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dynamic exhaust sparks
    ctx.shadowBlur = 4;
    for (let i = 0; i < 5; i++) {
      const sparkDist = 28 + Math.random() * (flameLength + 14);
      const sparkSpread = (Math.random() - 0.5) * (6 + (sparkDist - 28) * 0.28);
      const sparkSize = 1.0 + Math.random() * 1.5;
      ctx.fillStyle = Math.random() > 0.4 ? "#fde047" : "#38bdf8";
      ctx.shadowColor = ctx.fillStyle;
      ctx.fillRect(-sparkDist, sparkSpread - sparkSize / 2, sparkSize, sparkSize);
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // 3. Ground Effect Underfloor & Diffuser / Венті-тунелі днища та дифузор
  // ---------------------------------------------------------------------------
  // Carbon diffuser tunnels
  ctx.fillStyle = "#070b14";
  ctx.beginPath();
  ctx.moveTo(-19, -11);
  ctx.lineTo(-31, -13);
  ctx.lineTo(-31, 13);
  ctx.lineTo(-19, 11);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Diffuser vertical strakes (aero fences)
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  [-8, -4, 0, 4, 8].forEach((strakeY) => {
    ctx.beginPath();
    ctx.moveTo(-22, strakeY * 0.85);
    ctx.lineTo(-31, strakeY * 1.12);
    ctx.stroke();
  });

  // Carbon floor edge planks
  ctx.fillStyle = "#0c1322";
  ctx.beginPath();
  ctx.moveTo(12, -7);
  ctx.lineTo(10, -13.5);
  ctx.lineTo(-17, -13.5);
  ctx.lineTo(-19, -9);
  ctx.lineTo(-19, 9);
  ctx.lineTo(-17, 13.5);
  ctx.lineTo(10, 13.5);
  ctx.lineTo(12, 7);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Floor edge vortex generators / fins
  ctx.fillStyle = "#ef4444";
  [-10, -4, 2].forEach((fx) => {
    ctx.fillRect(fx, -14.2, 3, 1.1);
    ctx.fillRect(fx, 13.1, 3, 1.1);
  });

  // ---------------------------------------------------------------------------
  // 4. Double Wishbone Suspension & Carbon Arms / Силові важелі підвіски
  // ---------------------------------------------------------------------------
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  // Front wishbones & pushrods
  ctx.moveTo(14, -4);
  ctx.lineTo(18, -11.5);
  ctx.moveTo(22, -3);
  ctx.lineTo(18, -11.5);
  ctx.moveTo(16, -2);
  ctx.lineTo(19, -11);

  ctx.moveTo(14, 4);
  ctx.lineTo(18, 11.5);
  ctx.moveTo(22, 3);
  ctx.lineTo(18, 11.5);
  ctx.moveTo(16, 2);
  ctx.lineTo(19, 11);

  // Rear wishbones & drive shafts
  ctx.moveTo(-13, -4);
  ctx.lineTo(-18, -11);
  ctx.moveTo(-23, -3);
  ctx.lineTo(-18, -11);
  ctx.moveTo(-18, -3);
  ctx.lineTo(-18, -11);

  ctx.moveTo(-13, 4);
  ctx.lineTo(-18, 11);
  ctx.moveTo(-23, 3);
  ctx.lineTo(-18, 11);
  ctx.moveTo(-18, 3);
  ctx.lineTo(-18, 11);
  ctx.stroke();

  // Metallic suspension knuckles
  ctx.fillStyle = "#94a3b8";
  [
    [18, -11.5],
    [18, 11.5],
    [-18, -11],
    [-18, 11],
  ].forEach(([px, py]) => {
    ctx.beginPath();
    ctx.arc(px, py, 1.1, 0, Math.PI * 2);
    ctx.fill();
  });

  // ---------------------------------------------------------------------------
  // 5. 18" Low-Profile Slicks & Aero Wheel Covers / Низькопрофільні шини та ковпаки
  // ---------------------------------------------------------------------------
  const wheels = [
    { x: 11.25, y: -17.25, w: 13.5, h: 6.5, side: -1 },
    { x: 11.25, y: 10.75, w: 13.5, h: 6.5, side: 1 },
    { x: -25.25, y: -18.5, w: 14.5, h: 8.0, side: -1 },
    { x: -25.25, y: 10.5, w: 14.5, h: 8.0, side: 1 },
  ];

  wheels.forEach((w) => {
    ctx.save();
    // Tire tread rubber gradient
    const tireGrad = ctx.createLinearGradient(w.x, w.y, w.x, w.y + w.h);
    tireGrad.addColorStop(0, "#080c14");
    tireGrad.addColorStop(0.5, "#182030");
    tireGrad.addColorStop(1, "#080c14");
    ctx.fillStyle = tireGrad;
    ctx.beginPath();
    ctx.roundRect(w.x, w.y, w.w, w.h, 2.5);
    ctx.fill();

    ctx.strokeStyle = "#05080e";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Pirelli P-Zero Soft red sidewall racing line
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const stripeY = w.side < 0 ? w.y + 1 : w.y + w.h - 1;
    ctx.moveTo(w.x + 2, stripeY);
    ctx.lineTo(w.x + w.w - 2, stripeY);
    ctx.stroke();

    // Carbon aero wheel cover disk
    const wheelCenterX = w.x + w.w / 2;
    const wheelCenterY = w.y + w.h / 2;
    ctx.fillStyle = "#0c1424";
    ctx.beginPath();
    ctx.ellipse(wheelCenterX, wheelCenterY, w.w * 0.32, w.h * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Color-coded center lock nut (Left blue, Right red - official F1 standard)
    ctx.fillStyle = w.side < 0 ? "#38bdf8" : "#f43f5e";
    ctx.beginPath();
    ctx.arc(wheelCenterX, wheelCenterY, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // ---------------------------------------------------------------------------
  // 6. Swept Multi-Element Front Wing / Багатоелементне переднє антикрило
  // ---------------------------------------------------------------------------
  // Tier 1: Mainplane
  ctx.fillStyle = "#0c1524";
  ctx.beginPath();
  ctx.moveTo(37, 0);
  ctx.lineTo(34, -16.5);
  ctx.lineTo(30, -17);
  ctx.lineTo(30, 17);
  ctx.lineTo(34, 16.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Tier 2: Secondary crimson flap element
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.moveTo(35, 0);
  ctx.lineTo(32, -15.5);
  ctx.lineTo(29, -16);
  ctx.lineTo(30, 0);
  ctx.lineTo(29, 16);
  ctx.lineTo(32, 15.5);
  ctx.closePath();
  ctx.fill();

  // Tier 3: Upper flap element
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(32, 0);
  ctx.lineTo(29, -15);
  ctx.lineTo(27, -15);
  ctx.lineTo(28, 0);
  ctx.lineTo(27, 15);
  ctx.lineTo(29, 15);
  ctx.closePath();
  ctx.fill();

  // Gold Gurney flap edge
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(27, -14.5);
  ctx.lineTo(28, 0);
  ctx.lineTo(27, 14.5);
  ctx.stroke();

  // Endplates and outwash canards
  [-1, 1].forEach((side) => {
    const ey = side * 17;
    ctx.fillStyle = "#080e1a";
    ctx.fillRect(25, ey - 0.9, 13, 1.8);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 0.8;
    ctx.strokeRect(25, ey - 0.9, 13, 1.8);

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(31, ey);
    ctx.lineTo(26, ey + side * 1.8);
    ctx.lineTo(27, ey);
    ctx.closePath();
    ctx.fill();
  });

  // ---------------------------------------------------------------------------
  // 7. Sculpted Monocoque & Undercut Sidepods / Аеродинамічний монокок і понтони
  // ---------------------------------------------------------------------------
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(38, 0, -26, 0);
  bodyGrad.addColorStop(0, "#111c30");
  bodyGrad.addColorStop(0.3, "#0f1b2d");
  bodyGrad.addColorStop(0.7, "#0b1322");
  bodyGrad.addColorStop(1, "#070c17");

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(37, 0);
  ctx.lineTo(35, -2);
  ctx.lineTo(26, -3.2);
  ctx.lineTo(16, -4.5);
  ctx.lineTo(8, -5.5);
  ctx.lineTo(7, -11.5);
  ctx.lineTo(-4, -12);
  ctx.lineTo(-12, -9);
  ctx.lineTo(-17, -5.5);
  ctx.lineTo(-26, -3);
  ctx.lineTo(-27, -2);
  ctx.lineTo(-27, 2);
  ctx.lineTo(-26, 3);
  ctx.lineTo(-17, 5.5);
  ctx.lineTo(-12, 9);
  ctx.lineTo(-4, 12);
  ctx.lineTo(7, 11.5);
  ctx.lineTo(8, 5.5);
  ctx.lineTo(16, 4.5);
  ctx.lineTo(26, 3.2);
  ctx.lineTo(35, 2);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Radiator intake apertures
  [-1, 1].forEach((side) => {
    ctx.fillStyle = "#020408";
    ctx.beginPath();
    ctx.moveTo(7, side * 5.8);
    ctx.lineTo(6.5, side * 11.2);
    ctx.lineTo(4, side * 11);
    ctx.lineTo(4.5, side * 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  });

  // Livery: Nose center stripe
  const liveryGrad = ctx.createLinearGradient(37, 0, 15, 0);
  liveryGrad.addColorStop(0, "#facc15");
  liveryGrad.addColorStop(0.45, "#ef4444");
  liveryGrad.addColorStop(1, "#dc2626");

  ctx.fillStyle = liveryGrad;
  ctx.beginPath();
  ctx.moveTo(37, 0);
  ctx.lineTo(24, -1.8);
  ctx.lineTo(15, -1.8);
  ctx.lineTo(15, 1.8);
  ctx.lineTo(24, 1.8);
  ctx.closePath();
  ctx.fill();

  // Nose tip chevron & telemetry probe
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(37, 0);
  ctx.lineTo(33, -1.2);
  ctx.lineTo(33, 1.2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(25, -0.4, 3, 0.8);

  // Sidepod aerodynamic color swooshes & cooling gills
  [-1, 1].forEach((side) => {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(5, side * 11.3);
    ctx.lineTo(-6, side * 11.8);
    ctx.lineTo(-13, side * 8.5);
    ctx.lineTo(-12, side * 6.8);
    ctx.lineTo(-4, side * 9.5);
    ctx.lineTo(5, side * 9.5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(4, side * 9.3);
    ctx.lineTo(-4, side * 9.3);
    ctx.lineTo(-11, side * 6.6);
    ctx.lineTo(-10, side * 5.8);
    ctx.lineTo(-3, side * 8.2);
    ctx.lineTo(4, side * 8.2);
    ctx.closePath();
    ctx.fill();

    // Cooling louvers
    ctx.strokeStyle = "#070d18";
    ctx.lineWidth = 1;
    [-2, -4.5, -7, -9.5].forEach((lx) => {
      ctx.beginPath();
      ctx.moveTo(lx, side * 4.8);
      ctx.lineTo(lx - 1.5, side * 7.5);
      ctx.stroke();
    });

    // Mirrors
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(5, side * 3.5);
    ctx.lineTo(5, side * 8.0);
    ctx.stroke();

    ctx.fillStyle = "#0e1726";
    ctx.fillRect(3.8, side * 8.0 - (side < 0 ? 2.5 : 0), 2.6, 2.5);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(4.2, side * 8.0 - (side < 0 ? 2.1 : -0.4), 1.8, 1.7);
  });
  ctx.restore();

  // ---------------------------------------------------------------------------
  // 8. Cockpit, Driver & Titanium Halo / Капсула пілота, шолом та Halo
  // ---------------------------------------------------------------------------
  // Cockpit tub
  ctx.fillStyle = "#030712";
  ctx.beginPath();
  ctx.ellipse(0.5, 0, 6.5, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // F1 steering wheel with telemetry LCD
  ctx.fillStyle = "#090e17";
  ctx.fillRect(4.2, -2.0, 1.5, 4.0);
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(4.5, -1.2, 0.8, 2.4);

  // Driver racing helmet
  const helmetGrad = ctx.createRadialGradient(-0.8, -0.5, 0.5, -0.5, 0, 3.5);
  helmetGrad.addColorStop(0, "#f8fafc");
  helmetGrad.addColorStop(0.6, "#ef4444");
  helmetGrad.addColorStop(1, "#991b1b");
  ctx.fillStyle = helmetGrad;
  ctx.beginPath();
  ctx.ellipse(-0.5, 0, 2.8, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Visor with cyan glare reflection
  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.ellipse(0.8, 0, 1.0, 1.6, 0, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.fillStyle = "#e0f2fe";
  ctx.fillRect(1.0, -0.6, 0.6, 1.2);

  // Halo titanium protection arch
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.arc(0.2, 0, 4.2, -Math.PI * 0.58, Math.PI * 0.58);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4.4, 0);
  ctx.lineTo(7.2, 0);
  ctx.stroke();

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(0.2, 0, 4.2, -Math.PI * 0.52, Math.PI * 0.52);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4.4, 0);
  ctx.lineTo(7.2, 0);
  ctx.stroke();

  // ---------------------------------------------------------------------------
  // 9. Airbox, Shark Fin & Engine Cover Spine / Верхній повітрозабірник і кіль
  // ---------------------------------------------------------------------------
  // Airbox inlet
  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.ellipse(-3.5, 0, 1.5, 2.0, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  ctx.stroke();

  // T-Cam telemetry camera
  ctx.fillStyle = "#facc15";
  ctx.fillRect(-4.5, -0.8, 1.8, 1.6);
  ctx.fillStyle = "#020617";
  ctx.fillRect(-3.8, -0.5, 0.8, 1.0);

  // Central dorsal shark fin
  ctx.fillStyle = "#0a101d";
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.lineTo(-24, -0.8);
  ctx.lineTo(-24, 0.8);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.lineTo(-24, 0);
  ctx.stroke();

  ctx.fillStyle = "#facc15";
  ctx.fillRect(-24.5, -0.7, 1.5, 1.4);

  // ---------------------------------------------------------------------------
  // 10. Swept Rear Wing & DRS Actuator / Заднє антикрило та система DRS
  // ---------------------------------------------------------------------------
  // Endplates
  [-1, 1].forEach((side) => {
    const ey = side * 15;
    ctx.fillStyle = "#090e18";
    ctx.fillRect(-34, ey - (side < 0 ? 1.8 : 0), 8.5, 1.8);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 0.8;
    ctx.strokeRect(-34, ey - (side < 0 ? 1.8 : 0), 8.5, 1.8);

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(-32, ey - (side < 0 ? 1.4 : -0.2), 4, 1.2);
  });

  // Rear wing mainplane
  ctx.fillStyle = "#0c1322";
  ctx.beginPath();
  ctx.roundRect(-33, -14, 6.5, 28, 1.5);
  ctx.fill();
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // DRS upper flap
  ctx.fillStyle = "#dc2626";
  ctx.fillRect(-31.5, -13, 3.2, 26);
  ctx.fillStyle = "#facc15";
  ctx.fillRect(-30, -11, 1.2, 22);

  // DRS hydraulic bullet actuator
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.ellipse(-30, 0, 2.2, 1.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Swan-neck pylons
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-25, -2.5);
  ctx.lineTo(-30, -2.5);
  ctx.moveTo(-25, 2.5);
  ctx.lineTo(-30, 2.5);
  ctx.stroke();

  // FIA central rain safety flashing light
  ctx.save();
  ctx.fillStyle = "#ff0033";
  ctx.shadowColor = "#ff0033";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(-27.5, 0, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

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
