# Euler Integration

> *"Calculus is the language nature speaks; integration is how we listen one step at a time."*

## 1. The big idea

Newton's second law tells us acceleration. We want position. The bridge between them is **integration**, and the simplest discrete form is named after Leonhard Euler. Three lines of code — `vel += acc; pos += vel; acc = 0;` — and you have a working physics step. Understanding *why* those three lines work, and where they fail, is essential before we add anything more sophisticated.

## 2. Where this comes from

Leonhard Euler was the most prolific mathematician of the 18th century — possibly of any century. Among hundreds of other contributions, he developed in 1768 a method for numerically solving ordinary differential equations: the **Euler method**. The idea is disarmingly simple. If you know a quantity's value at time `t` and its rate of change, you can estimate its value a tiny moment later by assuming the rate stays constant over the interval.

In physics that means: if you know the velocity now and the acceleration now, you can guess the velocity a frame later. Then, knowing the new velocity, you can guess the new position. Repeat 60 times a second and you've animated motion.

The catch — known to Euler and to every physicist since — is that this is only an *approximation*. The true motion follows a smooth curve; we're climbing it with straight-line steps. Smaller steps mean smaller error, but more computation. With a fixed time step (one frame), the error accumulates. For most creative-coding sketches it's fine. For orbital mechanics or stiff springs, you reach for **Verlet integration**, **Runge-Kutta 4**, or **symplectic integrators** that conserve energy.

The reason we use the simple Euler step here isn't laziness. It's pedagogical. The three lines map *exactly* onto the three concepts — acceleration, velocity, position — and are short enough to read at a glance. Once you understand the loop, swapping in a fancier integrator is a 10-line change.

## 3. The model

The continuous physics:

```
a(t) = F(t) / m
v(t) = ∫ a(t) dt
x(t) = ∫ v(t) dt
```

The discrete Euler step (with `Δt = 1`, i.e. one frame):

```
v_{n+1} = v_n + a_n · Δt
x_{n+1} = x_n + v_{n+1} · Δt        // (semi-implicit if we use v_{n+1})
a_{n+1} = 0                          // forces will be re-applied next frame
```

The order matters. The version we use — update velocity first, then position from the new velocity — is technically the **semi-implicit (symplectic) Euler** method, and it's noticeably more stable for oscillators and orbits than the "explicit" version where position uses the *old* velocity. With one line of difference you've gone from a method that explodes to one that doesn't. Free win.

The reason for the `acc = 0` at the end is that **acceleration is not a stored property of the object**. It's a per-frame accumulator. Forces accumulate into it during the frame, and when integration is done, we wipe the slate. Forget this and your particles will drift sideways forever from a force that fired once.

## 4. In our code

**The three-line update.** This is the heart of the simulation. Read it as: "velocity changes by acceleration; position changes by the new velocity; clear the accumulator."

```javascript
update() {
  this.vel.add(this.acc);
  this.pos.add(this.vel);
  this.acc.mult(0);
}
```
*— `src/week2/Star.js:45-49` (`Star.update`)*

**The same loop, with a speed cap.** The Week 0 particle adds `vel.limit(6)` to keep things bounded — a useful safety net for noise-driven motion that can otherwise blow up.

```javascript
update() {
  this.vel.add(this.acc);
  this.vel.limit(6);
  this.pos.add(this.vel);
  this.acc.mult(0);
  this.noff += 0.01;
```
*— `src/week0/lessons/07-moving-object.js:43-48` (`Particle.update`)*

**Per-frame ordering.** The `draw` loop has a strict choreography: apply *all* forces, *then* integrate, *then* handle edges, *then* draw. Mixing those up creates frame-lag artifacts.

```javascript
for (const star of stars) {
  // Apply drag if inside gelatin
  if (gelly.contains(star)) {
    star.applyForce(gelly.calculateDrag(star));
  }

  // Gravity: F = m * g (downward)
  star.applyForce(p.createVector(0, GRAVITY * star.mass));

  star.update();
  star.checkEdges();
  star.display();
}
```
*— `src/week2/sketch.js:42-54` (`p.draw`)*

**Edges as inelastic collisions.** Bouncing is *not* part of the integration step proper — it's a correction applied after. We reverse the y-velocity and multiply by a dampening factor (negative, magnitude < 1) to lose energy. The position is also clamped to the floor to prevent the star from sinking below it.

```javascript
checkEdges() {
  if (this.pos.y > this.p.height - this.r2) {
    this.vel.y *= this.dampening;
    this.pos.y = this.p.height - this.r2;
  }
}
```
*— `src/week2/Star.js:52-57` (`Star.checkEdges`)*

## 5. Try it

1. **Forget to clear acc (easy).** Comment out `this.acc.mult(0)` in `Star.update` and run the sketch. Watch how every star accelerates uncontrollably. This is the single most common physics bug — make it once on purpose so you'll recognize it forever.
   <details><summary>Hint</summary>Without the reset, gravity adds to `acc` again every frame instead of replacing it. After 60 frames the effective `acc` is 60× too large.</details>

2. **Frame-rate-independent step (medium).** The current update assumes `Δt = 1 frame`. Modify it to use `p.deltaTime / 16.67` as a multiplier (so 60 fps is `Δt ≈ 1`). Then throttle the framerate with `p.frameRate(20)` and check the motion still feels the same.
   <details><summary>Hint</summary>`const dt = p.deltaTime / 16.67; this.vel.add(p5.Vector.mult(this.acc, dt)); this.pos.add(p5.Vector.mult(this.vel, dt));` Be aware: scaling a stored `vel` by `dt` is wrong; only the *increments* should be scaled.</details>

3. **Compare integrators (harder).** Build a single oscillator: a particle attached to a spring (`F = -k·x`). Run it side by side with two updates: explicit Euler (`pos += old_vel; vel += acc`) vs. semi-implicit (our current order). Plot the energy over 30 seconds. The explicit version gains energy and explodes; the semi-implicit version stays bounded.
   <details><summary>Hint</summary>Energy of a spring oscillator is `½ k x² + ½ m v²`. Print it once a second. The explicit version's curve will trend upward; the semi-implicit's will wobble around a constant.</details>

## 6. Going further

- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 2 — Forces and integration. https://natureofcode.com/forces/
- Hairer, Lubich & Wanner (2003). "Geometric Numerical Integration Illustrated by the Störmer–Verlet Method." *Acta Numerica*. https://www.unige.ch/~hairer/poly_geoint/week2.pdf
- Witkin, Andrew & Baraff, David (2001). "Physically Based Modeling: Principles and Practice." SIGGRAPH course notes. https://www.cs.cmu.edu/~baraff/sigcourse/
- Bourg, David & Bywalec, Bryan (2013). *Physics for Game Developers* (2nd ed.). O'Reilly. Chapter 11.
- The Coding Train — "Acceleration." https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/1-vectors/9-acceleration
- Gaffer On Games — "Integration Basics." https://gafferongames.com/post/integration_basics/
