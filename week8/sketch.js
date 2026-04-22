// Week 8 · Conway's Game of Life
// A cellular automaton: simple local rules, complex global behavior.
// This is a great first experience with 2D arrays, neighborhoods, and "simulation loops".

let grid;
let cell = 10;
let running = true;
let stepsPerFrame = 2;
let painting = 0; // 0 = not painting, 1 = painting alive, 2 = painting dead

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  const cols = floor(width / cell);
  const rows = floor(height / cell);
  grid = new Grid(cols, rows);
  grid.randomize(0.22);
}

function draw() {
  background(220, 40, 6);

  if (running) {
    for (let i = 0; i < stepsPerFrame; i++) grid.step();
  }

  if (painting) {
    const x = floor(mouseX / cell);
    const y = floor(mouseY / cell);
    grid.set(x, y, painting === 1 ? 1 : 0);
  }

  // Render the grid. Age shifts hue so stable patterns look different from churn.
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      const i = y * grid.cols + x;
      if (!grid.cells[i]) continue;
      const age = grid.ages[i];
      const h = (160 + age * 1.5) % 360;
      const b = map(min(age, 40), 0, 40, 70, 100);
      fill(h, 70, b);
      rect(x * cell, y * cell, cell - 1, cell - 1);
    }
  }

  drawHud();
}

function drawHud() {
  fill(0, 0, 100, 0.8);
  textFont('monospace', 12);
  text(`${running ? '▶ running' : '❚❚ paused'}  ·  steps/frame: ${stepsPerFrame}`, 12, 20);
}

function mousePressed() {
  painting = mouseButton === LEFT ? 1 : 2;
}

function mouseReleased() {
  painting = 0;
}

function keyPressed() {
  if (key === ' ') running = !running;
  if (key === 'n' || key === 'N') grid.step();
  if (key === 'r' || key === 'R') grid.randomize(0.22);
  if (key === 'c' || key === 'C') grid.clear();
  if (key === 'g' || key === 'G') {
    grid.clear();
    grid.stamp(GLIDER_GUN, 5, 5);
  }
  if (key === '+' || key === '=') stepsPerFrame = min(10, stepsPerFrame + 1);
  if (key === '-' || key === '_') stepsPerFrame = max(1, stepsPerFrame - 1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const cols = floor(width / cell);
  const rows = floor(height / cell);
  grid = new Grid(cols, rows);
  grid.randomize(0.22);
}
