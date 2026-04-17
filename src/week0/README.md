# Week 0 — JavaScript & p5.js Foundations

Welcome! Before we can simulate nature we need to speak the language. This week covers every concept you'll rely on throughout the course.

---

## 0.1 What is p5.js?

[p5.js](https://p5js.org/) is a JavaScript library that makes it easy to draw graphics, respond to user input, and create animations — all inside a web browser.

A p5 sketch has two essential functions:

```javascript
p.setup = () => {
  p.createCanvas(800, 600); // called once at the start
};

p.draw = () => {
  p.background(0);          // called ~60 times per second
  p.ellipse(400, 300, 50);
};
```

> **Instance mode** — In this course every sketch is wrapped in `new p5((p) => { ... })`. This avoids polluting the global scope and lets multiple sketches coexist on the same page.

---

## 0.2 The Coordinate System

| Concept | p5 value |
|---------|----------|
| Origin  | top-left corner `(0, 0)` |
| X axis  | increases **rightward** |
| Y axis  | increases **downward** |
| Canvas size | `p.width` × `p.height` |

```javascript
p.ellipse(0, 0, 40);          // top-left corner
p.ellipse(p.width/2, p.height/2, 40); // centre
```

---

## 0.3 Variables and Data Types

```javascript
const name   = 'Nature of Code';  // string  — immutable binding
let   score  = 0;                  // number  — can be reassigned
const isOn   = true;               // boolean
const pi     = 3.14159;            // floating-point number
```

Use `const` by default; switch to `let` only when you need to reassign.

---

## 0.4 Functions and Arrow Functions

```javascript
// Traditional function
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function (preferred in this course)
const greet = (name) => `Hello, ${name}!`;

// Multi-line arrow function
const add = (a, b) => {
  const result = a + b;
  return result;
};
```

---

## 0.5 Loops

```javascript
// for loop — run 10 circles across the canvas
for (let i = 0; i < 10; i++) {
  p.ellipse(i * 80 + 40, 300, 50);
}

// forEach on an array
const colours = ['red', 'green', 'blue'];
colours.forEach((col) => {
  p.fill(col);
  // ...
});
```

---

## 0.6 p5.Vector — The Workhorse of This Course

A `p5.Vector` holds `x` and `y` (and optionally `z`) components. It is the backbone of every physics simulation.

```javascript
// Create
const pos = p.createVector(200, 300);
const vel = p.createVector(2, -1);

// Arithmetic
pos.add(vel);              // pos += vel  (in-place)
const sum = p5.Vector.add(pos, vel); // returns a new vector

// Magnitude & direction
vel.mag();                 // length of the vector
vel.normalize();           // unit vector (length = 1)
vel.setMag(5);             // set length to 5

// Scalar multiplication
vel.mult(2);               // double the length
```

---

## 0.7 Classes

ES2022 classes are the cleanest way to group state + behaviour:

```javascript
class Particle {
  constructor(p, x, y) {
    this.p   = p;                          // store p5 instance
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
  }

  update() {
    this.pos.add(this.vel);
  }

  display() {
    this.p.ellipse(this.pos.x, this.pos.y, 20);
  }
}

// Usage inside a sketch:
const particle = new Particle(p, 400, 300);
```

> **Rule**: Always pass the p5 instance `p` as the first argument to any class constructor so it can call `p.ellipse()`, `p.createVector()`, etc. without relying on globals.

---

## Lesson Files

| File | Topic |
|------|-------|
| `lessons/01-intro-js.js` | Variables, loops, conditionals, arrays |
| `lessons/02-setup-draw.js` | Canvas, coordinates, basic shapes |
| `lessons/03-animation-loop.js` | frameCount, frameRate, deltaTime |
| `lessons/04-drawing.js` | fill, stroke, shapes, colorMode |
| `lessons/05-vectors.js` | p5.Vector operations visualised |
| `lessons/06-interactivity.js` | Mouse & keyboard events |
| `lessons/07-moving-object.js` | Full class-based physics particle |

---

## Challenges

1. **Colour picker** — Draw a grid of 100 rectangles, each filled with a unique HSB hue. Use nested `for` loops.
2. **Bouncing ball** — Create a `Ball` class with `pos`, `vel`. Make it bounce off all four edges.
3. **Cursor trail** — Store the last 30 mouse positions in an array; draw them as fading circles.
4. **Vector playground** — Draw three vectors from the canvas centre. Let the user drag one vector's tip with the mouse.
