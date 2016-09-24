// Jorge Alcaraz
// https://raze.mx
// Session 1 Assignement 

// "x-offset" in Perlin noise space
var xoff = 0;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  //We add a blue background to our canvas
  background(color(0, 0, 255));

  
  //Initial values for the triangle vertices
  
  var x = 10;
  var y = 50;
  var x1 = 100;
  var y1 = 500;
  var x2 = 200;
  var y2 = 300;

  // Function to create Perlin noise
  function createNoise() {
    x = noise(xoff) * width;
    y = noise(xoff) * height;
  }
  
  // It's triggered only with the mouse
  if (mouseIsPressed){
    createNoise();
  }
  
  // Move through perlin noise space
  xoff += 0.05;
  
  // Let's fill and create a green triangle
  fill(color(0, 125, 0));
  triangle(x, y, x1, y1, x2, y2);
}
