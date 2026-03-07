/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * The simplest noise and parent of most noise generators.
 * @class
 * @param {number|unset} [w]
 * @param {number|unset} [h]
 * @param {number|unset} [gridW]
 * @param {number|unset} [gridH]
 */
const CLS_whiteNoise = newClass().initClass();


CLS_whiteNoise.prototype.init = function(w, h, gridW, gridH) {
  if(w == null) w = 1;
  if(h == null) h = 1;
  if(gridW == null) gridW = 1;
  if(gridH == null) gridH = 1;

  this.width = w;
  this.height = h;
  this.gridWidth = gridW;
  this.gridHeight = gridH;
  this.tileWidth = w / gridW;
  this.tileHeight = h / gridH;
  /** @type {Array<Array<number>>} */
  this.noiseData = [].setVal(() => [].setVal(0.0, w), h);
  /** @type {Array<Array<Vec2>>} */
  this.vecData = [].setVal(() => [].setVal(() => new Vec2(0.0, 0.0), gridW), gridH);
  this.isBuilt = false;
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


/**
 * Prints `noiseData` as colored zeros.
 * @param {number|unset} [base]
 * @param {number|unset} [cap]
 * @return {void}
 */
CLS_whiteNoise.prototype.print = function(base, cap) {
  if(base == null) base = 0.0;
  if(cap == null) cap = 1.0;

  let str = "";
  this.noiseData.forEachFast(arr => {
    str += "\n";
    arr.forEachFast(z => {
      str += "0".color(Tmp.c2.set(Color.black).lerp(Color.white, Mathf.clamp((z - base) / cap)));
    });
  });

  print(str);
};


/**
 * Gets proper coordination of a looped noise when offset is used.
 * @param {number} coord
 * @param {number|unset} [off]
 * @param {boolean|unset} [isY]
 * @param {boolean|unset} [isGrid]
 * @return {number}
 */
CLS_whiteNoise.prototype.getOffsetCoord = function(coord, off, isY, isGrid) {
  let tmpCoord = coord + tryVal(off, 0);
  let w = isY ? (isGrid ? this.gridHeight : this.height) : (isGrid ? this.gridWidth : this.width);
  while(tmpCoord < 0) {
    tmpCoord += w;
  };
  while(tmpCoord >= w) {
    tmpCoord -= w;
  };

  return tmpCoord;
};


/**
 * Converts a point coordinate to grid point coordinate.
 * @param {number} coord
 * @param {boolean|unset} [isY]
 * @return {number}
 */
CLS_whiteNoise.prototype.toGridCoord = function(coord, isY) {
  return Math.floor(coord / (isY ? this.height : this.width) * (isY ? this.gridHeight : this.gridWidth));
};


/**
 * Converts a grid point coordinate to point coordinate.
 * @param {number} gCoord
 * @param {boolean|unset} [isY]
 * @return {number}
 */
CLS_whiteNoise.prototype.toPonCoord = function(gCoord, isY) {
  return Math.round(gCoord * (isY ? this.height / this.gridHeight : this.width / this.gridWidth));
};


/**
 * Gets z-value at (x, y).
 * @param {number} x
 * @param {number} y
 * @param {number|unset} [offX]
 * @param {number|unset} [offY]
 * @return {number}
 */
CLS_whiteNoise.prototype.getZ = function(x, y, offX, offY) {
  return this.noiseData[this.getOffsetCoord(y, offY, true)][this.getOffsetCoord(x, offX, false)];
};


/**
 * Gets vector at (gx, gy).
 * @param {number} gx
 * @param {number} gy
 * @param {number|unset} [offGx]
 * @param {number|unset} [offGy]
 * @return {Vec2}
 */
CLS_whiteNoise.prototype.getVec = function(gx, gy, offGx, offGy) {
  return this.vecData[this.getOffsetCoord(gy, offGy, true, true)][this.getOffsetCoord(gx, offGx, false, true)];
};


/**
 * Iterates through all points of the noise.
 * @param {function(Number, Number): void} scr - <ARGS>: x, y.
 * @return {void}
 */
CLS_whiteNoise.prototype.forEachPon = function(scr) {
  this.height._it(j => {
    this.width._it(i => {
      scr(i, j);
    });
  });
};


/**
 * Iterates through all grid points of the noise.
 * @param {function(): void} scr
 * @return {void}
 */
CLS_whiteNoise.prototype.forEachVert = function(scr) {
  this.gridHeight._it(j => {
    this.gridWidth._it(i => {
      scr(i, j);
    });
  });
};


/**
 * Sets up vectors, not used for white noise.
 * <br> <LATER>
 * @return {void}
 */
CLS_whiteNoise.prototype.setVecData = function() {

};


/**
 * Sets up noise data.
 * This method should be overrided for other noise types.
 * @param {number|unset} [base]
 * @param {number|unset} [cap]
 * @param {number|unset} [seed]
 * @return {Array<Array<number>>}
 */
CLS_whiteNoise.prototype.buildNoise = function(base, cap, seed) {
  if(this.isBuilt) return this.noiseData;
  if(base == null) base = 0.0;
  if(cap == null) cap = 1.0;
  if(seed == null) seed = -1.0;

  this.forEachPon((i, j) => {
    this.noiseData[j][i] = seed < 1 ?
      Mathf.random(base, cap) :
      Mathf.randomSeed(seed + i + j * 10000000, base, cap);
  });
  this.isBuilt = true;

  return this.noiseData;
};


module.exports = CLS_whiteNoise;
