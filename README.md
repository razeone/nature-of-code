# nature-of-code

This series of assiments belong the "Nature of code" [Kadenze](https://kadenze.com) MOOC by [Daniel Shiffman](https://github.com/shiffman)

### Contents
Each week is part of the code submited as part of my work for the course, part of the code are the constructors of the actual [Nature Of Code Kadenze](https://github.com/shiffman/The-Nature-of-Code-Kadenze) examples.

==Note: All the examples, unless the Mandelbrot set example use the event for clicking the mouse, so feel free to click when you're running them==

* Week 1: Is an unfinished try of creating a butterfly that flaps with Perlin Noise when you click the mouse.
* Week 2: Is an awesome physics engine to compare two particles' dampening in a substance called gelatin, you can create `Stars` with a mass, number of points and dampening by clicking. And the `Gelatin` can be also moved in the screen and change the dragging force applied to the object. You can change the values in the [sketch file](https://github.com/razeone/nature-of-code/blob/master/week2/sketch.js)
* Week 3: Is a simullation of two steering forces behaviours by [Craig Reynolds](http://www.red3d.com/cwr/steer/): Pursue and Arrive. Since the viruses are just pursuing the objective [random generated]("https://github.com/razeone/nature-of-code/blob/master/week3/sketch.js#L50-L54) target, the leukocytes are arriving to random viruses.
* Week 4: Is a drawing of the mandelbrot set in zoom: 1 the recursive function is not an enhancement, it was a requirement for the assignment, you can go deeper the fractal if you increase number of itterations and canvas size.
* Week 5: Is a genetic algorithm simulation following the viruses example on steering behaviours, but now there's a `DNA` class for handling fenotype and a `Population` class which calculates handles the population generations and mutation rate. Fitness is duplicated if the object reaches the target and decreased by 90% if the virus hits an antibiotic. ==Note: If you declare several antibiotics it's going to be difficult to your population to reach the object on the other side of the canvas, but it can and actually the model ran 56 generations to succed with 100 antibiotics in the screen.==

### Bonus examples for creative coders (weeks 6–10)

These newer sketches extend the course with self-contained, modern-p5 examples that each lean on a single concept — ideal for teaching programming to creatives. They load p5 from a CDN, so you can just open the `index.html` in a browser (no build step, no bundled library folder).

* **Week 6 — Particle System (`week6/`)**: fireworks built from a `Particle` class and a `Firework` composition that explodes mid-air. Covers forces, arrays of objects, lifespan, and an `Emitter` that leaks embers from the mouse. Click to launch, space toggles wind.
* **Week 7 — Flocking / Boids (`week7/`)**: an implementation of Craig Reynolds' three rules (separation, alignment, cohesion). Extends week 3's steering toward emergent group behavior. Keys `1`/`2`/`3` tune each rule's weight in real time.
* **Week 8 — Conway's Game of Life (`week8/`)**: a cellular automaton on a toroidal grid with age-based coloring. Click-drag to paint, space to pause, `G` spawns Gosper's glider gun. Introduces 2D arrays, neighborhoods, and a classic simulation loop.
* **Week 9 — L-Systems (`week9/`)**: procedural plants, Koch curve, Sierpinski triangle, and Heighway dragon from string-rewrite grammars drawn with a turtle. Builds on week 4's recursion but as a grammar. Click to plant wherever you like.
* **Week 10 — Phyllotaxis (`week10/`)**: the Vogel formula that places seeds at the golden angle (~137.5°). Drag to tune angle and scale, scroll to add seeds, `P` cycles palettes, `S` saves a PNG. A closing "program as a design tool" demo.

You can report any issues or send a PR if you want.

### License
MIT 
