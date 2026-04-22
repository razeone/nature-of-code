/**
 * Lesson 02 — p5.js setup/draw & the coordinate system
 *
 * Demonstrates: createCanvas, background, coordinate grid,
 * basic shapes, and how x/y works in p5 (origin = top-left).
 */
import p5 from 'p5';

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 500);
    p.noLoop(); // static diagram
  };

  p.draw = () => {
    p.background(10, 10, 30);
    p.textFont('monospace');

    // Draw coordinate grid
    p.stroke(40, 60, 80);
    p.strokeWeight(1);
    for (let x = 0; x <= p.width; x += 50) {
      p.line(x, 0, x, p.height);
    }
    for (let y = 0; y <= p.height; y += 50) {
      p.line(0, y, p.width, y);
    }

    // Axis labels
    p.fill(80, 120, 200);
    p.noStroke();
    p.textSize(11);
    for (let x = 50; x < p.width; x += 100) p.text(x, x + 2, 12);
    for (let y = 50; y < p.height; y += 100) p.text(y, 2, y + 12);

    // Origin label
    p.fill(255, 220, 80);
    p.textSize(13);
    p.text('(0,0)', 4, 14);

    // Example shapes with annotations
    const shapes = [
      { fn: () => { p.fill(255, 80, 80, 180); p.ellipse(150, 200, 80, 80); },
        label: 'ellipse(150, 200, 80, 80)', lx: 100, ly: 270 },
      { fn: () => { p.fill(80, 200, 255, 180); p.rect(300, 160, 100, 70, 6); },
        label: 'rect(300, 160, 100, 70)', lx: 290, ly: 250 },
      { fn: () => {
          p.fill(80, 255, 140, 180);
          p.triangle(520, 150, 460, 260, 580, 260);
        },
        label: 'triangle(520,150,460,260,580,260)', lx: 430, ly: 280 },
      { fn: () => { p.stroke(255, 180, 0); p.strokeWeight(3); p.line(650, 150, 750, 270); p.noStroke(); },
        label: 'line(650,150,750,270)', lx: 640, ly: 290 },
    ];

    shapes.forEach(({ fn, label, lx, ly }) => {
      fn();
      p.fill(200, 215, 240);
      p.noStroke();
      p.textSize(11);
      p.text(label, lx, ly);
    });

    // Title
    p.fill(200, 220, 255);
    p.textSize(14);
    p.text('p5.js Coordinate System — origin (0,0) is top-left', 20, p.height - 14);
  };
};

new p5(sketch);
