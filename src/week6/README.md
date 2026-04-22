# Week 6 — Viral Bloom (Capstone)

*"When all the forces of nature converge, something beautiful emerges."*

This is the capstone project for the course. **Viral Bloom** is a bioluminescent generative art scene that combines every technique you've learned:

| Technique | From | Role in Viral Bloom |
|-----------|------|---------------------|
| Perlin noise flow field | Week 1 + 3 | Animated current that guides star particles |
| Physics particles | Week 2 | Bioluminescent streamers that follow the flow field |
| Steering behaviors | Week 3 | Evolving viruses navigate toward a drifting target |
| Mandelbrot texture | Week 4 | Organic fractal overlay rendered incrementally |
| Genetic algorithms | Week 5 | Virus population evolves across generations |

---

## How It Works

### 1. Animated Flow Field (`FlowField.js`)

Unlike the static flow field in Week 3, the Viral Bloom flow field **animates over time** by advancing the noise z-offset each frame:

```javascript
update() {
  // ... sample noise(xoff, yoff, this.zoff) for each cell ...
  this.zoff += 0.004;  // slowly drift through 3D noise space
}
```

### 2. Bioluminescent Star Particles (`Star.js`)

Each `Star`:
- Follows the flow field using a seek-like steering force
- Leaves a glowing trail of recent positions
- Fades out over its lifespan (`255 → 0`)
- Wraps around canvas edges
- Is replaced by a newly spawned star each frame

```javascript
follow(field) {
  const desired = field.lookup(this.pos);
  desired.setMag(this.maxspeed);
  const steer = p5.Vector.sub(desired, this.vel);
  steer.limit(0.3);
  this.applyForce(steer);
}
```

### 3. Evolving Virus Population (`Population.js`)

Reuses `DNA` and `Virus` from Week 5. The target antibiotic drifts slowly via Perlin noise, so the population must continuously adapt.

### 4. Mandelbrot Texture (`Mandelbrot.js`)

Uses an offscreen `p5.Graphics` buffer. Renders 3 columns per frame with a bioluminescent teal palette. Interior points are transparent so the animation shows through.

---

## Controls

| Input | Action |
|-------|--------|
| Click | Snap target to mouse position |
| Press `F` | Toggle flow field arrow overlay |
| Press `R` | Restart Mandelbrot texture render |

---

## Capstone Challenge

Build your own Viral Bloom variant. Some ideas:

1. **Colour evolution** — Encode colour hue as part of the DNA. Viruses that reach the target pass on their colour. Watch the population converge on a dominant hue.

2. **Predator-prey** — Add a second population of "antibodies" that seek the most-fit viruses. The prey evolve to evade; the predators evolve to catch.

3. **Sound reactive** — Use the Web Audio API to map audio amplitude to the flow field speed and particle spawn rate.

4. **Multi-target** — Place 3 targets at the vertices of a triangle. The virus population evolves to split its effort across all three targets.

5. **Export** — Capture the canvas as a PNG or animated GIF at peak visual beauty. What generation produces the most interesting geometry?

---

## Architecture Notes

```
src/week6/
├── sketch.js       ← main scene, orchestrates everything
├── FlowField.js    ← animated Perlin noise flow field
├── Star.js         ← bioluminescent flow-following particle
├── Population.js   ← wraps week5 Population logic
├── Mandelbrot.js   ← offscreen buffer fractal texture
└── README.md       ← this file

Dependencies from week5/:
├── DNA.js
├── Virus.js
└── Antibiotic.js
```

This cross-week import structure shows how modular ES2022 classes scale from a single sketch to a multi-file application.
