# Complex Numbers

> *"Imaginary numbers are a fine and wonderful refuge of the divine spirit." — Leibniz*

## 1. The big idea

A **complex number** is just a pair `(a, b)` of real numbers with a special rule for multiplication. Geometrically it is a point in a 2-D plane; algebraically it is what you need to solve `x² + 1 = 0`. The Mandelbrot set lives in this plane, and every pixel on our canvas next week is a complex number we are squaring and adding to itself, over and over. So before we can iterate, we need a 5-minute refresher on the algebra.

## 2. Where this comes from

Complex numbers were invented kicking and screaming. In the 1500s Italian algebraists (Cardano, Bombelli) noticed that the cubic-equation formula sometimes required taking square roots of negative numbers *as an intermediate step*, even when the final answer was a perfectly real integer. Bombelli, in 1572, swallowed his discomfort and worked with `√−1` mechanically — and the formula gave correct results.

For two centuries they were called "imaginary" or "impossible" numbers. It took Caspar Wessel (1799), Jean-Robert Argand (1806), and finally Carl Friedrich Gauss to give them a respectable home: the **complex plane**. Once you draw `a + bi` as the point `(a, b)`, the mystery dissolves. Addition is vector addition. Multiplication is rotation-and-scaling. Nothing imaginary about it.

The geometric reading is what makes complex numbers indispensable for our purposes. Multiplying by `i` rotates a point 90° counter-clockwise. Multiplying by `2i` rotates 90° *and* doubles its distance from the origin. Squaring `z` doubles its angle and squares its distance. That last fact — squaring doubles the angle — is exactly why iterating `z² + c` produces such intricate patterns: small differences in starting angle compound exponentially.

The Mandelbrot set, the Julia sets, the Riemann zeta function, quantum mechanics, AC circuit analysis, image filtering with the Fourier transform — all of these depend on the complex plane. For us, it is the *coordinate system* of next lecture's fractal.

## 3. The model

A complex number is `z = a + bi`, where `i² = −1`. We display it as the point `(a, b)`:
- horizontal axis = **real** part
- vertical axis = **imaginary** part

Addition is componentwise:

```
(a + bi) + (c + di) = (a + c) + (b + d)i
```

Multiplication is the only rule that requires care. Apply distribution and remember `i² = −1`:

```
(a + bi)(c + di) = ac + adi + bci + bdi²
                 = (ac − bd) + (ad + bc)i
```

The two formulas we will use over and over next week are the **square** and the **modulus** (length):

```
z²    = (a + bi)² = (a² − b²) + (2ab)i
|z|   = √(a² + b²)
|z|²  = a² + b²        // cheap: no square root
```

Geometrically, squaring `z` doubles its angle from the positive real axis and squares its distance from the origin. So a point on the unit circle stays on the unit circle but spins; a point with `|z| > 1` flies outward fast; a point with `|z| < 1` collapses toward zero. Hold on to that picture — it is the entire intuition for the Mandelbrot escape test.

## 4. In our code

We never construct a "complex number object" — we just carry the two real components `(zReal, zImg)` as plain `number`s. The square-and-add step `z² + c` is hand-coded from the multiplication rule above.

```javascript
const tmpReal = zReal * zReal - zImg * zImg + cReal;
const tmpImg  = 2 * zReal * zImg + cImag;
```
*— `src/week4/Mandelbrot.js:68-69` (`#getIterations`)*

Compare line by line with the algebra: `tmpReal = a² − b² + cReal` is the real part of `z² + c`; `tmpImg = 2ab + cImag` is the imaginary part. We then overwrite `zReal, zImg` with these new values for the next iteration.

The escape test uses `|z|² < 4` instead of `|z| < 2` to skip a square root — squaring both sides preserves the inequality and saves a `Math.sqrt` per iteration, which adds up over millions of pixels.

```javascript
while (zReal * zReal + zImg * zImg < 4 && iter < this.maxIterations) {
```
*— `src/week4/Mandelbrot.js:67` (`#getIterations`)*

The other place complex numbers show up is in **mapping pixels to the plane**. Each canvas column has a fixed real part (`cReal`); each row inside it gets its own imaginary part (`cImag`). Both are linear interpolations from canvas pixel coordinates to the complex window `[x1, x2] × [y1, y2]`.

```javascript
#mapXToReal(px)    { return this.cWidth  * px / this.p.width  + this.x1; }
#mapYToImag(py)    { return this.y1 + this.cHeight * py / this.p.height; }
```
*— `src/week4/Mandelbrot.js:53-56` (`#mapXToReal`, `#mapYToImag`)*

## 5. Try it

1. **Multiply by hand.** Compute `(2 + 3i) × (1 − 4i)` using the formula `(ac − bd) + (ad + bc)i`. Then verify by computing `2 × 1`, `2 × −4i`, `3i × 1`, `3i × −4i` separately and adding.
   <details><summary>Hint</summary>`a=2, b=3, c=1, d=−4`. Real: `2·1 − 3·(−4) = 2 + 12 = 14`. Imag: `2·(−4) + 3·1 = −5`. Answer: `14 − 5i`.</details>

2. **Square a point.** Take `z = 0.5 + 0.5i` and apply `z → z² + c` once, with `c = −0.5 + 0.5i`. Where does the point land? Is its modulus growing or shrinking?
   <details><summary>Hint</summary>`z² = (0.25 − 0.25) + (2·0.5·0.5)i = 0 + 0.5i`. Add `c`: `−0.5 + i`. Modulus jumped from `√0.5 ≈ 0.71` to `√1.25 ≈ 1.12`, so it is escaping outward.</details>

3. **Why `|z| > 2`?** Convince yourself that once `|z|` ever exceeds `2`, it must escape to infinity. (Hint: think about how big `z²` is compared to `c`.)
   <details><summary>Hint</summary>If `|z| > 2`, then `|z²| > 4 > 2 + |c|` whenever `|c| ≤ 2` (which holds for every `c` in the Mandelbrot window). So the next `|z|` is even larger, and the next, and the next — guaranteed escape.</details>

## 6. Going further

- Needham, Tristan (1997). *Visual Complex Analysis*, Oxford. The geometric bible.
- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 8 — Fractals. <https://natureofcode.com/fractals/>
- Devaney, Robert L. (2003). *An Introduction to Chaotic Dynamical Systems*, Westview.
- 3Blue1Brown — *Holomorphic dynamics & the Mandelbrot set.* <https://www.youtube.com/watch?v=LqbZpur38nw>
- p5.js Reference — `map()`. <https://p5js.org/reference/#/p5/map>
