# Drag and Mediums

> *"In honey, you swim. In air, you fall. The medium decides."*

## 1. The big idea

A falling star in a vacuum just keeps accelerating. A real falling object eventually hits a **terminal velocity** because the surrounding medium pushes back, harder the faster the object moves. That push is **drag**, and it's the first force we'll model that depends on the object's *own velocity*. Adding drag to the Week 2 sketch — a translucent panel of "gelatin" stretched across the bottom of the canvas — is what turns it from "particles falling forever" into something that feels physical.

## 2. Where this comes from

Sir Isaac Newton studied air resistance in Book II of the *Principia* (1687) and proposed what we now call **Newton's drag equation**: at high speeds, drag is proportional to the *square* of velocity. A century later, Sir George Stokes derived a complementary result for very small or slow objects in viscous fluids — Stokes' law — where drag is *linear* in velocity. The difference comes down to the **Reynolds number**, a ratio of inertial to viscous forces. Honey at low speeds is Stokes; a baseball is Newton; a marble dropped through olive oil sits awkwardly in between.

For game and animation purposes the formula we almost always reach for is the high-Reynolds form, **quadratic drag**:

```
F_drag = -½ · ρ · C_d · A · |v|² · v̂
```

where `ρ` is the medium's density, `C_d` is a shape-dependent drag coefficient, `A` is the cross-sectional area, and `v̂` is the unit vector in the direction of motion. In *Nature of Code* and in this course we collapse all of those constants into a single coefficient `c` and write:

```
F_drag = -c · |v|² · v̂        (which equals  -c · |v| · v)
```

Two things to notice. The minus sign means drag always *opposes* motion. The `|v|²` means doubling your speed quadruples the resisting force — which is why terminal velocity exists, and why gelatin can stop a falling star almost on contact while a feather floats gently through air.

The third Newtonian insight tucked into this lecture: **mediums are spatial**. A region of fluid only resists motion within its boundaries. So we need not just a force, but a *test* — is this object inside the medium right now? — and only then do we apply the drag.

## 3. The model

Two pieces. The drag force itself:

```
speed     = |v|
F_drag    = (-v̂) · c · speed²
          = (v.copy().mult(-1).setMag(c · speed²))
```

And the containment test (axis-aligned bounding box):

```
inside ⇔  x ∈ [x₀, x₀ + w]  and  y ∈ [y₀, y₀ + h]
```

Putting them together, the per-frame question for each object is:

```
if inside(medium):
    F = drag(object.velocity, medium.c)
    object.applyForce(F)
```

A single coefficient `c` makes it easy to model multiple media — water, oil, honey — by using different values. Smaller `c` means a thinner medium; larger `c` means a thicker one. In our sketch `c = 0.08` is enough to make the stars visibly hesitate as they enter the gelatin.

A subtle prediction the model makes: drag does *not* scale with mass. So heavy stars punch through the gelatin while light ones can be nearly stopped by it. That's the same reason a bowling ball and a feather fall at different speeds in air, but identically in vacuum.

## 4. In our code

**The medium as a class with bounds and a coefficient.** Gelatin is just a rectangle plus a number.

```javascript
constructor(p, x, y, w, h, c) {
  this.p = p;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c; // drag coefficient
}
```
*— `src/week2/Gelatin.js:15-22` (`Gelatin.constructor`)*

**The containment test.** A pure AABB check against the mover's position.

```javascript
contains(mover) {
  const { x, y } = mover.pos;
  return x > this.x && x < this.x + this.w &&
         y > this.y && y < this.y + this.h;
}
```
*— `src/week2/Gelatin.js:29-33` (`Gelatin.contains`)*

**The drag force itself.** A direct translation of `F = -c·|v|² · v̂`. We `copy()` the velocity first because vector instance methods mutate.

```javascript
calculateDrag(mover) {
  const speed = mover.vel.mag();
  const dragMagnitude = this.c * speed * speed;
  const dragForce = mover.vel.copy();
  dragForce.mult(-1);
  dragForce.setMag(dragMagnitude);
  return dragForce;
}
```
*— `src/week2/Gelatin.js:40-47` (`Gelatin.calculateDrag`)*

**Wiring it into the sketch.** Each frame, for each star, ask the gelatin "do you contain this?" and only then apply the drag force. Gravity is applied unconditionally afterward.

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

**Drag coefficient as a tunable constant.** We pull `DRAGGING` out as a top-level constant so it's easy to find and modify. Try `0.01` for water, `0.5` for tar.

```javascript
const DRAGGING   = 0.08;  // drag coefficient of the gelatin
```
*— `src/week2/sketch.js:13` (sketch body)*

## 5. Try it

1. **Try different coefficients (easy).** Run the sketch with `DRAGGING = 0.01`, then `0.08` (current), then `0.5`. Observe how the stars' behavior in the gelatin changes from "barely affected" to "almost frozen."
   <details><summary>Hint</summary>You're changing one number on line 13 of `src/week2/sketch.js`. With very high drag, stars may oscillate or get pinned at the gelatin's surface — that's a sign the time step can't keep up with the force.</details>

2. **Stack two media (medium).** Add a second `Gelatin` instance — say "honey" near the bottom and "water" above it — with different `c` values and different colors. Both should test `contains()` and apply drag independently.
   <details><summary>Hint</summary>`const water = new Gelatin(p, 0, p.height/2, p.width, 100, 0.02); const honey = new Gelatin(p, 0, p.height - 100, p.width, 100, 0.3);` Then in the per-star loop, two `if (xxx.contains(star)) star.applyForce(xxx.calculateDrag(star));` checks.</details>

3. **Predict and verify terminal velocity (harder).** Analytically, terminal velocity is reached when `F_drag = F_gravity`, i.e. `c · v_t² = m · g`. Solve for `v_t = sqrt(m · g / c)`. With `m = 50`, `g = 0.3`, `c = 0.08`, that's about `v_t ≈ 13.7` pixels/frame. Add a HUD that prints each star's `vel.mag()` and confirm it converges to that value while inside the gelatin.
   <details><summary>Hint</summary>Inside the loop: `if (gelly.contains(star)) p.text(star.vel.mag().toFixed(2), star.pos.x + 20, star.pos.y);`. The number will oscillate around `~13.7` once the star has been in the gelatin long enough.</details>

## 6. Going further

- Shiffman, Daniel. *The Nature of Code* (2024), Chapter 2 — "Friction" and "Air and Fluid Resistance." https://natureofcode.com/forces/#air-and-fluid-resistance
- Newton, Isaac (1687). *Principia*, Book II, Sections I–II (resistance proportional to velocity squared). https://www.gutenberg.org/ebooks/28233
- Bourg, David & Bywalec, Bryan (2013). *Physics for Game Developers* (2nd ed.). O'Reilly. Chapter 7 — "Fluid Forces."
- Stokes, George (1851). "On the effect of the internal friction of fluids on the motion of pendulums."
- The Coding Train — "Drag Forces." https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/2-forces/2-drag-forces
- NASA Glenn — "The Drag Equation." https://www.grc.nasa.gov/www/k-12/airplane/drageq.html
