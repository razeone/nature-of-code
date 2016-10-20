// Jorge Raze
// https://raze.mx
// Session 4: Steering behaviours

function Liquid(x, y, w, h, c) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;

  // Is the Mover in the Liquid?
  this.contains = function(m) {
    var l = m.pos;
    return l.x > this.x && l.x < this.x + this.w &&
           l.y > this.y && l.y < this.y + this.h;
  };

  // Calculate drag force
  this.calculateDrag = function(m) {
    // Magnitude is coefficient * speed squared
    var speed = m.vel.mag();
    var dragMagnitude = this.c * speed * speed;

    // Direction is inverse of velocity
    var dragForce = m.vel.copy();
    dragForce.mult(-100);

    // Scale according to magnitude
    dragForce.setMag(dragMagnitude);
    return dragForce;
  }

  this.display = function() {
    noStroke();
    fill(50);
    rect(this.x, this.y, this.w, this.h);
  }
}
