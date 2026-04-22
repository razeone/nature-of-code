# Week 2 — Drag Forces

*"Every object in motion experiences resistance."*

This week we build a physics simulation from Newton's laws. Stars fall under gravity and slow down when they pass through a gelatin medium.

---

## 2.1 Newton's Laws — Quick Recap

| Law | Statement | In code |
|-----|-----------|---------|
| 1st | An object at rest stays at rest unless acted on by a force | `vel` stays constant unless `acc` ≠ 0 |
| 2nd | **F = m × a** (or **a = F / m**) | `acc = force / mass` |
| 3rd | Every action has an equal and opposite reaction | Not directly simulated here |

---

## 2.2 The Physics Update Loop (Euler Integration)

```javascript
update() {
  this.vel.add(this.acc);   // velocity changes by acceleration
  this.pos.add(this.vel);   // position changes by velocity
  this.acc.mult(0);          // clear acceleration — forces must be re-applied each frame
}
```

This pattern — accumulate forces → integrate → clear — is used in almost every physics engine.

---

## 2.3 Applying Forces

```javascript
applyForce(force) {
  // Newton's 2nd: a = F / m
  const f = p5.Vector.div(force, this.mass);
  this.acc.add(f);
}

// Gravity: F = m * g (downward)
star.applyForce(p.createVector(0, GRAVITY * star.mass));
```

Because we divide by mass, heavier objects accelerate less from the same force — a more massive star falls at the same rate as a lighter one under gravity (F is proportional to mass), but responds differently to drag.

---

## 2.4 Drag Force

Drag resists motion. The formula:

```
F_drag = -c × v × |v|
```

Where:
- `c` is the **drag coefficient** of the medium
- `v` is the current velocity vector
- `-` because drag always opposes motion

```javascript
calculateDrag(mover) {
  const speed = mover.vel.mag();
  const dragMagnitude = this.c * speed * speed;  // quadratic drag

  const dragForce = mover.vel.copy();
  dragForce.mult(-1);                              // oppose velocity
  dragForce.setMag(dragMagnitude);
  return dragForce;
}
```

---

## 2.5 The Gelatin Medium

`Gelatin` is a rectangular zone. Before applying forces we check if the star is inside:

```javascript
if (gelly.contains(star)) {
  star.applyForce(gelly.calculateDrag(star));
}
```

```javascript
contains(mover) {
  const { x, y } = mover.pos;
  return x > this.x && x < this.x + this.w &&
         y > this.y && y < this.y + this.h;
}
```

---

## 2.6 Dampening on Bounce

When a star hits the floor its `y` velocity is reversed and multiplied by a dampening factor (e.g. `-0.6`). This simulates energy loss in an inelastic collision:

```javascript
checkEdges() {
  if (this.pos.y > p.height - this.r2) {
    this.vel.y *= this.dampening;  // e.g. -0.6 → reverses and loses 40% energy
    this.pos.y = p.height - this.r2;
  }
}
```

---

## Key Concepts

| Concept | Code pattern |
|---------|-------------|
| Force accumulation | `applyForce()` adds to `acc` |
| Euler integration | `vel += acc; pos += vel; acc = 0` |
| Gravity | `F = createVector(0, g * mass)` |
| Quadratic drag | `F_drag = -c * v²` in direction of `-vel` |
| Medium collision | `contains()` checks AABB |

---

## Challenges

1. **Wind** — Add a horizontal wind force that only applies when the star is above the gelatin. Let the user control wind strength with the mouse x position.
2. **Terminal velocity** — Observe that quadratic drag creates a terminal velocity. Calculate what it should be analytically and verify it in the simulation.
3. **Multiple media** — Create three overlapping strips (water, oil, honey) with different drag coefficients. Give them different translucent colours.
4. **Spring** — Instead of dampening, connect two stars with a spring force: `F = -k * (distance - restLength)`. Make the system oscillate.
