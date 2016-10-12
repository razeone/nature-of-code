// Author: Jorge Alcaraz
// https:raze.mx
// Session 3: Steering behaviors

var leukocytes = [];
var viruses = [];
var virusLimit = 75;
var leukocyteLimit = 50;

function setup() {
	createCanvas(800, 600);

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
	var virusTarget = createVector(random(width), random(height));

	//var organism = createVector(mouseX, mouseY);
	//createNoisePositio
	for(i = 0; i < viruses.length; i++){
		viruses[i].seek(virusTarget)
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