/**
 * Lesson 01 — JavaScript Basics
 *
 * Demonstrates: variables, data types, arithmetic, conditionals,
 * loops, and functions — all visualised on a p5 canvas.
 */
import p5 from 'p5';

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 500);
    p.noLoop(); // static demo
  };

  p.draw = () => {
    p.background(15, 15, 35);
    p.textFont('monospace');

    // --- Variables & data types ---
    const name   = 'Nature of Code';   // string
    const width2 = 800;                 // number
    const isOn   = true;                // boolean
    let   count  = 0;                   // mutable

    // --- Arithmetic ---
    const sum     = 100 + 200;
    const product = 12 * 7;
    const modulo  = 17 % 5;            // remainder

    // --- Template literals ---
    const msg = `Sum: ${sum}, Product: ${product}, Modulo: ${modulo}`;

    p.fill(180, 220, 255);
    p.textSize(14);
    p.text(`Course: ${name}`, 30, 40);
    p.text(msg, 30, 64);
    p.text(`Boolean: ${isOn}`, 30, 88);

    // --- Conditional ---
    const status = isOn ? 'System ON' : 'System OFF';
    p.fill(isOn ? p.color(80, 255, 140) : p.color(255, 80, 80));
    p.text(status, 30, 120);

    // --- Loop: draw a row of squares with a counter ---
    p.fill(100, 150, 255);
    p.noStroke();
    for (let i = 0; i < 10; i++) {
      const x = 30 + i * 60;
      const h = 20 + i * 8;
      p.rect(x, 170, 40, h, 4);
      count++;
    }

    p.fill(200, 200, 230);
    p.textSize(13);
    p.text(`Loop ran ${count} times`, 30, 310);

    // --- Function (defined inside setup for clarity) ---
    const greet = (whom) => `Hello, ${whom}!`;
    p.text(greet('World'), 30, 340);

    // --- Array basics ---
    const colours = ['red', 'green', 'blue'];
    colours.forEach((col, idx) => {
      p.fill(col === 'red' ? '#e57' : col === 'green' ? '#5e7' : '#57e');
      p.ellipse(100 + idx * 80, 410, 50, 50);
    });

    p.fill(180);
    p.textSize(11);
    p.text('Array: [red, green, blue]', 30, 475);
  };
};

new p5(sketch);
