function Virus(m,x,y,r1,r2,npoints) {

	this.mass = m;
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.maxspeed = 300;
	this.maxforce = 0.3;


	this.r = 6;

	this.applyForce = function(force) {
		this.acc.add(force);
	};

	this.seek = function(target) {
		var desired = p5.Vector.sub(target, this.pos);

		// The seek behavior!
		desired.setMag(this.maxspeed);

		// Steering formula
		var steering = p5.Vector.sub(desired, this.vel);
		steering.limit(this.maxforce);
		this.applyForce(steering);

	};

	this.noise = function() {
		var xoff = 0;
		this.pos.x = noise(xoff) * width;
		this.pos.y = noise(xoff) * height;
	}

	

		this.update = function() {
			this.vel.add(this.acc);
			this.vel.limit(this.maxspeed);
			this.pos.add(this.vel);
			this.acc.set(0, 0);
		};

		this.display = function() {
		    var angle = TWO_PI / npoints;
		    var halfAngle = angle/2.0;
		    beginShape();
		    for (var a = 0; a < TWO_PI; a += angle) {
		      var sx = this.pos.x + cos(a) * r2;
		      var sy = this.pos.y + sin(a) * r2;
		      vertex(sx, sy);
		      sx = this.pos.x + cos(a+halfAngle) * r1;
		      sy = this.pos.y + sin(a+halfAngle) * r1;
		      vertex(sx, sy);
		    }
		    endShape(CLOSE);
		    stroke(0);
		    fill(random(255), random(255), random(255));
		};

}
