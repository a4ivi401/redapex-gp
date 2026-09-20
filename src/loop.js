/**
 * Fixed-Timestep Game Loop Engine / Двигун ігрового циклу з фіксованим кроком.
 *
 * Implements Glenn Fiedler's "Fix Your Timestep!" architecture:
 * decouples discrete simulation updates from monitor refresh rates.
 * Реалізує архітектуру розділення частоти фізичної симуляції та рендерингу.
 *
 * @param {Object} options
 * @param {number} [options.step=1/60] - Physics timestep in seconds / Крок фізики в секундах
 * @param {(step: number) => void} options.simulate - Fixed physics step callback / Колбек кроку фізики
 * @param {(alpha: number, stats: Object) => void} options.render - Frame render callback / Колбек рендерингу
 */
export function createLoop({ step = 1 / 60, simulate, render }) {
  const stats = {
    stepsPerSecond: 0,
    framesPerSecond: 0,
    frameTime: 0,
  };

  let accumulator = 0;
  let last = 0;
  let handle = 0;
  let running = false;

  let lastStatsUpdate = 0;
  let accumulatedFrames = 0;
  let accumulatedSteps = 0;

  function frame(now) {
    const dtMs = now - last;
    last = now;
    stats.frameTime = dtMs;

    // Temporal accumulator with spiral-of-death guard (capped at 250ms).
    // Акумулятор часу із захистом від каскадного зависання (ліміт 250 мс).
    accumulator += Math.min(dtMs / 1000, 0.25);

    // Consume accumulated time in fixed discrete steps.
    // Вичерпуємо накопичений час фіксованими дискретними кроками.
    let steps = 0;
    while (accumulator >= step) {
      simulate(step);
      accumulator -= step;
      steps += 1;
    }

    // Rolling performance statistics updated every 500ms.
    // Збір згладжених метрик продуктивності кожні 500 мс.
    accumulatedFrames += 1;
    accumulatedSteps += steps;
    const elapsedStats = now - lastStatsUpdate;
    if (elapsedStats >= 500) {
      stats.framesPerSecond = (accumulatedFrames / elapsedStats) * 1000;
      stats.stepsPerSecond = (accumulatedSteps / elapsedStats) * 1000;
      accumulatedFrames = 0;
      accumulatedSteps = 0;
      lastStatsUpdate = now;
    }

    // Residual time ratio alpha in [0, 1) for sub-frame state interpolation.
    // Залишковий коефіцієнт alpha [0, 1) для субкадрової інтерполяції (LERP).
    const alpha = accumulator / step;
    render(alpha, stats);

    if (running) {
      handle = requestAnimationFrame(frame);
    }
  }

  function start() {
    if (running) return;
    running = true;

    last = performance.now();
    lastStatsUpdate = last;
    accumulatedFrames = 0;
    accumulatedSteps = 0;
    accumulator = 0;

    handle = requestAnimationFrame(frame);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(handle);
  }

  return { start, stop, stats };
}
