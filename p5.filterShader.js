p5.prototype.filterShader = function(shaderObj) {
  _filterShader(shaderObj, this._renderer, this);
}

p5.Graphics.prototype.filterShader = function (shaderObj) {
  _filterShader(shaderObj, this, this);
};

p5.Image.prototype.filterShader = function (shaderObj) {
  _filterShader(shaderObj, this, this);
};

p5.Renderer.prototype.filterShader = function (shaderObj) {
  _filterShader(shaderObj, this, this);
};

function _filterShader(shaderObj, cnv, drawer) {
  
  if(!cnv._filterTexture) {
    cnv._filterTexture = createGraphics(cnv.width, cnv.height, WEBGL);
  } else if (cnv._filterTexture.width !== cnv.width ||
      cnv._filterTexture.height !== cnv.height) {
    cnv._filterTexture.resizeCanvas(cnv.width, cnv.height);
  }
  
  const tex = cnv._filterTexture;
  
  tex.shader(shaderObj);
  
  shaderObj.setUniform("filter_background", cnv);
  shaderObj.setUniform("filter_res", [cnv.width, cnv.height]);
  
  tex.rect(0, 0, tex.width, tex.height);
    
  drawer.push();
  drawer.resetMatrix();
  drawer.imageMode(CORNER);
  
  let x = 0;
  let y = 0;
  
  if(drawer._renderer.isP3D) {
    x = -cnv.width/2;
    y = -cnv.height/2;
  }
  
  drawer.clear();
  drawer.image(tex, x, y, cnv.width, cnv.height);
  
  drawer.pop();
}
