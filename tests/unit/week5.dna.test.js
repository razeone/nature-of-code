import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import DNA from '../../src/week5/DNA.js';

describe('week5 / DNA', () => {
  // Regression guard for `p5 is not defined` in DNA constructor (p5.Vector.fromAngle)
  it('constructs with a random gene array of the requested length', () => {
    const p = createP5Stub();
    const dna = new DNA(p, 25);
    expect(dna.genes.length).toBe(25);
    for (const g of dna.genes) {
      expect(Number.isFinite(g.x)).toBe(true);
      expect(Number.isFinite(g.y)).toBe(true);
      expect(g.mag()).toBeLessThanOrEqual(dna.maxforce + 1e-9);
    }
  });

  it('crossover() returns a child whose gene length matches the parents', () => {
    const p = createP5Stub();
    const a = new DNA(p, 12);
    const b = new DNA(p, 12);
    const child = a.crossover(b);
    expect(child).toBeInstanceOf(DNA);
    expect(child.genes.length).toBe(12);
    for (let i = 0; i < 12; i++) {
      expect(child.genes[i]).not.toBe(a.genes[i]);
      expect(child.genes[i]).not.toBe(b.genes[i]);
    }
  });

  // Regression guard for `p5 is not defined` in DNA#mutate (p5.Vector.fromAngle)
  it('mutate(1) replaces every gene with a fresh random vector', () => {
    const p = createP5Stub();
    const dna = new DNA(p, 8);
    const before = dna.genes.map((g) => g.copy());
    expect(() => dna.mutate(1)).not.toThrow();
    let differences = 0;
    for (let i = 0; i < 8; i++) {
      if (dna.genes[i].x !== before[i].x || dna.genes[i].y !== before[i].y) differences++;
    }
    expect(differences).toBeGreaterThan(0);
  });

  it('mutate(0) leaves all genes unchanged', () => {
    const p = createP5Stub();
    const dna = new DNA(p, 8);
    const before = dna.genes.map((g) => g.copy());
    dna.mutate(0);
    for (let i = 0; i < 8; i++) {
      expect(dna.genes[i].x).toBeCloseTo(before[i].x);
      expect(dna.genes[i].y).toBeCloseTo(before[i].y);
    }
  });
});
