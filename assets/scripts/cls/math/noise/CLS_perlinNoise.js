/* ----------------------------------------
 * NOTE:
 *
 * Simply 2D-Perlin noise.
 * Recommended ratio of {w} to {gridW}: 5:1.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_whiteNoise = require("lovec/cls/math/noise/CLS_whiteNoise");


const MATH_interp = require("lovec/math/MATH_interp");


/* <---------- meta ----------> */


const CLS_perlinNoise = newClass().extendClass(CLS_whiteNoise).initClass();


CLS_perlinNoise.prototype.init = function(w, h, gridW, gridH) {
  this.super("init", w, h, gridW, gridH);
};


const tmpCenterVec = new Vec2();
const tmpGridVecs = [
  new Vec2(),
  new Vec2(),
  new Vec2(),
  new Vec2(),
];
const tmpDstVecs = [
  new Vec2(),
  new Vec2(),
  new Vec2(),
  new Vec2(),
];


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_perlinNoise.prototype;


// @INHERITED
ptp.setVecData = function(seed) {
  if(seed == null) seed = -1.0;

  this.forEachVert((i, j) => {
    this.vecData[j][i].set(
      seed < 0.0 ? Mathf.random(-1.0, 1.0) : Mathf.randomSeed(seed + i + j * 10000000, -1.0, 1.0),
      seed < 0.0 ? Mathf.random(-1.0, 1.0) : Mathf.randomSeed(seed + i + j * 10000000, -1.0, 1.0),
    );
  });
};


// @INHERITED
ptp.buildNoise = function(base, cap, seed) {
  if(this.isBuilt) return this.noiseData;
  if(base == null) base = 0.0;
  if(cap == null) cap = 1.0;
  if(seed == null) seed = -1.0;

  this.setVecData(seed);
  this.forEachPon((i, j) => {
    tmpCenterVec.set(
      this.getOffsetCoord(i, seed < 0.0 ? Mathf.random(0.0, 1.0) : Mathf.randomSeed(seed + i, 0.0, 1.0), false),
      this.getOffsetCoord(j, seed < 0.0 ? Mathf.random(0.0, 1.0) : Mathf.randomSeed(seed + j * 10000000, 0.0, 1.0), true),
    );
    tmpDstVecs[0].set(tmpCenterVec).sub(tmpGridVecs[0].set(
      this.toPonCoord(this.toGridCoord(i, false), false),
      this.toPonCoord(this.toGridCoord(j, true), true),
    ));
    tmpDstVecs[1].set(tmpCenterVec).sub(tmpGridVecs[1].set(
      this.toPonCoord(this.toGridCoord(i, false) + 1, false),
      this.toPonCoord(this.toGridCoord(j, true), true),
    ));
    tmpDstVecs[2].set(tmpCenterVec).sub(tmpGridVecs[2].set(
      this.toPonCoord(this.toGridCoord(i, false), false),
      this.toPonCoord(this.toGridCoord(j, true) + 1, true),
    ));
    tmpDstVecs[3].set(tmpCenterVec).sub(tmpGridVecs[3].set(
      this.toPonCoord(this.toGridCoord(i, false) + 1, false),
      this.toPonCoord(this.toGridCoord(j, true) + 1, true),
    ));

    this.noiseData[j][i] = MATH_interp.biLerp(
      (this.vecData[this.getOffsetCoord(this.toGridCoord(j, true), 0, true, true)][this.getOffsetCoord(this.toGridCoord(i, false), 0, false, true)]).dot(tmpDstVecs[0]),
      (this.vecData[this.getOffsetCoord(this.toGridCoord(j, true), 0, true, true)][this.getOffsetCoord(this.toGridCoord(i, false), 1, false, true)]).dot(tmpDstVecs[1]),
      (this.vecData[this.getOffsetCoord(this.toGridCoord(j, true), 1, true, true)][this.getOffsetCoord(this.toGridCoord(i, false), 0, false, true)]).dot(tmpDstVecs[2]),
      (this.vecData[this.getOffsetCoord(this.toGridCoord(j, true), 1, true, true)][this.getOffsetCoord(this.toGridCoord(i, false), 1, false, true)]).dot(tmpDstVecs[3]),
      this.hermiteInterp((i - this.toPonCoord(this.toGridCoord(i, false), false)) / this.tileWidth),
      this.hermiteInterp((i - this.toPonCoord(this.toGridCoord(i, false), false)) / this.tileWidth),
      this.hermiteInterp((j - this.toPonCoord(this.toGridCoord(j, true), true)) / this.tileHeight),
    );
  });

  let tmpArr = this.noiseData.flatten();
  let max = Math.max.apply(null, tmpArr), min = Math.min.apply(null, tmpArr);
  this.forEachPon((i, j) => {
    this.noiseData[j][i] = (
      max === min ?
        0.0 :
        ((this.noiseData[j][i] - min) / (max - min))
    ) * (cap - base) + base;
  });
  this.isBuilt = true;

  return this.noiseData;
};


ptp.hermiteInterp = function(frac) {
  return (((6.0 * frac) - 15.0) * frac + 10.0) * Math.pow(frac, 3);
};


module.exports = CLS_perlinNoise;
