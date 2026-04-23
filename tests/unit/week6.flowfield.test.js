import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import FlowField from '../../src/week6/FlowField.js';

describe('week6 / FlowField', () => {
  // Regression guard for `p5 is not defined` in FlowField#update (p5.Vector.fromAngle)
  it('update() populates the grid with unit vectors', () => {
    const p = createP5Stub({ width: 200, height: 100 });
    const ff = new FlowField(p, 20);
    expect(() => ff.update()).not.toThrow();
    expect(ff.cols).toBe(10);
    expect(ff.rows).toBe(5);
    for (let i = 0; i < ff.cols; i++) {
      for (let j = 0; j < ff.rows; j++) {
        expect(ff.field[i][j].mag()).toBeCloseTo(1, 5);
      }
    }
  });

  it('lookup() returns a copy and clamps out-of-bounds positions', () => {
    const p = createP5Stub({ width: 200, height: 100 });
    const ff = new FlowField(p, 20);
    ff.update();
    const v = ff.lookup(p.createVector(35, 45));
    expect(v).not.toBe(ff.field[1][2]);
    expect(() => ff.lookup(p.createVector(-50, -50))).not.toThrow();
    expect(() => ff.lookup(p.createVector(9999, 9999))).not.toThrow();
  });

  it('update() advances the time offset on each call', () => {
    const p = createP5Stub({ width: 100, height: 100 });
    const ff = new FlowField(p, 20);
    const z0 = ff.zoff;
    ff.update();
    expect(ff.zoff).toBeGreaterThan(z0);
  });
});
