/**
 * Lesson 03 — Animation Loop: frameRate, frameCount, deltaTime
 *
 * Three animated bars that respond to frameCount, frameRate, and deltaTime.
 * Shows how the draw loop is the engine of all p5 animation.
 */
import p5 from 'p5';

const sketch = (p) => {
  let angle = 0;

  p.setup = () => {
    p.createCanvas(800, 500);
    p.textFont('monospace');
  };

  p.draw = () => {
    p.background(10, 12, 28);

    const cx = p.width / 2;
    const cy = p.height / 2;

    // --- Spinning arms driven by frameCount ---
    p.push();
    p.translate(cx, cy);
    p.stroke(100, 180, 255, 180);
    p.strokeWeight(2);

    for (let i = 0; i < 6; i++) {
      const a = p.frameCount * 0.02 + (i * p.TWO_PI) / 6;
      const len = 80 + p.sin(p.frameCount * 0.05 + i) * 40;
      const x2  = p.cos(a) * len;
      const y2  = p.sin(a) * len;
      p.stroke(p.map(i, 0, 6, 160, 260) % 360, 80, 255, 160);
      p.line(0, 0, x2, y2);

      p.noStroke();
      p.fill(p.map(i, 0, 6, 160, 260) % 360, 70, 255, 200);
      p.ellipse(x2, y2, 10, 10);
    }
    p.pop();

    // --- deltaTime: physics-independent animation ---
    // angle advances in degrees per millisecond regardless of frame rate
    angle += (90 / 1000) * p.deltaTime; // 90°/s

    p.push();
    p.translate(200, 120);
    p.stroke(80, 255, 160, 180);
    p.strokeWeight(2);
    p.noFill();
    p.ellipse(0, 0, 100, 100);
    const dx = p.cos(p.radians(angle)) * 50;
    const dy = p.sin(p.radians(angle)) * 50;
    p.fill(80, 255, 160);
    p.noStroke();
    p.ellipse(dx, dy, 14, 14);
    p.pop();

    // --- HUD ---
    p.fill(190, 210, 240);
    p.noStroke();
    p.textSize(13);
    const lines = [
      `frameCount : ${p.frameCount}`,
      `frameRate  : ${p.frameRate().toFixed(1)} fps`,
      `deltaTime  : ${p.deltaTime.toFixed(1)} ms`,
      `angle (deltaTime-driven) : ${(angle % 360).toFixed(1)}°`,
    ];
    lines.forEach((l, i) => p.text(l, 14, 24 + i * 18));

    p.textSize(11);
    p.fill(100, 130, 160);
    p.text('deltaTime ensures consistent speed regardless of frame rate', 14, p.height - 14);
  };
};

new p5(sketch);
