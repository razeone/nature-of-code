# Vectors

> *"A vector is an arrow with a length and a direction."* — paraphrased from every linear algebra textbook ever

## 1. The big idea

A **vector** is the smallest data structure that captures both *how much* and *which way*. Position, velocity, acceleration, force, wind — all of them are vectors. Once you stop juggling separate `x` and `y` variables and start thinking in `p5.Vector`s, the physics in the rest of this course almost writes itself.

## 2. Where this comes from

The modern vector emerged in the 19th century out of a tug-of-war between two ideas. William Rowan Hamilton spent more than a decade developing **quaternions** (1843), a four-component algebra he believed would describe rotation in space. Hermann Grassmann, working in obscurity in Germany, published *Die lineale Ausdehnungslehre* in 1844 — a far more general theory of "extended quantities" that nobody read until decades later.

Out of those two threads, Josiah Willard Gibbs at Yale and Oliver Heaviside in England distilled the practical three-component vector calculus we still use today. By 1901, Gibbs and his student E. B. Wilson had published *Vector Analysis*, the textbook that essentially defined the modern notation: bold letters for vectors, dot product, cross product, magnitude.

Game and graphics programmers inherited all of this, plus a hard constraint: the GPU and the canvas API only know about coordinates. Every elegant vector equation has to be unpacked into `x` and `y` (and sometimes `z`) at the moment of drawing. A vector library like `p5.Vector` lets us live in the elegant world while the unpacking happens behind the scenes.

The reason vectors matter in *Nature of Code* specifically is that Newton's second law, `F = m·a`, is a *vector* equation. Force has a direction. Acceleration has a direction. If you try to simulate physics with separate `velX` and `velY` floats, you'll re-derive vector arithmetic on the fly, badly. Better to learn the abstraction once.

## 3. The model

A 2D vector has two components, `(x, y)`. With it we can compute:

```
magnitude   |v|  = sqrt(x² + y²)
direction   θ    = atan2(y, x)
addition    a + b = (a.x + b.x, a.y + b.y)
scaling     k·v   = (k·x, k·y)
unit vector v̂    = v / |v|
dot product a·b   = a.x·b.x + a.y·b.y = |a||b|cos(θ)
```

Two operational rules to keep straight:

- **Instance methods mutate.** `a.add(b)` changes `a` in place and returns it.
- **Static methods don't.** `p5.Vector.add(a, b)` returns a new vector and leaves `a` and `b` alone.

That distinction is the source of most vector bugs you will write this term. When in doubt, `.copy()` first.

## 4. In our code

**Building vectors.** We create them either from components or from an angle.

```javascript
this.pos  = p.createVector(x, y);
this.vel  = p5.Vector.random2D().mult(p.random(1, 3));
this.acc  = p.createVector(0, 0);
```
*— `src/week0/lessons/07-moving-object.js:29-31` (`Particle.constructor`)*

**Mutating vs. non-mutating arithmetic.** Lesson 05 puts both styles side by side. `A.copy().mult(0.5)` is the safe pattern when `A` is needed again later.

```javascript
const sum   = p5.Vector.add(A, B);
const diff  = p5.Vector.sub(A, B);
const scaled = A.copy().mult(0.5);
const norm  = A.copy().normalize().mult(80); // scaled unit vector
const dot   = A.dot(B);
const angle = p5.Vector.angleBetween(A, B);
```
*— `src/week0/lessons/05-vectors.js:31-36` (sketch body)*

**Magnitude and direction.** Magnitude is "how fast" or "how strong"; direction is "which way."

```javascript
`A = (${A.x.toFixed(0)}, ${A.y.toFixed(0)})  |A| = ${A.mag().toFixed(1)}`,
```
*— `src/week0/lessons/05-vectors.js:63` (sketch body)*

**The Euler step is just three vector operations.** Velocity is integrated acceleration; position is integrated velocity. We'll come back to this in Week 2.

```javascript
update() {
  this.vel.add(this.acc);
  this.vel.limit(6);
  this.pos.add(this.vel);
  this.acc.mult(0);
  this.noff += 0.01;
```
*— `src/week0/lessons/07-moving-object.js:43-48` (`Particle.update`)*

**Vectors as forces.** A force *is* a vector. We build one from an angle and a magnitude and feed it into `applyForce`.

```javascript
// Perlin noise steering force
const theta = p.map(p.noise(pt.noff), 0, 1, 0, p.TWO_PI * 2);
pt.applyForce(p5.Vector.fromAngle(theta).mult(0.1));
```
*— `src/week0/lessons/07-moving-object.js:108-110` (sketch body)*

## 5. Try it

1. **Mouse vector (easy).** Each frame, draw a line from the canvas center to the mouse. Then print the line's magnitude and angle in the corner.
   <details><summary>Hint</summary>`const v = p.createVector(p.mouseX - cx, p.mouseY - cy); p.line(cx, cy, p.mouseX, p.mouseY); p.text(`|v|=${v.mag().toFixed(0)}`, 10, 20);`</details>

2. **Constant-speed wanderer (medium).** Create a particle with a random `vel`. Each frame, normalize `vel` and scale it back to a fixed speed (say 4). The particle should drift but never speed up or slow down.
   <details><summary>Hint</summary>`this.vel.normalize().mult(4)` after the acceleration step. Or use `this.vel.setMag(4)`.</details>

3. **Seek the mouse (harder).** Make a particle accelerate toward the mouse. The desired velocity is a unit vector from the particle to the mouse, scaled to a top speed. The steering force is `desired - vel`. Apply that as acceleration each frame.
   <details><summary>Hint</summary>`const desired = p5.Vector.sub(mouse, this.pos).setMag(maxSpeed); const steer = p5.Vector.sub(desired, this.vel).limit(maxForce); this.applyForce(steer);` This is Craig Reynolds' "seek" behavior — see Chapter 5 of *Nature of Code*.</details>

## 6. Going further

- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 1: Vectors. https://natureofcode.com/vectors/
- The Coding Train — Introduction to Vectors. https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/1-vectors/1-vector-introduction
- 3Blue1Brown — *Essence of Linear Algebra*, "Vectors, what even are they?" https://www.youtube.com/watch?v=fNk_zzaMoSs
- Gibbs, J. W. & Wilson, E. B. *Vector Analysis* (1901). https://archive.org/details/vectoranalysisat00gibb
- p5.js Reference — `p5.Vector`. https://p5js.org/reference/p5/p5.Vector/
- Reynolds, Craig (1999). "Steering Behaviors For Autonomous Characters." https://www.red3d.com/cwr/steer/
