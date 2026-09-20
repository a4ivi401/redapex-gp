/**
 * HiDPI/Retina Canvas Buffer Synchronization / Синхронізація буфера Canvas під HiDPI дисплеї.
 *
 * Synchronizes physical buffer resolution with CSS layout pixels via devicePixelRatio.
 * Uses ctx.setTransform(dpr, ...) to reset and maintain consistent scaling.
 * Узгоджує фізичну роздільну здатність із CSS-пікселями через devicePixelRatio.
 *
 * @param {string} selector - Canvas CSS selector / Селектор canvas
 */
export function createCanvas(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) throw new Error(`Canvas не знайдено: ${selector}`);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Не вдалося отримати 2D-контекст");

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const { clientWidth, clientHeight } = canvas;

    canvas.width = Math.round(clientWidth * dpr);
    canvas.height = Math.round(clientHeight * dpr);

    // Apply clean scaling matrix from identity / Встановлюємо матрицю масштабування з нуля
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  return {
    canvas,
    ctx,
    resize,
    get width() {
      return canvas.clientWidth;
    },
    get height() {
      return canvas.clientHeight;
    },
  };
}
