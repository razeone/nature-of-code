// Jorge Raze
// https://raze.mx
// Session 5: Evolutionary Computing

function Antibiotic(x, y, w_, h_, f) {
  this.location = createVector(x,y);
  this.w = w_;
  this.h = h_;

  this.display = function() {
    stroke(0);
    fill(f);
    strokeWeight(2);
    //rectMode(CORNER);
    ellipse(this.location.x,this.location.y,this.w,this.h);
  }

  this.contains = function(spot) {
    if (spot.x > this.location.x && spot.x < this.location.x + this.w && spot.y > this.location.y && spot.y < this.location.y + this.h) {
      return true;
    } else {
      return false;
    }
  }
}
