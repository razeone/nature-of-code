# Newton and Forces

> *"Force is equal to the change of motion."* — Isaac Newton, *Principia*, Definition VIII

## 1. The big idea

Almost everything we'll simulate this term sits on top of three sentences Isaac Newton wrote in 1687. A body keeps doing what it's doing unless something pushes it. The push, divided by the mass, is how fast its motion changes. Every push has a matching push back. Translate those into vectors and an update loop, and you have a physics engine.

## 2. Where this comes from

Isaac Newton's *Philosophiæ Naturalis Principia Mathematica* was published in 1687 after Edmond Halley begged (and paid) for it to exist. In it, Newton stated three "Axioms, or Laws of Motion" that unified terrestrial and celestial mechanics — the same equations that explained an apple falling explained the moon orbiting the Earth. This was, by a wide margin, the most successful physical theory ever written.

The crucial ingredient was the concept of **force as a vector quantity**. Forces have both a magnitude (how strong) and a direction (which way), and when several forces act on a body simultaneously, they add as vectors. This is the **principle of superposition**, and it's what lets us simply call `applyForce()` once for gravity and once for drag and trust that the math works out.

A second crucial ingredient was *mass*. Newton distinguished between weight (a force that depends on local gravity) and mass (an intrinsic resistance to acceleration). On the moon you'd weigh less but have the same mass, and the same horizontal push would accelerate you the same amount. That distinction matters for our simulation: heavier stars resist drag more than lighter ones.

For nearly two centuries Newton's mechanics was simply *correct*. Lagrange and Hamilton reformulated it more elegantly in the 18th and 19th centuries, but the predictions were the same. Only with Einstein's relativity (1905) and quantum mechanics (1920s) did we learn the limits — neither of which apply at the scale of stars falling through gelatin on an 800-pixel canvas.

## 3. The model

Newton's three laws, in the form we'll actually use:

```
1.  If ΣF = 0, velocity is constant.
2.  ΣF = m · a       →     a = ΣF / m
3.  F_AB = −F_BA      (every action has an equal and opposite reaction)
```

In code we don't usually compute the *sum* of forces ahead of time. Instead we **accumulate** them: each frame, every force applied via `applyForce` adds its `F/m` contribution to an acceleration vector. After everything has had a say, we integrate and clear:

```
acc = 0
for each force F:
    acc += F / m
vel += acc        // (Euler — see next lecture)
pos += vel
```

A force can come from anywhere: gravity (`(0, m·g)`), drag (`-c·v·|v|`), a spring, a wind, the player's input. They all enter through the same door — `applyForce(F)` — and the laws compose them for free. That's the elegance worth pausing to admire.

One subtlety about gravity. Real gravity is `F = m·g`, with `g ≈ 9.8 m/s²` on Earth. When we then compute `a = F/m`, the `m` cancels: every object falls at the same acceleration regardless of mass. Galileo's leaning-tower thought experiment baked into the equation. Drag is different — it does *not* scale with mass — so heavy objects punch through gelatin while light ones get held up.

## 4. In our code

**The Star body.** Each star carries position, velocity, acceleration, and mass — the four numbers Newton needs to predict its future.

```javascript
constructor(p, mass, x, y, r1, r2, npoints, dampening) {
  this.p = p;
  this.mass = mass;
  this.pos = p.createVector(x, y);
  this.vel = p.createVector(0, 0);
  this.acc = p.createVector(0, 0);
```
*— `src/week2/Star.js:20-25` (`Star.constructor`)*

**Newton's second law as one method.** `applyForce` is a literal translation of `a = F/m`. The new contribution is *added* to the existing acceleration so multiple forces can be applied per frame.

```javascript
applyForce(force) {
  const f = p5.Vector.div(force, this.mass);
  this.acc.add(f);
}
```
*— `src/week2/Star.js:39-42` (`Star.applyForce`)*

**Gravity as a force.** We don't fudge `acc.y += g`. We build a real `F = m·g` vector and let `applyForce` divide by mass for us — the `m` cancels and gravity ends up being a constant acceleration regardless of star mass.

```javascript
// Gravity: F = m * g (downward)
star.applyForce(p.createVector(0, GRAVITY * star.mass));
```
*— `src/week2/sketch.js:48-49` (`p.draw`)*

**Multiple forces, one update.** Inside the per-star loop, the star may receive a drag force *and* a gravity force in the same frame. Both flow through `applyForce` and accumulate into `acc` before `update()` runs.

```javascript
for (const star of stars) {
  // Apply drag if inside gelatin
  if (gelly.contains(star)) {
    star.applyForce(gelly.calculateDrag(star));
  }

  // Gravity: F = m * g (downward)
  star.applyForce(p.createVector(0, GRAVITY * star.mass));
```
*— `src/week2/sketch.js:42-49` (`p.draw`)*

## 5. Try it

1. **Constant push (easy).** Add a constant horizontal wind to the Week 2 sketch — for example `p.createVector(0.5, 0)` applied to every star every frame. Watch them drift sideways as they fall.
   <details><summary>Hint</summary>Insert `star.applyForce(p.createVector(0.5, 0));` next to the gravity call. To make it feel like wind (not a per-mass push), divide by mass first or just pick a small value.</details>

2. **Mass-dependent gravity (medium).** Spawn three stars with very different masses (5, 50, 500). Apply gravity correctly (`F = m·g`) and confirm they fall at the same rate. Then deliberately *break* it by writing `applyForce(createVector(0, GRAVITY))` (without the `* mass`) and watch how the heavy one stalls.
   <details><summary>Hint</summary>The bug is instructive: forgetting `* mass` means a heavier object receives a smaller acceleration `(g/m)`. That's *not* how gravity works — but it *is* how a constant force like wind should be coded.</details>

3. **Attractor (harder).** Add a single fixed point on the canvas. Every star receives a force toward that point with magnitude `G · m / d²` (Newton's law of gravitation), where `d` is the distance. Cap `d` from below to avoid blow-ups.
   <details><summary>Hint</summary>`const dir = p5.Vector.sub(attractor, star.pos); const d = p.constrain(dir.mag(), 20, 200); const F = dir.setMag(G * star.mass / (d * d)); star.applyForce(F);`</details>

## 6. Going further

- Newton, Isaac (1687). *Philosophiæ Naturalis Principia Mathematica*. Project Gutenberg English translation: https://www.gutenberg.org/ebooks/28233
- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 2: Forces. https://natureofcode.com/forces/
- Bourg, David & Bywalec, Bryan (2013). *Physics for Game Developers* (2nd ed.). O'Reilly. Chapters 2–4.
- Feynman, Richard. *The Feynman Lectures on Physics*, Vol. I, Ch. 9 — "Newton's Laws of Dynamics." https://www.feynmanlectures.caltech.edu/I_09.html
- The Coding Train — "Forces." https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/2-forces
