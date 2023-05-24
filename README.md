# p5.filterShader
A library that allows you to use a shader to add post processing filters to any p5.js sketch (including non-WEBGL sketches). Please note that this does use WEBGL behind the scenes.

This library is mostly for convinence and wraps some functionality that I was frequently using in my own sketches.

![image](https://raw.githubusercontent.com/BarneyWhiteman/p5.filterShader/main/colour_banner.png)

<small><em>Above: a screenshot of the [toon shader example](https://github.com/BarneyWhiteman/p5.filterShader/tree/main/examples/off_screen_toon_shader)</em></small>

## Get the library
The library must be added to your sketch *after* the p5.js library has been included but *before* you include your own sketch files.

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/gh/BarneyWhiteman/p5.filterShader@0.0.2/p5.filterShader.min.js"></script>
```

On OpenProcessing, paste this link into a new library slot:
```
https://cdn.jsdelivr.net/gh/BarneyWhiteman/p5.filterShader@0.0.2/p5.filterShader.min.js
```

### Self-hosted
[Download the minified or unminified source code from the releases tab](https://github.com/BarneyWhiteman/p5.filterShader/releases/), then add it to your HTML:
```html
<script type="text/javascript" src="p5.filterShader.min.js"></script>
```

## Usage

To use p5.filterShader, simply load in the [shader](https://p5js.org/reference/#/p5.Shader) you want in the [`preload` function](https://p5js.org/reference/#/p5/loadShader), then call `filterShader` and pass in your shader object to apply the shader. This is often done *after* you've drawn the rest of the frame to add a post processing effect, however it can be called whenever suits your needs.

```js
let myFilterShader;

function preload() {
  myFilterShader = loadShader("filter.vert", "filter.frag");
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  
  /*
  ... your drawing stuff here ...
  */
  
  // apply the shader as a filter
  filterShader(myFilterShader);
}
```

There is a basic [example sketch](https://github.com/BarneyWhiteman/p5.filterShader/tree/main/examples/main_canvas_black_and_white) which applies a filter to the main canvas.

### Shader uniforms
When used inside `filterShader`, the shader object is passed two uniform values.

Firstly there is

```glsl
uniform sampler2D filter_background
``` 
that is the image the filter is being applied to, and secondly there is

```glsl
uniform vec2 filter_res
```

which holds the resolution of the image in pixels.

Below is an example of a vertex and fragment shader which will turn the image into greyscale.
<table>
<tr>
<td>

```glsl
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 pos;

void main() {
  pos = aTexCoord;
  // flip the y axis
  pos.y = 1.0 - pos.y;

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  gl_Position = positionVec4;
}
```

</td>
<td>

```glsl
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 pos;

uniform sampler2D filter_background;
uniform vec2 filter_res;

void main() {
  vec4 col = texture2D(filter_background, pos);
  
  float avg = (col.r + col.g + col.b)/3.0;
  
  gl_FragColor = vec4(avg, avg, avg, 1.0);
}
```

</td>
</tr>
</table>

If you want to [set additional uniforms](https://p5js.org/reference/#/p5.Shader/setUniform) in your shader, you can do so as normal before calling `filterShader`.

```js
myFilterShader.setUniform("myUniform", [mouseX, mouseY]);
filterShader(myFilterShader);
```

### Where it can be used
`filterShader` can be called globally, as seen above, to be applied to the main canvas, or it can be called on a seperate graphics instance, as in the example below:

```js
let myFilterShader;
let offScreenGraphic;

function preload() {
  myFilterShader = loadShader("filter.vert", "filter.frag");
}

function setup() {
  createCanvas(400, 400);
  offScreenGraphic = createGraphics(width, height);
}

function draw() {
  offScreenGraphic.background(255);
  
  /*
  ... draw onto offScreenGraphic object here ...
  */
  
  // apply the shader as a filter
  offScreenGraphic.filterShader(myFilterShader);
  
  // draw the offScreenGraphic onto the main canvas for display
  image(offScreenGraphic, 0, 0);
}
```

There is an [example sketch](https://github.com/BarneyWhiteman/p5.filterShader/tree/main/examples/off_screen_toon_shader) which applies a filter to an off screen graphics object.
