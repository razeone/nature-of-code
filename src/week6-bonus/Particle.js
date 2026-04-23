/**
 * @class Particle
 * @description A single particle: position, velocity, acceleration, lifespan.
 *              The "trail" effect is produced by never fully clearing the
 *              background in the sketch.
 */
export default class Particle {
  /**
   * @param {p5}     p
   * @param {number} x
   * @param {number} y
   * @param {number} hue
   */
  constructor(p, x, y, hue) {
    this.p   = p;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(p.random(-1, 1), p.random(-6, -2));
    this.acc = p.createVector(0, 0);
    this.lifespan = 255;
    this.hue  = hue;
    this.size = p.random(2, 5);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 3;
  }

  display() {
    const p = this.p;
    p.noStroke();
    p.fill(this.hue, 90, 100, this.lifespan / 255);
    p.circle(this.pos.x, this.pos.y, this.size);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}
