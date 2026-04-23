import p5 from 'p5';
import Grid, { GLIDER_GUN } from './Grid.js';

/**
 * Week 8 — Conway's Game of Life
 *
 * A cellular automaton: simple local rules, complex global behavior.
 * A great first experience with 2D arrays, neighborhoods, and
 * "simulation loops".
 */

const sketch = (p) => {
  let grid;
  const cell = 10;
  let running = true;
  let stepsPerFrame = 2;
  let painting = 0; // 0 = not painting, 1 = painting alive, 2 = painting dead

  const buildGrid = () => {
    const cols = p.floor(p.width  / cell);
    const rows = p.floor(p.height / cell);
    grid = new Grid(cols, rows);
    grid.randomize(0.22);
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 1);
    p.noStroke();
    buildGrid();
  };

  p.draw = () => {
    p.background(220, 40, 6);

    if (running) {
      for (let i = 0; i < stepsPerFrame; i++) grid.step();
    }

    if (painting) {
      const x = p.floor(p.mouseX / cell);
      const y = p.floor(p.mouseY / cell);
      grid.set(x, y, painting === 1 ? 1 : 0);
    }

    // Render the grid. Age shifts hue so stable patterns look different from churn.
    for (let y = 0; y < grid.rows; y++) {
      for (let x = 0; x < grid.cols; x++) {
        const i = y * grid.cols + x;
        if (!grid.cells[i]) continue;
        const age = grid.ages[i];
        const h = (160 + age * 1.5) % 360;
        const b = p.map(p.min(age, 40), 0, 40, 70, 100);
        p.fill(h, 70, b);
        p.rect(x * cell, y * cell, cell - 1, cell - 1);
      }
    }

    drawHud();
  };

  const drawHud = () => {
    p.fill(0, 0, 100, 0.8);
    p.textFont('monospace', 12);
    p.text(`${running ? '▶ running' : '❚❚ paused'}  ·  steps/frame: ${stepsPerFrame}`, 12, 20);
  };

  p.mousePressed = () => {
    painting = p.mouseButton === p.LEFT ? 1 : 2;
  };

  p.mouseReleased = () => {
    painting = 0;
  };

  p.keyPressed = () => {
    if (p.key === ' ') running = !running;
    if (p.key === 'n' || p.key === 'N') grid.step();
    if (p.key === 'r' || p.key === 'R') grid.randomize(0.22);
    if (p.key === 'c' || p.key === 'C') grid.clear();
    if (p.key === 'g' || p.key === 'G') {
      grid.clear();
      grid.stamp(GLIDER_GUN, 5, 5);
    }
    if (p.key === '+' || p.key === '=') stepsPerFrame = p.min(10, stepsPerFrame + 1);
    if (p.key === '-' || p.key === '_') stepsPerFrame = p.max(1, stepsPerFrame - 1);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    buildGrid();
  };
};

new p5(sketch);
