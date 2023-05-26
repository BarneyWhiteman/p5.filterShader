# p5.filterShader
A library that allows you to use a fragment shader to add post processing filters to any p5.js sketch (including non-WEBGL sketches). Please note that this does use WEBGL behind the scenes.

This library is mostly for convinence and wraps some functionality that I was frequently using in my own sketches.

![image](https://raw.githubusercontent.com/BarneyWhiteman/p5.filterShader/main/colour_banner.png)

<small><em>Above: a screenshot of the [posterise shader example](https://editor.p5js.org/BarneyCodes/sketches/xfVcdKmtM)</em></small>

## Get the library
The library must be added to your sketch *after* the p5.js library has been included but *before* you include your own sketch files.

### Via CDN
The library is available via the following CDN:

```
https://cdn.jsdelivr.net/gh/BarneyWhiteman/p5.filterShader@0.0.2/p5.filterShader.min.js
```

You can include the following in your `index.html` *after* including the p5.js library:

```html
<script src="https://cdn.jsdelivr.net/gh/BarneyWhiteman/p5.filterShader@0.0.2/p5.filterShader.min.js"></script>
```

### Self-hosted
[Download the minified or unminified source code from the releases tab](https://github.com/BarneyWhiteman/p5.filterShader/releases/), then add it to your HTML:
```html
<script type="text/javascript" src="p5.filterShader.min.js"></script>
```

## Usage
To use p5.filterShader, simply [load](https://p5js.org/reference/#/p5/loadShader) in the [shader](https://p5js.org/reference/#/p5.Shader) you want in the [`preload` function](https://p5js.org/reference/#/p5/preload). 

You can then call `filterShader` and pass in your shader object to apply the shader. This is often done *after* you've drawn the rest of the frame to add a post processing effect, however it can be called whenever suits your needs.

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

There are examples available on the [online p5.js editor](https://editor.p5js.org/BarneyCodes/collections/qwCiTya1e).

### Uniforms provided by the library
When used inside `filterShader`, the shader object is passed two uniform values.

By adding the following lines of code to your fragment shader, you can access these values:

```glsl
uniform sampler2D filter_background;
uniform vec2 filter_res;
```

**`filter_background`** is the image the filter is being applied to.

**`filter_res`** holds the resolution of the image in pixels.



Below is an example of a vertex and fragment shader which will turn the image into greyscale.
<table>
<tr>
<td>

```glsl
// Generic Vertex Shader
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
  
  float avg = (col.r + col.g + col.b)/3.;
  
  gl_FragColor = vec4(avg, avg, avg, col.a);
}
```

</td>
</tr>
</table>

Look at the greyscale filter example to see a more complete version of using `filterShader`.

### Your own uniforms

If you want to [set additional uniforms](https://p5js.org/reference/#/p5.Shader/setUniform) in your shader, you can do so as normal before calling `filterShader`.

```js
myFilterShader.setUniform("mouse_pos", [mouseX, mouseY]);
filterShader(myFilterShader);
```

Look at the posterise filter example to see a more complete version of using `setUniform`.

### Where it can be used
`filterShader` can be called globally on the main canvas, or it can be called on a seperate graphics instance. 

```js

...
// Multiple drawing surfaces 
let canvas = createCanvas(400, 400);
let graphics = createGraphics(400, 400);

...

// Calling filterShader on the drawing surfaces
filterShader(myFilterShader);
canvas.filterShader(myFilterShader);
graphics.filterShader(myFilterShader);

```

Look at the posterise filter example to see a more complete version of using `filterShader` on an seperate graphics instance.

## Examples
You can find examples sketches using the `filterShader` function in the [online p5.js editor](https://editor.p5js.org/BarneyCodes/collections/qwCiTya1e).

There are currently two examples:
- A basic sketch using a greyscale filter on the main canvas [here](https://editor.p5js.org/BarneyCodes/sketches/SGaANoXS2)
- A more advanced sketch using a posterise filter on an off screen canvas, using setUniform [here](https://editor.p5js.org/BarneyCodes/sketches/xfVcdKmtM)
