// Author: Jorge Alcaraz
// https:raze.mx
// Session 3: Steering behaviors

var liquid;
var leukocytes = [];
var viruses = [];
var virusLimit = 190;
var leukocyteLimit = 150;
var xoff = 0;

var debug = false;

function setup() {
	createCanvas(1280, 800);

	// Make a new flowfield
	flowfield = new FlowField(20);
	liquid = new Liquid(0, height / 2, width, height / 2, 0.1);

	// Create new leukocyte
	for (var i = 0; i < leukocyteLimit; i++) {
		leukocytes.push(new Leukocyte(random(width), random(height)));
	}

	for (var i = 0; i < virusLimit; i++) {
		viruses.push(new Virus(5, random(width), random(width), 15, 20, 10));
	}


}

function draw() {
	background("#000000");

	// Draw liquid;
	liquid.display();

	// "regular" randomness
  // var x = random(0, width);

  // Perlin noise value
  var x = noise(xoff) * width;
	var y = noise(xoff) * height;
  // Move through perlin noise space
  xoff += 0.05;
	// Seek the target
	var targetVector = createVector(x, y);
	var cell = new Virus(5, random(width), random(width), 15, 20, 10);
	//var targetVector = createVector(random(width), random(height));
	//var targetVector = new Virus(5, targetVectorPosition.xm, targetVectorPosition.y, 15, 20, 10);
	//var targetVector = createVector(width / 2, height / 2);
	//var targetVector = createVector(0, 0);
	if (debug) {
		flowfield.display();
		cell.display();
		cell.update();
	}

	if(mouseIsPressed) {
		debug = true;
	}



	//var organism = createVector(mouseX, mouseY);
	//createNoisePositio
	for(i = 0; i < viruses.length; i++){
		if (liquid.contains(viruses[i])) {
	    // Calculate drag force
	    var dragForce = liquid.calculateDrag(viruses[i]);
	    // Apply drag force to Mover
	    viruses[i].applyForce(dragForce);
  	}
		viruses[i].seek(targetVector);
		viruses[i].display();
		viruses[i].update();
	}

	for(i = 0; i < leukocytes.length; i++){
		if (liquid.contains(leukocytes[i])) {
	    // Calculate drag force
	    var dragForce = liquid.calculateDrag(leukocytes[i]);
	    // Apply drag force to Mover
	    leukocytes[i].applyForce(dragForce);
  	}
		leukocytes[i].arrive(targetVector);
		leukocytes[i].display();
		leukocytes[i].update();

	}

}
