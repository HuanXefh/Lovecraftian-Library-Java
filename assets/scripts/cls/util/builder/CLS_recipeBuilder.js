/*
  ========================================
  Section: Definition
  ========================================
*/


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


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ util ------------------------------ */


  /**
   * @param {CLS_recipeBuilder} builder
   * @param {string} nmProp
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {CLS_recipeBuilder}
   */
  function setIoData(builder, nmProp, arr, shouldMerge) {
    if(builder.builderObj[nmProp] === undefined || !shouldMerge) {
      builder.builderObj[nmProp] = arr;
    } else {
      builder.builderObj[nmProp] = builder.builderObj[nmProp].concat(arr);
    };

    return builder;
  };


  /**
   * Sets CI field.
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {this}
   */
  CLS_recipeBuilder.prototype.__ci = function(arr, shouldMerge) {
    return setIoData(this, "ci", arr, shouldMerge);
  };


  /**
   * Sets BI field.
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {this}
   */
  CLS_recipeBuilder.prototype.__bi = function(arr, shouldMerge) {
    return setIoData(this, "bi", arr, shouldMerge);
  };


  /**
   * Sets AUX field.
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {this}
   */
  CLS_recipeBuilder.prototype.__aux = function(arr, shouldMerge) {
    return setIoData(this, "aux", arr, shouldMerge);
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
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {this}
   */
  CLS_recipeBuilder.prototype.__opt = function(arr, shouldMerge) {
    return setIoData(this, "opt", arr, shouldMerge);
  };


  /**
   * Sets PAYI field.
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {this}
   */
  CLS_recipeBuilder.prototype.__payi = function(arr, shouldMerge) {
    return setIoData(this, "payi", arr, shouldMerge);
  };


  /**
   * Sets CO field.
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {this}
   */
  CLS_recipeBuilder.prototype.__co = function(arr, shouldMerge) {
    return setIoData(this, "co", arr, shouldMerge);
  };


  /**
   * Sets BO field.
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {this}
   */
  CLS_recipeBuilder.prototype.__bo = function(arr, shouldMerge) {
    return setIoData(this, "bo", arr, shouldMerge);
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
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {this}
   */
  CLS_recipeBuilder.prototype.__fo = function(arr, shouldMerge) {
    return setIoData(this, "fo", arr, shouldMerge);
  };


  /**
   * Sets PAYO field.
   * @param {Array} arr
   * @param {boolean|unset} [shouldMerge]
   * @return {this}
   */
  CLS_recipeBuilder.prototype.__payo = function(arr, shouldMerge) {
    return setIoData(this, "payo", arr, shouldMerge);
  };




module.exports = CLS_recipeBuilder;
