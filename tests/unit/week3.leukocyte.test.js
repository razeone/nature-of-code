import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import Leukocyte from '../../src/week3/Leukocyte.js';

describe('week3 / Leukocyte', () => {
  it('constructs with sensible defaults', () => {
    const p = createP5Stub();
    const l = new Leukocyte(p, 100, 200);
    expect(l.pos.x).toBe(100);
    expect(l.pos.y).toBe(200);
    expect(l.maxspeed).toBeGreaterThan(0);
    expect(l.maxforce).toBeGreaterThan(0);
  });

  // Regression guard for `p5 is not defined` in arrive() (p5.Vector.sub)
  it('arrive() applies a finite steering force toward the target', () => {
    const p = createP5Stub();
    const l = new Leukocyte(p, 0, 0);
    const target = p.createVector(300, 0);
    expect(() => l.arrive(target)).not.toThrow();
    expect(Number.isFinite(l.acc.x)).toBe(true);
    expect(Number.isFinite(l.acc.y)).toBe(true);
    expect(l.acc.x).toBeGreaterThan(0);
    expect(l.acc.mag()).toBeLessThanOrEqual(l.maxforce + 1e-9);
  });

  it('arrive() inside the slow radius produces a smaller desired speed', () => {
    const p = createP5Stub();
    const l = new Leukocyte(p, 0, 0);
    l.arrive(p.createVector(5, 0), 100);
    const closeAccMag = l.acc.mag();

    const l2 = new Leukocyte(p, 0, 0);
    l2.arrive(p.createVector(500, 0), 100);
    const farAccMag = l2.acc.mag();

    expect(closeAccMag).toBeLessThan(farAccMag);
  });
});
