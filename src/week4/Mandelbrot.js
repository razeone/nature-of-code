/**
 * @class Mandelbrot
 * @description Renders the Mandelbrot set on a p5.js canvas using complex
 *              number iteration. Each pixel is coloured by how many iterations
 *              the series z_(n+1) = z_n² + c takes to escape |z| = 2.
 *
 * Rendering is done incrementally (one column per frame) so the sketch stays
 * interactive while the image builds up.
 */
export default class Mandelbrot {
  /**
   * @param {p5}    p            - p5 instance
   * @param {number} maxIterations - escape-time limit
   * @param {number} x1           - real axis min
   * @param {number} x2           - real axis max
   * @param {number} y1           - imaginary axis min
   * @param {number} y2           - imaginary axis max
   */
  constructor(p, maxIterations = 128, x1 = -2.5, x2 = 1.0, y1 = -1.0, y2 = 1.0) {
    this.p = p;
    this.maxIterations = maxIterations;
    this.x1 = x1; this.x2 = x2;
    this.y1 = y1; this.y2 = y2;
    this.cWidth  = x2 - x1;
    this.cHeight = y2 - y1;
    this.palette = this.#generatePalette();
    this.currentX = 0; // tracks which column we are rendering
  }

  /** Build the colour palette used for escape-time colouring. */
  #generatePalette() {
    const p = this.p;
    const palette = [];
    const max = this.maxIterations;

    // Deep blue gradient for low iterations
    for (let i = 0; i < 16; i++) {
      palette.push(p.color(i * 8, i * 8, 128 + i * 4));
    }
    // Bright blue/white for mid iterations
    for (let i = 16; i < 64; i++) {
      palette.push(p.color(128 + i - 16, 128 + i - 16, 192 + i - 16));
    }
    // Cycling purple/white for high iterations
    for (let i = 64; i < max; i++) {
      palette.push(p.color((319 - i) % 256, (128 + (319 - i) / 2) % 256, (319 - i) % 256));
    }
    // Interior: black
    palette[max] = p.color(0, 0, 0);
    return palette;
  }

  /** @param {number} px - canvas x coordinate */
  #mapXToReal(px)    { return this.cWidth  * px / this.p.width  + this.x1; }
  /** @param {number} py - canvas y coordinate */
  #mapYToImag(py)    { return this.y1 + this.cHeight * py / this.p.height; }

  /**
   * Returns the escape iteration count for a complex point c = (cReal, cImag).
   * @param {number} cReal
   * @param {number} cImag
   * @returns {number}
   */
  #getIterations(cReal, cImag) {
    let zReal = 0, zImg = 0, iter = 0;

    while (zReal * zReal + zImg * zImg < 4 && iter < this.maxIterations) {
      const tmpReal = zReal * zReal - zImg * zImg + cReal;
      const tmpImg  = 2 * zReal * zImg + cImag;
      // Period-2 bulb check: if orbit is stuck, it's interior
      if (zReal === tmpReal && zImg === tmpImg) { iter = this.maxIterations; break; }
      zReal = tmpReal;
      zImg  = tmpImg;
      iter++;
    }
    return iter;
  }

  /**
   * Render one column of pixels. Call once per frame for incremental rendering.
   * @returns {boolean} true when all columns have been rendered
   */
  renderColumn() {
    const p = this.p;
    if (this.currentX >= p.width) return true;

    const x = this.currentX;
    const cReal = this.#mapXToReal(x);

    p.loadPixels();
    for (let y = 0; y < p.height; y++) {
      const iter = this.#getIterations(cReal, this.#mapYToImag(y));
      const col  = this.palette[iter];
      const idx  = 4 * (y * p.width + x);
      p.pixels[idx]     = p.red(col);
      p.pixels[idx + 1] = p.green(col);
      p.pixels[idx + 2] = p.blue(col);
      p.pixels[idx + 3] = 255;
    }
    p.updatePixels();

    this.currentX++;
    return false;
  }

  /** True if the full image has been rendered. */
  get done() {
    return this.currentX >= this.p.width;
  }

  /** Reset so the image renders from scratch. */
  reset() {
    this.currentX = 0;
  }
}
