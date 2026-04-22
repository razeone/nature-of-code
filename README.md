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
