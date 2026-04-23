# Capstone Walkthrough

> *"Read the source, Luke."* — every senior engineer, eventually

## 1. The big idea
This lecture is a guided read-through of `src/week6/sketch.js`, top to bottom. Every block of code in the capstone has a job, and once you can name each job — and trace the data that flows between them — you can confidently fork the project, swap subsystems, or extend it for the final challenge.

## 2. Where this comes from
The structure of `sketch.js` follows the canonical p5.js *instance-mode* pattern: a single function that receives a `p` object and attaches `p.setup`, `p.draw`, and event handlers. Daniel Shiffman teaches this pattern in *The Nature of Code* (2024 edition) precisely because it scales. Global-mode p5 is fine for a single short sketch, but as soon as you have multiple classes, shared state, and a handful of constants at the top, instance mode is the only sane choice — it lets the entire sketch be imported, embedded, or unit-tested.

The orchestration discipline — `setup()` initialises, `draw()` runs the frame loop, event handlers mutate state — is a direct descendant of the original Processing API from 2001. It is also a special case of the **immediate-mode rendering** loop common in games: every frame is drawn from scratch from the current state. This is conceptually simpler than retained-mode (DOM, scene graph) systems and is why p5.js is such a natural fit for generative animation.

A more subtle inheritance: the *constants-at-the-top, classes-imported, single-orchestrator-file* layout is exactly how Karl Sims structured his *Evolved Virtual Creatures* code in 1994 — modular components composed by a tiny driver. Three decades on, the pattern has not aged a day.

## 3. The model
The lifecycle of a single run of the capstone:

```
program start
  └─ new p5(sketch)
        ├─ p.setup()       runs once
        │     ├─ create canvas, set colour mode
        │     ├─ instantiate FlowField, Mandelbrot
        │     ├─ seed STAR_COUNT stars
        │     └─ instantiate target (Antibiotic) and Population
        │
        └─ p.draw()        runs every frame, forever
              ├─ paint translucent background (trail effect)
              ├─ Mandelbrot: render 3 cols, then blit
              ├─ FlowField: update; optionally display arrows
              ├─ Stars: spawn SPAWN_RATE, follow/update/display, cull dead
              ├─ Population: live (or evolve every `lifetime` frames)
              ├─ drift the target via Perlin noise
              └─ draw HUD
```

Two event handlers (`p.keyPressed`, `p.mousePressed`) mutate state asynchronously between frames. They never call `redraw()` themselves — they just set flags or move the target, and the next `p.draw()` picks it up.

## 4. In our code

**Imports.** Five classes, four from `./` and one cross-week import — `Antibiotic` is reused verbatim from Week 5, illustrating that ES modules cross folders cleanly:

```javascript
import p5 from 'p5';
import FlowField  from './FlowField.js';
import Star       from './Star.js';
import Population from './Population.js';
import Mandelbrot from './Mandelbrot.js';
import Antibiotic from '../week5/Antibiotic.js';
```
*— `src/week6/sketch.js:1-6`*

**Tunable constants.** The complete dial board for the piece — change one number, change the personality:

```javascript
const STAR_COUNT    = 120;
const POP_SIZE      = 30;
const MUTATION_RATE = 0.01;
const SPAWN_RATE    = 2;   // number of new stars spawned per frame
```
*— `src/week6/sketch.js:27-30`*

**Sketch-scope state.** Closed over by `setup` and `draw`; never globals:

```javascript
let flowfield;
let stars;
let population;
let mandelbrot;
let target;
let lifeCounter = 0;
let lifetime;
let showFlow = false;
```
*— `src/week6/sketch.js:33-40`*

**`setup()` — one-time wiring.** Canvas, colour mode, then construct each subsystem in dependency order. Note that `lifetime = p.height` ties the genome length to the canvas height, which gives every virus enough ticks to traverse the canvas:

```javascript
p.setup = () => {
  p.createCanvas(800, 600);
  p.colorMode(p.RGB, 255);
  p.textFont('monospace');

  flowfield  = new FlowField(p, 24);
  mandelbrot = new Mandelbrot(p, 64);

  // Seed stars across canvas
  stars = Array.from({ length: STAR_COUNT }, () =>
    new Star(p, p.random(p.width), p.random(p.height))
  );

  lifetime   = p.height;
  target     = new Antibiotic(p, p.width / 2, 50, 36, 36, p.color(255, 200, 220, 200));
  population = new Population(p, POP_SIZE, MUTATION_RATE, lifetime);
};
```
*— `src/week6/sketch.js:42-58` (`p.setup`)*

**The frame begins with a low-alpha wash.** This is what creates the bioluminescent trail aesthetic — old pixels decay over a few frames instead of being wiped:

```javascript
p.background(5, 5, 18, 40);
```
*— `src/week6/sketch.js:62`*

**Mandelbrot subsystem — slow background texture.** Three columns per frame go into the off-screen buffer; `display()` blits the whole buffer to the canvas:

