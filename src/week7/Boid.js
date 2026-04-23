/**
 * @class Boid
 * @description A single agent in a Reynolds-style flock. Three local rules
 *              — separation, alignment, cohesion — produce emergent flocking.
 */
import p5 from 'p5';

export default class Boid {
  /**
   * @param {p5}     p - p5 instance
   * @param {number} x - initial x position
   * @param {number} y - initial y position
   */
  constructor(p, x, y) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p5.Vector.random2D().mult(p.random(2, 4));
    this.acc = p.createVector();
    this.r = 3;
    this.maxSpeed = 4;
    this.maxForce = 0.15;
    this.hue = p.random(180, 260);
  }

  /** Toroidal screen wrap — keeps the flock visible without a hard bounce. */
  edges() {
    const { p } = this;
    if (this.pos.x < -this.r)        this.pos.x = p.width + this.r;
    if (this.pos.x > p.width + this.r) this.pos.x = -this.r;
    if (this.pos.y < -this.r)        this.pos.y = p.height + this.r;
    if (this.pos.y > p.height + this.r) this.pos.y = -this.r;
  }

  /**
   * Steer toward an arbitrary target (used for the mouse attractor).
   * @param {p5.Vector} target
   * @param {number}    [weight=1]
   */
  seek(target, weight = 1) {
    const desired = p5.Vector.sub(target, this.pos).setMag(this.maxSpeed);
    const steer = p5.Vector.sub(desired, this.vel).limit(this.maxForce).mult(weight);
    this.acc.add(steer);
  }

  /**
   * Apply Reynolds' three rules using `others` as the neighborhood.
   * @param {Boid[]} others
   * @param {{separation:number,alignment:number,cohesion:number}} weights
   */
  flock(others, weights) {
    const p = this.p;
    const perception = 60;
    const desiredSeparation = 24;
    let sep = p.createVector();
    let ali = p.createVector();
    let coh = p.createVector();
    let sepN = 0, aliN = 0, cohN = 0;

    for (const o of others) {
      if (o === this) continue;
      const d = p5.Vector.dist(this.pos, o.pos);
      if (d > 0 && d < desiredSeparation) {
        const diff = p5.Vector.sub(this.pos, o.pos).div(d);
        sep.add(diff);
        sepN++;
      }
      if (d > 0 && d < perception) {
        ali.add(o.vel);
        coh.add(o.pos);
        aliN++;
        cohN++;
      }
    }

    if (sepN > 0) sep.div(sepN).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce);
    if (aliN > 0) ali.div(aliN).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce);
    if (cohN > 0) {
      coh.div(cohN).sub(this.pos).setMag(this.maxSpeed);
      coh = p5.Vector.sub(coh, this.vel).limit(this.maxForce);
    }

    this.acc.add(sep.mult(weights.separation));
    this.acc.add(ali.mult(weights.alignment));
    this.acc.add(coh.mult(weights.cohesion));
  }

  /** Integrate acceleration into velocity, velocity into position. */
  update() {
    this.vel.add(this.acc).limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  /** Draw the boid as a small triangle pointing along its velocity. */
  display() {
    const p = this.p;
    const angle = this.vel.heading() + p.HALF_PI;
    p.noStroke();
    p.fill(this.hue, 70, 95, 0.9);
    p.push();
    p.translate(this.pos.x, this.pos.y);
    p.rotate(angle);
    p.triangle(0, -this.r * 2, -this.r, this.r * 2, this.r, this.r * 2);
    p.pop();
  }
}
