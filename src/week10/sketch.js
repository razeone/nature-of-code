import p5 from 'p5';

/**
 * Week 10 — Phyllotaxis
 *
 * A classic Vogel formula: place the n-th seed at (r, θ) = (c·√n, n·α).
 * When α is the golden angle (~137.5°), the arrangement tiles perfectly —
 * which is why sunflowers, pinecones, and pineapples look the way they do.
 *
 * This is a "program as design tool" lesson: one slider changes a number,
 * and the whole image reorganizes. A great closing demo for a creative-
 * coding course.
 */

const GOLDEN = 137.50776405003785;

const sketch = (p) => {
  // (hue, sat, bri) as functions of seed index n
  const PALETTES = [
    { name: 'sunset',  fn: (n) => [(n * 0.6 + 10) % 360, 80, 95] },
    { name: 'ocean',   fn: (n) => [(180 + n * 0.3) % 360, 70, 95] },
    { name: 'spring',  fn: (n) => [(90 + p.sin(n * 0.02) * 60 + 360) % 360, 65, 90] },
    { name: 'mono',    fn: (n) => [220, 10, 80 + (n % 40) * 0.3] },
    { name: 'rainbow', fn: (n) => [(n * 2) % 360, 70, 95] }
  ];

  let angleDeg   = GOLDEN;
  let c          = 4.5;   // scale — distance between seeds
  let nMax       = 1800;  // number of seeds drawn
  let animating  = false;
  let paletteIdx = 0;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 1);
    p.noStroke();
  };

  p.draw = () => {
    p.background(230, 40, 5, animating ? 0.15 : 1);
    p.translate(p.width / 2, p.height / 2);

    if (animating) angleDeg += 0.02; // drift — watch the pattern rearrange live

    const palette = PALETTES[paletteIdx].fn;
    const a = p.radians(angleDeg);

    for (let n = 0; n < nMax; n++) {
      const r = c * p.sqrt(n);
      const theta = n * a;
      const x = r * p.cos(theta);
      const y = r * p.sin(theta);
      const [h, s, b] = palette(n);
      const size = p.map(n, 0, nMax, 2, 6);
      p.fill(h, s, b, 0.9);
      p.circle(x, y, size);
    }

    drawHud();
  };

  const drawHud = () => {
    p.resetMatrix();
    p.fill(0, 0, 100, 0.85);
    p.textFont('monospace', 12);
    p.text(
      `angle: ${angleDeg.toFixed(4)}°   scale: ${c.toFixed(2)}   seeds: ${nMax}   palette: ${PALETTES[paletteIdx].name}`,
      12, 24
    );
  };

  p.mouseDragged = () => {
    // Left-right changes the angle; up-down changes the scale. Tiny nudges matter.
    angleDeg += p.movedX * 0.02;
    c = p.constrain(c + p.movedY * -0.02, 1, 14);
  };

  p.mouseWheel = (e) => {
    nMax = p.constrain(nMax - e.delta * 2, 200, 6000);
    return false;
  };

  p.keyPressed = () => {
    if (p.key === ' ') animating = !animating;
    if (p.key === 'g' || p.key === 'G') angleDeg = GOLDEN;
    if (p.key === 'p' || p.key === 'P') paletteIdx = (paletteIdx + 1) % PALETTES.length;
    if (p.key === 's' || p.key === 'S') p.saveCanvas(`phyllotaxis-${angleDeg.toFixed(2)}`, 'png');
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
