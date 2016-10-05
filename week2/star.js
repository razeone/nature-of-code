// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 2: Drag Force

function Star(m,x,y,r1,r2,npoints) {

  this.mass = m;
  this.position = createVector(x,y);
  this.velocity = createVector(0,0);
  this.acceleration = createVector(0,0);

  // Newton's 2nd law: F = M * A
  // or A = F / M
  this.applyForce = function(force) {
    var f = p5.Vector.div(force,this.mass);
    this.acceleration.add(f);
  };

  this.update = function() {
    // Velocity changes according to acceleration
    this.velocity.add(this.acceleration);
    // position changes by velocity
    this.position.add(this.velocity);
    // We must clear acceleration each frame
    this.acceleration.mult(0);
  };

  this.display = function() {
    var angle = TWO_PI / npoints;
    var halfAngle = angle/2.0;
    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
      var sx = this.position.x + cos(a) * r2;
      var sy = this.position.y + sin(a) * r2;
      vertex(sx, sy);
      sx = this.position.x + cos(a+halfAngle) * r1;
      sy = this.position.y + sin(a+halfAngle) * r1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    stroke(0);
    fill(255,127);
  };

  // Bounce off bottom of window
  this.checkEdges = function() {
    if (this.position.y > height) {
      this.velocity.y *= -0.9;  // A little dampening when hitting the bottom
      this.position.y = height;
    }
  };

}
