// Jorge Raze
// https://raze.mx
// Session 5: Evolutionary Computing

var lifetime;  // How long should each generation live

var population;  // Population

var lifeCounter;   // Timer for cycle of generation

var target;        // Target location

var info;

var recordtime;         // Fastest time to target

var antibiotics;  //an array list to keep track of all the antibiotics!
var antibioticsLimit = 100;

function setup() {
  createCanvas(800, 600);
  // The number of cycles we will allow a generation to live
  lifetime = height;

  // Initialize variables
  lifeCounter = 0;

  // Create a population with a mutation rate, and population max
  var mutationRate = 0.01;
  population = new Population(mutationRate, 50);

  info = createP("");
  info.position(10,height);

  recordtime = lifeCounter;

  target = new Antibiotic(width/2-12, 24, 40, 40, 'pink');

  // Create the obstacle course
  antibiotics = [];
  for(i = 0; i < antibioticsLimit; i++){
  	antibiotics.push(new Antibiotic(random(width), random(height), 20, 20, 'white'));
  }

}

function draw() {
  background(101);

  // Draw the start and target locations
  target.display();

  // If the generation hasn't ended yet
  if (lifeCounter < lifetime) {
    population.live(antibiotics);
    if ((population.targetReached()) && (lifeCounter < recordtime)) {
      recordtime = lifeCounter;
    }
    lifeCounter++;
    // Otherwise a new generation
  }
  else {
    lifeCounter = 0;
    population.fitness();
    population.selection();
    population.reproduction();
  }

 // Draw the antibiotics
  for (var i = 0; i < antibiotics.length; i++) {
    antibiotics[i].display();

  }
  info.html("Generation #: " + population.getGenerations() + "<br>" + "Cycles left: " + (lifetime-lifeCounter));

}

// Move the target if the mouse is pressed
// System will adapt to new target
function mousePressed() {
  target.location.x = mouseX;
  target.location.y = mouseY;
}
