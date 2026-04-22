/**
 * @class FlowField
 * @description A 2-D grid of p5.Vectors derived from Perlin noise. Agents
 *              can query the field at any position to get a steering direction.
 */
export default class FlowField {
  /**
   * @param {p5}    p          - p5 instance
   * @param {number} resolution - size of each grid cell in pixels
   */
  constructor(p, resolution = 20) {
    this.p = p;
    this.resolution = resolution;
    this.cols = Math.floor(p.width  / resolution);
    this.rows = Math.floor(p.height / resolution);
    this.field = this.#make2D(this.cols, this.rows);
    this.#init();
  }

  /** Build a 2-D array of null values. */
  #make2D(cols, rows) {
    return Array.from({ length: cols }, () => new Array(rows).fill(null));
  }

  /** Fill the grid with angle vectors derived from Perlin noise. */
  #init() {
    const p = this.p;
    p.noiseSeed(Math.floor(p.random(10000)));

    let xoff = 0;
    for (let i = 0; i < this.cols; i++) {
      let yoff = 0;
      for (let j = 0; j < this.rows; j++) {
        const theta = p.map(p.noise(xoff, yoff), 0, 1, 0, p.TWO_PI);
        this.field[i][j] = p5.Vector.fromAngle(theta);
        yoff += 0.1;
      }
      xoff += 0.1;
    }
  }

  /**
   * Return the field vector at the given world position.
   * @param {p5.Vector} pos
   * @returns {p5.Vector}
   */
  lookup(pos) {
    const col = Math.floor(this.p.constrain(pos.x / this.resolution, 0, this.cols - 1));
    const row = Math.floor(this.p.constrain(pos.y / this.resolution, 0, this.rows - 1));
    return this.field[col][row].copy();
  }

  /** Draw the field as arrows — useful for debugging. */
  display() {
    const p = this.p;
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const v = this.field[i][j];
        const x = i * this.resolution;
        const y = j * this.resolution;
        const len = this.resolution * 0.6;

        p.push();
        p.translate(x + this.resolution / 2, y + this.resolution / 2);
        p.rotate(v.heading());
        p.stroke(100, 180, 255, 80);
        p.strokeWeight(1);
        p.line(0, 0, len, 0);
        // arrowhead
        p.line(len, 0, len - 4, -3);
        p.line(len, 0, len - 4,  3);
        p.pop();
      }
    }
  }
}
