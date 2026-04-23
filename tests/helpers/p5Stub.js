import p5 from 'p5';

/**
 * Build a minimal stand-in for a p5 instance that supports the surface area
 * the Nature-of-Code class files actually use. All draw/IO calls are no-ops;
 * numeric helpers (random, noise, map, constrain, dist, cos, sin) are real.
 *
 * Vectors come from the real `p5.Vector` static API so any test that exercises
 * physics math against the stub produces real numbers.
 *
 * @param {{width?: number, height?: number, seed?: number}} [opts]
 */
export function createP5Stub({ width = 800, height = 600, seed = 1 } = {}) {
  // Deterministic LCG so tests are reproducible
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };

  const noise = (x = 0, y = 0, z = 0) => {
    // Simple deterministic pseudo-noise in [0, 1] — not real Perlin, but stable.
    const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return n - Math.floor(n);
  };

  const stub = {
    width,
    height,
    mouseX: 0,
    mouseY: 0,
    mouseIsPressed: false,
    frameCount: 0,
    pixels: new Uint8ClampedArray(width * height * 4),
    PI: Math.PI,
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI / 2,
    HSB: 'hsb',
    RGB: 'rgb',
    CLOSE: 'close',
    CENTER: 'center',
    LEFT: 'left',
    TOP: 'top',
    BASELINE: 'baseline',

    // Math helpers — real implementations
    random(a, b) {
      if (a === undefined) return rand();
      if (Array.isArray(a)) return a[Math.floor(rand() * a.length)];
      if (b === undefined) return rand() * a;
      return rand() * (b - a) + a;
    },
    noise,
    noiseSeed(n) { s = (n >>> 0) || 1; },
    map(v, a, b, c, d) { return c + ((v - a) * (d - c)) / (b - a || 1); },
    constrain(v, lo, hi) { return Math.min(Math.max(v, lo), hi); },
    dist(x1, y1, x2, y2) { const dx = x2 - x1, dy = y2 - y1; return Math.sqrt(dx * dx + dy * dy); },
    cos: Math.cos,
    sin: Math.sin,
    abs: Math.abs,
    sqrt: Math.sqrt,
    floor: Math.floor,
    min: Math.min,
    max: Math.max,

    // Vectors — back with real p5.Vector
    createVector(x = 0, y = 0, z = 0) { return new p5.Vector(x, y, z); },

    // Color helpers — return tagged opaque objects
    color(...args) {
      const [r = 0, g = r, b = r, a = 255] = args;
      return { __color: true, levels: [r, g, b, a], r, g, b, a };
    },
    red(c)   { return c?.levels ? c.levels[0] : 0; },
    green(c) { return c?.levels ? c.levels[1] : 0; },
    blue(c)  { return c?.levels ? c.levels[2] : 0; },
    alpha(c) { return c?.levels ? c.levels[3] : 255; },

    // Drawing primitives — no-ops
    createCanvas() {},
    background() {},
    fill() {}, noFill() {},
    stroke() {}, noStroke() {},
    strokeWeight() {},
    rect() {}, ellipse() {}, line() {}, triangle() {}, point() {}, vertex() {},
    beginShape() {}, endShape() {},
    push() {}, pop() {}, translate() {}, rotate() {}, scale() {},
    text() {}, textSize() {}, textFont() {}, textAlign() {},
    colorMode() {},
    image() {},
    loadPixels() {}, updatePixels() {},
    pixelDensity() {},
    frameRate() { return 60; },

    // DOM helpers (week5 sketch uses createP)
    createP() {
      const el = { html() { return el; }, style() { return el; } };
      return el;
    },

    // Sub-buffer (week6 Mandelbrot uses createGraphics)
    createGraphics(w, h) {
      return createP5Stub({ width: w, height: h, seed });
    },
  };

  return stub;
}
