// Jorge Raze
// https://raze.mx
// Session 2: Drag Force

var gelly;
var stars = [];
var dragging = 0.1
var dampening = -5
var starPoints = 18
var starMass = 50

function setup() {
  createCanvas(screen.width, screen.height - 70);

  gelly = new Gelatin(width / 2, -1, width / 2, height + 1, dragging);
}

function draw() {
  background('#69d0f7');
  gelly.display();

  if (mouseIsPressed) {
  	stars.push(new Star(starMass, mouseX, mouseY, 33, 99, starPoints, dampening));
  }

  for(i = 0; i < stars.length; i++){
  		if(gelly.contains(stars[i])){
  			var dragForce = gelly.calculateDrag(stars[i]);
  			stars[i].applyForce(dragForce);
  		}
	  	var gravity = createVector(0, 1.25 * stars[i].mass, -1);
	  	stars[i].applyForce(gravity);
	  	stars[i].update();
	  	stars[i].display();
	  	stars[i].checkEdges();
	  }
}
