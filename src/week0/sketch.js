import p5 from 'p5';

/**
 * Week 0 — JS & p5.js Foundations
 * Interactive demo: a bouncing particle that follows the mouse.
 * Displays live stats: frameCount, frameRate, position, velocity.
 */

class Particle {
  /**
   * @param {p5} p - p5 instance
   * @param {number} x - initial x position
   * @param {number} y - initial y position
   */
  constructor(p, x, y) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(p.random(-2, 2), p.random(-2, 2));
    this.acc = p.createVector(0, 0);
    this.radius = 20;
    this.hue = p.random(360);
  }

  /** Steer toward the mouse with a gentle attraction force. */
  attractToMouse() {
    const mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
    const desired = p5.Vector.sub(mouse, this.pos);
    const d = desired.mag();

    // Only attract when mouse is on canvas
    if (d > 1) {
      desired.setMag(this.p.map(d, 0, 400, 0, 4));
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(0.2);
      this.acc.add(steer);
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(6);
    this.pos.add(this.vel);
    this.acc.mult(0); // reset acceleration each frame

    // Bounce off edges
    if (this.pos.x < this.radius || this.pos.x > this.p.width - this.radius) {
      this.vel.x *= -1;
      this.pos.x = this.p.constrain(this.pos.x, this.radius, this.p.width - this.radius);
    }
    if (this.pos.y < this.radius || this.pos.y > this.p.height - this.radius) {
      this.vel.y *= -1;
      this.pos.y = this.p.constrain(this.pos.y, this.radius, this.p.height - this.radius);
    }

    // Slowly shift hue
    this.hue = (this.hue + 0.5) % 360;
  }

  display() {
    const p = this.p;
    p.colorMode(p.HSB, 360, 100, 100, 100);

    // Glow ring
    p.noFill();
    for (let i = 4; i >= 1; i--) {
      p.stroke(this.hue, 80, 100, 20 * i);
      p.strokeWeight(i * 2);
      p.ellipse(this.pos.x, this.pos.y, this.radius * 2 + i * 8);
    }

    // Body
    p.fill(this.hue, 70, 95, 90);
    p.noStroke();
    p.ellipse(this.pos.x, this.pos.y, this.radius * 2);

    // Velocity vector arrow
    p.stroke(this.hue, 40, 100, 80);
    p.strokeWeight(2);
    const tip = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, 6));
    p.line(this.pos.x, this.pos.y, tip.x, tip.y);

    p.colorMode(p.RGB, 255);
  }
}

const sketch = (p) => {
  let particle;

  p.setup = () => {
    p.createCanvas(800, 600);
    p.textFont('monospace');
    particle = new Particle(p, p.width / 2, p.height / 2);
  };

  p.draw = () => {
    p.background(10, 10, 26, 30); // slight trail effect

    particle.attractToMouse();
    particle.update();
    particle.display();

    drawHUD();
  };

  /** Heads-up display showing live debug info. */
  const drawHUD = () => {
    p.fill(180, 200, 220);
    p.noStroke();
    p.textSize(12);

    const lines = [
      `frameCount : ${p.frameCount}`,
      `frameRate  : ${p.frameRate().toFixed(1)} fps`,
      `pos        : (${particle.pos.x.toFixed(1)}, ${particle.pos.y.toFixed(1)})`,
      `vel        : (${particle.vel.x.toFixed(2)}, ${particle.vel.y.toFixed(2)})`,
      `speed      : ${particle.vel.mag().toFixed(2)}`,
      ``,
      `Move mouse to attract particle`,
    ];

    lines.forEach((line, i) => p.text(line, 14, 20 + i * 16));
  };
};

new p5(sketch);
