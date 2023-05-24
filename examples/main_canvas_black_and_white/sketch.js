// grey scale shader post processing the main canvas
//
// A simple example sketch showing the p5.filterShader library
// https://github.com/BarneyWhiteman/p5.filterShader

let greyscaleShader;

// load in the shader
function preload() {
  greyscaleShader = loadShader("filter.vert", "filter.frag");
}

function setup() {
  createCanvas(400, 400);
  strokeWeight(10);
}

function draw() {
  background(255);
  
  // Draw some stuff on the screen
  stroke(255, 0, 0);
  fill(255, 255, 0);
  square(50, 50, 100);
  
  stroke(0, 255, 255);
  fill(0, 255, 0);
  circle(300, 300, 100);
  
  if(mouseIsPressed) {
    // If the mouse is pressed, filter our image using our shader
    filterShader(greyscaleShader);
  }
}