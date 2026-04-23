# Seek and Arrive

> *"The desired velocity is what you wish you were doing; the steering force is the apology for what you actually are."*

## 1. The big idea

`seek` and `arrive` are the simplest steering behaviors and they encode a deep idea: every behavior can be expressed as a **desired velocity** that the agent then has to reconcile with its current velocity. `seek` always wants to go full speed at the target; `arrive` wants to slow down as it gets close. Same skeleton, different scalar — and that small change is the difference between a missile and a parking car.

## 2. Where this comes from

Reynolds' 1999 paper opens with `seek` precisely because every other behavior is a variation of it. *Flee* is `seek` with a sign flip. *Pursuit* is `seek` with a predicted future target. *Wander* is `seek` toward a slowly drifting random point. *Path following* is `seek` toward the next waypoint. Once you internalise `seek`, the whole zoo of behaviors stops feeling magical.

`arrive` exists because pure `seek` looks bad in one common case: stopping. A `seek`ing agent reaches its target at full speed, overshoots, swings back, overshoots again, and orbits forever. That oscillation is fine for a predator chasing prey but ridiculous for a character trying to stand on a doorstep. `arrive` solves it by collapsing `desired` to zero as distance shrinks, so the corrective force naturally brings the agent to rest.

The mathematical lineage is older still. Pursuit curves — the path traced by an agent that always points at a moving target — were studied by Pierre Bouguer in 1732 in the context of naval navigation, and the same equations show up in missile guidance ("proportional navigation") and in animal predation studies of dragonflies and bats. Reynolds' contribution was not the curve but the *recipe*: express the desire as a vector, subtract the current velocity, cap the result.

In our Week 3 sketch, `Virus` instances `seek` a slowly drifting target (a Perlin-noise position) while `Leukocyte` instances `arrive` at random viruses. Watching the two at once is the best possible intuition pump for the difference.

## 3. The model

For both behaviors the recipe is the same four lines. Only the magnitude of `desired` changes.

```
SEEK:
  desired  = normalize(target − pos) * maxspeed
  steering = desired − velocity
  steering = limit(steering, maxforce)

ARRIVE:
  d        = |target − pos|
  speed    = (d < slowRadius) ? map(d, 0, slowRadius, 0, maxspeed)
                              : maxspeed
  desired  = normalize(target − pos) * speed
  steering = desired − velocity
  steering = limit(steering, maxforce)
```

The key derivation is `steering = desired − velocity`. Geometrically: `desired` is the velocity vector you *wish* you had this frame; `velocity` is what you actually have. Their difference is the velocity change you need, and dividing by 1 frame gives an acceleration — i.e. a force (with `mass = 1`). Capping it at `maxforce` is the agent's "muscle limit": it can only request so much course correction per frame.

For `arrive`, `slowRadius` is the only new tuning knob. Inside it, speed ramps linearly from 0 (at the target) to `maxspeed` (at the radius edge). Outside it, the behavior is identical to `seek`. That linear ramp is what makes the agent decelerate smoothly instead of skidding to a stop.

## 4. In our code

`seek` is the canonical four-liner: build the desired velocity, subtract the current one, cap, apply.

```javascript
seek(target) {
  const desired = p5.Vector.sub(target, this.pos);
  desired.setMag(this.maxspeed);
  const steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  this.applyForce(steer);
}
```
*— `src/week3/Virus.js:45-51` (`seek`)*

`arrive` is the same shape, with one extra branch that scales the desired magnitude when we're inside the slow zone.

```javascript
arrive(target, slowRadius = 100) {
  const desired = p5.Vector.sub(target, this.pos);
  const d = desired.mag();

  // Scale speed by distance when inside the slow zone
  const speed = d < slowRadius
    ? this.p.map(d, 0, slowRadius, 0, this.maxspeed)
    : this.maxspeed;

  desired.setMag(speed);
  const steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  this.applyForce(steer);
}
```
*— `src/week3/Leukocyte.js:38-51` (`arrive`)*

In the main loop, leukocytes pick a random virus each frame and `arrive` at it — so the target is constantly changing, but the slowing-down behavior is still visible whenever the chosen virus is nearby.

```javascript
const randomVirus = viruses[Math.floor(p.random(viruses.length))];
l.arrive(randomVirus.pos);
l.update();
l.display();
```
*— `src/week3/sketch.js:73-76` (leukocyte update loop)*

Note that `Leukocyte` carries a different `maxspeed` (4) and `maxforce` (0.25) than `Virus` (3 and 0.3). These two scalars are the entire personality difference — the algorithms are otherwise identical.

```javascript
this.maxspeed = 4;
this.maxforce = 0.25;
```
*— `src/week3/Leukocyte.js:19-20` (`constructor`)*

## 5. Try it

1. **Implement `flee`.** Add a `flee(target)` method to `Virus.js` that is the exact opposite of `seek`. Use it to make every virus run away from the mouse position.
   <details><summary>Hint</summary>`flee` is `seek` with the desired vector pointing away: `desired = pos − target` (i.e. swap the order of the subtraction), then continue with the same `setMag → sub vel → limit` pipeline.</details>

2. **Visualise the slow zone.** In `sketch.js`, draw a faint circle of radius `100` around each leukocyte's current target. Watch how the agent decelerates only after entering the circle.
   <details><summary>Hint</summary>Inside the leukocyte loop, after picking `randomVirus`, call `p.noFill(); p.stroke(255, 40); p.ellipse(randomVirus.pos.x, randomVirus.pos.y, 200, 200);` (diameter = 2 × radius).</details>

3. **Pursuit.** Make a leukocyte `arrive` not at the virus's *current* position but at its *predicted* position 10 frames from now. The result should look like an interception rather than a chase.
   <details><summary>Hint</summary>`predicted = virus.pos + virus.vel * 10`. Pass `predicted` to `arrive` instead of `virus.pos`. This is exactly Reynolds' "pursuit" behavior.</details>

## 6. Going further

- Reynolds, Craig W. (1999). *Steering Behaviors For Autonomous Characters* — sections on Seek, Flee, Arrival, Pursuit. <https://www.red3d.com/cwr/steer/>
- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 5.2–5.3. <https://natureofcode.com/autonomous-agents/>
- The Coding Train — *5.1 Seek* and *5.2 Arrive*. <https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/5-autonomous-agents/1-seek>
- Millington, Ian & Funge, John (2009). *Artificial Intelligence for Games* (2nd ed.), Chapter 3 — Movement.
- p5.js Reference — `p5.Vector.sub`, `setMag`, `limit`. <https://p5js.org/reference/#/p5.Vector>
