import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import FlowField from '../../src/week3/FlowField.js';

describe('week3 / FlowField', () => {
  // Regression guard for `p5 is not defined` in FlowField.js#init
  it('initialises a grid of unit vectors without throwing', () => {
    const p = createP5Stub({ width: 200, height: 100 });
    const ff = new FlowField(p, 20);
    expect(ff.cols).toBe(10);
    expect(ff.rows).toBe(5);
    for (let i = 0; i < ff.cols; i++) {
      for (let j = 0; j < ff.rows; j++) {
        const v = ff.field[i][j];
        expect(typeof v.heading).toBe('function');
        expect(v.mag()).toBeCloseTo(1, 5);
      }
    }
  });

  it('lookup() returns a copy of the cell vector for the given world position', () => {
    const p = createP5Stub({ width: 200, height: 100 });
    const ff = new FlowField(p, 20);
    const v = ff.lookup(p.createVector(35, 45));
    expect(v).not.toBe(ff.field[1][2]);
    expect(v.x).toBeCloseTo(ff.field[1][2].x);
    expect(v.y).toBeCloseTo(ff.field[1][2].y);
  });

  it('lookup() clamps out-of-bounds positions to the grid edges', () => {
    const p = createP5Stub({ width: 200, height: 100 });
    const ff = new FlowField(p, 20);
    expect(() => ff.lookup(p.createVector(-50, -50))).not.toThrow();
    expect(() => ff.lookup(p.createVector(9999, 9999))).not.toThrow();
  });
});
