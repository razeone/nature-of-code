function Leukocyte(x, y, m) {
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.maxspeed = 0.6;
	this.maxforce = 2;

	this.r = 6;

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.seek = function(target) {
		var desired = p5.Vector.sub(target, this.pos);

		// The seek behavior!
		desired.setMag(this.maxspeed);

		// Steering formula
		var steering = p5.Vector.sub(desired, this.vel);
		steering.limit(this.maxforce);
		this.applyForce(steering);

	}

	this.arrive = function(target) {

		var desired = p5.Vector.sub(target, this.pos);

		// desired.setMag(this.maxspeed);

		// The arrive behavior!
		var d = desired.mag();

		if (d < 100) {
		  // Map the desired magnitude according to distance
		  var m = map(d, 0, 100, 0, this.maxspeed);
		  desired.setMag(m);
		} else {
		  desired.setMag(this.maxspeed);
		}


		var steering = p5.Vector.sub(desired, this.vel);
		steering.limit(this.maxforce);

		this.applyForce(steering);

	}

	this.virusColision = function(m) {
	    var l = m.pos;
	    //console.log(l.x);
		if(l == this.pos){
			console.log('Colision');
			return true;
		}
	}


	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.set(0, 0);
	  }

	this.display = function() {
		// Draw a particle rotated in the direction of velocity
		stroke(200, this.lifespan);
		strokeWeight(2);
		fill(127, this.lifespan);
		ellipse(this.pos.x, this.pos.y, 12, 12);

		var theta = this.vel.heading() + PI / 2;
		fill(127);
		stroke(200);
		strokeWeight(1);
		push();
		translate(this.pos.x, this.pos.y);
		rotate(theta);
		beginShape();
		vertex(0, -this.r * 2);
		vertex(-this.r, this.r * 2);
		vertex(this.r, this.r * 2);
		endShape(CLOSE);
		pop();

	}

	
}