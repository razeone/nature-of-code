// Jorge Alcaraz
// https://raze.mx
// Session 4 Fractals

function setup() {
  createCanvas(700, 400);
  mandelbrot = new Mandelbrot();
  //mandelbrot.iterate();
}

function draw() {
  //We add a black background to our canvas
  background('#000000');
  mandelbrot.display();
  //noLoop();
}
