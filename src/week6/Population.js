import DNA from '../week5/DNA.js';
import Virus from '../week5/Virus.js';

/**
 * @class Population  (Week 6 — Viral Bloom)
 * @description A simplified population of evolving viruses used as
 *              decorative glowing entities. Fitness is based on proximity
 *              to a target, and the population evolves each generation.
 */
export default class Population {
  /**
   * @param {p5}    p            - p5 instance
   * @param {number} size         - number of individuals
   * @param {number} mutationRate - gene mutation probability
   * @param {number} lifetime     - ticks per generation
   */
  constructor(p, size, mutationRate, lifetime) {
    this.p = p;
    this.size         = size;
    this.mutationRate = mutationRate;
    this.lifetime     = lifetime;
    this.generations  = 0;
    this.matingPool   = [];
    this.population   = this.#spawn();
  }

  #spawn() {
    const p = this.p;
    const start = p.createVector(p.width / 2, p.height - 20);
    return Array.from({ length: this.size }, () =>
      new Virus(p, start, new DNA(p, this.lifetime), this.lifetime)
    );
  }

  /**
   * Run one tick. Agents are drawn by this class (no obstacles in capstone).
   * @param {import('../week5/Antibiotic.js').default} target
   */
  live(target) {
    for (const v of this.population) {
      v.checkTarget(target);
      v.run([], target); // no obstacles
    }
  }

  /** Evaluate → select → reproduce. */
  evolve() {
    for (const v of this.population) v.calcFitness();

    // Build mating pool
    this.matingPool = [];
    const maxFit = this.population.reduce((m, v) => Math.max(m, v.getFitness()), 0);
    for (const v of this.population) {
      const n = Math.floor(this.p.map(v.getFitness(), 0, maxFit, 0, 100));
      for (let j = 0; j < n; j++) this.matingPool.push(v);
    }

    // Reproduce
    const start = this.p.createVector(this.p.width / 2, this.p.height - 20);
    this.population = this.population.map(() => {
      const m = this.matingPool[Math.floor(this.p.random(this.matingPool.length))];
      const d = this.matingPool[Math.floor(this.p.random(this.matingPool.length))];
      if (!m || !d) return new Virus(this.p, start, new DNA(this.p, this.lifetime), this.lifetime);
      const childDNA = m.getDNA().crossover(d.getDNA());
      childDNA.mutate(this.mutationRate);
      return new Virus(this.p, start, childDNA, this.lifetime);
    });

    this.generations++;
  }

  getGenerations() { return this.generations; }
}
