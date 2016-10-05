// Jorge Raze
// https://raze.mx
// Session 2: Drag Force

var gelly;
var stars = [];

function setup() {
  createCanvas(800, 600);
  
  gelly = new Gelatin(width / 2, -1, width / 2, height + 1, 0.1);
}

function draw() {
  background('#69d0f7');
  gelly.display();

  if (mouseIsPressed) {
  	stars.push(new Star(5, mouseX, mouseY, 80, 100, 40));
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