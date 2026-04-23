// Craig Reynolds' Boids — three simple rules produce emergent flocking.
//   separation: avoid crowding close neighbors
//   alignment:  steer toward the average heading of neighbors
//   cohesion:   steer toward the average position of neighbors
class Boid {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 4));
    this.acc = createVector();
    this.r = 3;
    this.maxSpeed = 4;
    this.maxForce = 0.15;
    this.hue = random(180, 260);
  }

  edges() {
    // Wrap around — keeps the flock on screen without a hard bounce.
    if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    if (this.pos.y < -this.r) this.pos.y = height + this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
  }

  // Steer toward an arbitrary target (used for the mouse attractor).
  seek(target, weight = 1) {
    const desired = p5.Vector.sub(target, this.pos).setMag(this.maxSpeed);
    const steer = p5.Vector.sub(desired, this.vel).limit(this.maxForce).mult(weight);
    this.acc.add(steer);
  }

  flock(others, weights) {
    const perception = 60;
    const desiredSeparation = 24;
    let sep = createVector(), ali = createVector(), coh = createVector();
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

  update() {
    this.vel.add(this.acc).limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    const angle = this.vel.heading() + HALF_PI;
    noStroke();
    fill(this.hue, 70, 95, 0.9);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    triangle(0, -this.r * 2, -this.r, this.r * 2, this.r, this.r * 2);
    pop();
  }
}
