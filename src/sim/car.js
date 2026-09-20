/**
 * 2D Kinematics and Numerical Integration / Векторна кінематика та чисельне інтегрування.
 *
 * Simulates angular steering, longitudinal thrust, non-linear drag, and max speed clamp.
 * Моделює поворот, векторну тягу, експоненціальний опір середовища та обмеження швидкості.
 */

export const CAR_CONFIG = {
  ROTATION_SPEED: Math.PI * 1.8, // Angular velocity (rad/s) / Кутова швидкість (рад/с)
  THRUST_ACCEL: 620, // Longitudinal acceleration (px/s²) / Лінійне прискорення тяги (px/с²)
  DRAG: 0.982, // Velocity retention coefficient / Коефіцієнт лінійного опору середовища
  MAX_SPEED: 680, // Terminal velocity limit (px/s) / Гранична швидкість (px/с)
};

/**
 * Initializes object kinematic state / Ініціалізація стану об'єкта.
 */
export function createCar(x = 0, y = 0, angle = 0) {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    angle,
    thrust: false,
  };
}

/**
 * Normalizes angle to [-PI, PI] / Нормалізація кута до діапазону [-PI, PI].
 */
export function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

/**
 * Integrates state over timestep dt via Semi-Implicit Euler method.
 * Чисельне інтегрування стану за крок dt методом напівнеявного Ейлера.
 */
export function integrate(car, input, dt) {
  // 1. Angular steering / Поворот орієнтації
  let steer = 0;
  if (input.isDown("ArrowLeft") || input.isDown("KeyA")) steer -= 1;
  if (input.isDown("ArrowRight") || input.isDown("KeyD")) steer += 1;

  car.angle = normalizeAngle(car.angle + steer * CAR_CONFIG.ROTATION_SPEED * dt);

  // 2. Longitudinal thrust / Поздовжня тяга
  car.thrust =
    input.isDown("ArrowUp") ||
    input.isDown("KeyW") ||
    input.isDown("Space");

  if (car.thrust) {
    car.vx += Math.cos(car.angle) * CAR_CONFIG.THRUST_ACCEL * dt;
    car.vy += Math.sin(car.angle) * CAR_CONFIG.THRUST_ACCEL * dt;
  }

  // 3. Frame-rate independent drag & velocity clamp / Опір середовища та обмеження швидкості
  const dragFactor = Math.pow(CAR_CONFIG.DRAG, dt * 60);
  car.vx *= dragFactor;
  car.vy *= dragFactor;

  const speed = Math.hypot(car.vx, car.vy);
  if (speed > CAR_CONFIG.MAX_SPEED) {
    const scale = CAR_CONFIG.MAX_SPEED / speed;
    car.vx *= scale;
    car.vy *= scale;
  }

  // 4. Position update / Оновлення координат
  car.x += car.vx * dt;
  car.y += car.vy * dt;

  return car;
}
