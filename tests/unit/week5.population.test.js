import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import Population from '../../src/week5/Population.js';
import Antibiotic from '../../src/week5/Antibiotic.js';

describe('week5 / Population', () => {
  // Indirectly guards DNA's `p5 is not defined` bug because Population
  // builds Virus → DNA in its constructor.
  it('constructs a population of the requested size without throwing', () => {
    const p = createP5Stub();
    const pop = new Population(p, 0.01, 10, 50);
    expect(pop.population.length).toBe(10);
    expect(pop.getGenerations()).toBe(0);
  });

  it('selection() builds a non-empty mating pool when at least one virus has positive fitness', () => {
    const p = createP5Stub();
    const pop = new Population(p, 0.01, 6, 20);
    pop.population.forEach((v, i) => { v.fitness = i + 1; });
    pop.selection();
    expect(pop.matingPool.length).toBeGreaterThan(0);
  });

  it('reproduction() advances the generation counter and replaces the population', () => {
    const p = createP5Stub();
    const pop = new Population(p, 0.0, 6, 20);
    pop.population.forEach((v, i) => { v.fitness = i + 1; });
    pop.selection();
    const oldRefs = [...pop.population];
    pop.reproduction();
    expect(pop.getGenerations()).toBe(1);
    expect(pop.population.length).toBe(6);
    for (const v of pop.population) {
      expect(oldRefs).not.toContain(v);
    }
  });

  it('targetReached() reflects whether any virus hit the target', () => {
    const p = createP5Stub();
    const pop = new Population(p, 0.01, 4, 20);
    expect(pop.targetReached()).toBe(false);
    pop.population[2].hitTarget = true;
    expect(pop.targetReached()).toBe(true);
  });

  it('Antibiotic.contains uses ellipse hit-test', () => {
    const p = createP5Stub();
    const a = new Antibiotic(p, 100, 100, 40, 20, 'red');
    expect(a.contains(p.createVector(100, 100))).toBe(true);
    expect(a.contains(p.createVector(119, 100))).toBe(true);
    expect(a.contains(p.createVector(140, 100))).toBe(false);
    expect(a.contains(p.createVector(100, 111))).toBe(false);
  });
});
