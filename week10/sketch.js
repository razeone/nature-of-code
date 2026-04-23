// Week 10 · Phyllotaxis
// A classic Vogel formula: place the n-th seed at (r, θ) = (c·√n, n·α).
// When α is the golden angle (~137.5°), the arrangement tiles perfectly — which is why
// sunflowers, pinecones, and pineapples look the way they do.
//
// This is a "program as design tool" lesson: one slider changes a number, and the
// whole image reorganizes. Great closing demo for a creative-coding course.

const GOLDEN = 137.50776405003785;
const PALETTES = [
  // (hue, sat, bri) as functions of seed index n
  { name: 'sunset',  fn: n => [(n * 0.6 + 10) % 360, 80, 95] },
  { name: 'ocean',   fn: n => [(180 + n * 0.3) % 360, 70, 95] },
  { name: 'spring',  fn: n => [(90 + sin(n * 0.02) * 60 + 360) % 360, 65, 90] },
  { name: 'mono',    fn: n => [220, 10, 80 + (n % 40) * 0.3] },
  { name: 'rainbow', fn: n => [(n * 2) % 360, 70, 95] }
];

let angleDeg = GOLDEN;
let c = 4.5;           // scale — distance between seeds
let nMax = 1800;       // number of seeds drawn
let animating = false;
let paletteIdx = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(230, 40, 5, animating ? 0.15 : 1);
  translate(width / 2, height / 2);

  if (animating) angleDeg += 0.02; // drift — watch the pattern rearrange live

  const palette = PALETTES[paletteIdx].fn;
  const a = radians(angleDeg);

  for (let n = 0; n < nMax; n++) {
    const r = c * sqrt(n);
    const theta = n * a;
    const x = r * cos(theta);
    const y = r * sin(theta);
    const [h, s, b] = palette(n);
    const size = map(n, 0, nMax, 2, 6);
    fill(h, s, b, 0.9);
    circle(x, y, size);
  }

  drawHud();
}

function drawHud() {
  resetMatrix();
  fill(0, 0, 100, 0.85);
  textFont('monospace', 12);
  text(`angle: ${angleDeg.toFixed(4)}°   scale: ${c.toFixed(2)}   seeds: ${nMax}   palette: ${PALETTES[paletteIdx].name}`, 12, 24);
}

function mouseDragged() {
  // Left-right changes the angle; up-down changes the scale. Tiny nudges matter.
  angleDeg += (movedX) * 0.02;
  c = constrain(c + movedY * -0.02, 1, 14);
}

function mouseWheel(e) {
  nMax = constrain(nMax - e.delta * 2, 200, 6000);
  return false;
}

function keyPressed() {
  if (key === ' ') animating = !animating;
  if (key === 'g' || key === 'G') angleDeg = GOLDEN;
  if (key === 'p' || key === 'P') paletteIdx = (paletteIdx + 1) % PALETTES.length;
  if (key === 's' || key === 'S') saveCanvas(`phyllotaxis-${angleDeg.toFixed(2)}`, 'png');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
