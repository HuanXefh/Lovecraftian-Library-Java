/* ----------------------------------------
 * NOTE:
 *
 * The simplest noise and parent of most noise generators.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


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
  this.noiseData = [].setVal(() => [].setVal(0.0, w), h);
  this.vecData = [].setVal(() => [].setVal(() => new Vec2(0.0, 0.0), gridW), gridH);

  this.isBuilt = false;
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_whiteNoise.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Prints {noiseData} of the noise as colored zeros.
 * ---------------------------------------- */
ptp.print = function(base, cap) {
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


/* ----------------------------------------
 * NOTE:
 *
 * Returns the proper coordination for a looped noise, when offset is used.
 * ---------------------------------------- */
ptp.getOffsetCoord = function(coord, off, isY, isGrid) {
  let tmpCoord = tryVal(coord, 0) + tryVal(off, 0);
  let w = isY ? (isGrid ? this.gridHeight : this.height) : (isGrid ? this.gridWidth : this.width);
  while(tmpCoord < 0) {
    tmpCoord += w;
  };
  while(tmpCoord >= w) {
    tmpCoord -= w;
  };

  return tmpCoord;
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts a point coordination to grid point coordination.
 * ---------------------------------------- */
ptp.toGridCoord = function(coord, isY) {
  return Math.floor(tryVal(coord, 0) / (isY ? this.height : this.width) * (isY ? this.gridHeight : this.gridWidth));
};


/* ----------------------------------------
 * NOTE:
 *
 * Reversed version of {toGridCoord}.
 * ---------------------------------------- */
ptp.toPonCoord = function(gCoord, isY) {
  return Math.round(gCoord * (isY ? this.height / this.gridHeight : this.width / this.gridWidth));
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns the z-value at (x, y).
 * ---------------------------------------- */
ptp.getZ = function(x, y, offX, offY) {
  return this.noiseData[this.getOffsetCoord(y, offY, true)][this.getOffsetCoord(x, offX, false)];
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns the vector at (gx, gy).
 * ---------------------------------------- */
ptp.getVec = function(gx, gy, offGx, offGy) {
  return this.vecData[this.getOffsetCoord(gy, offGy, true, true)][this.getOffsetCoord(gx, offGx, false, true)];
};


/* ----------------------------------------
 * NOTE:
 *
 * Iteration over each point of the noise.
 * ---------------------------------------- */
ptp.forEachPon = function(scr) {
  this.height._it(1, j => {
    this.width._it(1, i => {
      scr(i, j);
    });
  });
};


/* ----------------------------------------
 * NOTE:
 *
 * Iteration over each grid point of the noise.
 * ---------------------------------------- */
ptp.forEachVert = function(scr) {
  this.gridHeight._it(1, j => {
    this.gridWidth._it(1, i => {
      scr(i, j);
    });
  });
};


/* ----------------------------------------
 * NOTE:
 *
 * @LATER
 * Sets up the {vecData}, not used for white noise.
 * ---------------------------------------- */
ptp.setVecData = function() {

};


/* ----------------------------------------
 * NOTE:
 *
 * Sets up {noiseData}.
 * This should be overrided for other noise types.
 * ---------------------------------------- */
ptp.buildNoise = function(base, cap, seed) {
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
},


module.exports = CLS_whiteNoise;
