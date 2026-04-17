# Week 4 — Fractals & the Mandelbrot Set

*"The boundary of the Mandelbrot set is where order meets chaos."*

A fractal is a self-similar geometric structure — zoom in and you see the same patterns repeating at every scale. The Mandelbrot set is the most famous fractal, born from a deceptively simple equation in the complex plane.

---

## 4.1 Complex Numbers — A Quick Refresher

A complex number has a **real** part and an **imaginary** part:

```
c = a + bi
```

Where `i² = -1`. We visualise complex numbers as points on a 2D plane:
- horizontal axis = real part
- vertical axis = imaginary part

**Multiplication rule:**

```
(a + bi)(c + di) = (ac − bd) + (ad + bc)i
```

---

## 4.2 The Mandelbrot Iteration

For each pixel `(px, py)` on the canvas we compute a complex number `c` and repeatedly apply:

```
z_(n+1) = z_n² + c
```

Starting with `z_0 = 0`. We count how many iterations before `|z| ≥ 2` (the escape condition). If the sequence never escapes within `maxIterations` steps, the point is **inside** the Mandelbrot set (coloured black).

```javascript
getIterations(cReal, cImag) {
  let zReal = 0, zImg = 0, iter = 0;

  while (zReal*zReal + zImg*zImg < 4 && iter < this.maxIterations) {
    const tmpReal = zReal*zReal - zImg*zImg + cReal;   // real part of z²+c
    const tmpImg  = 2*zReal*zImg + cImag;               // imag part of z²+c
    zReal = tmpReal;
    zImg  = tmpImg;
    iter++;
  }
  return iter;   // escape time = number of iterations
}
```

Note: `|z|² < 4` is equivalent to `|z| < 2` (avoids a square root).

---

## 4.3 Mapping Pixels to Complex Numbers

The canvas is a window into the complex plane. We map:

```javascript
// Pixel (px, py) → complex number c = (cReal, cImag)
const cReal = cWidth  * px / width  + x1;  // x1 = -2.5, x2 = 1.0
const cImag = y1 + cHeight * py / height;  // y1 = -1.0, y2 = 1.0
```

---

## 4.4 Escape-Time Colouring

The escape time (iteration count) determines the colour. Points that escape quickly get one colour; slow escapees get another; interior points are black.

The palette in `Mandelbrot.js` uses three bands:
1. Deep blues for low iteration counts (near the set boundary but not inside)
2. Bright blue/white for mid-range
3. Cycling purple/white for high counts

```javascript
palette[maxIterations] = p.color(0, 0, 0);  // interior = black
```

---

## 4.5 Incremental Rendering

The Mandelbrot set is expensive to compute (each pixel needs up to 128 iterations). Instead of freezing the page, `Mandelbrot.js` renders **one column per call** to `renderColumn()`:

```javascript
// In sketch.js draw():
for (let i = 0; i < 4; i++) {
  done = mandelbrot.renderColumn();
}
```

This gives a visible left-to-right sweep and keeps the frame rate smooth.

---

## 4.6 Using `loadPixels()` / `updatePixels()`

Direct pixel manipulation is much faster than calling `p.point()` for every pixel:

```javascript
p.loadPixels();
for (let y = 0; y < height; y++) {
  const idx = 4 * (y * width + x);   // RGBA: 4 bytes per pixel
  p.pixels[idx]     = red;
  p.pixels[idx + 1] = green;
  p.pixels[idx + 2] = blue;
  p.pixels[idx + 3] = 255;            // alpha = opaque
}
p.updatePixels();
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| Complex plane | 2D space where x = real, y = imaginary |
| Escape time | Iterations before `\|z\| > 2` |
| Interior | Points that never escape = Mandelbrot set |
| Colour palette | Maps escape time → colour |
| `loadPixels()` | Direct pixel buffer access |

---

## Challenges

1. **Zoom** — Map mouse position to adjust `x1, x2, y1, y2` ranges. Click to zoom into interesting regions.
2. **Smooth colouring** — Replace integer escape time with the *continuous* (fractional) escape time formula to eliminate colour banding.
3. **Julia sets** — A Julia set uses a fixed `c` and varies the starting `z`. Modify the iteration to compute the Julia set for `c = -0.7 + 0.27i`.
4. **Other fractals** — Implement the Burning Ship fractal by replacing `z² + c` with `(|Re(z)| + i|Im(z)|)² + c`.
