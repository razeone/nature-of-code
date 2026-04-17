/**
 * @class Virus
 * @description A star-shaped agent that uses the *seek* steering behavior to
 *              chase a target position. Based on Craig Reynolds' steering formulas.
 */
export default class Virus {
  /**
   * @param {p5}    p       - p5 instance
   * @param {number} x      - initial x position
   * @param {number} y      - initial y position
   * @param {number} r1     - inner star radius
   * @param {number} r2     - outer star radius
   * @param {number} npoints - number of star points
   */
  constructor(p, x, y, r1 = 15, r2 = 20, npoints = 10) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.maxspeed = 3;
    this.maxforce = 0.3;
    this.r1 = r1;
    this.r2 = r2;
    this.npoints = npoints;
    this.mass = 1;

    // Random tint so each virus looks slightly different
    this.hue = p.random(80, 160);
  }

  /**
   * Add a force vector to the accumulator (no mass division — use applyForce for physics).
   * @param {p5.Vector} force
   */
  applyForce(force) {
    this.acc.add(force);
  }

  /**
   * Seek steering: calculate a force that steers this agent toward `target`.
   * @param {p5.Vector} target
   */
  seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxspeed);
    const steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }

  /** Integrate physics and reset acceleration. */
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  /** Render the star shape. */
  display() {
    const p = this.p;
    const angle = p.TWO_PI / this.npoints;
    const half  = angle / 2;

    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.fill(this.hue, 70, 90, 80);
    p.stroke(this.hue, 40, 100, 60);
    p.strokeWeight(1);

    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      p.vertex(this.pos.x + p.cos(a) * this.r2,       this.pos.y + p.sin(a) * this.r2);
      p.vertex(this.pos.x + p.cos(a + half) * this.r1, this.pos.y + p.sin(a + half) * this.r1);
    }
    p.endShape(p.CLOSE);
    p.colorMode(p.RGB, 255);
  }
}
