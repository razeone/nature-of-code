import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import Star from '../../src/week2/Star.js';

describe('week2 / Star', () => {
  it('constructs with vectors at the given position', () => {
    const p = createP5Stub();
    const star = new Star(p, 50, 100, 200, 14, 28, 18, -0.5);
    expect(star.pos.x).toBe(100);
    expect(star.pos.y).toBe(200);
    expect(star.mass).toBe(50);
    expect(star.vel.x).toBe(0);
    expect(star.vel.y).toBe(0);
  });

  // Regression guard for `p5 is not defined` in Star.js#applyForce
  it('applies a force using a = F / m without throwing', () => {
    const p = createP5Stub();
    const star = new Star(p, 10, 0, 0, 14, 28, 18, -0.5);
    const force = p.createVector(20, 50);
    expect(() => star.applyForce(force)).not.toThrow();
    // a = F / m  →  (2, 5)
    expect(star.acc.x).toBeCloseTo(2);
    expect(star.acc.y).toBeCloseTo(5);
  });

  it('integrates velocity and position on update()', () => {
    const p = createP5Stub();
    const star = new Star(p, 1, 0, 0, 14, 28, 18, -0.5);
    star.applyForce(p.createVector(2, 3));
    star.update();
    expect(star.vel.x).toBeCloseTo(2);
    expect(star.vel.y).toBeCloseTo(3);
    expect(star.pos.x).toBeCloseTo(2);
    expect(star.pos.y).toBeCloseTo(3);
    expect(star.acc.x).toBe(0);
    expect(star.acc.y).toBe(0);
  });

  it('bounces off the bottom edge with dampening', () => {
    const p = createP5Stub({ height: 400 });
    const star = new Star(p, 1, 0, 500, 14, 28, 18, -0.6);
    star.vel.y = 8;
    star.checkEdges();
    expect(star.vel.y).toBeCloseTo(8 * -0.6);
    expect(star.pos.y).toBe(400 - 28);
  });
});
