/**
 * @class Liquid
 * @description A rectangular region that applies quadratic drag to any agent
 *              moving through it. Analogous to Gelatin from week 2.
 */
export default class Liquid {
  /**
   * @param {p5}    p - p5 instance
   * @param {number} x - left edge
   * @param {number} y - top edge
   * @param {number} w - width
   * @param {number} h - height
   * @param {number} c - drag coefficient
   */
  constructor(p, x, y, w, h, c) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  /**
   * @param {{ pos: p5.Vector }} mover
   * @returns {boolean}
   */
  contains(mover) {
    const { x, y } = mover.pos;
    return x > this.x && x < this.x + this.w &&
           y > this.y && y < this.y + this.h;
  }

  /**
   * Calculate drag force: F_drag = -c * v * |v|.
   * @param {{ vel: p5.Vector }} mover
   * @returns {p5.Vector}
   */
  calculateDrag(mover) {
    const speed = mover.vel.mag();
    const dragMagnitude = this.c * speed * speed;
    const dragForce = mover.vel.copy();
    dragForce.mult(-1);
    dragForce.setMag(dragMagnitude);
    return dragForce;
  }

  /** Render the liquid region. */
  display() {
    const p = this.p;
    p.noStroke();
    p.fill(20, 40, 80, 120);
    p.rect(this.x, this.y, this.w, this.h);

    p.fill(60, 100, 160, 180);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text('Liquid  (drag zone)', this.x + this.w / 2, this.y + 6);
    p.textAlign(p.LEFT, p.BASELINE);
  }
}
