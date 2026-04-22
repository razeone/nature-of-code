/**
 * Lesson 07 — A Class-Based Moving Object
 *
 * Introduces OOP with a fully-featured Particle class:
 *  • constructor receives p5 instance + initial position
 *  • applyForce (Newton's 2nd law)
 *  • update  (Euler integration)
 *  • display (with velocity arrow & glow)
 *  • wrap-around edges
 *
 * Click to spawn new particles; they drift with a random initial velocity
 * and experience a gentle gravity + Perlin-noise steering force.
 */
import p5 from 'p5';

/**
 * @class Particle
 * @description A physics particle that stores its own p5 instance,
 *              allowing it to call p5 functions without globals.
 */
class Particle {
  /**
   * @param {p5}    p    - p5 instance
   * @param {number} x   - initial x
   * @param {number} y   - initial y
   */
  constructor(p, x, y) {
    this.p    = p;
    this.pos  = p.createVector(x, y);
    this.vel  = p5.Vector.random2D().mult(p.random(1, 3));
    this.acc  = p.createVector(0, 0);
    this.mass = p.random(1, 4);
    this.hue  = p.random(360);
    this.noff = p.random(1000); // unique Perlin noise offset
  }

  /** Apply a force: a = F / m (Newton's 2nd law). */
  applyForce(force) {
    this.acc.add(p5.Vector.div(force, this.mass));
  }

  /** Euler integration: vel += acc; pos += vel; clear acc. */
  update() {
    this.vel.add(this.acc);
    this.vel.limit(6);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.noff += 0.01;

    // Wrap around canvas edges
    const p = this.p;
    if (this.pos.x < 0)        this.pos.x = p.width;
    if (this.pos.x > p.width)  this.pos.x = 0;
    if (this.pos.y < 0)        this.pos.y = p.height;
    if (this.pos.y > p.height) this.pos.y = 0;
  }

  display() {
    const p = this.p;
    p.colorMode(p.HSB, 360, 100, 100, 100);

    const r = 6 + this.mass * 3;

    // Glow layers
    for (let i = 3; i >= 1; i--) {
      p.noStroke();
      p.fill(this.hue, 70, 90, 15 * i);
      p.ellipse(this.pos.x, this.pos.y, (r + i * 6) * 2);
    }

    // Core
    p.fill(this.hue, 60, 100, 90);
    p.ellipse(this.pos.x, this.pos.y, r * 2);

    // Velocity arrow
    const tip = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, 5));
    p.stroke(this.hue, 40, 100, 70);
    p.strokeWeight(1.5);
    p.line(this.pos.x, this.pos.y, tip.x, tip.y);

    p.colorMode(p.RGB, 255);
  }
}

// ---- Sketch ----

const sketch = (p) => {
  const particles = [];
  let noiseOff = 0;

  p.setup = () => {
    p.createCanvas(800, 550);
    p.textFont('monospace');

    // Seed three particles
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(p, p.random(p.width), p.random(p.height)));
    }
  };

  p.draw = () => {
    p.background(8, 10, 24, 50); // trail effect

    for (const pt of particles) {
      // Gravity
      pt.applyForce(p.createVector(0, 0.05 * pt.mass));

      // Perlin noise steering force
      const theta = p.map(p.noise(pt.noff), 0, 1, 0, p.TWO_PI * 2);
      pt.applyForce(p5.Vector.fromAngle(theta).mult(0.1));

      pt.update();
      pt.display();
    }

    // HUD
    p.fill(160, 185, 215);
    p.noStroke();
    p.textSize(12);
    p.text(`Particles: ${particles.length}  |  Click to spawn`, 14, 22);
    p.text(`Each particle has its own mass, hue, and noise offset.`, 14, 40);
  };

  p.mousePressed = () => {
    particles.push(new Particle(p, p.mouseX, p.mouseY));
  };
};

new p5(sketch);
