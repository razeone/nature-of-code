// A single particle: position, velocity, acceleration, lifespan.
// The "trail" is drawn by never fully clearing the background in sketch.js.
class Particle {
  constructor(x, y, hue) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-6, -2));
    this.acc = createVector(0, 0);
    this.lifespan = 255;
    this.hue = hue;
    this.size = random(2, 5);
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
    noStroke();
    fill(this.hue, 90, 100, this.lifespan / 255);
    circle(this.pos.x, this.pos.y, this.size);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

// A "firework" shell that rises and then explodes into many Particles.
class Firework {
  constructor(x, hue) {
    this.shell = new Particle(x, height, hue);
    this.shell.vel = createVector(random(-1, 1), random(-14, -10));
    this.shell.size = 4;
    this.exploded = false;
    this.children = [];
    this.hue = hue;
  }

  applyForce(f) {
    if (!this.exploded) this.shell.applyForce(f);
    else for (const c of this.children) c.applyForce(f);
  }

  update() {
    if (!this.exploded) {
      this.shell.update();
      if (this.shell.vel.y >= 0) this.explode();
    } else {
      for (const c of this.children) c.update();
      this.children = this.children.filter(c => !c.isDead());
    }
  }

  explode() {
    this.exploded = true;
    const count = floor(random(40, 90));
    for (let i = 0; i < count; i++) {
      const p = new Particle(this.shell.pos.x, this.shell.pos.y, this.hue);
      // Shoot outward in every direction.
      p.vel = p5.Vector.fromAngle(random(TWO_PI)).mult(random(1, 6));
      p.size = random(2, 4);
      this.children.push(p);
    }
  }

  display() {
    if (!this.exploded) this.shell.display();
    else for (const c of this.children) c.display();
  }

  isDone() {
    return this.exploded && this.children.length === 0;
  }
}
