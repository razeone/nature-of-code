/**
 * @class Emitter
 * @description A slow emitter at a target point that leaks glowing embers.
 *              Shows how a "system" just composes many Particles under
 *              shared forces.
 */
import Particle from './Particle.js';

export default class Emitter {
  /** @param {p5} p */
  constructor(p) {
    this.p = p;
    this.particles = [];
  }

  spawn(x, y) {
    const p = this.p;
    const ember = new Particle(p, x, y, p.random(20, 60));
    ember.vel  = p.createVector(p.random(-0.6, 0.6), p.random(-1.4, -0.2));
    ember.size = p.random(1, 3);
    ember.lifespan = 180;
    this.particles.push(ember);
  }

  /** @param {p5.Vector[]} forces */
  run(forces) {
    for (const part of this.particles) {
      for (const f of forces) part.applyForce(f);
      part.update();
      part.display();
    }
    this.particles = this.particles.filter((p) => !p.isDead());
  }
}
