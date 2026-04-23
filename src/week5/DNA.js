/**
 * @class DNA
 * @description Encodes the genetic sequence of a Virus as an array of force
 *              vectors — one per generation tick (`lifetime`). Supports
 *              single-point crossover and per-gene mutation.
 */
import p5 from 'p5';

export default class DNA {
  /**
   * @param {p5}     p        - p5 instance
   * @param {number} lifetime - number of genes (= number of ticks per generation)
   * @param {number[]} [genes] - pre-built gene array (used by crossover)
   */
  constructor(p, lifetime, genes = null) {
    this.p = p;
    this.lifetime = lifetime;
    this.maxforce = 0.4;

    if (genes) {
      this.genes = genes;
    } else {
      // Random initialisation: each gene is a unit vector scaled by random force
      this.genes = Array.from({ length: lifetime }, () => {
        const v = p5.Vector.fromAngle(p.random(p.TWO_PI));
        v.mult(p.random(0, this.maxforce));
        return v;
      });
    }
  }

  /**
   * Single-point crossover: produce a child that takes genes from
   * `this` up to the midpoint and from `partner` after.
   * @param {DNA} partner
   * @returns {DNA}
   */
  crossover(partner) {
    const midpoint = Math.floor(this.p.random(this.genes.length));
    const childGenes = this.genes.map((gene, i) =>
      i > midpoint ? gene.copy() : partner.genes[i].copy()
    );
    return new DNA(this.p, this.lifetime, childGenes);
  }

  /**
   * Mutate each gene independently with probability `rate`.
   * @param {number} rate - mutation probability [0, 1]
   */
  mutate(rate) {
    this.genes = this.genes.map((gene) => {
      if (this.p.random(1) < rate) {
        const v = p5.Vector.fromAngle(this.p.random(this.p.TWO_PI));
        v.mult(this.p.random(0, this.maxforce));
        return v;
      }
      return gene;
    });
  }
}
