import p5 from 'p5';
import Mandelbrot from './Mandelbrot.js';

/**
 * Week 4 — Fractals & Mandelbrot
 *
 * The Mandelbrot set is rendered one column per frame so you can watch
 * it appear in real time. Once complete, rendering stops.
 */

const sketch = (p) => {
  let mandelbrot;
  let done = false;

  p.setup = () => {
    p.createCanvas(700, 400);
    p.background(0);
    p.textFont('monospace');
    mandelbrot = new Mandelbrot(p, 128);
  };

  p.draw = () => {
    if (!done) {
      // Render a few columns per frame for a visible sweep effect
      for (let i = 0; i < 4; i++) {
        done = mandelbrot.renderColumn();
        if (done) break;
      }
    }

    drawHUD();
  };

  const drawHUD = () => {
    p.fill(200, 210, 230);
    p.noStroke();
    p.textSize(12);
    const pct = Math.min(100, Math.round((mandelbrot.currentX / p.width) * 100));
    p.text(done ? 'Rendering complete' : `Rendering… ${pct}%`, 10, p.height - 10);
  };
};

new p5(sketch);
