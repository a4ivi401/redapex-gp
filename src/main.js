import "./style.css";
import { createCanvas } from "./render/canvas.js";
import { createInput } from "./input.js";
import { createLoop } from "./loop.js";
import { createCar, integrate } from "./sim/car.js";
import { wrapArena, lerpPosition, lerpAngle } from "./sim/arena.js";
import { drawCar, drawGrid, drawHud } from "./render/draw.js";

// Composition Root / Головний модуль ініціалізації та зв'язування компонентів
const view = createCanvas("#game");
const { ctx } = view;
const input = createInput(window);

// Dual-state storage for sub-frame linear interpolation (LERP).
// Подвійний стан для субкадрової лінійної інтерполяції.
let currentCar = createCar(view.width / 2, view.height / 2);
let previousCar = { ...currentCar };

/**
 * Advances physics by one fixed step (1/60s).
 * Просування фізичної симуляції на один фіксований крок.
 */
function simulate(step) {
  previousCar = { ...currentCar };
  integrate(currentCar, input, step);
  wrapArena(currentCar, view.width, view.height);
}

/**
 * Renders interpolated frame state based on residual alpha ratio.
 * Рендеринг кадру з лінійною інтерполяцією стану за коефіцієнтом alpha.
 */
function render(alpha, stats) {
  // 1. Clear viewport & draw track grid / Очищення та малювання сітки
  ctx.fillStyle = "#080c14";
  ctx.fillRect(0, 0, view.width, view.height);
  drawGrid(ctx, view.width, view.height);

  // 2. State interpolation (LERP) / Інтерполяція стану
  const renderX = lerpPosition(
    previousCar.x,
    currentCar.x,
    alpha,
    view.width
  );
  const renderY = lerpPosition(
    previousCar.y,
    currentCar.y,
    alpha,
    view.height
  );
  const renderAngle = lerpAngle(previousCar.angle, currentCar.angle, alpha);
  const renderThrust = currentCar.thrust;

  // 3. Draw model & telemetry / Відображення моделі та телеметрії
  drawCar(ctx, renderX, renderY, renderAngle, renderThrust);
  drawHud(ctx, stats, alpha, currentCar, input);
}

const loop = createLoop({ simulate, render });
loop.start();

// Keyboard Shortcuts / Гарячі клавіші: H (HUD Toggle), R (Reset Object)
window.addEventListener("keydown", (e) => {
  if (e.code === "KeyH") {
    const hud = document.getElementById("hud");
    if (hud) hud.classList.toggle("hud-hidden");
  } else if (e.code === "KeyR") {
    currentCar = createCar(view.width / 2, view.height / 2);
    previousCar = { ...currentCar };
  }
});

// Global bridge for DevTools inspection & lab experiments.
// Глобальні об'єкти для тестування в DevTools та експериментів.
window.loop = loop;
window.game = {
  view,
  input,
  get car() {
    return currentCar;
  },
  resetCar() {
    currentCar = createCar(view.width / 2, view.height / 2);
    previousCar = { ...currentCar };
  },
};
