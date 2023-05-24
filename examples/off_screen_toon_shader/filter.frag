#ifdef GL_ES
precision mediump float;
#endif

// Number of bands for toon effect
const float numBands = 8.0;

// Pixel position
varying vec2 pos;

// Uniforms set by filterShader
uniform sampler2D filter_background; // contains the image being filtered
uniform vec2 filter_res; // contains the image resolution in pixels

void main() {
   // Read colour from image
  vec4 col = texture2D(filter_background, pos);
  
  // Round to band value
  col = floor(col * numBands)/numBands;
  
  gl_FragColor = vec4(col.rgb, 1.0);
}