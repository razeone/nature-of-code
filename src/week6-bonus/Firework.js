/**
 * @class Firework
 * @description A "shell" particle that rises and then explodes into many
 *              child Particles. Demonstrates composition of objects under
 *              shared forces.
 */
import p5 from 'p5';
import Particle from './Particle.js';

export default class Firework {
  /**
   * @param {p5}     p
   * @param {number} x
   * @param {number} hue
   */
  constructor(p, x, hue) {
    this.p     = p;
    this.shell = new Particle(p, x, p.height, hue);
    this.shell.vel = p.createVector(p.random(-1, 1), p.random(-14, -10));
    this.shell.size = 4;
    this.exploded  = false;
    this.children  = [];
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
      this.children = this.children.filter((c) => !c.isDead());
    }
  }

  explode() {
    const p = this.p;
    this.exploded = true;
    const count = p.floor(p.random(40, 90));
    for (let i = 0; i < count; i++) {
      const child = new Particle(p, this.shell.pos.x, this.shell.pos.y, this.hue);
      // Shoot outward in every direction.
      child.vel  = p5.Vector.fromAngle(p.random(p.TWO_PI)).mult(p.random(1, 6));
      child.size = p.random(2, 4);
      this.children.push(child);
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
