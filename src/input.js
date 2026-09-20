/**
 * Encapsulated Input Subsystem / Підсистема обробки подій вводу.
 *
 * Uses lexical closures to isolate keyboard state within private Sets.
 * Використовує замикання для інкапсуляції стану клавіш у приватних Set.
 *
 * @param {EventTarget} [target=window] - Event listener target / Цільовий об'єкт для слухачів
 */
export function createInput(target = window) {
  const down = new Set();
  const pressed = new Set();

  function onKeyDown(e) {
    if (!e.repeat) {
      pressed.add(e.code);
    }
    down.add(e.code);
  }

  function onKeyUp(e) {
    down.delete(e.code);
  }

  target.addEventListener("keydown", onKeyDown);
  target.addEventListener("keyup", onKeyUp);

  return {
    /**
     * Level-triggered check: returns true while key is held down.
     * Рівневий тригер: повертає true, доки клавіша затиснута.
     */
    isDown(code) {
      return down.has(code);
    },

    /**
     * Edge-triggered check: returns true once per key press event.
     * Фронтовий тригер: повертає true один раз на одне натискання.
     */
    justPressed(code) {
      if (pressed.has(code)) {
        pressed.delete(code);
        return true;
      }
      return false;
    },

    /**
     * Cleans up event listeners / Видалення слухачів подій.
     */
    destroy() {
      target.removeEventListener("keydown", onKeyDown);
      target.removeEventListener("keyup", onKeyUp);
      down.clear();
      pressed.clear();
    },
  };
}
