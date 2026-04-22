import p5 from 'p5';

/**
 * Week 1 — Perlin Noise
 *
 * A triangle whose three vertices are animated through Perlin noise space.
 * Hold the mouse button to add more turbulence.
 * Each vertex moves through its own region of noise space using offsets.
 */

const sketch = (p) => {
  // Independent noise offsets for each vertex and axis
  let offsets;

  // How fast we move through noise space
  const NOISE_SPEED = 0.005;
  const TURBO_SPEED = 0.03; // speed when mouse is held

  p.setup = () => {
    p.createCanvas(800, 600);
    p.colorMode(p.HSB, 360, 100, 100, 100);

    // Each vertex has an x-offset and y-offset, spaced apart so they're independent
    offsets = [
      { x: 0.0,   y: 10.0  },   // vertex A
      { x: 20.0,  y: 30.0  },   // vertex B
      { x: 40.0,  y: 50.0  },   // vertex C
    ];
  };

  p.draw = () => {
    p.background(220, 80, 12, 100);

    const speed = p.mouseIsPressed ? TURBO_SPEED : NOISE_SPEED;

    // Map each noise value to canvas coordinates
    const vertices = offsets.map(({ x, y }) => ({
      px: p.noise(x) * p.width,
      py: p.noise(y) * p.height,
    }));

    // Advance through noise space
    offsets.forEach((off) => {
      off.x += speed;
      off.y += speed;
    });

    drawGlowTriangle(vertices);
    drawVertexDots(vertices);
    drawHUD(speed);
  };

  /**
   * Draw the triangle with a layered glow effect.
   * @param {{px:number, py:number}[]} verts
   */
  const drawGlowTriangle = (verts) => {
    const [a, b, c] = verts;

    // Outer glow layers
    for (let i = 5; i >= 1; i--) {
      p.stroke(140, 80, 100, 15 * i);
      p.strokeWeight(i * 3);
      p.noFill();
      p.triangle(a.px, a.py, b.px, b.py, c.px, c.py);
    }

    // Filled triangle
    p.fill(140, 60, 80, 70);
    p.stroke(140, 100, 100, 90);
    p.strokeWeight(2);
    p.triangle(a.px, a.py, b.px, b.py, c.px, c.py);
  };

  /**
   * Draw glowing dots at each vertex.
   * @param {{px:number, py:number}[]} verts
   */
  const drawVertexDots = (verts) => {
    verts.forEach(({ px, py }, i) => {
      const hue = (120 + i * 40) % 360;
      p.noStroke();
      p.fill(hue, 80, 100, 60);
      p.ellipse(px, py, 18, 18);
      p.fill(hue, 40, 100, 90);
      p.ellipse(px, py, 8, 8);
    });
  };

  /**
   * Display instructions and noise offset values.
   * @param {number} speed
   */
  const drawHUD = (speed) => {
    p.colorMode(p.RGB, 255);
    p.fill(200, 220, 240);
    p.noStroke();
    p.textSize(12);
    p.textFont('monospace');

    p.text(`Hold mouse — turbo mode (speed: ${speed.toFixed(3)})`, 14, 20);
    offsets.forEach((off, i) => {
      p.text(`Vertex ${String.fromCharCode(65 + i)} offset: (${off.x.toFixed(2)}, ${off.y.toFixed(2)})`, 14, 40 + i * 16);
    });
    p.colorMode(p.HSB, 360, 100, 100, 100);
  };
};

new p5(sketch);
