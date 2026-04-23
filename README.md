# Nature of Code — Modern Creative Coding

A complete creative coding course built on [p5.js](https://p5js.org/), modernised with **Vite**, **ES2022+** syntax, and ES Modules.

> Original ES5 sketches live in `week1/`–`week5/`. The modern rewrite is in `src/week0/`–`src/week6/`.

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
| **End-to-end** (Playwright) | `e2e/pages.spec.js` | Page-load regressions: each `weekN/index.html` is opened in headless Chromium and any uncaught error or `console.error` fails the test. |

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
