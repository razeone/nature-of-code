// Jorge Raze
// https://raze.mx
// Session 2: Drag Force

var Gelatin = function(x, y, w, h, c) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;
  
  this.contains = function(m) {
    var l = m.position;
    return l.x > this.x && l.x < this.x + this.w &&
           l.y > this.y && l.y < this.y + this.h;
  };
  
  this.calculateDrag = function(m) {
    // Magnitude is coefficient * speed squared
    var speed = m.velocity.mag();
    var dragMagnitude = this.c * speed * speed;

    // Direction is inverse of velocity
    var dragForce = m.velocity.copy();
    dragForce.mult(-1);

    // Scale according to magnitude
    dragForce.setMag(dragMagnitude);
    return dragForce;
  }

  this.display = function() {
    noStroke();
    fill('#dbf769');
    rect(this.x, this.y, this.w, this.h);
  }
}