# The Mandelbrot Set

> *"Clouds are not spheres, mountains are not cones... Nature exhibits not simply a higher degree but an altogether different level of complexity." — Benoît Mandelbrot*

## 1. The big idea

The **Mandelbrot set** is the set of complex numbers `c` for which the iteration `z₀ = 0`, `zₙ₊₁ = zₙ² + c` stays bounded forever. That is the entire definition. From this two-line rule emerges the most intricate object in mathematics — a black silhouette whose boundary, magnified to any depth, never stops revealing new spirals, mini-copies of itself, and seahorse-shaped valleys. Every pixel of next week's render is one experiment with one value of `c`.

## 2. Where this comes from

The story starts with two French mathematicians during World War I. **Pierre Fatou** and **Gaston Julia** independently studied what happens when you iterate a polynomial in the complex plane: which starting points stay bounded, which escape to infinity? Julia's 1918 paper described the elaborate fractal sets — now called *Julia sets* — that form the boundary between the two fates. But without computers, neither could *see* what they had described.

Sixty years later, in 1980, **Benoît Mandelbrot** at IBM's Watson Research Center had access to a mainframe and a printer. He was investigating the *parameter space* of Julia's iteration: instead of fixing `c` and asking which `z₀` stay bounded, he fixed `z₀ = 0` and asked which `c` stay bounded. The image he printed — black blob, antennae, satellites — was published in 1980 in *Annals of the New York Academy of Sciences* under the title *"Fractal aspects of the iteration of `z ↦ λz(1−z)`"*. Two years later he wrote the popular book *The Fractal Geometry of Nature* and gave the world the word *fractal*.

What makes the set famous is that it contains shrunken copies of itself everywhere on its boundary. Adrien Douady and John H. Hubbard proved in 1982 that the set is **connected** (the dust-like islands you see at low resolution are actually attached by filaments thinner than a pixel) and that it is the universal moduli space for quadratic Julia sets — every Julia set is in some sense "indexed" by a point of the Mandelbrot set. So by drawing the Mandelbrot set you are drawing a catalogue of all quadratic dynamical systems at once.

For us, the practical takeaway is simpler: a single closed-form formula, run a hundred times per pixel, produces an image of unbounded complexity. That is the magic of iteration.

## 3. The model

The iteration is:

```
z₀     = 0
z_{n+1} = z_n² + c
```

For each candidate `c`, ask: does the sequence `z₀, z₁, z₂, …` stay bounded? It can be proven that:

```
if ever  |z| > 2,  then |z| → ∞   (escape guaranteed)
```

So we have a clean **escape criterion**: iterate until either (a) `|z| > 2` (escaped — `c` is **not** in the set) or (b) we hit a maximum iteration count `N` (assumed to be in the set). The number of iterations before escape is called the **escape time**, and using it to colour the pixel produces the iconic banded look.

In components, with `z = a + bi` and `c = cReal + cImag i`:

```
a_{n+1} = a_n² − b_n² + cReal
b_{n+1} = 2 a_n b_n     + cImag
escape when  a² + b² > 4    // equivalent to |z| > 2
```

That is the whole algorithm. There is no clever trick, no closed-form shortcut — just brute iteration. What varies between implementations is *colouring*, *zoom*, and *speed*, which is the subject of the next lecture.

## 4. In our code

The escape-time loop is the heart of `Mandelbrot.js`. Notice how it mirrors the model line for line.

```javascript
#getIterations(cReal, cImag) {
  let zReal = 0, zImg = 0, iter = 0;

  while (zReal * zReal + zImg * zImg < 4 && iter < this.maxIterations) {
    const tmpReal = zReal * zReal - zImg * zImg + cReal;
    const tmpImg  = 2 * zReal * zImg + cImag;
    // Period-2 bulb check: if orbit is stuck, it's interior
    if (zReal === tmpReal && zImg === tmpImg) { iter = this.maxIterations; break; }
    zReal = tmpReal;
    zImg  = tmpImg;
    iter++;
  }
  return iter;
}
```
*— `src/week4/Mandelbrot.js:64-77` (`#getIterations`)*

`z₀ = 0` is encoded by initialising `zReal = 0, zImg = 0`. The `while` condition `zReal² + zImg² < 4` is the escape test `|z|² < 4`. The two `tmp` lines are the real and imaginary parts of `z² + c`. The "period-2 bulb" early-exit is a pure optimisation — if the new `z` exactly equals the previous one, the orbit is a fixed point and will never escape, so we can short-circuit to `maxIterations` right away.

The number returned (`iter`) is then used as an index into a precomputed colour palette:

```javascript
const iter = this.#getIterations(cReal, this.#mapYToImag(y));
const col  = this.palette[iter];
```
*— `src/week4/Mandelbrot.js:92-93` (`renderColumn`)*

The palette is built once in the constructor, with three bands and a black "interior" entry at `palette[maxIterations]` so points that never escape come out solid black.

```javascript
// Interior: black
palette[max] = p.color(0, 0, 0);
return palette;
```
*— `src/week4/Mandelbrot.js:48-50` (`#generatePalette`)*

The viewing window is set in the constructor — by default `[-2.5, 1.0] × [-1.0, 1.0]`, which is the standard frame that fits the whole set with a little headroom.

```javascript
constructor(p, maxIterations = 128, x1 = -2.5, x2 = 1.0, y1 = -1.0, y2 = 1.0) {
```
*— `src/week4/Mandelbrot.js:19` (`constructor`)*

## 5. Try it

1. **Trace an orbit by hand.** Take `c = −1 + 0i` and iterate `zₙ₊₁ = zₙ² + c` starting from `z₀ = 0` for five steps. Does it escape? What about `c = 1 + 0i`?
   <details><summary>Hint</summary>For `c = −1`: 0, −1, 0, −1, 0 — bounded forever, **inside** the set. For `c = 1`: 0, 1, 2, 5, 26 — escaped after 3 steps, **outside**.</details>

2. **Increase `maxIterations`.** In `sketch.js`, change `new Mandelbrot(p, 128)` to `new Mandelbrot(p, 512)`. What changes about the boundary detail? What about render time?
   <details><summary>Hint</summary>More iterations let you correctly classify points whose orbits are slow to escape, so the boundary becomes finer and the black region shrinks slightly. Render time scales roughly linearly with the iteration cap.</details>

3. **Zoom in.** Change the constructor to `new Mandelbrot(p, 256, -0.75, -0.73, 0.10, 0.12)` and watch a tiny region near the "seahorse valley" fill the canvas. Try a few more windows of your own.
   <details><summary>Hint</summary>The window is `[x1, x2] × [y1, y2]` in the complex plane. Smaller windows = deeper zoom. Interesting spots: `(-0.745, 0.105)`, `(-1.401, 0.0)`, `(0.275, 0.005)`.</details>

## 6. Going further

- Mandelbrot, Benoît B. (1980). *Fractal aspects of the iteration of z ↦ λz(1−z).* Annals NY Acad Sci 357.
- Mandelbrot, Benoît B. (1982). *The Fractal Geometry of Nature.* W. H. Freeman.
- Devaney, Robert L. (2003). *An Introduction to Chaotic Dynamical Systems.* Westview.
- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 8 — Fractals. <https://natureofcode.com/fractals/>
- Numberphile — *What's so special about the Mandelbrot set?* <https://www.youtube.com/watch?v=FFftmWSzgmk>
- The Coding Train — *Coding Challenge #21: Mandelbrot Set with p5.js.* <https://thecodingtrain.com/challenges/21-mandelbrot-set-with-p5-js>
