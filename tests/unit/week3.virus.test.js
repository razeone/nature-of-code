import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import Virus from '../../src/week3/Virus.js';

describe('week3 / Virus', () => {
  // Regression guard for `p5 is not defined` in seek() (p5.Vector.sub)
  it('seek() applies a finite steering force toward the target', () => {
    const p = createP5Stub();
    const v = new Virus(p, 0, 0);
    const target = p.createVector(0, 300);
    expect(() => v.seek(target)).not.toThrow();
    expect(Number.isFinite(v.acc.x)).toBe(true);
    expect(Number.isFinite(v.acc.y)).toBe(true);
    expect(v.acc.y).toBeGreaterThan(0);
    expect(v.acc.mag()).toBeLessThanOrEqual(v.maxforce + 1e-9);
  });

  it('update() integrates and respects maxspeed', () => {
    const p = createP5Stub();
    const v = new Virus(p, 0, 0);
    v.applyForce(p.createVector(100, 0));
    v.update();
    expect(v.vel.mag()).toBeLessThanOrEqual(v.maxspeed + 1e-9);
  });
});
