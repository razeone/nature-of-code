import DNA from './DNA.js';

/**
 * @class Virus
 * @description A star-shaped genetic agent. Each Virus carries a DNA object
 *              whose genes are applied as forces every tick. Fitness is
 *              calculated after a generation ends.
 */
export default class Virus {
  /**
   * @param {p5}    p      - p5 instance
   * @param {p5.Vector} location - starting position
   * @param {DNA}   dna    - genetic sequence
   * @param {number} lifetime - ticks per generation (must match DNA length)
   */
  constructor(p, location, dna, lifetime) {
    this.p = p;
    this.acc      = p.createVector(0, 0);
    this.vel      = p.createVector(0, 0);
    this.pos      = p.createVector(location.x, location.y);
    this.r        = 4;
    this.fitness  = 0;
    this.dna      = dna;
    this.lifetime = lifetime;
    this.geneCounter = 0;

    // How close did it get to the target?
    this.recordDist  = 10000;
    this.finishTime  = 0;
    this.hitObstacle = false;
    this.hitTarget   = false;
  }

  /**
   * FITNESS FUNCTION
   * Rewards reaching the target quickly and getting close.
   * Penalises obstacle collisions.
   */
  calcFitness() {
    const dist = Math.max(this.recordDist, 1);
    this.fitness = Math.pow(1 / (this.finishTime * dist), 4);
    if (this.hitObstacle) this.fitness *= 0.1;
    if (this.hitTarget)   this.fitness *= 2;
  }

  /**
   * Run one simulation tick: apply gene force, update physics,
   * check collisions.
   * @param {Antibiotic[]} obstacles
   * @param {Antibiotic}   target
   */
  run(obstacles, target) {
    if (!this.hitObstacle && !this.hitTarget) {
      this.applyForce(this.dna.genes[this.geneCounter % this.dna.genes.length]);
      this.geneCounter++;
      this.update();
      this.#checkObstacles(obstacles);
    }
    if (!this.hitObstacle) this.display();
  }

  /**
   * Update target-tracking bookkeeping.
   * @param {Antibiotic} target
   */
  checkTarget(target) {
    const d = this.p.dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
    if (d < this.recordDist) this.recordDist = d;

    if (target.contains(this.pos) && !this.hitTarget) {
      this.hitTarget = true;
    } else if (!this.hitTarget) {
      this.finishTime++;
    }
  }

  /** @param {p5.Vector} f */
  applyForce(f) { this.acc.add(f); }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  /** @param {Antibiotic[]} obstacles */
  #checkObstacles(obstacles) {
    for (const obs of obstacles) {
      if (obs.contains(this.pos)) this.hitObstacle = true;
    }
  }

  display() {
    const p = this.p;
    const npoints = 10;
    const r1 = 8, r2 = 14;
    const angle = p.TWO_PI / npoints;
    const half  = angle / 2;

    // Colour reflects current fitness (green = high, dark = low)
    const g = p.map(this.fitness, 0, 0.01, 60, 255);
    p.fill(0, p.constrain(g, 60, 255), 0, 200);
    p.noStroke();

    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      p.vertex(this.pos.x + p.cos(a) * r2,       this.pos.y + p.sin(a) * r2);
      p.vertex(this.pos.x + p.cos(a + half) * r1, this.pos.y + p.sin(a + half) * r1);
    }
    p.endShape(p.CLOSE);
  }

  getFitness() { return this.fitness; }
  getDNA()     { return this.dna; }
}
