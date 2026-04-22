# Nature of Code — Modern Creative Coding

A complete creative coding course built on [p5.js](https://p5js.org/), modernised with **Vite**, **ES2022+** syntax, and ES Modules.

> Original ES5 sketches live in `week1/`–`week5/`. The modern rewrite is in `src/week0/`–`src/week6/`.

## Course Structure

| Week | Topic | Key Concepts |
|------|-------|-------------|
| 0 | JS & p5.js Foundations | Variables, loops, p5.Vector, classes, events |
| 1 | Perlin Noise | `noise()`, organic randomness, animation |
| 2 | Drag Forces | Newton's laws, F = ma, drag coefficient |
| 3 | Steering Behaviors | Seek, arrive, flow fields, liquid drag |
| 4 | Fractals & Mandelbrot | Complex numbers, iteration, color palettes |
| 5 | Genetic Algorithms | DNA, fitness, selection, crossover, mutation |
| 6 | Viral Bloom (Capstone) | All concepts combined into generative art |

### Bonus examples for creative coders (weeks 6–10)

These newer sketches extend the course with self-contained, modern-p5 examples that each lean on a single concept — ideal for teaching programming to creatives. They load p5 from a CDN, so you can just open the `index.html` in a browser (no build step, no bundled library folder).

* **Week 6 — Particle System (`week6/`)**: fireworks built from a `Particle` class and a `Firework` composition that explodes mid-air. Covers forces, arrays of objects, lifespan, and an `Emitter` that leaks embers from the mouse. Click to launch, space toggles wind.
* **Week 7 — Flocking / Boids (`week7/`)**: an implementation of Craig Reynolds' three rules (separation, alignment, cohesion). Extends week 3's steering toward emergent group behavior. Keys `1`/`2`/`3` tune each rule's weight in real time.
* **Week 8 — Conway's Game of Life (`week8/`)**: a cellular automaton on a toroidal grid with age-based coloring. Click-drag to paint, space to pause, `G` spawns Gosper's glider gun. Introduces 2D arrays, neighborhoods, and a classic simulation loop.
* **Week 9 — L-Systems (`week9/`)**: procedural plants, Koch curve, Sierpinski triangle, and Heighway dragon from string-rewrite grammars drawn with a turtle. Builds on week 4's recursion but as a grammar. Click to plant wherever you like.
* **Week 10 — Phyllotaxis (`week10/`)**: the Vogel formula that places seeds at the golden angle (~137.5°). Drag to tune angle and scale, scroll to add seeds, `P` cycles palettes, `S` saves a PNG. A closing "program as a design tool" demo.

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
