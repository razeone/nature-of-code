# JavaScript Essentials

> *"A language that doesn't affect the way you think about programming is not worth knowing."* — Alan Perlis

## 1. The big idea

Before we can simulate gravity, drag, or noise, we need a handful of language features we'll reach for over and over: variables, arrow functions, arrays, loops, conditionals, and classes. This lecture is a focused pass through the slice of modern JavaScript (ES2015+) that the rest of the course depends on. If you already know JavaScript, skim it for the conventions we use; if you don't, treat it as your reference card.

## 2. Where this comes from

JavaScript was sketched out by Brendan Eich at Netscape in May 1995, in roughly ten days, to make web pages interactive. For most of its life it was a quirky scripting language tucked into browsers. That changed in 2015 with the ECMAScript 6 (ES2015) revision, which added classes, modules, `let`/`const`, arrow functions, template literals, and destructuring. Those features turned JavaScript into a serious general-purpose language.

The Nature of Code was originally written in Java and then in p5.js, a JavaScript port of Processing. Processing itself was created by Casey Reas and Ben Fry at the MIT Media Lab in 2001, with the goal of making programming approachable for designers and artists. Lauren McCarthy started p5.js in 2013 to bring that same spirit to the browser.

The reason we use JavaScript here is pragmatic: every laptop already has a JavaScript runtime — the browser. There's no install, no compile step, no "works on my machine." You write code, save the file, and the canvas updates. That short feedback loop matters when you are trying to get a feel for how an equation behaves.

Modern JavaScript is also surprisingly close to the pseudo-code in physics and graphics papers. Arrow functions look like math; classes look like the way Newton's *Principia* describes a body. We'll lean into that.

## 3. The model

You only need a small subset of the language to do creative coding well:

- **Bindings**: `const` for values that don't change, `let` for ones that do. Avoid `var`.
- **Numbers and strings**: one numeric type (`number`, IEEE 754 double), template literals with backticks for interpolation.
- **Functions**: arrow functions for short callbacks, `function` only when you need hoisting.
- **Collections**: arrays with `.forEach`, `.map`, `.filter`; objects as plain key-value bags.
- **Control flow**: `for`, `for...of`, `if`/`else`, the ternary `cond ? a : b`.
- **Classes**: ES2015 `class` syntax for grouping state and behavior.

A useful mental model: JavaScript hands you references, not values, for anything that isn't a number, string, boolean, `null`, or `undefined`. Two variables can point at the same array; mutating one mutates "both."

```
const a = [1, 2, 3];
const b = a;        // b and a refer to the same array
b.push(4);          // a is now [1, 2, 3, 4] too
```

That single fact explains most "why did my vector change?" bugs in the weeks ahead.

## 4. In our code

**Variables, arithmetic, and template literals.** We use `const` by default and only switch to `let` when we genuinely need to reassign. Template literals (`` ` ` ``) make string interpolation painless.

```javascript
const name   = 'Nature of Code';   // string
const width2 = 800;                 // number
const isOn   = true;                // boolean
let   count  = 0;                   // mutable
```
*— `src/week0/lessons/01-intro-js.js:20-23` (sketch body)*

**Arrow functions.** This is our preferred function form. Concise, lexically-scoped `this`, perfect for callbacks.

```javascript
const greet = (whom) => `Hello, ${whom}!`;
p.text(greet('World'), 30, 340);
```
*— `src/week0/lessons/01-intro-js.js:59-60` (sketch body)*

**Loops over arrays.** We mix classic `for` (when we need the index) with `.forEach` (when we don't). Notice destructuring in the callback parameters.

```javascript
const colours = ['red', 'green', 'blue'];
colours.forEach((col, idx) => {
  p.fill(col === 'red' ? '#e57' : col === 'green' ? '#5e7' : '#57e');
  p.ellipse(100 + idx * 80, 410, 50, 50);
});
```
*— `src/week0/lessons/01-intro-js.js:63-67` (sketch body)*

**Classes.** ES2015 classes are the cleanest way to bundle state and behavior. Every class in this course takes the p5 instance `p` as its first constructor argument so it can call drawing functions without relying on globals.

```javascript
class Particle {
  constructor(p, x, y) {
    this.p    = p;
    this.pos  = p.createVector(x, y);
    this.vel  = p5.Vector.random2D().mult(p.random(1, 3));
    this.acc  = p.createVector(0, 0);
    this.mass = p.random(1, 4);
    this.hue  = p.random(360);
    this.noff = p.random(1000);
  }
}
```
*— `src/week0/lessons/07-moving-object.js:21-35` (`Particle.constructor`)*

## 5. Try it

1. **Counter sketch (easy).** In a fresh sketch, declare `let count = 0;`. Every frame, increment it and draw the value with `p.text(count, 20, 20);`. What happens after a minute?
   <details><summary>Hint</summary>`p.draw` runs about 60 times per second, so after 60 seconds `count` is around 3600. Use `p.frameCount` for the same effect without your own variable.</details>

2. **Array of circles (medium).** Create an array of 20 random `{x, y, r}` objects in `setup`. In `draw`, iterate them with `.forEach` and render an ellipse for each. Then mutate one entry's `x` by `+1` per frame and watch only that circle drift.
   <details><summary>Hint</summary>Build with `Array.from({length: 20}, () => ({ x: p.random(p.width), y: p.random(p.height), r: 20 }))`. Mutate `circles[0].x += 1` inside `draw`.</details>

3. **Bouncer class (harder).** Write a `Bouncer` class with `pos`, `vel`, `update()`, and `display()`. In `update`, reverse `vel.x` when the position hits the left or right edge. Spawn five of them with random initial velocities.
   <details><summary>Hint</summary>Inside `update()`, `if (this.pos.x < 0 || this.pos.x > this.p.width) this.vel.x *= -1;`. Don't forget to call `this.pos.add(this.vel)` first.</details>

## 6. Going further

- Eich, Brendan. "JavaScript at Ten Years" (2005). https://brendaneich.com/2008/04/popularity/
- MDN — JavaScript Guide. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- Haverbeke, Marijn. *Eloquent JavaScript* (3rd ed., 2018). https://eloquentjavascript.net/
- Shiffman, Daniel. *The Nature of Code* (2024), Introduction. https://natureofcode.com/
- The Coding Train — "JavaScript Basics" track. https://thecodingtrain.com/
