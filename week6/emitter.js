// A slow emitter at the mouse that leaks glowing embers.
// Shows how a "system" just composes many Particles under shared forces.
class Emitter {
  constructor() {
    this.particles = [];
  }

  spawn(x, y) {
    const p = new Particle(x, y, random(20, 60));
    p.vel = createVector(random(-0.6, 0.6), random(-1.4, -0.2));
    p.size = random(1, 3);
    p.lifespan = 180;
    this.particles.push(p);
  }

  run(forces) {
    for (const p of this.particles) {
      for (const f of forces) p.applyForce(f);
      p.update();
      p.display();
    }
    this.particles = this.particles.filter(p => !p.isDead());
  }
}
