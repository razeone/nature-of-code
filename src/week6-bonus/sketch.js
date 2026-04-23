import p5 from 'p5';
import Firework from './Firework.js';
import Emitter  from './Emitter.js';

/**
 * Week 6 Bonus — Particle System (Fireworks)
 *
 * Concepts: forces, arrays of objects, lifespan, composition
 * (Firework -> Particles). Try changing gravity, wind strength, or the
 * number of children spawned in Firework.explode().
 */

const sketch = (p) => {
  let fireworks = [];
  let emitter;
  let gravity;
  let windOn = false;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 1);
    gravity = p.createVector(0, 0.18);
    emitter = new Emitter(p);
  };

  p.draw = () => {
    // Low-alpha background = motion trails.
    p.background(230, 40, 6, 0.25);

    // Ambient embers leaking up from the mouse.
    emitter.spawn(p.mouseX, p.mouseY);
    const wind = windOn
      ? p.createVector(0.05 * p.sin(p.frameCount * 0.01), 0)
      : p.createVector(0, 0);
    emitter.run([gravity, wind]);

    // Occasional auto-launch so the canvas is never empty.
    if (p.random(1) < 0.025) {
      fireworks.push(new Firework(p, p.random(p.width), p.random(360)));
    }

    for (const fw of fireworks) {
      fw.applyForce(gravity);
      if (windOn) fw.applyForce(wind);
      fw.update();
      fw.display();
    }
    fireworks = fireworks.filter((fw) => !fw.isDone());
  };

  p.mousePressed = () => {
    fireworks.push(new Firework(p, p.mouseX, p.random(360)));
  };

  p.keyPressed = () => {
    if (p.key === ' ') windOn = !windOn;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
