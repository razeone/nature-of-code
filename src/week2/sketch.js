import p5 from 'p5';
import Gelatin from './Gelatin.js';
import Star from './Star.js';

/**
 * Week 2 — Drag Forces
 *
 * Stars spawn where you click and fall under gravity.
 * When they enter the gelatin medium their speed is slowed by drag.
 * They bounce off the floor with dampening.
 */

const DRAGGING   = 0.08;  // drag coefficient of the gelatin
const DAMPENING  = -0.5;  // velocity multiplier on floor bounce
const STAR_POINTS = 18;
const STAR_MASS  = 50;
const GRAVITY    = 0.3;   // pixels·frame⁻²

const sketch = (p) => {
  let gelly;
  const stars = [];

  p.setup = () => {
    p.createCanvas(800, 600);
    p.textFont('monospace');

    // Gelatin occupies the bottom third of the canvas
    const gelH = p.height / 3;
    gelly = new Gelatin(p, 0, p.height - gelH, p.width, gelH, DRAGGING);
  };

  p.draw = () => {
    p.background(10, 20, 40);

    gelly.display();

    // Spawn a star at the mouse when pressed
    if (p.mouseIsPressed) {
      stars.push(new Star(p, STAR_MASS, p.mouseX, p.mouseY, 14, 28, STAR_POINTS, DAMPENING));
    }

    for (const star of stars) {
      // Apply drag if inside gelatin
      if (gelly.contains(star)) {
        star.applyForce(gelly.calculateDrag(star));
      }

      // Gravity: F = m * g (downward)
      star.applyForce(p.createVector(0, GRAVITY * star.mass));

      star.update();
      star.checkEdges();
      star.display();
    }

    drawHUD();
  };

  const drawHUD = () => {
    p.fill(200, 210, 230);
    p.noStroke();
    p.textSize(12);
    p.text(`Stars: ${stars.length}`, 14, 20);
    p.text(`Click to spawn stars`, 14, 36);
    p.text(`Drag coeff: ${DRAGGING} | Dampening: ${DAMPENING}`, 14, 52);
  };
};

new p5(sketch);
