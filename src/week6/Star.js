/**
 * @class Star  (Week 6 — Viral Bloom)
 * @description A bioluminescent particle that follows the flow field and
 *              fades over its lifetime, trailing a glowing streamer.
 */
export default class Star {
  /**
   * @param {p5}    p    - p5 instance
   * @param {number} x   - initial x
   * @param {number} y   - initial y
   */
  constructor(p, x, y) {
    this.p   = p;
    this.pos = p.createVector(x, y);
    this.vel = p5.Vector.random2D().mult(p.random(0.5, 2));
    this.acc = p.createVector(0, 0);

    this.maxspeed  = p.random(2, 5);
    this.lifespan  = 255;
    this.decay     = p.random(1, 3);

    // Bioluminescent colour (teal / cyan / purple range)
    this.hue = p.random(160, 290);
    this.trail = []; // recent positions for the trail
    this.maxTrail = 12;
  }

  /** @param {p5.Vector} f */
  applyForce(f) { this.acc.add(f); }

  /**
   * Follow the flow field.
   * @param {import('./FlowField.js').default} field
   */
  follow(field) {
    const desired = field.lookup(this.pos);
    desired.setMag(this.maxspeed);
    const steer = p5.Vector.sub(desired, this.vel);
    steer.limit(0.3);
    this.applyForce(steer);
  }

  update() {
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrail) this.trail.shift();

    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= this.decay;

    // Wrap around edges
    const p = this.p;
    if (this.pos.x < 0)         this.pos.x = p.width;
    if (this.pos.x > p.width)   this.pos.x = 0;
    if (this.pos.y < 0)         this.pos.y = p.height;
    if (this.pos.y > p.height)  this.pos.y = 0;
  }

  /** @returns {boolean} */
  get dead() { return this.lifespan <= 0; }

  display() {
    const p = this.p;
    p.colorMode(p.HSB, 360, 100, 100, 255);

    // Glowing trail
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = (i / this.trail.length) * this.lifespan * 0.5;
      p.stroke(this.hue, 80, 90, alpha);
      p.strokeWeight(1.5);
      if (i > 0) {
        p.line(this.trail[i - 1].x, this.trail[i - 1].y, this.trail[i].x, this.trail[i].y);
      }
    }

    // Core dot with outer glow
    p.noStroke();
    p.fill(this.hue, 60, 100, this.lifespan * 0.3);
    p.ellipse(this.pos.x, this.pos.y, 10, 10);
    p.fill(this.hue, 30, 100, this.lifespan);
    p.ellipse(this.pos.x, this.pos.y, 4, 4);

    p.colorMode(p.RGB, 255);
  }
}
