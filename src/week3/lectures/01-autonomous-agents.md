# Autonomous Agents

> *"A bird does not need a choreographer to fly in a flock."*

## 1. The big idea

An **autonomous agent** is a simulated entity that perceives a tiny slice of its world and decides — on its own, every frame — what force to apply to itself. No script, no central director. From this single rule (perceive → desire → steer) we get behaviors that *look* intentional: chasing, fleeing, queueing, flocking. Steering behaviors are the bridge between Newtonian physics (Week 2) and the lifelike motion of animals, crowds, and game characters.

## 2. Where this comes from

In 1986 Craig Reynolds was working on computer-animated film and faced a problem: how do you animate a flock of a hundred birds without keyframing every wingbeat? His answer, published as *"Flocks, Herds, and Schools: A Distributed Behavioral Model"* at SIGGRAPH 1987, was that flocking is **emergent**. Each "boid" follows three local rules — separation, alignment, cohesion — and the flock pattern arises for free.

Thirteen years later, in his 1999 GDC paper *"Steering Behaviors For Autonomous Characters"*, Reynolds generalised the idea. He factored an agent into three layers: **action selection** (what do I want?), **steering** (which way does that pull me?), and **locomotion** (how do my muscles realise that?). For our purposes, the middle layer is everything: it converts a desire into a force.

This decomposition matters because it makes complexity *additive*. Want a fish that flees predators, hugs the seabed, and follows a current? Compute three steering forces and add them. The agent becomes a small composition of behaviors instead of a giant state machine.

The same blueprint shows up far beyond animation: NPCs in games (Half-Life's marines used boids-style flocking), crowd evacuation simulations, multi-robot path planning, and even particle effects. Whenever you see motion that feels *alive* but was clearly not hand-animated, steering behaviors are usually under the hood.

## 3. The model

An agent owns three vectors — `position`, `velocity`, `acceleration` — exactly as in Week 2. The new ingredient is the **steering force**, defined by Reynolds as:

```
desired   = (where I want to go) at maxspeed
steering  = desired − velocity         // the correction
steering  = limit(steering, maxforce)  // bounded "muscle"
acceleration += steering / mass
```

The subtraction `desired − velocity` is the heart of the model. Without it, an agent would simply *snap* its velocity to the desired direction and look robotic. With it, the agent only ever applies a small corrective nudge — it has to *turn* into the new direction over several frames, and that delay is what reads as life.

Two scalars tune the personality of every agent: `maxspeed` (how fast can I move?) and `maxforce` (how hard can I turn?). A small `maxforce` produces wide, lazy arcs; a large one produces sharp, snappy reactions.

## 4. In our code

A `Virus` is a textbook agent — position, velocity, acceleration, plus the two limits.

```javascript
constructor(p, x, y, r1 = 15, r2 = 20, npoints = 10) {
  this.p = p;
  this.pos = p.createVector(x, y);
  this.vel = p.createVector(0, 0);
  this.acc = p.createVector(0, 0);
  this.maxspeed = 3;
  this.maxforce = 0.3;
```
*— `src/week3/Virus.js:17-23` (`constructor`)*

Forces are not applied directly to velocity — they accumulate in `acc` and are integrated once per frame, which lets us compose multiple steering forces just by adding them.

```javascript
applyForce(force) {
  this.acc.add(force);
}
```
*— `src/week3/Virus.js:37-39` (`applyForce`)*

The integration step is identical to a Week 2 mover: add acceleration to velocity, cap it at `maxspeed`, then move and clear the accumulator.

```javascript
update() {
  this.vel.add(this.acc);
  this.vel.limit(this.maxspeed);
  this.pos.add(this.vel);
  this.acc.set(0, 0);
}
```
*— `src/week3/Virus.js:54-59` (`update`)*

The same agents can also be pushed around by environmental forces. In our sketch, anything inside the `Liquid` region accumulates a drag force *before* its steering force is computed — proving the additive nature of the model.

```javascript
if (liquid.contains(v)) v.applyForce(liquid.calculateDrag(v));
v.seek(target);
v.update();
```
*— `src/week3/sketch.js:64-66` (virus update loop)*

## 5. Try it

1. **Personality knobs.** In `Virus.js` change `maxforce` to `0.05` and then to `2`. Describe in one sentence how each value changes the *feel* of the chase.
   <details><summary>Hint</summary>`maxforce` caps how quickly velocity can change. A tiny value gives wide, lazy arcs; a huge one lets the agent snap instantly toward the target.</details>

2. **Mass matters.** Add a `mass` parameter that the constructor receives, and divide the steering force by `mass` inside `applyForce`. Spawn one heavy virus and several light ones. What happens?
   <details><summary>Hint</summary>`a = F / m`. Heavier agents accelerate slower, so they cut wider corners and lag behind the target.</details>

3. **Two desires at once.** In `sketch.js`, after `v.seek(target)`, add a second force that always pushes the virus toward `(width/2, height/2)` (call `seek` twice with different targets). Does the result look broken or believable?
   <details><summary>Hint</summary>Steering forces are vectors — they just add. The agent will end up steering toward the *midpoint* of the two targets, weighted by distance.</details>

## 6. Going further

- Reynolds, Craig W. (1999). *Steering Behaviors For Autonomous Characters.* GDC. <https://www.red3d.com/cwr/steer/>
- Reynolds, Craig W. (1987). *Flocks, Herds, and Schools: A Distributed Behavioral Model.* SIGGRAPH. <https://www.red3d.com/cwr/boids/>
- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 5 — Autonomous Agents. <https://natureofcode.com/autonomous-agents/>
- The Coding Train — *Steering Behaviors* playlist. <https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/5-autonomous-agents/1-seek>
- p5.js Reference — `p5.Vector`. <https://p5js.org/reference/#/p5.Vector>
