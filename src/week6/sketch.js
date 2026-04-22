import p5 from 'p5';
import FlowField  from './FlowField.js';
import Star       from './Star.js';
import Population from './Population.js';
import Mandelbrot from './Mandelbrot.js';
import Antibiotic from '../week5/Antibiotic.js';

/**
 * Week 6 — Viral Bloom (Capstone)
 *
 * A bioluminescent generative art scene that combines every technique:
 *
 *  • Perlin noise flow field — glowing directional current visualised
 *    as faint arrows and followed by star particles.
 *  • Star particles — flow-following bioluminescent streamers with trails.
 *  • Evolving virus population — star-shaped agents that evolve DNA to
 *    reach a drifting target antibiotic; brightness reflects fitness.
 *  • Mandelbrot texture — an incrementally-rendered fractal overlay
 *    that adds an organic, cell-like texture in the background.
 *
 * Interactions:
 *  • Click — move the target that the virus population chases.
 *  • Press 'f' — toggle the flow field arrow overlay.
 *  • Press 'r' — restart the Mandelbrot texture render.
 */

const STAR_COUNT    = 120;
const POP_SIZE      = 30;
const MUTATION_RATE = 0.01;
const SPAWN_RATE    = 2;   // number of new stars spawned per frame

const sketch = (p) => {
  let flowfield;
  let stars;
  let population;
  let mandelbrot;
  let target;
  let lifeCounter = 0;
  let lifetime;
  let showFlow = false;

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

  p.draw = () => {
    // Deep dark background with slight persistence for trail effect
    p.background(5, 5, 18, 40);

    // Mandelbrot texture (renders a few columns each frame)
    mandelbrot.renderColumns(3);
    mandelbrot.display();

    // Animated flow field
    flowfield.update();
    if (showFlow) flowfield.display(25);

    // Spawn new stars, cull dead ones
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

    // Evolving virus population
    target.display();
    if (lifeCounter < lifetime) {
      population.live(target);
      lifeCounter++;
    } else {
      lifeCounter = 0;
      population.evolve();
    }

    // Drifting target (slow Perlin noise)
    const tx = p.noise(p.frameCount * 0.003)       * (p.width  - 80) + 40;
    const ty = p.noise(p.frameCount * 0.003 + 50)  * (p.height / 3);
    target.pos.set(tx, ty);

    drawHUD();
  };

  p.keyPressed = () => {
    if (p.key === 'f' || p.key === 'F') showFlow = !showFlow;
    if (p.key === 'r' || p.key === 'R') mandelbrot.reset();
  };

  p.mousePressed = () => {
    target.pos.set(p.mouseX, p.mouseY);
  };

  const drawHUD = () => {
    p.fill(140, 180, 200, 200);
    p.noStroke();
    p.textSize(11);
    p.text(`Stars: ${stars.length}  |  Gen: ${population.getGenerations()}  |  [F] flow  [R] reset fractal`, 12, p.height - 10);
  };
};

new p5(sketch);
