p5.prototype.filterShader = function(shaderObj) {
  _filterShader(shaderObj, this._renderer, image);
}

p5.Graphics.prototype.filterShader = function (shaderObj) {
  _filterShader(shaderObj, this);
};

p5.Image.prototype.filterShader = function (shaderObj) {
  _filterShader(shaderObj, this);
};

p5.Renderer.prototype.filterShader = function (shaderObj) {
  _filterShader(shaderObj, this);
};

function _filterShader(shaderObj, cnv, imageFunc) {
  
  if(!cnv._filterTexture ||
      cnv._filterTexture.width !== cnv.width ||
      cnv._filterTexture.height !== cnv.height) {
    cnv._filterTexture = createGraphics(cnv.width, cnv.height, WEBGL);
  }
  
  const tex = cnv._filterTexture;
  
  tex.shader(shaderObj);
  
  shaderObj.setUniform("filter_background", cnv);
  shaderObj.setUniform("filter_res", [cnv.width, cnv.height]);
  
  tex.rect(0, 0, tex.width, tex.height);
  
  if(!imageFunc) {
    imageFunc = cnv.image;
  }
  
  imageFunc(tex, 0, 0, cnv.width, cnv.height);
}
