/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * Used to build a recipe object.
 * Only contains fields related to I/O.
 * @class
 * @extends CLS_paramBuilder
 */
const CLS_recipeBuilder = newClass().extendClass(CLS_paramBuilder).initClass();


CLS_recipeBuilder.prototype.init = function() {
  this.builderObj = {};
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


/**
 * Sets CI field.
 * @param {Array|unset} [arr]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__ci = function(arr) {
  this.builderObj["ci"] = tryVal(arr, Array.air);

  return this;
};


/**
 * Sets BI field.
 * @param {Array|unset} [arr]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__bi = function(arr) {
  this.builderObj["bi"] = tryVal(arr, Array.air);

  return this;
};


/**
 * Sets AUX field.
 * @param {Array|unset} [arr]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__aux = function(arr) {
  this.builderObj["aux"] = tryVal(arr, Array.air);

  return this;
};


/**
 * Sets `reqOpt`.
 * @param {boolean|unset} [bool]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__reqOpt = function(bool) {
  this.builderObj["reqOpt"] = tryVal(bool, false);

  return this;
};


/**
 * Sets OPT field.
 * @param {Array|unset} [arr]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__opt = function(arr) {
  this.builderObj["opt"] = tryVal(arr, Array.air);

  return this;
};


/**
 * Sets PAYI field.
 * @param {Array|unset} [arr]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__payi = function(arr) {
  this.builderObj["payi"] = tryVal(arr, Array.air);

  return this;
};


/**
 * Sets CO field.
 * @param {Array|unset} [arr]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__co = function(arr) {
  this.builderObj["co"] = tryVal(arr, Array.air);

  return this;
};


/**
 * Sets BO field.
 * @param {Array|unset} [arr]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__bo = function(arr) {
  this.builderObj["bo"] = tryVal(arr, Array.air);

  return this;
};


/**
 * Sets `failP`.
 * @param {number|unset} [frac]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__failP = function(frac) {
  this.builderObj["failP"] = tryVal(frac, 0.0);

  return this;
};


/**
 * Sets FO field.
 * @param {Array|unset} [arr]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__fo = function(arr) {
  this.builderObj["fo"] = tryVal(arr, Array.air);

  return this;
};


/**
 * Sets PAYO field.
 * @param {Array|unset} [arr]
 * @return {this}
 */
CLS_recipeBuilder.prototype.__payo = function(arr) {
  this.builderObj["payo"] = tryVal(arr, Array.air);

  return this;
};


module.exports = CLS_recipeBuilder;
