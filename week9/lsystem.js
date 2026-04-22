// Lindenmayer system (L-system): a grammar that rewrites strings.
// Each character is a drawing instruction for a "turtle":
//   F  draw forward
//   +  turn right by angle
//   -  turn left by angle
//   [  push state (position + heading)
//   ]  pop state
//   X  placeholder (no drawing, but rewritten by rules)
//
// Presets below come from Prusinkiewicz & Lindenmayer, "The Algorithmic Beauty of Plants".
const PRESETS = {
  plant: {
    axiom: 'X',
    rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' },
    angle: 22.5,
    step: 6,
    maxIter: 6,
    hue: [90, 140]
  },
  koch: {
    axiom: 'F',
    rules: { F: 'F+F-F-F+F' },
    angle: 90,
    step: 4,
    maxIter: 5,
    hue: [200, 260]
  },
  sierpinski: {
    axiom: 'F-G-G',
    rules: { F: 'F-G+F+G-F', G: 'GG' },
    angle: 120,
    step: 4,
    maxIter: 6,
    hue: [0, 40]
  },
  dragon: {
    axiom: 'FX',
    rules: { X: 'X+YF+', Y: '-FX-Y' },
    angle: 90,
    step: 6,
    maxIter: 12,
    hue: [280, 330]
  }
};

// Apply the rewrite rules `n` times. This is the engine of the L-system —
// a single line grows exponentially into a detailed shape.
function expand(axiom, rules, n) {
  let s = axiom;
  for (let i = 0; i < n; i++) {
    let out = '';
    for (const c of s) out += rules[c] !== undefined ? rules[c] : c;
    s = out;
  }
  return s;
}

// Walk the string with a turtle and draw it.
// Passing a `rng` (seeded random) lets us add a touch of wiggle per branch
// without losing determinism when iterations change.
function drawLSystem(sentence, opts) {
  const { step, angleDeg, hueRange, jitter = 0 } = opts;
  const a = radians(angleDeg);
  const stack = [];
  let depth = 0;

  for (let i = 0; i < sentence.length; i++) {
    const c = sentence[i];
    if (c === 'F' || c === 'G') {
      const s = step * (1 - depth * 0.04);
      const hue = lerp(hueRange[0], hueRange[1], depth / 10);
      const weight = max(0.4, 4 - depth * 0.35);
      stroke(hue, 60, 90, 0.9);
      strokeWeight(weight);
      line(0, 0, 0, -s);
      translate(0, -s);
    } else if (c === '+') {
      rotate(a + (noise(i * 0.1) - 0.5) * jitter);
    } else if (c === '-') {
      rotate(-a + (noise(i * 0.1) - 0.5) * jitter);
    } else if (c === '[') {
      push();
      depth++;
    } else if (c === ']') {
      pop();
      depth--;
    }
  }
}
