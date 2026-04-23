import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import Liquid from '../../src/week3/Liquid.js';

describe('week3 / Liquid', () => {
  it('contains() detects whether a mover is inside the rect', () => {
    const p = createP5Stub();
    const l = new Liquid(p, 0, 300, 800, 300, 0.08);
    expect(l.contains({ pos: { x: 100, y: 400 } })).toBe(true);
    expect(l.contains({ pos: { x: 100, y: 100 } })).toBe(false);
  });

  it('calculateDrag returns a force opposite to velocity with magnitude c·v²', () => {
    const p = createP5Stub();
    const l = new Liquid(p, 0, 0, 800, 600, 0.08);
    const mover = { vel: p.createVector(3, 4) };
    const drag = l.calculateDrag(mover);
    expect(drag.mag()).toBeCloseTo(0.08 * 25, 5);
    expect(Math.sign(drag.x)).toBe(-1);
    expect(Math.sign(drag.y)).toBe(-1);
  });
});
