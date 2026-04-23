/**
 * @class FlowField  (Week 6 — Viral Bloom)
 * @description Perlin-noise flow field that animates over time, creating a
 *              slowly shifting bioluminescent current across the canvas.
 */
import p5 from 'p5';

export default class FlowField {
  /**
   * @param {p5}    p          - p5 instance
   * @param {number} resolution - grid cell size in pixels
   */
  constructor(p, resolution = 24) {
    this.p = p;
    this.resolution = resolution;
    this.cols = Math.ceil(p.width  / resolution);
    this.rows = Math.ceil(p.height / resolution);
    this.field = this.#make2D();
    this.zoff  = 0; // noise z-axis for time animation
  }

  #make2D() {
    return Array.from({ length: this.cols }, () => new Array(this.rows).fill(null));
  }

  /**
   * Regenerate the flow field vectors for the current time offset.
   * Call once per frame for animated flow.
   */
  update() {
    const p = this.p;
    let xoff = 0;
    for (let i = 0; i < this.cols; i++) {
      let yoff = 0;
      for (let j = 0; j < this.rows; j++) {
        const theta = p.map(p.noise(xoff, yoff, this.zoff), 0, 1, 0, p.TWO_PI * 2);
        this.field[i][j] = p5.Vector.fromAngle(theta);
        yoff += 0.1;
      }
      xoff += 0.1;
    }
    this.zoff += 0.004;
  }

  /**
   * Return the field vector at a world position.
   * @param {p5.Vector} pos
   * @returns {p5.Vector}
   */
  lookup(pos) {
    const col = Math.floor(this.p.constrain(pos.x / this.resolution, 0, this.cols - 1));
    const row = Math.floor(this.p.constrain(pos.y / this.resolution, 0, this.rows - 1));
    return this.field[col][row].copy();
  }

  /**
   * Draw the flow field as faint arrows (debug/aesthetic overlay).
   * @param {number} [alpha=30]
   */
  display(alpha = 30) {
    const p = this.p;
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const v   = this.field[i][j];
        const cx  = i * this.resolution + this.resolution / 2;
        const cy  = j * this.resolution + this.resolution / 2;
        const len = this.resolution * 0.5;
        p.push();
        p.translate(cx, cy);
        p.rotate(v.heading());
        p.stroke(80, 200, 200, alpha);
        p.strokeWeight(1);
        p.line(0, 0, len, 0);
        p.pop();
      }
    }
  }
}
