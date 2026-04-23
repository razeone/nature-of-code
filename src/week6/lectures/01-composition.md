# Composition

> *"The whole is greater than the sum of its parts."* — paraphrased from Aristotle, *Metaphysics*

## 1. The big idea
The capstone is a **composition** problem, not a new-technique problem. Every subsystem in *Viral Bloom* — the flow field, the star particles, the evolving virus population, the Mandelbrot overlay — was built in an earlier week. The interesting work is now **integration**: deciding what runs every frame, what runs once, who owns shared state, and how visual layers stack so the result feels like one scene rather than five demos in a trench coat.

## 2. Where this comes from
Generative-art software has wrestled with composition since the 1960s — Vera Molnár, Frieder Nake, and Manfred Mohr stacked simple plotter routines into surprisingly rich images by carefully choosing what each layer contributed. The same idea drives modern creative-coding pipelines (Processing, p5.js, openFrameworks, TouchDesigner): each subsystem does *one* visual job, and the artist composes them with order, blend mode, and timing.

In software-engineering terms, this is **separation of concerns**. Each class in `src/week6/` has a single responsibility: `FlowField` produces vectors, `Star` consumes them, `Population` evolves agents, `Mandelbrot` paints a slow texture. The orchestrator (`sketch.js`) owns *time* (the frame loop) and *space* (the canvas), and decides who gets a turn each frame.

A second tradition in the room is **incremental rendering**. Bret Victor's interactive essays and Inigo Quilez's shader work both rely on the trick of doing expensive computation a sliver at a time so the frame rate never tanks. We use the same trick for the Mandelbrot texture: it would freeze the canvas if we drew the whole thing at once, so we draw three columns per frame and accumulate into an off-screen buffer.

A third is **trail-based rendering**, popularised in p5.js by Daniel Shiffman's particle tutorials and Tyler Hobbs' essays on flow-field plots. Instead of clearing the background every frame to a solid colour, you clear it to a *low-alpha* version of the background colour. Old pixels fade gradually, producing motion blur that turns instantaneous particle positions into glowing streamers — a very small change with a very big aesthetic payoff.

The final tradition is **parameter exposure**. Anything you might want to tweak should sit at the top of the file as a named constant. The four constants at the top of `sketch.js` (`STAR_COUNT`, `POP_SIZE`, `MUTATION_RATE`, `SPAWN_RATE`) are the entire control surface of the piece. Move them, and the personality changes.

## 3. The model
A single frame of *Viral Bloom* is a layered render — back to front:

```
1. Background wash    (alpha=40, gives trail decay)
2. Mandelbrot buffer  (slow background texture, draws 3 cols/frame)
3. Flow field         (computed every frame; arrows only if showFlow)
4. Star particles     (spawn, follow flow, draw with HSB glow)
5. Virus population   (target, then live OR evolve)
6. Drifting target    (Perlin-walk the goal)
7. HUD                (text overlay last)
```

Two timescales are running simultaneously. The **fast loop** (every frame) advances the flow field, particles, and one tick of every virus. The **slow loop** (every `lifetime` frames, where `lifetime = p.height = 600`) triggers `population.evolve()`. The Mandelbrot adds a third, even slower, *one-shot* timescale: it finishes after `width / cols ≈ 267` frames and then sits still until you press `R`.

Visually, layering is enforced purely by *draw order*. There is no z-buffer; whoever paints last paints on top. That is why the HUD is drawn last and the Mandelbrot is drawn first.

The shared resources are minimal. The `FlowField` is read by every `Star`. The `target` is read by the `Population`. Neither relationship requires the consumer to know who else is reading — both are *pull* APIs (`field.lookup(pos)`, `target.contains(pos)`). This is what makes the composition tractable: the subsystems are decoupled.

## 4. In our code

**The control surface — top of `sketch.js`.** Four numbers fully parameterise the personality of the scene:

