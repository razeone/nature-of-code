// Jorge Raze
// https://raze.mx
// Session 4: Steering behaviours

function Virus(x,y,r1,r2,npoints) {

  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 300;
  this.maxforce = 0.3;

  this.dna = dna_;
  // How close did it get to the target
  this.recordDist = 10000;      // Some high number that will be beat instantly
  this.finishTime = 0;          // We're going to count how long it takes to reach target

  this.hitObstacle = false;    // Am I stuck on an obstacle?
  this.hitTarget = false;   // Did I reach the target


  this.calcFitness = function() {
    if (this.recordDist < 1) {
      this.recordDist = 1;
    }

    // Reward finishing faster and getting close
    this.fitness = (1/(this.finishTime*this.recordDist));

    // Make the function exponential
    this.fitness = pow(this.fitness, 4);

    if (this.hitObstacle) this.fitness *= 0.1; // lose 90% of fitness hitting an obstacle
    if (this.hitTarget) this.fitness *= 2; // twice the fitness for finishing!
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  // Did I make it to the target?
  this.checkTarget = function() {
    var d = dist(this.location.x, this.location.y, target.location.x, target.location.y);
    if (d < this.recordDist) this.recordDist = d;

    if (target.contains(this.location) && !this.hitTarget) {
      this.hitTarget = true;
    }
    else if (!this.hitTarget) {
      this.finishTime++;
    }
  }

  // Did I hit an obstacle?
  this.obstacles = function(os) {
    for (var i = 0; i < os.length; i++) {
      if (os[i].contains(this.location)) {
        this.hitObstacle = true;
      }
    }
  }

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
        fill(0, random(255), 0);
    };

}
