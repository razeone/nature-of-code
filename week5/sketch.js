var viruses = [];
var virusLimit = 190;
var antibiotics = [];
var antibioticsLimit = 100;

function setup() {
	createCanvas(800, 600);
	for (var i = 0; i < virusLimit; i++) {
		viruses.push(new Virus(random(width), random(width), 15, 20, 10));
	}

	for (var i = 0; i < antibioticsLimit; i++) {
		antibiotics.push(new Antibiotic(random(width), random(height), 25, 25));
	}

}

function draw() {
	background('#000000');
	var targetVector = createVector(width/2, height/2);
	for(i = 0; i < antibiotics.length; i++){
		antibiotics[i].display()
	}
	for(i = 0; i < viruses.length; i++){
		viruses[i].seek(targetVector);
		viruses[i].display();
		viruses[i].update();
	}
}