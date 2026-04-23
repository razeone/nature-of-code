# Implementing Perlin Noise in p5.js

> *"Make it smooth. Make it cheap. Make it tile."* — informal motto of every shader programmer

## 1. The big idea

p5.js ships an implementation of Perlin noise as `p.noise()`. The function takes one, two, or three coordinates and returns a value in `[0, 1]`. The art isn't in the implementation — Perlin and his successors did that work for us — it's in deciding *how to feed it inputs*. This lecture walks through the practical decisions: independent offsets per object, step size as a knob, mapping the output, and using extra dimensions for time.

## 2. Where this comes from

The 1985 algorithm has three pieces: a permutation table that fakes randomness deterministically, a set of gradient vectors at integer lattice points, and a smoothing function that blends contributions from the surrounding lattice corners. p5's `noise()` is a JavaScript port of the classic implementation, with the lattice resolution and octave behavior controllable through `noiseDetail`.

In production graphics work, Perlin noise has largely been replaced by **simplex noise**, a 2001 redesign also by Ken Perlin. Simplex uses a triangular lattice instead of a square one, scales better to higher dimensions (`O(n²)` instead of `O(2ⁿ)`), and avoids the directional artifacts you can sometimes see in classical Perlin. Most game engines and shading languages today use simplex or one of its descendants (OpenSimplex, FastNoiseLite). For 2D creative coding, the difference is rarely visible.

What matters is that p5 gave us a single function that *just works*. So the job becomes: how do we use it? The Week 1 sketch is a small case study. Three vertices of a triangle each pull their position from noise, and the trick is keeping their motions visibly *independent*.

## 3. The model

There are four design knobs you'll reach for again and again:

```
1. Offset       — where in noise space you sample (per object)
2. Step size    — how fast the offset advances each frame
3. Output map   — how you remap [0, 1] into pixels, angles, colors…
4. Dimensions   — 1D for time series, 2D for fields, 3D for animated fields
```

To make two objects move *independently*, give them offsets that are far apart. `noise(0.001)` and `noise(0.002)` are nearly identical; `noise(0.001)` and `noise(50)` look unrelated. A common pattern is `this.noff = p.random(1000)` per particle.

To make a single value *animate over time* you don't pass time directly. You pass a slowly-incrementing offset:

```
const value = p.noise(xoff) * range;
xoff += step;          // step ≈ 0.005–0.02 for "slow and natural"
```

For animated 2D fields (the basis of flow fields and procedural clouds) you sample 3D noise where the third coordinate is time:

```
const v = p.noise(x * scale, y * scale, time);
time += 0.01;
```

## 4. In our code

**Independent offsets per vertex.** The triangle's three vertices each live in their own region of noise space, separated by large gaps so they don't correlate. This is the offset-as-identity pattern.

```javascript
// Each vertex has an x-offset and y-offset, spaced apart so they're independent
offsets = [
  { x: 0.0,   y: 10.0  },   // vertex A
  { x: 20.0,  y: 30.0  },   // vertex B
  { x: 40.0,  y: 50.0  },   // vertex C
];
```
*— `src/week1/sketch.js:23-28` (`p.setup`)*

**Sample, then advance.** Every frame, each vertex's `(px, py)` comes from a fresh noise lookup; afterward we step every offset forward by `speed`. Sampling first and advancing second keeps the math easy to reason about.

```javascript
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
```
*— `src/week1/sketch.js:36-46` (`p.draw`)*

**Step size as a UI knob.** Holding the mouse switches the step from `0.005` to `0.03`, a 6× jump. The motion changes character: from gentle drift to twitchy chaos. This is the cheapest, most informative knob in the noise toolbox.

```javascript
const NOISE_SPEED = 0.005;
const TURBO_SPEED = 0.03; // speed when mouse is held
```
*— `src/week1/sketch.js:16-17` (sketch body)*

**Output mapping.** `noise()` returns `[0, 1]`. To get pixels we multiply by `p.width`/`p.height`. To get an angle we'd map to `[0, TWO_PI]`. The Week 0 particle does exactly that for steering:

```javascript
// Perlin noise steering force
const theta = p.map(p.noise(pt.noff), 0, 1, 0, p.TWO_PI * 2);
pt.applyForce(p5.Vector.fromAngle(theta).mult(0.1));
```
*— `src/week0/lessons/07-moving-object.js:108-110` (sketch body)*

## 5. Try it

1. **Recolor the triangle (easy).** Modify the Week 1 sketch so the triangle's hue is also noise-driven. Add a fourth offset, sample it, and `p.map` it to a hue in `[0, 360]`.
   <details><summary>Hint</summary>`const hueOff = ...; const h = p.map(p.noise(hueOff), 0, 1, 0, 360); p.fill(h, 60, 80, 70);` Don't forget to advance `hueOff` each frame, and to be in HSB color mode.</details>

2. **Flow field (medium).** Build a 20×15 grid of short line segments. The angle of each line is `noise(i * 0.1, j * 0.1) * TWO_PI * 2`. Animate it by adding a third noise argument that increments slowly.
   <details><summary>Hint</summary>Two nested loops over `i, j`. `const a = p.noise(i*0.1, j*0.1, t) * p.TWO_PI * 2; const dx = cos(a) * 12; const dy = sin(a) * 12;` Then draw a line from the cell center to that offset.</details>

3. **Mountain skyline (harder).** Draw an animated horizon line. Use `beginShape` and a loop of vertices whose y is `noise(i * 0.02, t) * height/2 + height/2`. Increment `t` each frame to make the mountains gently shift.
   <details><summary>Hint</summary>Close the shape down to the bottom corners with two extra vertices so you can fill it. Try `noiseDetail(4, 0.5)` to add layered "octaves" for ridgier mountains.</details>

## 6. Going further

- Shiffman, Daniel. *The Nature of Code* (2024), "Introduction" — Perlin noise. https://natureofcode.com/random/#perlin-noise
- Perlin, Ken (2002). "Improving Noise." SIGGRAPH '02. https://mrl.cs.nyu.edu/~perlin/paper445.pdf
- p5.js Reference — `noise()`, `noiseSeed()`, `noiseDetail()`. https://p5js.org/reference/p5/noise/
- The Coding Train — "Polar Perlin Noise Loops." https://thecodingtrain.com/challenges/136-polar-perlin-noise-loops
- Quílez, Iñigo. "Value noise vs Perlin noise." https://iquilezles.org/articles/morenoise/
- Reynolds, Craig (1999). "Steering Behaviors For Autonomous Characters" (flow fields). https://www.red3d.com/cwr/steer/
