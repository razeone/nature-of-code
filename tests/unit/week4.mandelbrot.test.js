import { describe, it, expect } from 'vitest';
import { createP5Stub } from '../helpers/p5Stub.js';
import Mandelbrot from '../../src/week4/Mandelbrot.js';

describe('week4 / Mandelbrot', () => {
  it('builds a palette sized maxIterations + 1 with black at the interior index', () => {
    const p = createP5Stub({ width: 100, height: 100 });
    const m = new Mandelbrot(p, 32);
    expect(m.palette.length).toBeGreaterThanOrEqual(33);
    const interior = m.palette[32];
    expect(interior.r).toBe(0);
    expect(interior.g).toBe(0);
    expect(interior.b).toBe(0);
  });

  it('renderColumn() advances currentX and eventually reports done', () => {
    const p = createP5Stub({ width: 4, height: 4 });
    const m = new Mandelbrot(p, 16);
    expect(m.done).toBe(false);
    let done = false;
    let safety = 0;
    while (!done && safety++ < 100) done = m.renderColumn();
    expect(done).toBe(true);
    expect(m.done).toBe(true);
    expect(m.currentX).toBeGreaterThanOrEqual(p.width);
  });

  it('reset() rewinds the rendering cursor', () => {
    const p = createP5Stub({ width: 2, height: 2 });
    const m = new Mandelbrot(p, 8);
    m.renderColumn();
    m.renderColumn();
    expect(m.currentX).toBe(2);
    m.reset();
    expect(m.currentX).toBe(0);
    expect(m.done).toBe(false);
  });
});
