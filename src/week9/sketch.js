import p5 from 'p5';
import { PRESETS, expand, drawLSystem } from './LSystem.js';

/**
 * Week 9 — L-Systems
 *
 * Recursion as a grammar. Builds naturally on week 4's Mandelbrot —
 * same "self-similar" idea, but here the recursion is encoded in
 * rewrite rules rather than a function call.
 */

const sketch = (p) => {
  let preset = 'plant';
  let iterations = 4;
  let seeds = []; // {x, y, preset, iters, rot}

  const renderAll = () => {
    p.background(160, 40, 5, 1);
    if (seeds.length === 0) {
      // Initial plant in the middle.
      seeds.push({ x: p.width / 2, y: p.height - 20, preset, iters: iterations, rot: 0 });
    }
    for (const s of seeds) {
      const def = PRESETS[s.preset];
      const sent = expand(def.axiom, def.rules, p.min(s.iters, def.maxIter));
      p.push();
      p.translate(s.x, s.y);
      p.rotate(s.rot);
      drawLSystem(p, sent, { step: def.step, angleDeg: def.angle, hueRange: def.hue, jitter: 0.05 });
      p.pop();
    }
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 1);
    p.background(160, 40, 5);
    renderAll();
  };

  p.draw = () => {
    // Static render — only redraw on state change.
    p.noLoop();
  };

  p.mousePressed = () => {
    // Plant where you click. Koch/Sierpinski/dragon don't branch so we don't need to flip them.
    const rot = preset === 'plant' ? 0 : -p.HALF_PI;
    seeds.push({ x: p.mouseX, y: p.mouseY, preset, iters: iterations, rot });
    renderAll();
  };

  p.keyPressed = () => {
    if (p.key === '1') preset = 'plant';
    if (p.key === '2') preset = 'koch';
    if (p.key === '3') preset = 'sierpinski';
    if (p.key === '4') preset = 'dragon';
    if (p.key === '+' || p.key === '=') iterations = p.min(PRESETS[preset].maxIter, iterations + 1);
    if (p.key === '-' || p.key === '_') iterations = p.max(1, iterations - 1);
    if (p.key === 'r' || p.key === 'R') { seeds = []; p.noiseSeed(p.millis()); }
    renderAll();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    renderAll();
  };
};

new p5(sketch);
