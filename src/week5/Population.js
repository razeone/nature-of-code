import Virus from './Virus.js';
import DNA   from './DNA.js';

/**
 * @class Population
 * @description Manages a generation of Virus agents through the full
 *              evolutionary cycle: live → fitness → selection → reproduction.
 */
export default class Population {
  /**
   * @param {p5}    p            - p5 instance
   * @param {number} mutationRate - probability of gene mutation [0, 1]
   * @param {number} size         - number of individuals
   * @param {number} lifetime     - ticks per generation
   */
  constructor(p, mutationRate, size, lifetime) {
    this.p = p;
    this.mutationRate = mutationRate;
    this.lifetime     = lifetime;
    this.generations  = 0;
    this.matingPool   = [];

    const start = p.createVector(p.width / 2, p.height + 20);
    this.population = Array.from({ length: size }, () =>
      new Virus(p, start, new DNA(p, lifetime), lifetime)
    );
  }

  /**
   * Simulate one tick for all individuals.
   * @param {import('./Antibiotic.js').default[]} obstacles
   * @param {import('./Antibiotic.js').default}   target
   */
  live(obstacles, target) {
    for (const v of this.population) {
      v.checkTarget(target);
      v.run(obstacles, target);
    }
  }

  /** Calculate fitness for every individual. */
  fitness() {
    for (const v of this.population) v.calcFitness();
  }

  /** Build the mating pool weighted by normalised fitness. */
  selection() {
    this.matingPool = [];
    const maxFit = this.#getMaxFitness();

    for (const v of this.population) {
      const normalised = this.p.map(v.getFitness(), 0, maxFit, 0, 1);
      const entries    = Math.floor(normalised * 100);
      for (let j = 0; j < entries; j++) this.matingPool.push(v);
    }
  }

  /** Create the next generation via crossover + mutation. */
  reproduction() {
    const start = this.p.createVector(this.p.width / 2, this.p.height + 20);

    this.population = this.population.map(() => {
      const mom = this.matingPool[Math.floor(this.p.random(this.matingPool.length))];
      const dad = this.matingPool[Math.floor(this.p.random(this.matingPool.length))];
      const childDNA = mom.getDNA().crossover(dad.getDNA());
      childDNA.mutate(this.mutationRate);
      return new Virus(this.p, start, childDNA, this.lifetime);
    });

    this.generations++;
  }

  /** @returns {boolean} */
  targetReached() {
    return this.population.some((v) => v.hitTarget);
  }

  /** @returns {number} */
  getGenerations() { return this.generations; }

  /** @returns {number} */
  #getMaxFitness() {
    return this.population.reduce((max, v) => Math.max(max, v.getFitness()), 0);
  }
}
