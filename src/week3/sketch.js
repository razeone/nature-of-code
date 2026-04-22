import p5 from 'p5';
import Virus     from './Virus.js';
import Leukocyte from './Leukocyte.js';
import FlowField from './FlowField.js';
import Liquid    from './Liquid.js';

/**
 * Week 3 — Steering Behaviors
 *
 * • Viruses (green stars) seek a roaming target cell.
 * • Leukocytes (white circles) arrive at random viruses.
 * • Both agents experience drag in the liquid medium (bottom half).
 * • Press any key to toggle the flow-field debug overlay.
 */

const VIRUS_COUNT     = 60;
const LEUKOCYTE_COUNT = 40;

const sketch = (p) => {
  let flowfield;
  let liquid;
  const viruses     = [];
  const leukocytes  = [];
  let debug = false;

  p.setup = () => {
    p.createCanvas(800, 600);
    p.textFont('monospace');

    flowfield = new FlowField(p, 20);
    liquid    = new Liquid(p, 0, p.height / 2, p.width, p.height / 2, 0.08);

    for (let i = 0; i < VIRUS_COUNT; i++) {
      viruses.push(new Virus(p, p.random(p.width), p.random(p.height)));
    }
    for (let i = 0; i < LEUKOCYTE_COUNT; i++) {
      leukocytes.push(new Leukocyte(p, p.random(p.width), p.random(p.height)));
    }
  };

  p.draw = () => {
    p.background(0, 5, 15);

    liquid.display();

    if (debug) flowfield.display();

    // Roaming target: slowly drifts via Perlin noise
    const tx = p.noise(p.frameCount * 0.005)       * p.width;
    const ty = p.noise(p.frameCount * 0.005 + 100) * p.height;
    const target = p.createVector(tx, ty);

    // Draw target marker
    p.noFill();
    p.stroke(255, 80, 80, 160);
    p.strokeWeight(2);
    p.ellipse(tx, ty, 30, 30);
    p.stroke(255, 80, 80, 80);
    p.line(tx - 20, ty, tx + 20, ty);
    p.line(tx, ty - 20, tx, ty + 20);

    // Update viruses
    for (const v of viruses) {
      if (liquid.contains(v)) v.applyForce(liquid.calculateDrag(v));
      v.seek(target);
      v.update();
      v.display();
    }

    // Update leukocytes — each arrives at a random virus
    for (const l of leukocytes) {
      if (liquid.contains(l)) l.applyForce(liquid.calculateDrag(l));
      const randomVirus = viruses[Math.floor(p.random(viruses.length))];
      l.arrive(randomVirus.pos);
      l.update();
      l.display();
    }

    drawHUD();
  };

  p.keyPressed = () => { debug = !debug; };

  const drawHUD = () => {
    p.fill(180, 200, 220);
    p.noStroke();
    p.textSize(12);
    p.text(`Viruses: ${VIRUS_COUNT}  |  Leukocytes: ${LEUKOCYTE_COUNT}`, 14, 20);
    p.text(`Press any key to toggle flow field`, 14, 36);
    p.text(`Flow field: ${debug ? 'ON' : 'OFF'}`, 14, 52);
  };
};

new p5(sketch);
