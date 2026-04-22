/**
 * @class Gelatin
 * @description A rectangular medium that exerts a drag force on any object
 *              that passes through it. Rendered as a translucent yellow-green panel.
 */
export default class Gelatin {
  /**
   * @param {p5} p - p5 instance
   * @param {number} x - left edge x
   * @param {number} y - top edge y
   * @param {number} w - width of the medium
   * @param {number} h - height of the medium
   * @param {number} c - drag coefficient
   */
  constructor(p, x, y, w, h, c) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c; // drag coefficient
  }

  /**
   * Returns true if the object's position is inside this medium.
   * @param {{ pos: p5.Vector }} mover - any object with a `pos` p5.Vector
   * @returns {boolean}
   */
  contains(mover) {
    const { x, y } = mover.pos;
    return x > this.x && x < this.x + this.w &&
           y > this.y && y < this.y + this.h;
  }

  /**
   * Calculates the drag force: magnitude = c * v², direction = −velocity.
   * @param {{ vel: p5.Vector }} mover - object with a `vel` p5.Vector
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

  /** Render the gelatin medium. */
  display() {
    const p = this.p;
    p.noStroke();
    p.fill(180, 240, 80, 60); // translucent yellow-green
    p.rect(this.x, this.y, this.w, this.h);

    // Label
    p.fill(120, 180, 50, 180);
    p.textSize(13);
    p.textAlign(p.CENTER, p.TOP);
    p.text('Gelatin Medium  (drag)', this.x + this.w / 2, this.y + 8);
    p.textAlign(p.LEFT, p.BASELINE);
  }
}
