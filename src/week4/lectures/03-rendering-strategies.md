# Rendering Strategies

> *"Premature optimization is the root of all evil — but the Mandelbrot set is the exception that proves the rule."*

## 1. The big idea

The Mandelbrot algorithm is correct in three lines, but a naïve implementation will freeze your browser. A 700×400 canvas with 128 iterations is up to **35 million** complex multiplies *per frame*. To keep the page interactive we use three tricks: (1) talk to the pixel buffer directly with `loadPixels()` instead of calling `point()`; (2) precompute a **colour palette** and look it up by integer index; (3) render the image **incrementally**, one column per frame, so the event loop stays responsive. Each trick is independent and each one is essential.

## 2. Where this comes from

Pixel-level graphics on the web are unfairly expensive. Every call into the 2-D canvas API crosses the JavaScript ↔ C++ boundary, validates arguments, sets state, and goes through compositing. For a single rectangle that is fine; for 280 000 individual `point()` calls per frame it is a disaster. The standard remedy, exposed in p5.js as `loadPixels()` / `pixels[]` / `updatePixels()`, is to copy the entire pixel buffer into a typed array, mutate it in plain JavaScript (which the JIT can optimise), then commit the whole thing back in a single call.

The colour palette idea is even older. Early frame buffers (the 1980s, the Apple II, EGA, VGA) had so little video memory that they stored an *index* per pixel and a separate small **palette** mapping indices to RGB. This was a hardware necessity, but it had a side effect that fractal artists exploited heavily: by *cycling* the palette (rotating its entries) you could animate a Mandelbrot image without recomputing a single iteration. The Mandelbrot poster art of the late 80s — psychedelic colour waves rolling across a static fractal — is just palette cycling.

The third idea — **incremental rendering** — is the modern equivalent of the same insight. JavaScript on the main thread is single-threaded and cooperative: if your `draw()` call takes 5 seconds, the page is frozen for 5 seconds, and the user sees nothing until the very end. By doing only a small chunk of work per frame and yielding back to the browser, we get a visible progress sweep, smooth interaction, and the option to stop early or to zoom mid-render. Modern alternatives (Web Workers, `OffscreenCanvas`, WebGPU shaders) are faster still, but for a teaching sketch the per-frame chunking is the simplest pattern that already feels good.

These three ideas — direct pixel writes, palette indexing, and incremental work — apply far beyond fractals. Any pixel-by-pixel image generator (ray-marched signed distance fields, reaction-diffusion, cellular automata visualisations) benefits from exactly the same recipe.

## 3. The model

The pixel buffer is a flat `Uint8ClampedArray` of length `4 * width * height`, laid out as `RGBA, RGBA, RGBA, …` row by row. To address pixel `(x, y)`:

```
idx = 4 * (y * width + x)
pixels[idx + 0] = red    // 0..255
pixels[idx + 1] = green
pixels[idx + 2] = blue
pixels[idx + 3] = alpha  // 255 = opaque
```

Always wrap mutations in `loadPixels()` … `updatePixels()`. Forgetting `updatePixels()` means your changes are made to a stale local copy and never reach the screen.

The colour palette pattern: precompute `palette[i] = color(...)` for `i = 0..maxIterations`. At render time, the inner loop becomes a single array index, never a colour computation. As a bonus, `palette[maxIterations]` can be set to *any* sentinel colour (we use black) to mark interior points distinctly.

The incremental rendering pattern: keep a cursor (here `currentX`) on the object. Each frame, advance the cursor by some chunk and draw only those columns. Return a flag when done so the caller can stop.

## 4. In our code

`renderColumn` ties all three patterns together: pull the column's `cReal`, walk down the column writing into the pixel buffer, advance the cursor.

