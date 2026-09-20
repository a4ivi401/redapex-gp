# 🏎️ RedApex GP — 2D Vehicle Simulator & Physics Loop Engine

[![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-v10-4B32C3?style=flat-square&logo=eslint&logoColor=white)](https://eslint.org/)
[![Lab](https://img.shields.io/badge/Lab%2001-Passed-22c55e?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-0ea5e9?style=flat-square)]()

2D симулятор руху транспортного засобу на базі HTML5 Canvas та ванільного JavaScript. Проєкт реалізує архітектуру детермінованого ігрового циклу з фіксованим часовим кроком (**Fixed-Timestep Accumulator**), кадровою синхронізацією через `requestAnimationFrame`, субкадровою лінійною інтерполяцією стану (**lerp**) та інкапсуляцією підсистеми вводу через лексичні замикання.

> 🌐 **Language / Мова:** [🇺🇦 Українська](#-українська-версія) | [🇬🇧 English](#-english-version)

---

## 🇺🇦 Українська версія

### 📌 Архітектурний опис

**RedApex GP** — це двовимірна система симуляції кінематики та векторної динаміки транспортного засобу. Вона демонструє розділення частоти оновлення фізичної моделі ($60\text{ Hz}$) та частоти рендерингу монітора (60/120/144+ Hz) за допомогою акумулятора часу та інтерполяції проміжних станів.

### 🎮 Керування
- `W` / `▲ Стрілка вгору` / `Space` — активація вектора поздовжньої тяги (Thrust)
- `A` / `D` / `◄ / ► Стрілки` — зміна кута орієнтації (Steering)
- `H` — перемикання видимості оверлею телеметрії (HUD Toggle)
- `R` — скидання просторового стану об'єкта (Reset Position & Velocity)

### 🚀 Запуск та перевірка

```bash
# Встановлення залежностей
npm install

# Запуск локального середовища розробки (Vite)
npm run dev

# Компіляція оптимізованого продакшн бандла
npm run build

# Статичний аналіз коду (ESLint)
npx eslint .
```

### 🧱 Структура модулів

```txt
src/
├── main.js         # Точка входу: конфігурація та зв'язування циклу, вводу, фізики й рендера
├── loop.js         # createLoop() — фіксований крок (1/60 c), rAF, збір метрик та розрахунок alpha
├── input.js        # createInput() — обробка клавіатурних подій через замикання (closure)
├── style.css       # Стилізація інтерфейсу та координатної сітки
├── sim/
│   ├── car.js      # Векторна динаміка об'єкта (чисельне інтегрування, drag, кутова швидкість)
│   └── arena.js    # Замкнений тороїдальний простір (wrap) та інтерполяція за найкоротшою дугою
└── render/
    ├── canvas.js   # Ініціалізація полотна з масштабуванням під devicePixelRatio (HiDPI)
    └── draw.js     # Immediate Mode рендеринг полігональної моделі та оверлею телеметрії
```

---

### 🧪 Лабораторні дослідження та результати (Milestone 4)

#### 1. Синхронне блокування головного потоку (100 ms Busy-Wait)
* **Методика:** Ін'єкція штучного циклу очікування `while (performance.now() < t + 100) {}` кожні 60 кадрів.
* **Спостереження:** `frameTime` зріс до **116.7 ms**, рендерний `FPS` просів до **~48-50**. Спостерігається періодичний мікрофриз тривалістю 100 мс. Одразу після розблокування Call Stack акумулятор відпрацьовує накопичену різницю часу серією з 6 дискретних викликів `simulate(1/60)`, повертаючи просторовий стан об'єкта до актуального фізичного часу.
* **Теоретичне обґрунтування:** JavaScript виконується в однопотоковій моделі за принципом Run-to-completion. Зайнятий Call Stack блокує чергу мікрозадач та етапи пайплайну браузера (Recalculate Style, Layout, Paint, Composite).

#### 2. Порівняння `requestAnimationFrame` та `setInterval(16ms)`
* **Методика:** Заміна планувальника кадрів на `setInterval(frame, 16)` із подальшим фоновим згортанням вкладки на 5 секунд.
* **Порівняльна таблиця:**
  | Параметр | `requestAnimationFrame` | `setInterval(16ms)` |
  |---|---|---|
  | **Стабільність інтервалу (Jitter)** | $\pm 0.2 \dots 0.4 \text{ ms}$ (синхронізація з V-Sync) | $\pm 5.0 \dots 9.0 \text{ ms}$ (хаотичний розкид 11–23 ms) |
  | **Поведінка у фоновому режимі** | Призупинення викликів (0–1 FPS, збереження ресурсів CPU) | Продовження таймерних викликів із тротлінгом браузера (~1000 ms) |
  | **Підтримка моніторів 120/144+ Hz** | Адаптивна частота відповідно до апаратного V-Sync | Жорстка прив'язка до статичного інтервалу (~60 Hz) |

#### 3. Змінний крок часу проти Детермінованого Акумулятора
* **Методика:** Постійне прискорення протягом 5.0 секунд у нормальному режимі та при 6-кратному тротлінгу CPU в DevTools.
* **Результати:**
  - При змінному кроці $\Delta t$ (`simulate(dt)`): нелінійне згасання швидкості через опір середовища призводить до просторового розходження фінальної координати на **>60 пікселів**.
  - При фіксованому кроці (`step = 1/60`): в обох режимах виконується рівно 300 однакових ітерацій чисельного інтегрування $\to$ **кінцеві вектори координат збігаються з точністю до субпікселя**.

---

### 💡 Ключові концепції

1. **Event Loop та фази виконання:**
   - Call Stack (синхронний код) $\to$ повне вичерпання **Microtask Queue** (`Promise.then`, `queueMicrotask`) $\to$ фаза **Rendering** (`rAF` $\to$ Style Recalculation $\to$ Layout $\to$ Paint) $\to$ вибірка наступної макрозадачі з Task Queue.
2. **Акумулятор та коефіцієнт інтерполяції ($\alpha$):**
   - Фізична симуляція завжди обчислюється з кроком $dt = 1/60\text{ с}$.
   - Коефіцієнт $\alpha = \frac{\text{accumulator}}{\text{step}} \in [0, 1)$ відображає залишок часу між останнім розрахованим кроком та поточним моментом рендерингу. Позиція для відображення розраховується як $\vec{P}_{\text{render}} = \text{lerp}(\vec{P}_{\text{prev}}, \vec{P}_{\text{curr}}, \alpha)$.
3. **Інкапсуляція стану через замикання (Closures):**
   - Утиліта `createInput` зберігає внутрішній стан клавіш у замиканні структури `Set`. Доступ із зовнішнього середовища обмежується методами `isDown` та `justPressed`.

---

## 🇬🇧 English Version

### 📌 Architectural Overview

**RedApex GP** is a 2D vehicle kinematics and vector dynamics simulator built with vanilla JavaScript and HTML5 Canvas. The project showcases an industrial-grade **Fixed-Timestep Accumulator** game loop, display-synchronized execution via `requestAnimationFrame`, sub-frame linear state interpolation (**lerp**), and closure-encapsulated input tracking.

### 🎮 Controls
- `W` / `▲ Arrow Up` / `Space` — Linear longitudinal thrust
- `A` / `D` / `◄ / ► Arrows` — Angular steering
- `H` — Toggle telemetry overlay visibility
- `R` — Reset vehicle position and velocity vectors

### 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start local development server (Vite)
npm run dev

# Build production bundle
npm run build

# Static analysis (ESLint)
npx eslint .
```

### 🧱 Module Layout

```txt
src/
├── main.js         # Composition root: wires loop, input subsystem, physics, and canvas
├── loop.js         # createLoop() — fixed timestep (1/60s), rAF scheduler, stats & alpha ratio
├── input.js        # createInput() — keyboard event handling encapsulated via closures
├── style.css       # Viewport layout and dark telemetry interface styles
├── sim/
│   ├── car.js      # Vector dynamics (Euler integration, quadratic drag, max speed clamp)
│   └── arena.js    # Toroidal space wrapping & shortest-arc angle/position interpolation
└── render/
    ├── canvas.js   # HiDPI/Retina canvas buffer setup via setTransform
    └── draw.js     # Immediate Mode 2D rendering for polygonal geometry and telemetry HUD
```

---

### 🧪 Experimental Analysis (Milestone 4)

#### 1. Main Thread Blocking (100 ms Busy-Wait)
* **Method:** Injected `while (performance.now() < t + 100) {}` every 60 frames inside the render phase.
* **Findings:** `frameTime` increased to **116.7 ms**, causing render `FPS` to drop to **~48-50**. A visible 100 ms frame freeze occurs once per second. As soon as execution leaves the Call Stack, the accumulator resolves the temporal debt via 6 consecutive `simulate(1/60)` steps, instantly realigning the simulation with wall-clock time.
* **Runtime Mechanics:** JavaScript enforces run-to-completion semantics on a single thread. Synchronous CPU execution prevents the Microtask Queue from draining and halts browser rendering stages (Recalculate Style, Layout, Paint).

#### 2. `requestAnimationFrame` vs `setInterval(16ms)`
* **Method:** Replaced the frame scheduler with `setInterval(frame, 16)` and minimized the browser window for 5 seconds.
* **Findings:**
  - **Frame Cadence (Jitter):** `rAF` maintained a strict $\pm 0.2\text{ ms}$ interval aligned with display V-Sync. `setInterval` experienced timing jitter between 11 ms and 23 ms.
  - **Background Throttling:** When inactive, `rAF` paused frame rendering (0–1 FPS, zero CPU overhead), whereas `setInterval` continued ticking at browser-throttled rates (~1s intervals).
  - **High Refresh Displays:** `rAF` natively adapted to 120/144 Hz refresh rates; `setInterval` remained artificially constrained to ~60 Hz.

#### 3. Variable Timestep vs Fixed Timestep Accumulator
* **Method:** Continuous acceleration for 5.0 seconds under native execution vs 6× CPU throttling in DevTools.
* **Findings:**
  - With **Variable Timestep** (`simulate(dt)`): Non-linear drag integration produced a trajectory error exceeding **>60 pixels**.
  - With **Fixed Timestep Accumulator**: Both conditions processed exactly 300 discrete simulation steps of $1/60\text{ s}$, producing **deterministic, sub-pixel identical coordinates**.

---

## 📜 License

MIT License © 2026. Built for academic study of game engine architecture.
