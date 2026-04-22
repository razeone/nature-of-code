/**
 * Lesson 04 — Drawing Primitives
 *
 * A gallery of p5 drawing commands: fill, stroke, strokeWeight,
 * colorMode, rect, ellipse, triangle, arc, beginShape/endShape,
 * push/pop for isolated transforms.
 */
import p5 from 'p5';

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 500);
    p.noLoop();
  };

  p.draw = () => {
    p.background(14, 14, 32);
    p.textFont('monospace');

    // 1. Coloured rectangle with rounded corners
    p.fill(255, 100, 80, 200);
    p.stroke(255, 150, 130);
    p.strokeWeight(2);
    p.rect(30, 40, 120, 80, 10);
    label('rect + rounded', 30, 140);

    // 2. Ellipse
    p.fill(80, 180, 255, 200);
    p.stroke(120, 200, 255);
    p.ellipse(220, 80, 100, 60);
    label('ellipse', 185, 140);

    // 3. Triangle
    p.fill(80, 255, 160, 200);
    p.stroke(120, 255, 180);
    p.triangle(340, 120, 300, 50, 390, 50);
    label('triangle', 310, 140);

    // 4. Arc
    p.fill(255, 220, 80, 200);
    p.stroke(255, 240, 120);
    p.arc(490, 80, 90, 90, 0, p.PI + p.HALF_PI);
    label('arc', 460, 140);

    // 5. beginShape / vertex — custom polygon (hexagon)
    p.fill(200, 80, 255, 180);
    p.stroke(220, 130, 255);
    p.beginShape();
    for (let i = 0; i < 6; i++) {
      const a = p.TWO_PI / 6 * i - p.HALF_PI;
      p.vertex(630 + p.cos(a) * 45, 80 + p.sin(a) * 45);
    }
    p.endShape(p.CLOSE);
    label('beginShape', 590, 140);

    // 6. Push/pop: isolated transform
    p.push();
    p.translate(100, 280);
    p.rotate(p.PI / 6);
    p.fill(255, 160, 60, 200);
    p.stroke(255, 190, 100);
    p.rect(-40, -25, 80, 50, 6);
    p.pop();
    label('push/pop\n+ rotate', 60, 365);

    // 7. colorMode HSB
    p.colorMode(p.HSB, 360, 100, 100, 100);
    for (let i = 0; i < 12; i++) {
      const h = i * 30;
      p.fill(h, 80, 90, 80);
      p.noStroke();
      p.ellipse(280 + i * 38, 280, 30, 30);
    }
    label('colorMode HSB', 270, 330);
    p.colorMode(p.RGB, 255);

    // 8. strokeWeight demo
    p.stroke(140, 200, 255);
    p.noFill();
    [1, 3, 6, 10].forEach((w, i) => {
      p.strokeWeight(w);
      p.line(650, 200 + i * 35, 780, 200 + i * 35);
    });
    label('strokeWeight\n1, 3, 6, 10', 635, 365);

    // helper
    function label(txt, x, y) {
      p.fill(160, 180, 210);
      p.noStroke();
      p.textSize(11);
      p.text(txt, x, y);
    }
  };
};

new p5(sketch);
