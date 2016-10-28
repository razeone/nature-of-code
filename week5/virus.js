// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 5: Evolutionary Computing

// Rocket class -- this is just like our Boid / Particle class
// the only difference is that it has DNA & fitness

//constructor
function Virus(l, dna_, totalRockets) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(0,0);
  this.location = createVector(l.x,l.y);
  // Size
  this.r = 4;
  // Fitness and DNA
  this.fitness = 0;
  // To count which force we're on in the genes
  this.geneCounter = 0;
  this.dna = dna_;
  // How close did it get to the target
  this.recordDist = 10000;      // Some high number that will be beat instantly
  this.finishTime = 0;          // We're going to count how long it takes to reach target

  this.hitObstacle = false;    // Am I stuck on an obstacle?
  this.hitTarget = false;   // Did I reach the target


  // FITNESS FUNCTION
  // distance = distance from target
  // finish = what order did i finish (first, second, etc. . .)
  // f(distance,finish) =   (1.0f / finish^1.5) * (1.0f / distance^6);
  // a lower finish is rewarded (exponentially) and/or shorter distance to target (exponetially)
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

  // Run in relation to all the obstacles
  // If I'm stuck, don't bother updating or checking for intersection
  this.run = function(os) {
    if (!this.hitObstacle && !this.hitTarget) {
      this.applyForce(this.dna.genes[this.geneCounter]);
      this.geneCounter = (this.geneCounter + 1) % this.dna.genes.length;
      this.update();
      // If I hit an edge or an obstacle
      this.obstacles(os);
    }
    // Draw me!
    if (!this.hitObstacle) {
      this.display();
    }
  }

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

  this.applyForce = function(f) {
    this.acceleration.add(f);
  };

  this.update = function() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  };

  var r1 = 15;
  var r2 = 20;

  this.display = function() {
    var angle = TWO_PI / 10;
    var halfAngle = angle/2.0;
    fill(0, random(255), 0);
    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
      var sx = this.location.x + cos(a) * r2;
      var sy = this.location.y + sin(a) * r2;
      vertex(sx, sy);
      sx = this.location.x + cos(a+halfAngle) * r1;
      sy = this.location.y + sin(a+halfAngle) * r1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    stroke(0);
  };

  this.getFitness = function() {
    return this.fitness;
  };

  this.getDNA = function() {
    return this.dna;
  };

  this.stopped = function() {
    return this.hitObstacle;
  }
}
