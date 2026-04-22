/**
 * Lesson 06 — Interactivity: Mouse & Keyboard
 *
 * Demonstrates:
 *  • mouseX / mouseY — real-time position
 *  • mouseIsPressed — continuous press
 *  • mousePressed() callback — single click
 *  • keyIsDown() — held keys
 *  • keyPressed() / key — single key events
 */
import p5 from 'p5';

const sketch = (p) => {
  const clicks    = [];   // positions of all clicks
  const messages  = [];   // key-press messages
  const MAX_MSG   = 6;

  p.setup = () => {
    p.createCanvas(800, 550);
    p.textFont('monospace');
  };

  p.draw = () => {
    p.background(10, 14, 30, 220);

    // --- Crosshair following mouse ---
    p.stroke(80, 160, 255, 160);
    p.strokeWeight(1);
    p.line(p.mouseX, 0, p.mouseX, p.height);
    p.line(0, p.mouseY, p.width, p.mouseY);

    // --- Circle that grows while mouse is held ---
    const held = p.mouseIsPressed;
    const r    = held ? 60 : 20;
    p.fill(held ? p.color(255, 120, 60, 180) : p.color(80, 180, 255, 180));
    p.noStroke();
    p.ellipse(p.mouseX, p.mouseY, r, r);

    // --- Keyboard: WASD moves a box ---
    if (!('bx' in p)) { p.bx = p.width / 2; p.by = p.height / 2; }
    const spd = 3;
    if (p.keyIsDown(87)) p.by -= spd; // W
    if (p.keyIsDown(83)) p.by += spd; // S
    if (p.keyIsDown(65)) p.bx -= spd; // A
    if (p.keyIsDown(68)) p.bx += spd; // D
    p.bx = p.constrain(p.bx, 20, p.width  - 20);
    p.by = p.constrain(p.by, 20, p.height - 20);

    p.fill(80, 255, 180, 200);
    p.stroke(120, 255, 200);
    p.strokeWeight(2);
    p.rect(p.bx - 20, p.by - 20, 40, 40, 6);

    // --- Previous click trails ---
    clicks.forEach(({ x, y, age }) => {
      p.noStroke();
      p.fill(255, 200, 80, p.map(age, 0, 120, 200, 0));
      p.ellipse(x, y, 12, 12);
    });
    for (let i = clicks.length - 1; i >= 0; i--) {
      clicks[i].age++;
      if (clicks[i].age > 120) clicks.splice(i, 1);
    }

    // --- HUD ---
    p.noStroke();
    p.fill(170, 200, 230);
    p.textSize(13);
    const lines = [
      `mouse : (${p.mouseX}, ${p.mouseY})`,
      `pressed: ${held}`,
      `box pos: (${Math.round(p.bx)}, ${Math.round(p.by)})`,
      `Use WASD to move the green box`,
      `Click anywhere to leave a dot`,
    ];
    lines.forEach((l, i) => p.text(l, 14, 22 + i * 18));

    // Key messages
    p.fill(255, 200, 100);
    p.textSize(12);
    messages.forEach((m, i) => p.text(m, 14, p.height - 14 - (messages.length - 1 - i) * 18));
  };

  p.mousePressed = () => {
    clicks.push({ x: p.mouseX, y: p.mouseY, age: 0 });
  };

  p.keyPressed = () => {
    messages.push(`keyPressed: "${p.key}" (code ${p.keyCode})`);
    if (messages.length > MAX_MSG) messages.shift();
  };
};

new p5(sketch);
