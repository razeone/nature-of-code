import p5 from 'p5';
import Boid from './Boid.js';

/**
 * Week 7 — Flocking (Boids)
 *
 * Builds on week 3's steering behaviors by adding group perception.
 * The "flock" emerges from three weighted rules — try tweaking the weights.
 */

const sketch = (p) => {
  let boids = [];
  const weights = { separation: 1.6, alignment: 1.0, cohesion: 1.0 };
  let trails = true;

  const reset = (n) => {
    boids = [];
    for (let i = 0; i < n; i++) {
      boids.push(new Boid(p, p.random(p.width), p.random(p.height)));
    }
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 1);
    reset(160);
  };

  p.draw = () => {
    if (trails) p.background(220, 40, 5, 0.12);
    else p.background(220, 40, 5);

    const mouse = p.createVector(p.mouseX, p.mouseY);
    for (const b of boids) {
      b.flock(boids, weights);
      // A soft pull toward the mouse — try commenting this out.
      b.seek(mouse, 0.4);
      b.edges();
      b.update();
      b.display();
    }

    drawHud();
  };

  const drawHud = () => {
    p.noStroke();
    p.fill(0, 0, 100, 0.7);
    p.textFont('monospace', 12);
    const y = 20;
    p.text(`boids: ${boids.length}`, 12, y);
    p.text(`separation: ${weights.separation.toFixed(2)} (1/Shift+1)`, 12, y + 16);
    p.text(`alignment:  ${weights.alignment.toFixed(2)} (2/Shift+2)`, 12, y + 32);
    p.text(`cohesion:   ${weights.cohesion.toFixed(2)} (3/Shift+3)`, 12, y + 48);
  };

  p.mousePressed = () => {
    for (let i = 0; i < 15; i++) boids.push(new Boid(p, p.mouseX, p.mouseY));
  };

  p.keyPressed = () => {
    const step = p.keyIsDown(p.SHIFT) ? -0.2 : 0.2;
    if (p.key === '1') weights.separation = p.max(0, weights.separation + step);
    if (p.key === '2') weights.alignment  = p.max(0, weights.alignment  + step);
    if (p.key === '3') weights.cohesion   = p.max(0, weights.cohesion   + step);
    if (p.key === 'r' || p.key === 'R') reset(160);
    if (p.key === 't' || p.key === 'T') trails = !trails;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
