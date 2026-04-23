# Nature of Code — Modern Creative Coding

A complete creative coding course built on [p5.js](https://p5js.org/), modernised with **Vite**, **ES2022+** syntax, and ES Modules.

> All sketches live under `src/`. Every week ships as a Vite entry point that imports `p5` from `node_modules` and uses **p5 instance mode**.

## Course Structure

| Week | Topic | Sketch | Lectures |
|------|-------|--------|----------|
| 0 | JS & p5.js Foundations | [`src/week0/`](src/week0/) | [📖](src/week0/lectures/) |
| 1 | Perlin Noise | [`src/week1/`](src/week1/) | [📖](src/week1/lectures/) |
| 2 | Drag Forces | [`src/week2/`](src/week2/) | [📖](src/week2/lectures/) |
| 3 | Steering Behaviors | [`src/week3/`](src/week3/) | [📖](src/week3/lectures/) |
| 4 | Fractals & Mandelbrot | [`src/week4/`](src/week4/) | [📖](src/week4/lectures/) |
| 5 | Genetic Algorithms | [`src/week5/`](src/week5/) | [📖](src/week5/lectures/) |
| 6 | Viral Bloom (Capstone) | [`src/week6/`](src/week6/) | [📖](src/week6/lectures/) |

Each week ships with a quick-reference `README.md` next to the code, plus a
`lectures/` directory containing 2–3 long-form lectures (theory, history,
annotated source walkthroughs, exercises with hints, references).

### Bonus examples for creative coders

These additional self-contained sketches extend the course with one-concept-per-page demos — ideal for teaching programming to creatives. They use the same modern structure (Vite + ES modules + p5 instance mode) as the core weeks.

* **Week 6 Bonus — Particle System ([`src/week6-bonus/`](src/week6-bonus/))**: fireworks built from a `Particle` class and a `Firework` composition that explodes mid-air. Covers forces, arrays of objects, lifespan, and an `Emitter` that leaks embers from the mouse. Click to launch, space toggles wind.
* **Week 7 — Flocking / Boids ([`src/week7/`](src/week7/))**: an implementation of Craig Reynolds' three rules (separation, alignment, cohesion). Extends week 3's steering toward emergent group behavior. Keys `1`/`2`/`3` tune each rule's weight in real time.
* **Week 8 — Conway's Game of Life ([`src/week8/`](src/week8/))**: a cellular automaton on a toroidal grid with age-based coloring. Click-drag to paint, space to pause, `G` spawns Gosper's glider gun. Introduces 2D arrays, neighborhoods, and a classic simulation loop.
* **Week 9 — L-Systems ([`src/week9/`](src/week9/))**: procedural plants, Koch curve, Sierpinski triangle, and Heighway dragon from string-rewrite grammars drawn with a turtle. Builds on week 4's recursion but as a grammar. Click to plant wherever you like.
* **Week 10 — Phyllotaxis ([`src/week10/`](src/week10/))**: the Vogel formula that places seeds at the golden angle (~137.5°). Drag to tune angle and scale, scroll to add seeds, `P` cycles palettes, `S` saves a PNG. A closing "program as a design tool" demo.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Building for Production

```bash
npm run build
npm run preview
```

## Testing

This project uses [Vitest](https://vitest.dev/) for unit tests and
[Playwright](https://playwright.dev/) for end-to-end smoke tests of every week's
sketch page.

```bash
npm test            # run all unit tests once
npm run test:watch  # watch mode
npm run test:e2e    # build + Playwright (boots vite preview, loads each week)
```

The test pyramid:

| Layer | Lives in | Catches |
|------|------|------|
| **Unit** (Vitest + jsdom) | `tests/unit/*.test.js` | Logic regressions in `Star`, `FlowField`, `DNA`, `Population`, `Mandelbrot`, etc. — runs the real source files against a hand-rolled p5 stub (`tests/helpers/p5Stub.js`). |
| **End-to-end** (Playwright) | `e2e/pages.spec.js` | Page-load regressions: each `src/weekN/index.html` is opened in headless Chromium and any uncaught error or `console.error` fails the test. |

CI runs both layers on every push and pull request — see `.github/workflows/test.yml`.

## Tech Stack

- **[Vite](https://vitejs.dev/)** — lightning-fast build tool & dev server
- **[p5.js](https://p5js.org/)** — creative coding library (instance mode)
- **ES2022+** — `const`/`let`, classes, arrow functions, template literals
- **ES Modules** — `import`/`export` throughout

## Code Conventions

- All sketches use **p5 instance mode**: `new p5((p) => { ... })`
- Each class lives in its own file and is `export default`
- Classes receive the p5 instance `p` as their first constructor argument
- Relative imports always include the `.js` extension

## Original Course

Based on [The Nature of Code](https://natureofcode.com/) by Daniel Shiffman, originally taught at [Kadenze](https://kadenze.com).

### License
MIT
