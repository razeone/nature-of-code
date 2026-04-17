# Week 3 — Steering Behaviors

*"Emergence: complex group behavior from simple individual rules."*

Steering behaviors, introduced by Craig Reynolds in 1999, describe how autonomous agents move through an environment. Each behavior is a **force** that nudges the agent toward a desired velocity.

---

## 3.1 The Steering Formula

All Reynolds steering behaviors share the same structure:

```
steering force = desired velocity − current velocity
```

```javascript
seek(target) {
  const desired = p5.Vector.sub(target, this.pos);   // point toward target
  desired.setMag(this.maxspeed);                       // at full speed

  const steer = p5.Vector.sub(desired, this.vel);    // steering = desired − current
  steer.limit(this.maxforce);                          // cap steering force
  this.applyForce(steer);
}
```

This elegant formula produces **smooth, organic motion** — the agent doesn't teleport, it *steers*.

---

## 3.2 Seek

The simplest behavior: always want to be moving **directly toward the target at maximum speed**.

```javascript
// desired direction = target − pos, set to maxspeed
// steer = desired − vel, limited to maxforce
```

Result: the agent accelerates toward the target, overshoots slightly, curves back — creating a realistic pursuit.

---

## 3.3 Arrive

Like seek, but the agent **slows down** as it approaches the target:

```javascript
arrive(target, slowRadius = 100) {
  const desired = p5.Vector.sub(target, this.pos);
  const d = desired.mag();

  // Inside the slow zone: ramp speed from 0 → maxspeed
  const speed = d < slowRadius
    ? p.map(d, 0, slowRadius, 0, this.maxspeed)
    : this.maxspeed;

  desired.setMag(speed);
  const steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  this.applyForce(steer);
}
```

---

## 3.4 Flow Field

A flow field is a 2D grid of direction vectors. Each agent queries the field at its current position and steers to follow the local direction:

```javascript
// Look up the field vector at this agent's position
const desired = flowfield.lookup(this.pos);
desired.setMag(this.maxspeed);
const steer = p5.Vector.sub(desired, this.vel);
steer.limit(this.maxforce);
this.applyForce(steer);
```

The field is generated using Perlin noise — so adjacent cells point in similar directions, creating smooth currents.

---

## 3.5 The Simulation in sketch.js

```
Viruses ──seek──► roaming target (Perlin noise position)
Leukocytes ──arrive──► random Virus

Both agents experience drag in the lower half (Liquid medium).
Press any key to toggle the flow field debug overlay.
```

---

## 3.6 Liquid Drag

The `Liquid` class works identically to `Gelatin` from Week 2:

```javascript
if (liquid.contains(agent)) {
  agent.applyForce(liquid.calculateDrag(agent));
}
```

---

## Key Classes

| Class | Behavior |
|-------|----------|
| `Virus` | Seek — chases target at constant speed |
| `Leukocyte` | Arrive — slows near target |
| `FlowField` | 2D Perlin-noise grid of direction vectors |
| `Liquid` | Rectangular drag medium |

---

## Challenges

1. **Flee** — Implement a `flee(target)` method (the exact opposite of seek). Add a predator that the leukocytes flee from.
2. **Wander** — Add a `wander()` behavior using a circle in front of the agent. Pick a random point on the circle each frame to steer toward.
3. **Separation** — Keep viruses from overlapping by adding a repulsion force between neighbors within a given radius.
4. **Flocking** — Combine **separation** + **alignment** + **cohesion** to produce a Boids flocking simulation.
