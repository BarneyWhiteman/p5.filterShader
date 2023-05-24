#ifdef GL_ES
precision mediump float;
#endif

// Pixel position
varying vec2 pos;

// Uniforms set by filterShader
uniform sampler2D filter_background; // contains the image being filtered
uniform vec2 filter_res; // contains the image resolution in pixels

void main() {
  // Read colour from image
  vec4 col = texture2D(filter_background, pos);
  
  // Find average of red, green, and blue
  float avg = (col.r + col.g + col.b)/3.0;
  
  // Output the greyscale colour
  gl_FragColor = vec4(avg, avg, avg, 1.0);
}