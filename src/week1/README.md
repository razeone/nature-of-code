# Week 1 — Perlin Noise

*"Randomness in nature is not chaotic — it flows."*

In this week we explore **Perlin noise**: a smoothly varying pseudo-random function invented by Ken Perlin for the film *Tron* (1982). Unlike pure randomness (`Math.random()`), Perlin noise produces values that change gradually, giving animations an organic, natural feel.

---

## 1.1 The Problem with Pure Randomness

```javascript
// This flickers wildly — unusable for smooth animation
const x = p.random(0, p.width);  // jumps everywhere each frame
```

What we want is a value that *drifts* rather than jumps.

---

## 1.2 Perlin Noise Basics

```javascript
// p.noise() always returns a value in [0, 1]
const n = p.noise(xoff);          // 1D noise at position xoff

// Move through noise space each frame
xoff += 0.01;                      // small step = smooth motion
```

The key insight: **the input to `noise()` is a position in noise space**, not a time value. Moving slowly through this space produces smooth variation.

```javascript
// Map noise output to canvas coordinates
const x = p.noise(xoff) * p.width;   // x in [0, width]
const y = p.noise(yoff) * p.height;  // y in [0, height]
```

---

## 1.3 2D Perlin Noise

By passing two arguments you sample a 2D noise field — great for textures and flow fields:

```javascript
const n = p.noise(xoff, yoff);
// Different values but still smooth in both dimensions
```

---

## 1.4 The Triangle Demo

In `sketch.js` each vertex of the triangle has its own **independent region** of noise space (separated by large offsets so they don't correlate):

```javascript
// Vertex A lives around xoff=0, Vertex B around xoff=20, etc.
offsets = [
  { x: 0.0,  y: 10.0 },   // Vertex A
  { x: 20.0, y: 30.0 },   // Vertex B
  { x: 40.0, y: 50.0 },   // Vertex C
];

// Each frame: sample noise and advance
const px = p.noise(off.x) * p.width;
const py = p.noise(off.y) * p.height;
off.x += speed;
off.y += speed;
```

---

## 1.5 Turbo Mode (Mouse)

Holding the mouse button increases the advance speed:

```javascript
const speed = p.mouseIsPressed ? TURBO_SPEED : NOISE_SPEED;
// TURBO_SPEED is 6× faster → more erratic, chaotic motion
```

This shows how the *step size* controls the character of the noise.

---

## 1.6 noiseSeed

For reproducible results, set the noise seed before your sketch runs:

```javascript
p.noiseSeed(42);  // same seed → same noise every run
```

Omitting `noiseSeed` gives a different noise field each time the page loads.

---

## Key API Reference

| Function | Description |
|----------|-------------|
| `p.noise(x)` | 1D Perlin noise value in `[0, 1]` |
| `p.noise(x, y)` | 2D Perlin noise |
| `p.noise(x, y, z)` | 3D Perlin noise (great for animated textures) |
| `p.noiseSeed(n)` | Set the noise seed for reproducibility |
| `p.noiseDetail(lod, falloff)` | Control octaves and falloff |
| `p.map(v, a, b, c, d)` | Remap a value from range [a,b] to [c,d] |

---

## Challenges

1. **Noise landscape** — Use 2D Perlin noise (`noise(x, y)`) to colour every pixel: map the value to a blue→green gradient to create a heightmap.
2. **Noise walker** — Create a `Walker` class whose position drifts via Perlin noise. Give it a colour that also comes from noise.
3. **Noise mountain** — Draw a `beginShape()` curve where each vertex's y-height is determined by `noise(xoff + i * 0.05) * height * 0.5`. Create an animated mountain skyline.
4. **3D noise** — Add a third noise argument that increases each frame: `noise(xoff, yoff, zoff)`. How does this change the animation?
