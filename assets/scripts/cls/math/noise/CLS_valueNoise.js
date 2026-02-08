/* ----------------------------------------
 * NOTE:
 *
 * Based on white noise, but smoother.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_whiteNoise = require("lovec/cls/math/noise/CLS_whiteNoise");


const MATH_interp = require("lovec/math/MATH_interp");


/* <---------- meta ----------> */


const CLS_valueNoise = newClass().extendClass(CLS_whiteNoise).initClass();


CLS_valueNoise.prototype.init = function(w, h, gridW, gridH) {
  this.super("init", w, h, gridW, gridH);
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_valueNoise.prototype;


// @INHERITED
ptp.setVecData = function(base, cap, seed) {
  if(base == null) base = 0.0;
  if(cap == null) cap = 1.0;
  if(seed == null) seed = -1.0;

  this.forEachVert((i, j) => {
    this.vecData[j][i].set(
      seed < 0.0 ? Mathf.random(base, cap) : Mathf.randomSeed(seed + i + j * 10000000, base, cap),
      0.0,
    );
  });
};


// @INHERITED
ptp.buildNoise = function(base, cap, seed) {
  if(this.isBuilt) return this.noiseData;
  if(base == null) base = 0.0;
  if(cap == null) cap = 1.0;
  if(seed == null) seed = -1.0;

  this.setVecData(base, cap, seed);
  this.forEachPon((i, j) => {
    this.noiseData[j][i] = MATH_interp.smoothBiLerp(
      (this.vecData[this.getOffsetCoord(this.toGridCoord(j, true), 0, true, true)][this.getOffsetCoord(this.toGridCoord(i, false), 0, false, true)]).x,
      (this.vecData[this.getOffsetCoord(this.toGridCoord(j, true), 0, true, true)][this.getOffsetCoord(this.toGridCoord(i, false), 1, false, true)]).x,
      (this.vecData[this.getOffsetCoord(this.toGridCoord(j, true), 1, true, true)][this.getOffsetCoord(this.toGridCoord(i, false), 0, false, true)]).x,
      (this.vecData[this.getOffsetCoord(this.toGridCoord(j, true), 1, true, true)][this.getOffsetCoord(this.toGridCoord(i, false), 1, false, true)]).x,
      (i - this.toPonCoord(this.toGridCoord(i, false), false)) / this.tileWidth,
      (i - this.toPonCoord(this.toGridCoord(i, false), false)) / this.tileWidth,
      (j - this.toPonCoord(this.toGridCoord(j, true), true)) / this.tileHeight,
    );
  });

  this.isBuilt = true;

  return this.noiseData;
};


module.exports = CLS_valueNoise;