```javascript
mandelbrot.renderColumns(3);
mandelbrot.display();
```
*— `src/week6/sketch.js:65-66`*

**Flow field — animated each frame.** The arrow overlay is gated behind the `showFlow` toggle so the field is invisible by default:

```javascript
flowfield.update();
if (showFlow) flowfield.display(25);
```
*— `src/week6/sketch.js:69-70`*

**Star particles — spawn, then update/draw/cull in a single backward loop.** Backward iteration lets us `splice` dead stars without messing up indices:

```javascript
for (let i = 0; i < SPAWN_RATE; i++) {
  stars.push(new Star(p, p.random(p.width), p.random(p.height)));
}
for (let i = stars.length - 1; i >= 0; i--) {
  const s = stars[i];
  s.follow(flowfield);
  s.update();
  s.display();
  if (s.dead) stars.splice(i, 1);
}
```
*— `src/week6/sketch.js:73-82`*

**Evolving population — two-phase loop.** The same `lifeCounter < lifetime` ↔ `evolve()` switch from Week 5, but slimmer because there are no obstacles:

```javascript
target.display();
if (lifeCounter < lifetime) {
  population.live(target);
  lifeCounter++;
} else {
  lifeCounter = 0;
  population.evolve();
}
```
*— `src/week6/sketch.js:85-92`*

The capstone `Population.evolve()` collapses fitness, selection, and reproduction into one method (Week 5 split them):

```javascript
evolve() {
  for (const v of this.population) v.calcFitness();

  // Build mating pool
  this.matingPool = [];
  const maxFit = this.population.reduce((m, v) => Math.max(m, v.getFitness()), 0);
  for (const v of this.population) {
    const n = Math.floor(this.p.map(v.getFitness(), 0, maxFit, 0, 100));
    for (let j = 0; j < n; j++) this.matingPool.push(v);
  }
  // ... reproduce ...
}
```
*— `src/week6/Population.js:47-56` (`evolve`)*

**Drifting target — two uncorrelated Perlin walks.** The `+ 50` y-offset is the canonical p5 trick for decorrelation. `0.003` is slow enough that the population can almost keep up:

```javascript
const tx = p.noise(p.frameCount * 0.003)       * (p.width  - 80) + 40;
const ty = p.noise(p.frameCount * 0.003 + 50)  * (p.height / 3);
target.pos.set(tx, ty);
```
*— `src/week6/sketch.js:95-97`*

**HUD — drawn last so it sits on top.** A single line of monospace text with current counts:

```javascript
const drawHUD = () => {
  p.fill(140, 180, 200, 200);
  p.noStroke();
  p.textSize(11);
  p.text(`Stars: ${stars.length}  |  Gen: ${population.getGenerations()}  |  [F] flow  [R] reset fractal`, 12, p.height - 10);
};
```
*— `src/week6/sketch.js:111-116`*

**Event handlers — flag toggles and pointer events.** No frame-loop logic lives here:

```javascript
p.keyPressed = () => {
  if (p.key === 'f' || p.key === 'F') showFlow = !showFlow;
  if (p.key === 'r' || p.key === 'R') mandelbrot.reset();
};

p.mousePressed = () => {
  target.pos.set(p.mouseX, p.mouseY);
};
```
*— `src/week6/sketch.js:102-109`*

**The bottom of the file — instantiation.** Without this line, `sketch` is just a function that nothing calls:

```javascript
new p5(sketch);
```
*— `src/week6/sketch.js:119`*

## 5. Try it

<details><summary>Hint — Slow the universe down</summary>
Add `p.frameRate(15)` at the end of `setup()`. Every subsystem now runs at one quarter speed. Watch the GA struggle (it has the same number of generations per minute, but you see them more clearly).
</details>

<details><summary>Hint — Make the Mandelbrot regenerate</summary>
Inside the `else` branch (after `population.evolve()`), call `mandelbrot.reset()`. The fractal now redraws after every generation — a slow visual heartbeat synced to evolution.
</details>

<details><summary>Hint — Couple the flow field to the GA</summary>
Make the flow field's `zoff` increment proportional to `population.getGenerations()`. The current speeds up as evolution progresses. This is the kind of cross-subsystem coupling the modular architecture makes trivial.
</details>

## 6. Going further
- Shiffman, Daniel. *The Nature of Code* (2024). Chapters 4–9. https://natureofcode.com/
- The Coding Train — *Nature of Code 2*. https://thecodingtrain.com/tracks/the-nature-of-code-2
- Sims, Karl (1994). "Evolving Virtual Creatures". SIGGRAPH. https://www.karlsims.com/papers/siggraph94.pdf
- Reynolds, Craig W. (1999). "Steering Behaviors For Autonomous Characters". https://www.red3d.com/cwr/steer/
- Perlin, Ken (1985). "An image synthesizer". SIGGRAPH.
- p5.js Reference — instance mode. https://p5js.org/reference/#/p5/p5
