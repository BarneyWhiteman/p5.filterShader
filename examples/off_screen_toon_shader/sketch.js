// Toon shader post processing on off-screen graphics
//
// A simple example sketch showing the p5.filterShader library
// https://github.com/BarneyWhiteman/p5.filterShader

let greyscaleShader;

let gfx;

function preload() {
  greyscaleShader = loadShader("filter.vert", "filter.frag");
}

function setup() {
  createCanvas(400, 200);

  // Create an off-screen graphics to draw on
  gfx = createGraphics(width/2, height, WEBGL);
  gfx.noStroke();
  noLoop();
}

function draw() {
  gfx.background(96);
  
  gfx.push();
  
  // Give some lighting
  const t = millis()/1000;
  gfx.directionalLight(255, 255, 255, cos(t/2), sin(t), -1);
  
  // Draw a sphere
  gfx.fill(255, 0, 255);
  gfx.sphere(50);
  
  gfx.pop();
  
  // Draw image before filter (left)
  image(gfx, 0, 0, width/2, height);
  // Apply filter
  gfx.filterShader(greyscaleShader);
  // Draw image after filter (right)
  image(gfx, width/2, 0, width/2, height);
}