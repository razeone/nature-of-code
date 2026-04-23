# Randomness vs. Noise

> *"Randomness in nature is not chaotic — it flows."*

## 1. The big idea

Pure pseudo-random numbers (`Math.random`, `p.random`) are uniformly distributed and independent: every sample is unrelated to the one before it. That's perfect for dice rolls, terrible for animation. **Perlin noise** is a different kind of randomness — neighboring samples are *correlated*, so the output drifts smoothly. The result feels organic instead of glitchy. Knowing when to reach for which is one of the most useful instincts in creative coding.

## 2. Where this comes from

In 1982 Disney commissioned a science-fiction film called *Tron*, in which characters travel inside a computer. The texture work was being done by a young programmer named Ken Perlin at Mathematical Applications Group, Inc. (MAGI). Perlin was frustrated: every CGI surface in the film looked too clean. Wood grain, marble, clouds, fire — all of it had a synthetic flatness. Real textures, he reasoned, are pseudo-random in a structured way: zoom in and you see fine detail; zoom out and you see broad shapes.

Three years later, at SIGGRAPH 1985, Perlin published "An image synthesizer," introducing the function we now call **Perlin noise**. The trick was elegant: lay down a grid of random gradient vectors, then for any point in space compute a smoothly-interpolated dot product against the nearest grid vectors. The result is a continuous function — close points in space give close output values — but with no obvious periodicity. In 1997 the technique won him an Academy Award for Technical Achievement.

In 2002 Perlin revisited the algorithm in "Improving Noise," replacing his original Hermite interpolation with a fifth-degree polynomial (`6t⁵ − 15t⁴ + 10t³`) that has continuous second derivatives. That fixed visible artifacts in normal maps and is the version most modern libraries — including p5.js — implement.

For our purposes the takeaway is simpler than the math: there is a function `noise(x)` that returns a value between 0 and 1, and small steps in `x` give small changes in the output. It is the key to organic-looking motion, terrain, and texture.

## 3. The model

Compare the two:

```
random(0, 1)   →  uniform, independent samples
                  next call: anything in [0, 1] with equal probability

noise(x)       →  smooth deterministic function
                  noise(x) and noise(x + 0.01) are very close
                  noise(x) and noise(x + 5)     are essentially unrelated
```

The single most important thing to internalize: **the input to `noise` is a position in noise space, not a time value.** You walk through this space at your own pace by incrementing an offset variable each frame:

```
xoff += 0.01    // small step → smooth drift
xoff += 0.5     // big step   → looks like pure random again
```

You can extend the same idea to 2D (`noise(x, y)` for textures and flow fields) or 3D (`noise(x, y, z)` to animate a 2D field over time). Every additional dimension multiplies the cost, but the API stays the same.

A useful analogy: imagine a hilly landscape that already exists. `random` teleports you to a new spot every frame. `noise` lets you walk across it.

## 4. In our code

**Pure randomness as an anti-pattern for animation.** The Week 1 README states the problem plainly: a value chosen with `p.random` jumps wildly each frame.

```javascript
// This flickers wildly — unusable for smooth animation
const x = p.random(0, p.width);  // jumps everywhere each frame
```
*— `src/week1/README.md:11-14` (section 1.1)*

**Noise as a position lookup.** A single `p.noise(xoff)` call returns a deterministic value in `[0, 1]`. Advance `xoff` slowly to glide across noise space.

```javascript
// p.noise() always returns a value in [0, 1]
const n = p.noise(xoff);          // 1D noise at position xoff

// Move through noise space each frame
xoff += 0.01;                      // small step = smooth motion
```
*— `src/week1/README.md:23-27` (section 1.2)*

**Step size controls character.** The Week 1 sketch reuses the same noise function but switches step size based on whether the mouse is held. Small steps look natural; large steps look frantic.

```javascript
const speed = p.mouseIsPressed ? TURBO_SPEED : NOISE_SPEED;
```
*— `src/week1/sketch.js:34` (sketch body)*

**Reproducibility.** Like `Math.random`, noise is deterministic given a seed. Set `noiseSeed` once and you get the same field every page load — invaluable for screenshots, animations, and debugging.

```javascript
p.noiseSeed(42);  // same seed → same noise every run
```
*— `src/week1/README.md:90` (section 1.6)*

## 5. Try it

1. **Random vs. noise side by side (easy).** Make two horizontal lines of dots, 100 each, across the canvas. The top line's y is `random(0, height/2)` per dot; the bottom line's y is `noise(i * 0.05) * (height/2) + height/2`. Compare.
   <details><summary>Hint</summary>Loop `i` from 0 to 99 with `p.ellipse(i * (width/100), yTop, 6)` and similar for the bottom. The contrast is the whole point — the top is jagged, the bottom undulates.</details>

2. **Animated noise drifter (medium).** Animate a single circle whose `x` and `y` come from `noise(xoff)` and `noise(yoff)`, with each offset advancing by `0.01` per frame. The two offsets should start far apart (e.g. 0 and 1000) so they don't correlate.
   <details><summary>Hint</summary>If you forget the offset trick, both axes will move identically and the circle will travel a diagonal. Use `let xoff = 0, yoff = 1000;` in the outer scope.</details>

3. **Noise step survey (harder).** Render five overlaid graphs of `noise(xoff)` over 400 samples, each with a different step size: `0.001, 0.01, 0.05, 0.1, 0.5`. Label each. Which one stops looking like noise and starts looking random?
   <details><summary>Hint</summary>Use `p.beginShape(); for (let i = 0; i < 400; i++) p.vertex(i, 100 + p.noise(i * step) * 80); p.endShape();`. Around `step = 0.5` the structure collapses — neighboring samples are no longer correlated.</details>

## 6. Going further

- Perlin, Ken (1985). "An image synthesizer." SIGGRAPH '85. https://dl.acm.org/doi/10.1145/325165.325247
- Perlin, Ken (2002). "Improving Noise." SIGGRAPH '02. https://mrl.cs.nyu.edu/~perlin/paper445.pdf
- Shiffman, Daniel. *The Nature of Code* (2024), "Introduction" — random and noise. https://natureofcode.com/random/
- The Coding Train — "Introduction to Perlin Noise." https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/i-3-noise/1-perlin-noise
- p5.js Reference — `noise()`. https://p5js.org/reference/p5/noise/
- Gustavson, Stefan (2005). "Simplex noise demystified." https://weber.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
