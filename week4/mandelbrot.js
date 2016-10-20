var maxIterations = 1024;

// Visible complex plane
var x1 = -2.5;
var x2 = 1;
var y1 = -1;
var y2 = 1;

var cWidth = x2-x1;
var cHeight = y2-y1;


function Mandelbrot() {


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
            for(var y = 0; y < height; y++){
                var color = this.iterate(x, y);
                stroke(palette[color]);
                point(x, y);
            }
        }
    }

    this.draw = function() {

    }

    this.iterate = function(x, y) {
        var cReal = this.mapXToReal(x);
        var cImg = this.mapYToComplex(y);

        var zReal = 0.0;
        var zImg = 0.0;

        var control = 0;
        while (zReal * zReal + zImg*zImg < 4 && control < maxIterations) {
            var tmpZReal = zReal*zReal - zImg*zImg + cReal;
            var tmpZImg = 2*zReal*zImg + cImg;
            if (zReal == tmpZReal && zImg == tmpZImg) {
                control = maxIterations;
                break;
            }
            zReal = tmpZReal;
            zImg = tmpZImg;
            control++;
        }
        return control;
    };

}