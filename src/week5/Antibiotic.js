/**
 * @class Antibiotic
 * @description An ellipse obstacle / target on the canvas. Viruses gain
 *              bonus fitness by reaching the target antibiotic and lose
 *              fitness by hitting obstacle antibiotics.
 */
export default class Antibiotic {
  /**
   * @param {p5}    p     - p5 instance
   * @param {number} x    - centre x
   * @param {number} y    - centre y
   * @param {number} w    - ellipse width
   * @param {number} h    - ellipse height
   * @param {p5.Color|string} fillColor - display colour
   */
  constructor(p, x, y, w, h, fillColor) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.w = w;
    this.h = h;
    this.fillColor = fillColor;
  }

  /**
   * Returns true if `spot` is within the bounding box of this ellipse.
   * @param {p5.Vector} spot
   * @returns {boolean}
   */
  contains(spot) {
    // Use ellipse hit-test: (dx/rx)² + (dy/ry)² < 1
    const rx = this.w / 2;
    const ry = this.h / 2;
    const dx = spot.x - this.pos.x;
    const dy = spot.y - this.pos.y;
    return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) < 1;
  }

  display() {
    const p = this.p;
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(this.fillColor);
    p.ellipse(this.pos.x, this.pos.y, this.w, this.h);
  }
}
