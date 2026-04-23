# Flow Fields and Perlin Noise

> *"Wind has no choreographer either."*

## 1. The big idea

A **flow field** is a vector painted at every cell of a grid that covers the world. An agent that lands in a cell asks "which way is the wind blowing here?" and uses that vector as its `desired` velocity. Build the field from **Perlin noise** and adjacent cells point in similar directions, producing smooth currents instead of chaos. The result: hundreds of agents moving like leaves on a stream, with zero per-agent intelligence.

## 2. Where this comes from

Vector fields are an old idea from physics — fluid dynamics, electromagnetism, gravitational fields. Each is a function `F(x, y) → vector` that tells anything sitting at `(x, y)` which way to go. In 1986, Dave Anderson and others used precomputed vector fields in early game AI to give crowds direction without per-agent pathfinding; today they are everywhere from RTS unit movement (Supreme Commander's flow-field pathfinding, 2007) to particle simulations in tools like Houdini.

Reynolds himself listed "path following" and "flow field following" as standard steering behaviors in his 1999 paper. The trick that makes them practical for animation is **smoothness**. A purely random field would jitter agents in every direction; what we want is a field that is locally consistent — neighbouring cells should look almost the same. That is exactly the property Perlin noise was invented to provide.

Ken Perlin invented his namesake noise function in 1983 while making the visual effects for *Tron* and published it at SIGGRAPH 1985 in *"An image synthesizer"*. Random number generators of the day produced static — fine for static, terrible for textures of clouds, marble, fire, or wind. Perlin's noise is *coherent*: `noise(x)` and `noise(x + 0.01)` are guaranteed to be close. Sampling it on a grid gives values that flow rather than flicker. Perlin won an Academy Award for it in 1997.

In our sketch we sample `p.noise(x, y)`, map it to an angle in `[0, 2π]`, and store a unit vector pointing in that direction at every grid cell. Press any key to see the field as little arrows.

## 3. The model

The data structure is a 2-D array of vectors:

```
field[i][j] = unitVector(angle(i, j))
angle(i, j) = map(noise(i * step, j * step), 0, 1, 0, 2π)
```

The `step` (we use `0.1`) controls how *zoomed in* we are on the noise: small steps make broad, sweeping currents; large steps make tight, swirly turbulence. Each cell stores a *unit* vector — direction only. The agent rescales it to its own `maxspeed` when steering.

Lookup is constant-time. To find the field vector for an agent at world position `(x, y)`:

```
col = floor(x / resolution)
row = floor(y / resolution)
desired = field[col][row].copy() * maxspeed
steering = desired − velocity, limited to maxforce
```

Two subtleties: (1) we `copy()` the cell vector so steering doesn't mutate the field; (2) we `constrain` the indices so an agent that drifts off-canvas still gets a valid lookup instead of crashing.

## 4. In our code

The field is built once at construction. Perlin noise is sampled at offsets that grow by `0.1` each step, which is what makes adjacent cells gently rotate rather than jump.

```javascript
#init() {
  const p = this.p;
  p.noiseSeed(Math.floor(p.random(10000)));

  let xoff = 0;
  for (let i = 0; i < this.cols; i++) {
    let yoff = 0;
    for (let j = 0; j < this.rows; j++) {
      const theta = p.map(p.noise(xoff, yoff), 0, 1, 0, p.TWO_PI);
      this.field[i][j] = p5.Vector.fromAngle(theta);
      yoff += 0.1;
    }
    xoff += 0.1;
  }
}
```
*— `src/week3/FlowField.js:28-42` (`#init`)*

`p5.Vector.fromAngle(theta)` is the workhorse: it returns a unit vector at the given angle, ready to be scaled by `maxspeed` later.

Lookup is a clamp + index. The `constrain` calls make the function safe for agents that have wandered off-canvas.

```javascript
lookup(pos) {
  const col = Math.floor(this.p.constrain(pos.x / this.resolution, 0, this.cols - 1));
  const row = Math.floor(this.p.constrain(pos.y / this.resolution, 0, this.rows - 1));
  return this.field[col][row].copy();
}
```
*— `src/week3/FlowField.js:49-53` (`lookup`)*

The debug overlay draws each cell vector as a tiny arrow — invaluable for understanding *why* the agents curve the way they do.

```javascript
p.translate(x + this.resolution / 2, y + this.resolution / 2);
p.rotate(v.heading());
p.stroke(100, 180, 255, 80);
p.strokeWeight(1);
p.line(0, 0, len, 0);
// arrowhead
p.line(len, 0, len - 4, -3);
p.line(len, 0, len - 4,  3);
```
*— `src/week3/FlowField.js:66-73` (`display`)*

The current sketch builds the flow field but doesn't yet use it for steering — the viruses `seek` a moving target instead. The first exercise below wires the field in.

## 5. Try it

1. **Follow the field.** Replace the `v.seek(target)` line in `sketch.js` with a small `followField(flowfield)` method on `Virus` that uses `flowfield.lookup(this.pos)` as the desired velocity. The viruses should now drift along the currents.
   <details><summary>Hint</summary>Inside `followField`, do: `const desired = flowfield.lookup(this.pos); desired.setMag(this.maxspeed); const steer = p5.Vector.sub(desired, this.vel); steer.limit(this.maxforce); this.applyForce(steer);` — same skeleton as `seek`.</details>

2. **Animate the field.** Make the field evolve over time: pass `p.frameCount * 0.01` as a third argument to `p.noise(xoff, yoff, zoff)` and rebuild the field every few frames. The currents should now slowly *breathe*.
   <details><summary>Hint</summary>Add a `update()` method on `FlowField` that re-runs `#init`-style logic but with the time offset. Call it from `p.draw()` every 10 frames or so to keep cost down.</details>

3. **Tune the turbulence.** Change the `0.1` step in `#init` to `0.02`, then to `0.5`. Describe what the field looks like in each case.
   <details><summary>Hint</summary>`0.02` samples the noise very close together — broad, smooth jet-stream-like currents. `0.5` samples it far apart — neighbouring cells become almost independent, so the field looks like static again.</details>

## 6. Going further

- Perlin, Ken (1985). *An image synthesizer.* SIGGRAPH. <https://dl.acm.org/doi/10.1145/325165.325247>
- Reynolds, Craig W. (1999). *Steering Behaviors For Autonomous Characters* — section on path/field following. <https://www.red3d.com/cwr/steer/>
- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 0 (Noise) and Chapter 5.10 (Flow Fields). <https://natureofcode.com/autonomous-agents/>
- The Coding Train — *5.5 Flow Fields*. <https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/5-autonomous-agents/1-seek>
- p5.js Reference — `noise()`, `p5.Vector.fromAngle()`. <https://p5js.org/reference/#/p5/noise>
