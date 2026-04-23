// Week 9 · L-Systems
// Recursion as a grammar. Builds naturally on week 4's Mandelbrot — same "self-similar"
// idea, but here the recursion is encoded in rewrite rules rather than a function call.

let preset = 'plant';
let iterations = 4;
let sentence = '';
let seeds = []; // {x, y, preset, iters, rot}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  background(160, 40, 5);
  regenerate();
  renderAll();
}

function regenerate() {
  const p = PRESETS[preset];
  const iters = min(iterations, p.maxIter);
  sentence = expand(p.axiom, p.rules, iters);
}

function renderAll() {
  background(160, 40, 5, 1);
  if (seeds.length === 0) {
    // Initial plant in the middle.
    seeds.push({ x: width / 2, y: height - 20, preset, iters: iterations, rot: 0 });
  }
  for (const s of seeds) {
    const p = PRESETS[s.preset];
    const sent = expand(p.axiom, p.rules, min(s.iters, p.maxIter));
    push();
    translate(s.x, s.y);
    rotate(s.rot);
    drawLSystem(sent, { step: p.step, angleDeg: p.angle, hueRange: p.hue, jitter: 0.05 });
    pop();
  }
}

function draw() {
  // Static render — only redraw on state change.
  noLoop();
}

function mousePressed() {
  // Plant where you click. Koch/Sierpinski/dragon don't branch so we don't need to flip them.
  const rot = preset === 'plant' ? 0 : -HALF_PI;
  seeds.push({ x: mouseX, y: mouseY, preset, iters: iterations, rot });
  renderAll();
}

function keyPressed() {
  if (key === '1') preset = 'plant';
  if (key === '2') preset = 'koch';
  if (key === '3') preset = 'sierpinski';
  if (key === '4') preset = 'dragon';
  if (key === '+' || key === '=') iterations = min(PRESETS[preset].maxIter, iterations + 1);
  if (key === '-' || key === '_') iterations = max(1, iterations - 1);
  if (key === 'r' || key === 'R') { seeds = []; noiseSeed(millis()); }
  regenerate();
  renderAll();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  renderAll();
}
