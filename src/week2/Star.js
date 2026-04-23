/**
 * @class Star
 * @description A star-shaped physics body with mass, position, velocity and
 *              acceleration. Applies Newton's 2nd law (F = ma). Bounces off
 *              the bottom edge with dampening.
 */
import p5 from 'p5';

export default class Star {
  /**
   * @param {p5}    p         - p5 instance
   * @param {number} mass     - mass of the star (affects gravity response)
   * @param {number} x        - initial x position
   * @param {number} y        - initial y position
   * @param {number} r1       - inner radius of the star
   * @param {number} r2       - outer radius of the star
   * @param {number} npoints  - number of star points
   * @param {number} dampening - velocity multiplier on floor bounce (negative to reverse, < 1 to lose energy)
   */
  constructor(p, mass, x, y, r1, r2, npoints, dampening) {
    this.p = p;
    this.mass = mass;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.r1 = r1;
    this.r2 = r2;
    this.npoints = npoints;
    this.dampening = dampening; // e.g. -0.6

    // Tint color chosen randomly at birth
    this.col = p.color(p.random(100, 255), p.random(100, 200), p.random(200, 255), 200);
  }

  /**
   * Apply a force using Newton's 2nd law: a = F / m.
   * @param {p5.Vector} force
   */
  applyForce(force) {
    const f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  /** Integrate velocity and position, then clear acceleration. */
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  /** Bounce off the bottom edge with dampening. */
  checkEdges() {
    if (this.pos.y > this.p.height - this.r2) {
      this.vel.y *= this.dampening;
      this.pos.y = this.p.height - this.r2;
    }
  }

  /** Draw the star shape. */
  display() {
    const p = this.p;
    const angle = p.TWO_PI / this.npoints;
    const halfAngle = angle / 2;

    p.fill(this.col);
    p.stroke(255, 80);
    p.strokeWeight(1);

    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      const sx = this.pos.x + p.cos(a) * this.r2;
      const sy = this.pos.y + p.sin(a) * this.r2;
      p.vertex(sx, sy);
      const ix = this.pos.x + p.cos(a + halfAngle) * this.r1;
      const iy = this.pos.y + p.sin(a + halfAngle) * this.r1;
      p.vertex(ix, iy);
    }
    p.endShape(p.CLOSE);
  }
}
