// Week 7 · Flocking (Boids)
// Builds on week 3's steering behaviors by adding group perception.
// The "flock" emerges from three weighted rules — try tweaking the weights.

let boids = [];
let weights = { separation: 1.6, alignment: 1.0, cohesion: 1.0 };
let trails = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  reset(160);
}

function reset(n) {
  boids = [];
  for (let i = 0; i < n; i++) boids.push(new Boid(random(width), random(height)));
}

function draw() {
  if (trails) background(220, 40, 5, 0.12);
  else background(220, 40, 5);

  const mouse = createVector(mouseX, mouseY);
  for (const b of boids) {
    b.flock(boids, weights);
    // A soft pull toward the mouse — try commenting this out.
    b.seek(mouse, 0.4);
    b.edges();
    b.update();
    b.display();
  }

  drawHud();
}

function drawHud() {
  noStroke();
  fill(0, 0, 100, 0.7);
  textFont('monospace', 12);
  const y = 20;
  text(`boids: ${boids.length}`, 12, y);
  text(`separation: ${weights.separation.toFixed(2)} (1/Shift+1)`, 12, y + 16);
  text(`alignment:  ${weights.alignment.toFixed(2)} (2/Shift+2)`, 12, y + 32);
  text(`cohesion:   ${weights.cohesion.toFixed(2)} (3/Shift+3)`, 12, y + 48);
}

function mousePressed() {
  for (let i = 0; i < 15; i++) boids.push(new Boid(mouseX, mouseY));
}

function keyPressed() {
  const step = keyIsDown(SHIFT) ? -0.2 : 0.2;
  if (key === '1') weights.separation = max(0, weights.separation + step);
  if (key === '2') weights.alignment = max(0, weights.alignment + step);
  if (key === '3') weights.cohesion  = max(0, weights.cohesion + step);
  if (key === 'r' || key === 'R') reset(160);
  if (key === 't' || key === 'T') trails = !trails;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