```javascript
renderColumn() {
  const p = this.p;
  if (this.currentX >= p.width) return true;

  const x = this.currentX;
  const cReal = this.#mapXToReal(x);

  p.loadPixels();
  for (let y = 0; y < p.height; y++) {
    const iter = this.#getIterations(cReal, this.#mapYToImag(y));
    const col  = this.palette[iter];
    const idx  = 4 * (y * p.width + x);
    p.pixels[idx]     = p.red(col);
    p.pixels[idx + 1] = p.green(col);
    p.pixels[idx + 2] = p.blue(col);
    p.pixels[idx + 3] = 255;
  }
  p.updatePixels();

  this.currentX++;
  return false;
}
```
*— `src/week4/Mandelbrot.js:83-104` (`renderColumn`)*

The driver in `sketch.js` decides how aggressive to be. Here we render four columns per frame — fast enough that the sweep is brisk on a modern laptop, slow enough that the page never stutters.

```javascript
if (!done) {
  // Render a few columns per frame for a visible sweep effect
  for (let i = 0; i < 4; i++) {
    done = mandelbrot.renderColumn();
    if (done) break;
  }
}
```
*— `src/week4/sketch.js:23-29` (`p.draw`)*

The palette is built once, in the constructor, in three bands so the gradient is visually richer than a single linear ramp would be.

```javascript
// Deep blue gradient for low iterations
for (let i = 0; i < 16; i++) {
  palette.push(p.color(i * 8, i * 8, 128 + i * 4));
}
// Bright blue/white for mid iterations
for (let i = 16; i < 64; i++) {
  palette.push(p.color(128 + i - 16, 128 + i - 16, 192 + i - 16));
}
```
*— `src/week4/Mandelbrot.js:36-43` (`#generatePalette`)*

The HUD reads the cursor directly to compute progress, which costs nothing because `currentX` is just a number.

```javascript
const pct = Math.min(100, Math.round((mandelbrot.currentX / p.width) * 100));
p.text(done ? 'Rendering complete' : `Rendering… ${pct}%`, 10, p.height - 10);
```
*— `src/week4/sketch.js:38-39` (`drawHUD`)*

## 5. Try it

1. **Increase the chunk size.** In `sketch.js`, change the inner loop from `i < 4` to `i < p.width`, which renders the whole image in a single frame. Time it (open DevTools → Performance). At what `maxIterations` does the page start to feel laggy?
   <details><summary>Hint</summary>On a typical laptop the full 700×400 at `maxIterations = 128` takes ~200–500 ms — already a noticeable hitch. Bumping to `512` makes the freeze multi-second. That is exactly why we chunked it.</details>

2. **Palette cycling.** Add an `offset` field to `Mandelbrot` and, when looking up `palette[iter]`, use `palette[(iter + offset) % palette.length]` instead. Increment `offset` each frame and call a new `recolor()` method that walks `pixels[]` and rewrites colours *without* re-running the iteration. The fractal should pulse with colour at 60 fps.
   <details><summary>Hint</summary>You will need to remember the iteration count per pixel — store it in a `Uint16Array` of size `width * height` during the initial render. `recolor()` then iterates over that array, does the palette lookup with the offset, and writes RGBA into `pixels[]`.</details>

3. **Render in tiles, not columns.** Change `renderColumn` to `renderTile(size = 32)` that draws a `size × size` square per call, in row-major order. Does this give a more pleasant progress animation than the left-to-right sweep?
   <details><summary>Hint</summary>Track `currentTileX, currentTileY` instead of `currentX`. Inner loops go `for (let y = ty; y < ty + size; y++)` and `for (let x = tx; x < tx + size; x++)`, clamped to canvas bounds. Tiles are also the natural unit if you ever move to Web Workers — one worker per tile.</details>

## 6. Going further

- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 8 — Fractals. <https://natureofcode.com/fractals/>
- p5.js Reference — `loadPixels()`, `pixels[]`, `updatePixels()`. <https://p5js.org/reference/#/p5/loadPixels>
- The Coding Train — *Coding Challenge #21: Mandelbrot Set with p5.js.* <https://thecodingtrain.com/challenges/21-mandelbrot-set-with-p5-js>
- MDN — *Pixel manipulation with canvas.* <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas>
- Smith, Alvy Ray (1995). *A Pixel Is Not A Little Square.* Microsoft Tech Memo 6.
