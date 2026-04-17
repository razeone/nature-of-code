import p5 from 'p5';
import Population  from './Population.js';
import Antibiotic  from './Antibiotic.js';

/**
 * Week 5 — Genetic Algorithms
 *
 * A population of viruses evolve DNA force-vectors across generations to
 * navigate from the bottom to the target antibiotic at the top, while
 * avoiding white obstacle antibiotics.
 *
 * Click to move the target. The population will adapt.
 */

const MUTATION_RATE  = 0.01;
const POP_SIZE       = 50;
const OBSTACLE_COUNT = 12;

const sketch = (p) => {
  let lifetime;   // ticks per generation
  let lifeCounter;
  let population;
  let target;
  const obstacles = [];
  let infoEl;

  p.setup = () => {
    p.createCanvas(800, 600);
    p.textFont('monospace');

    lifetime    = p.height;
    lifeCounter = 0;

    target = new Antibiotic(p, p.width / 2, 30, 40, 40, p.color(255, 180, 200));

    for (let i = 0; i < OBSTACLE_COUNT; i++) {
      obstacles.push(new Antibiotic(p, p.random(p.width), p.random(80, p.height - 80), 20, 20, p.color(220, 220, 220)));
    }

    population = new Population(p, MUTATION_RATE, POP_SIZE, lifetime);

    infoEl = p.createP('');
    infoEl.style('color', '#c0d0e0');
    infoEl.style('font-family', 'monospace');
    infoEl.style('font-size', '13px');
    infoEl.style('margin', '4px 14px');
  };

  p.draw = () => {
    p.background(30, 30, 50);

    target.display();
    for (const obs of obstacles) obs.display();

    if (lifeCounter < lifetime) {
      population.live(obstacles, target);
      lifeCounter++;
    } else {
      // Next generation
      lifeCounter = 0;
      population.fitness();
      population.selection();
      population.reproduction();
    }

    const cyclesLeft = lifetime - lifeCounter;
    infoEl.html(
      `Generation: ${population.getGenerations()} &nbsp;|&nbsp; ` +
      `Cycles left: ${cyclesLeft} &nbsp;|&nbsp; ` +
      `Mutation rate: ${(MUTATION_RATE * 100).toFixed(1)}%`
    );
  };

  // Drag target with mouse
  p.mousePressed = () => {
    target.pos.set(p.mouseX, p.mouseY);
  };
};

new p5(sketch);
