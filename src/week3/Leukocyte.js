/**
 * @class Leukocyte
 * @description A circular immune-cell agent that uses the *arrive* steering
 *              behavior — it slows down as it approaches its target.
 */
export default class Leukocyte {
  /**
   * @param {p5}    p - p5 instance
   * @param {number} x - initial x position
   * @param {number} y - initial y position
   */
  constructor(p, x, y) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.maxspeed = 4;
    this.maxforce = 0.25;
    this.r = 6;   // body radius
    this.mass = 1;
  }

  /**
   * Apply a force to the acceleration accumulator.
   * @param {p5.Vector} force
   */
  applyForce(force) {
    this.acc.add(force);
  }

  /**
   * Arrive steering: like seek but slows down within `slowRadius` of the target.
   * @param {p5.Vector} target
   * @param {number} [slowRadius=100]
   */
  arrive(target, slowRadius = 100) {
    const desired = p5.Vector.sub(target, this.pos);
    const d = desired.mag();

    // Scale speed by distance when inside the slow zone
    const speed = d < slowRadius
      ? this.p.map(d, 0, slowRadius, 0, this.maxspeed)
      : this.maxspeed;

    desired.setMag(speed);
    const steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }

  /** Integrate physics and clear accumulator. */
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  /** Render the leukocyte as a white circle with a heading triangle. */
  display() {
    const p = this.p;
    const theta = this.vel.heading() + p.PI / 2;

    // Body
    p.stroke(255, 200);
    p.strokeWeight(2);
    p.fill(255, 180);
    p.ellipse(this.pos.x, this.pos.y, this.r * 2.5, this.r * 2.5);

    // Direction indicator
    p.push();
    p.translate(this.pos.x, this.pos.y);
    p.rotate(theta);
    p.fill(200, 230, 255, 200);
    p.stroke(255, 150);
    p.strokeWeight(1);
    p.beginShape();
    p.vertex(0, -this.r * 2);
    p.vertex(-this.r, this.r * 2);
    p.vertex(this.r, this.r * 2);
    p.endShape(p.CLOSE);
    p.pop();
  }
}
