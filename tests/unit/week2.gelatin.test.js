import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import Gelatin from '../../src/week2/Gelatin.js';

describe('week2 / Gelatin', () => {
  it('contains() detects whether a mover lies inside the rect', () => {
    const p = createP5Stub();
    const gel = new Gelatin(p, 100, 200, 300, 100, 0.1);
    expect(gel.contains({ pos: { x: 150, y: 250 } })).toBe(true);
    expect(gel.contains({ pos: { x:  50, y: 250 } })).toBe(false);
    expect(gel.contains({ pos: { x: 150, y:  50 } })).toBe(false);
    expect(gel.contains({ pos: { x: 500, y: 250 } })).toBe(false);
  });

  it('calculateDrag returns a force opposite to velocity with magnitude c·v²', () => {
    const p = createP5Stub();
    const gel = new Gelatin(p, 0, 0, 800, 600, 0.1);
    const mover = { vel: p.createVector(3, 4) }; // |v| = 5
    const drag = gel.calculateDrag(mover);
    expect(drag.mag()).toBeCloseTo(2.5, 5);
    expect(Math.sign(drag.x)).toBe(-1);
    expect(Math.sign(drag.y)).toBe(-1);
  });
});