```javascript
const STAR_COUNT    = 120;
const POP_SIZE      = 30;
const MUTATION_RATE = 0.01;
const SPAWN_RATE    = 2;   // number of new stars spawned per frame
```
*— `src/week6/sketch.js:27-30`*

**Trail effect via low-alpha background.** Instead of `background(0)`, we paint a translucent dark wash each frame so old particle pixels survive briefly:

```javascript
p.background(5, 5, 18, 40);
```
*— `src/week6/sketch.js:62` (`p.draw`)*

**Animated flow field.** The third coordinate of Perlin noise advances each call to `update()`, so the field morphs over time rather than being a static map:

```javascript
const theta = p.map(p.noise(xoff, yoff, this.zoff), 0, 1, 0, p.TWO_PI * 2);
this.field[i][j] = p5.Vector.fromAngle(theta);
// ...
this.zoff += 0.004;
```
*— `src/week6/FlowField.js:36-42` (`update`)*

**Stars consume the field through a steering force.** The pattern is the classic Reynolds *seek*: desired velocity equals the field vector at our position, and we steer toward it with a clamped force. No `Star` knows that `FlowField` exists in detail — it only calls `lookup`:

```javascript
follow(field) {
  const desired = field.lookup(this.pos);
  desired.setMag(this.maxspeed);
  const steer = p5.Vector.sub(desired, this.vel);
  steer.limit(0.3);
  this.applyForce(steer);
}
```
*— `src/week6/Star.js:37-43` (`follow`)*

**Mandelbrot uses incremental rendering into an off-screen buffer.** Three columns per frame is barely visible CPU work, yet after about four seconds the whole texture has painted in:

```javascript
mandelbrot.renderColumns(3);
mandelbrot.display();
```
*— `src/week6/sketch.js:65-66` (`p.draw`)*

**Drifting target via Perlin noise.** The target is the genetic algorithm's optimisation goal *and* a kinetic element of the composition — it never sits still:

```javascript
const tx = p.noise(p.frameCount * 0.003)       * (p.width  - 80) + 40;
const ty = p.noise(p.frameCount * 0.003 + 50)  * (p.height / 3);
target.pos.set(tx, ty);
```
*— `src/week6/sketch.js:95-97` (`p.draw`)*

The 50-unit offset on the y-axis Perlin call is the standard p5.js trick for getting two *uncorrelated* 1D noise walks out of one noise function.

## 5. Try it

<details><summary>Hint — Change the layer order</summary>
Move the Mandelbrot draw to *after* the stars. The fractal now occludes the particles. Move the HUD to *before* everything: invisible. Layer order is the cheapest art-direction tool you have.
</details>

<details><summary>Hint — Tune the trail length</summary>
The alpha value `40` in `background(5, 5, 18, 40)` controls trail persistence. Lower it (try 15) and trails grow long and ghostly. Raise it (try 120) and trails vanish almost immediately.
</details>

<details><summary>Hint — Add a fifth subsystem</summary>
Pick something you wrote in weeks 1–4 (Lorenz attractor, Mover swarm, Conway's Life). Write a class for it, import it into `sketch.js`, give it one `update()` and one `display()` method, and slot it into the layer stack. The composition should still feel coherent if the colour palette agrees.
</details>

## 6. Going further
- Reas, Casey & Fry, Ben (2014). *Processing: A Programming Handbook for Visual Designers and Artists* (2nd ed.). MIT Press.
- Hobbs, Tyler (2017). "Flow Fields". https://tylerxhobbs.com/essays/2020/flow-fields
- Reynolds, Craig W. (1999). "Steering Behaviors For Autonomous Characters". https://www.red3d.com/cwr/steer/
- Perlin, Ken (1985). "An image synthesizer". SIGGRAPH.
- Shiffman, Daniel. *The Nature of Code* (2024). Chapters 4 (particles) and 5 (autonomous agents). https://natureofcode.com/
- p5.js Reference. https://p5js.org/reference/
