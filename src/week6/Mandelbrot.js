/**
 * @class Mandelbrot  (Week 6 — Viral Bloom)
 * @description Renders a fragment of the Mandelbrot set as a decorative
 *              texture overlay with bioluminescent coloring. Renders
 *              incrementally — a few columns per frame — so it does not
 *              freeze the animation.
 */
export default class Mandelbrot {
  /**
   * @param {p5}    p            - p5 instance
   * @param {number} maxIterations
   * @param {number} x1 - real min
   * @param {number} x2 - real max
   * @param {number} y1 - imag min
   * @param {number} y2 - imag max
   */
  constructor(p, maxIterations = 64, x1 = -2.0, x2 = 0.5, y1 = -1.0, y2 = 1.0) {
    this.p = p;
    this.maxIterations = maxIterations;
    this.x1 = x1; this.x2 = x2;
    this.y1 = y1; this.y2 = y2;
    this.cWidth  = x2 - x1;
    this.cHeight = y2 - y1;
    this.currentX = 0;
    // Render into an off-screen buffer
    this.buffer = p.createGraphics(p.width, p.height);
    this.buffer.pixelDensity(1);
    this.buffer.background(0, 0);
  }

  #mapX(px) { return this.cWidth  * px / this.p.width  + this.x1; }
  #mapY(py) { return this.y1 + this.cHeight * py / this.p.height; }

  #getIterations(cr, ci) {
    let zr = 0, zi = 0, n = 0;
    while (zr * zr + zi * zi < 4 && n < this.maxIterations) {
      const tr = zr * zr - zi * zi + cr;
      const ti = 2 * zr * zi + ci;
      if (zr === tr && zi === ti) { n = this.maxIterations; break; }
      zr = tr; zi = ti; n++;
    }
    return n;
  }

  /**
   * Render `cols` columns into the offscreen buffer.
   * @param {number} [cols=2]
   */
  renderColumns(cols = 2) {
    if (this.done) return;
    const buf = this.buffer;
    buf.loadPixels();
    for (let c = 0; c < cols && this.currentX < this.p.width; c++, this.currentX++) {
      const cr = this.#mapX(this.currentX);
      for (let y = 0; y < this.p.height; y++) {
        const n = this.#getIterations(cr, this.#mapY(y));
        if (n === this.maxIterations) continue; // interior stays transparent
        // Bioluminescent teal palette
        const t   = n / this.maxIterations;
        const r   = Math.floor(t * 40);
        const g   = Math.floor(60 + t * 180);
        const b   = Math.floor(80 + t * 160);
        const a   = Math.floor(t * 80); // mostly transparent overlay
        const idx = 4 * (y * this.p.width + this.currentX);
        buf.pixels[idx]     = r;
        buf.pixels[idx + 1] = g;
        buf.pixels[idx + 2] = b;
        buf.pixels[idx + 3] = a;
      }
    }
    buf.updatePixels();
  }

  /** Draw the buffer onto the main canvas. */
  display() {
    this.p.image(this.buffer, 0, 0);
  }

  get done() { return this.currentX >= this.p.width; }
}
