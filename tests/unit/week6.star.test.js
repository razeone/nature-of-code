import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import Star from '../../src/week6/Star.js';

describe('week6 / Star (bioluminescent particle)', () => {
  it('constructs with a positioned vector and finite velocity', () => {
    const p = createP5Stub();
    const s = new Star(p, 100, 200);
    expect(s.pos.x).toBe(100);
    expect(s.pos.y).toBe(200);
    expect(Number.isFinite(s.vel.x)).toBe(true);
    expect(Number.isFinite(s.vel.y)).toBe(true);
    expect(s.dead).toBe(false);
    expect(s.lifespan).toBeGreaterThan(0);
  });

  // Regression guard for `p5 is not defined` in follow() (p5.Vector.sub)
  it('follow() applies a finite steering force from a flow-field vector', () => {
    const p = createP5Stub();
    const s = new Star(p, 50, 50);
    const fakeField = { lookup: () => p.createVector(1, 0) };
    expect(() => s.follow(fakeField)).not.toThrow();
    expect(Number.isFinite(s.acc.x)).toBe(true);
    expect(Number.isFinite(s.acc.y)).toBe(true);
    expect(s.acc.mag()).toBeLessThanOrEqual(0.3 + 1e-9);
  });

  it('update() decays lifespan and wraps around edges', () => {
    const p = createP5Stub({ width: 100, height: 100 });
    const s = new Star(p, 50, 50);
    const initial = s.lifespan;
    s.update();
    expect(s.lifespan).toBeLessThan(initial);

    s.pos.x = -10;
    s.update();
    expect(s.pos.x).toBeGreaterThan(50);
  });

  it('eventually reports dead', () => {
    const p = createP5Stub();
    const s = new Star(p, 0, 0);
    s.lifespan = 0.5;
    s.update();
    expect(s.dead).toBe(true);
  });
});
