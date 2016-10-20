var maxIterations = 1024;

// Visible complex plane
var x1 = -2.5;
var x2 = 1;
var y1 = -1;
var y2 = 1;

var cWidth = x2-x1;
var cHeight = y2-y1;


function Mandelbrot() {

    this.control;


    // map our bitmap x coordinate to a real axis coordinate
    this.mapXToReal = function(xcoord) {
      return cWidth * xcoord / width + x1;
    }

    // map our bitmap y coordinate to an imaginary axis coordinate
    this.mapYToComplex = function(ycoord) {
      return y1 + cHeight * ycoord / height;
    }

    // set colors in this function
    this.generatePalette = function() {
        var palette = [];
        for (i = 0; i < 16; i++) {
            var c = "rgb(" + (i*8) + "," + (i*8) + "," + (128+i*4) + ")";
            palette.push(c);
        }
        for (i = 16; i < 64; i++) {
            var c = "rgb(" + (128+i-16) + "," + (128+i-16) + "," + (192+i-16) + ")";
            palette.push(c);
        }
        for (i = 64; i < maxIterations; i++) {
        // 319 is TOTALLY a magic number in this context
            var c = "rgb(" + ((319-i)%256) + "," + ((128+(319-i)/2)%256) + "," + ((319-i)%256) + ")";
            palette.push(c);
        }
        palette[maxIterations] = "rgb(0,0,0)";
        return palette;
    }

    var palette = this.generatePalette();
    var x = 0;
    var y = 0;

    this.display = function() {
        for(var x = 0; x < width; x++){
            //for(var y = 0; y < height; y++){
                this.control = 0;
                this.x = x;
                this.y = y;
                this.iterate();
            //}
        }
    }

    this.iterate = function() {
        if(this.y >= height){
            this.y = 0;
            return;
        }
        else{
            var z = [this.x, this.y];
            this.control = this.getIterations(z);
            stroke(palette[this.control]);
            point(this.x, this.y);
            this.y++;
            this.iterate();
        }
        //return control;
    };

    this.getIterations = function(z) {
        var iterations = 0;
        var cReal = this.mapXToReal(z[0]);
        var cImg = this.mapYToComplex(z[1]);

        var zReal = 0.0;
        var zImg = 0.0;

        //var control = 0;
        while (zReal * zReal + zImg*zImg < 4 && iterations < maxIterations) {
            var tmpZReal = zReal*zReal - zImg*zImg + cReal;
            var tmpZImg = 2*zReal*zImg + cImg;
            if (zReal == tmpZReal && zImg == tmpZImg) {
                iterations = maxIterations;
                break;
            }
            zReal = tmpZReal;
            zImg = tmpZImg;
            iterations++;
        }
        return iterations;
    }

}