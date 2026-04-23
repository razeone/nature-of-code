# p5.js and the Canvas

> *"Software is a medium. Sketching is how we think in it."* — Casey Reas

## 1. The big idea

p5.js gives us two things: a canvas to draw on, and a tight loop that redraws it many times per second. Everything else in this course — particles, noise fields, drag forces — is built on top of those two facts. This lecture explains the loop, the coordinate system, and the **instance mode** pattern we use everywhere.

## 2. Where this comes from

In 2001 Casey Reas and Ben Fry built Processing as a teaching environment at the MIT Media Lab. Their goal was to make the first hour of programming visually rewarding: you write `ellipse(50, 50, 80, 80);` and a circle appears. By stripping away boilerplate and centering on a `setup()` / `draw()` pair, they made graphics programming approachable for designers and artists.

Twelve years later, in 2013, Lauren McCarthy started p5.js to bring that same friendliness to the browser. Instead of compiling Java, you save a `.js` file and refresh. Instead of a separate window, you get an HTML5 `<canvas>` embedded in the page. The API is intentionally close to Processing's, which means decades of Processing tutorials, books, and Coding Train videos still apply.

The HTML5 canvas itself was introduced by Apple in 2004 for the Dashboard widgets in Mac OS X Tiger and standardized in HTML5 by 2014. Under the hood, every p5 drawing call eventually becomes a canvas API call. p5 is doing two jobs for us: hiding the canvas boilerplate, and providing math/utility helpers (random, noise, vectors, color modes) that the raw canvas does not.

In a course like ours we have one extra requirement: multiple sketches, sometimes on the same page, must not stomp on each other. That's why we always use **instance mode** — `new p5((p) => { ... })` — instead of the global mode you'll see in older tutorials. Every drawing function is called as `p.ellipse(...)`, never bare `ellipse(...)`.

## 3. The model

A p5 sketch is a function that registers two callbacks on a p5 instance:

```
setup()   // runs once, before the first frame
draw()    // runs ~60 times per second, forever
```

The canvas uses screen coordinates: the **origin `(0, 0)` is the top-left corner**, x increases to the right, and **y increases downward**. This trips up anyone coming from math class, where y goes up. It doesn't take long to internalize, but expect a couple of upside-down sketches first.

Animation comes from three globals provided every frame:

```
p.frameCount   // integer, frames since the sketch started
p.frameRate()  // current frames-per-second (a measurement)
p.deltaTime    // milliseconds since the previous frame
```

If you want motion that runs at the same speed on a phone and a gaming PC, multiply your per-step changes by `p.deltaTime`. If you don't care, increment by a constant per frame and accept that the speed depends on the hardware.

## 4. In our code

**Instance mode.** Every sketch in this repo is wrapped in this pattern. The `p` parameter is *the* p5 instance, and we attach `setup`/`draw` to it.

```javascript
const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 500);
    p.noLoop(); // static demo
  };

  p.draw = () => {
    p.background(15, 15, 35);
    p.textFont('monospace');
```
*— `src/week0/lessons/01-intro-js.js:9-17` (sketch body)*

**The coordinate system.** Lesson 02 draws a labelled grid that makes the top-left origin obvious. Notice how `(0,0)` lives in the corner.

```javascript
// Origin label
p.fill(255, 220, 80);
p.textSize(13);
p.text('(0,0)', 4, 14);
```
*— `src/week0/lessons/02-setup-draw.js:36-39` (sketch body)*

**Drawing primitives.** We work with rectangles, ellipses, triangles, arcs, and custom polygons via `beginShape`/`vertex`/`endShape`. Color and stroke are *modal* — once set, they apply to every following call until you change them.

```javascript
// 5. beginShape / vertex — custom polygon (hexagon)
p.fill(200, 80, 255, 180);
p.stroke(220, 130, 255);
p.beginShape();
for (let i = 0; i < 6; i++) {
  const a = p.TWO_PI / 6 * i - p.HALF_PI;
  p.vertex(630 + p.cos(a) * 45, 80 + p.sin(a) * 45);
}
p.endShape(p.CLOSE);
```
*— `src/week0/lessons/04-drawing.js:46-53` (sketch body)*

**The animation loop.** `frameCount` drives time-like motion; `deltaTime` makes that motion frame-rate independent. Both are available for free inside `draw`.

```javascript
// deltaTime: physics-independent animation
// angle advances in degrees per millisecond regardless of frame rate
angle += (90 / 1000) * p.deltaTime; // 90°/s
```
*— `src/week0/lessons/03-animation-loop.js:43-45` (sketch body)*

**Interactivity.** Mouse and keyboard state is exposed as properties (`p.mouseX`, `p.mouseIsPressed`, `p.keyIsDown(...)`) and as event callbacks you assign to (`p.mousePressed`, `p.keyPressed`).

```javascript
p.mousePressed = () => {
  clicks.push({ x: p.mouseX, y: p.mouseY, age: 0 });
};

p.keyPressed = () => {
  messages.push(`keyPressed: "${p.key}" (code ${p.keyCode})`);
  if (messages.length > MAX_MSG) messages.shift();
};
```
*— `src/week0/lessons/06-interactivity.js:84-91` (sketch body)*

## 5. Try it

1. **Hello canvas (easy).** Make a sketch that draws a single ellipse that follows the mouse. Use `p.mouseX` and `p.mouseY` and clear the background each frame.
   <details><summary>Hint</summary>In `draw`: `p.background(0); p.ellipse(p.mouseX, p.mouseY, 40);`. Try removing the background to see the trail.</details>

2. **Frame-rate-independent orbit (medium).** Make a circle orbit the canvas center using `p.cos`/`p.sin`. Drive the angle with `p.deltaTime` so it completes one revolution every 4 seconds, regardless of frame rate.
   <details><summary>Hint</summary>One revolution per 4 s = `360 / 4000` degrees per millisecond. Accumulate `angle += (360 / 4000) * p.deltaTime`. Then `x = cx + cos(radians(angle)) * r;`.</details>

3. **Click-to-paint (harder).** Maintain an array of `{x, y, color}` dots. Push a new dot in `p.mousePressed` with the current mouse position and a random hue. Render every dot in `draw`. Add a key handler so pressing `c` clears the array.
   <details><summary>Hint</summary>`p.mousePressed = () => dots.push({ x: p.mouseX, y: p.mouseY, c: p.color(p.random(255), 100, 200) });` and `p.keyPressed = () => { if (p.key === 'c') dots.length = 0; };`</details>

## 6. Going further

- Reas, Casey & Fry, Ben (2014). *Processing: A Programming Handbook for Visual Designers and Artists* (2nd ed.). MIT Press.
- McCarthy, Lauren et al. (2015). "p5.js" — about page. https://p5js.org/about/
- p5.js Reference. https://p5js.org/reference/
- HTML Living Standard — The `canvas` element. https://html.spec.whatwg.org/multipage/canvas.html
- Shiffman, Daniel. *The Nature of Code* (2024), Introduction. https://natureofcode.com/
- The Coding Train — "Code! Programming with p5.js." https://thecodingtrain.com/tracks/code-programming-with-p5-js
