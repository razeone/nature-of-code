/**
 * Lesson 05 — p5.Vector Operations
 *
 * Interactive visualisation of vector maths:
 *  • Vector A = mouse position relative to canvas centre
 *  • Vector B = fixed diagonal
 *  • A + B, A - B, scalar multiplication, dot product, normalise
 *
 * Move your mouse to see the vectors update live.
 */
import p5 from 'p5';

const sketch = (p) => {
  const ORIGIN = { x: 0, y: 0 }; // set in setup

  p.setup = () => {
    p.createCanvas(800, 550);
    ORIGIN.x = p.width  / 2;
    ORIGIN.y = p.height / 2;
    p.textFont('monospace');
  };

  p.draw = () => {
    p.background(10, 12, 28);

    // A = mouse offset from centre
    const A = p.createVector(p.mouseX - ORIGIN.x, p.mouseY - ORIGIN.y);
    // B = fixed
    const B = p.createVector(120, -60);

    const sum   = p5.Vector.add(A, B);
    const diff  = p5.Vector.sub(A, B);
    const scaled = A.copy().mult(0.5);
    const norm  = A.copy().normalize().mult(80); // scaled unit vector
    const dot   = A.dot(B);
    const angle = p5.Vector.angleBetween(A, B);

    // Draw grid
    p.stroke(25, 35, 55);
    p.strokeWeight(1);
    for (let x = 0; x < p.width;  x += 50) p.line(x, 0, x, p.height);
    for (let y = 0; y < p.height; y += 50) p.line(0, y, p.width, y);

    // Axes
    p.stroke(50, 70, 100);
    p.strokeWeight(1.5);
    p.line(0, ORIGIN.y, p.width, ORIGIN.y);
    p.line(ORIGIN.x, 0, ORIGIN.x, p.height);

    // Draw vectors
    drawArrow(p.createVector(0, 0), A,    [255, 100, 100], 'A (mouse)');
    drawArrow(p.createVector(0, 0), B,    [100, 200, 255], 'B');
    drawArrow(p.createVector(0, 0), sum,  [255, 200, 80],  'A + B');
    drawArrow(p.createVector(0, 0), diff, [180, 80, 255],  'A − B');
    drawArrow(p.createVector(0, 0), scaled,[80, 255, 160], '0.5 × A');
    drawArrow(p.createVector(0, 0), norm,  [255, 120, 200],'norm(A)×80');

    // HUD
    p.fill(180, 200, 230);
    p.noStroke();
    p.textSize(12);
    const info = [
      `A = (${A.x.toFixed(0)}, ${A.y.toFixed(0)})  |A| = ${A.mag().toFixed(1)}`,
      `B = (${B.x}, ${B.y})  |B| = ${B.mag().toFixed(1)}`,
      `A·B (dot product) = ${dot.toFixed(1)}`,
      `Angle A↔B = ${p.degrees(angle).toFixed(1)}°`,
    ];
    info.forEach((l, i) => p.text(l, 14, 20 + i * 17));
  };

  /**
   * Draw a labelled arrow from (ox,oy) offset by vector v.
   * @param {p5.Vector} from - relative start (0,0 = canvas centre in this sketch)
   * @param {p5.Vector} v    - the vector to draw
   * @param {number[]}  col  - [r, g, b]
   * @param {string}    label
   */
  const drawArrow = (from, v, col, label) => {
    const ox = ORIGIN.x + from.x;
    const oy = ORIGIN.y + from.y;
    const tx = ox + v.x;
    const ty = oy + v.y;

    p.stroke(...col, 200);
    p.strokeWeight(2);
    p.line(ox, oy, tx, ty);

    // Arrowhead
    const head = v.copy().normalize().mult(10);
    const perp  = p.createVector(-head.y, head.x).mult(0.4);
    p.fill(...col, 200);
    p.noStroke();
    p.triangle(tx, ty, tx - head.x + perp.x, ty - head.y + perp.y, tx - head.x - perp.x, ty - head.y - perp.y);

    // Label
    p.fill(...col, 220);
    p.textSize(11);
    p.text(label, tx + 6, ty - 4);
  };
};

new p5(sketch);
