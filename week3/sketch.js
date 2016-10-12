// Author: Jorge Alcaraz
// https:raze.mx
// Session 3: Steering behaviors

var leukocytes = [];
var viruses = [];
var virusLimit = 20;
var leukocyteLimit = 60;

var debug = false;

function setup() {
	createCanvas(1280, 524);

	// Make a new flowfield
	flowfield = new FlowField(20);

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

	// Seek the target
	//var virusTarget = createVector(random(width), random(height));
	//var virusTarget = createVector(width / 2, height / 2);
	var virusTarget = createVector(0, 0);

	if (debug) flowfield.display();

	if(mouseIsPressed) {
		debug = true;
	}



	//var organism = createVector(mouseX, mouseY);
	//createNoisePositio
	for(i = 0; i < viruses.length; i++){
		viruses[i].seek(virusTarget)
		if(viruses[i].touchCenter()) {
			viruses[i].splice(i, 1);
		}
		viruses[i].display()
		viruses[i].update();
	}

	for(i = 0; i < leukocytes.length; i++){
		for(j = 0; j < viruses.length; j++) {
			leukocytes[i].virusColision(viruses[j]);
		}
		leukocytes[i].arrive(virusTarget);
		leukocytes[i].display();
		leukocytes[i].update();
	}

}
