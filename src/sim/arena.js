/**
 * Toroidal Arena Geometry & Wrap-Around Interpolation / Тороїдальна геометрія та інтерполяція.
 */

/**
 * Wraps entity coordinates around boundary limits / Закольцовує координати об'єкта по краях арени.
 */
export function wrapArena(entity, width, height) {
  if (entity.x < 0) entity.x += width;
  else if (entity.x > width) entity.x -= width;

  if (entity.y < 0) entity.y += height;
  else if (entity.y > height) entity.y -= height;
}

/**
 * Boundary-aware linear position interpolation / Інтерполяція позиції з урахуванням закольцовування.
 */
export function lerpPosition(a, b, t, size) {
  let diff = b - a;
  if (diff > size / 2) diff -= size;
  else if (diff < -size / 2) diff += size;

  let res = a + diff * t;
  if (res < 0) res += size;
  if (res >= size) res -= size;
  return res;
}

/**
 * Shortest-arc angular interpolation / Інтерполяція кута за найкоротшою дугою.
 */
export function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}
