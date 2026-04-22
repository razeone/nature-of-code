// Week 6 · Particle System
// Concepts: forces, arrays of objects, lifespan, composition (Firework -> Particles).
// Try: change gravity, wind strength, or the number of children in Firework.explode().

let fireworks = [];
let emitter;
let gravity;
let windOn = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  gravity = createVector(0, 0.18);
  emitter = new Emitter();
}

function draw() {
  // Low-alpha background = motion trails.
  background(230, 40, 6, 0.25);

  // Ambient embers leaking up from the mouse.
  emitter.spawn(mouseX, mouseY);
  const wind = windOn ? createVector(0.05 * sin(frameCount * 0.01), 0) : createVector(0, 0);
  emitter.run([gravity, wind]);

  // Occasional auto-launch so the canvas is never empty.
  if (random(1) < 0.025) {
    fireworks.push(new Firework(random(width), random(360)));
  }

  for (const fw of fireworks) {
    fw.applyForce(gravity);
    if (windOn) fw.applyForce(wind);
    fw.update();
    fw.display();
  }
  fireworks = fireworks.filter(fw => !fw.isDone());
}

function mousePressed() {
  fireworks.push(new Firework(mouseX, random(360)));
}

function keyPressed() {
  if (key === ' ') windOn = !windOn;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
