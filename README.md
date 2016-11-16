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

You can report any issues or send a PR if you want.

### License
MIT 
