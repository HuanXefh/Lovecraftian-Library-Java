/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * Used to build a recipe object.
     * Only contains fields related to I/O.
     * @class
     * @extends CLS_paramBuilder
     */
    const CLS_recipeBuilder = newClass().extendClass(CLS_paramBuilder).initClass();


    CLS_recipeBuilder.prototype.init = function() {


        /** @type {Object} */
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
     * @param {string} nameProp
     * @param {Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {CLS_recipeBuilder}
     */
    function setIoData(builder, nameProp, arr, shouldMerge) {
        if(builder.builderObj[nameProp] === undefined || !shouldMerge) {
            builder.builderObj[nameProp] = arr;
        } else {
            builder.builderObj[nameProp] = builder.builderObj[nameProp].concat(arr);
        };

        return builder;
    };


    /**
     * Sets CI field.
     * @param {RecipeIo2Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setCi = function(arr, shouldMerge) {
        return setIoData(this, "ci", arr, shouldMerge);
    };


    /**
     * Sets BI field.
     * @param {RecipeIo3Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setBi = function(arr, shouldMerge) {
        return setIoData(this, "bi", arr, shouldMerge);
    };


    /**
     * Sets AUX field.
     * @param {RecipeIo2Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setAux = function(arr, shouldMerge) {
        return setIoData(this, "aux", arr, shouldMerge);
    };


    /**
     * Sets `reqOpt`.
     * @param {boolean|unset} [bool]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setReqOpt = function(bool) {
        this.builderObj.reqOpt = tryVal(bool, false);

      return this;
    };


    /**
     * Sets OPT field.
     * @param {RecipeIo4Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setOpt = function(arr, shouldMerge) {
        return setIoData(this, "opt", arr, shouldMerge);
    };


    /**
     * Sets PAYI field.
     * @param {RecipeIo2Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setPayi = function(arr, shouldMerge) {
        return setIoData(this, "payi", arr, shouldMerge);
    };


    /**
     * Sets CO field.
     * @param {RecipeIo2Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setCo = function(arr, shouldMerge) {
        return setIoData(this, "co", arr, shouldMerge);
    };


    /**
     * Sets BO field.
     * @param {RecipeIo3Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setBo = function(arr, shouldMerge) {
        return setIoData(this, "bo", arr, shouldMerge);
    };


    /**
     * Sets `failP`.
     * @param {number|unset} [frac]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setFailP = function(frac) {
        this.builderObj.failP = tryVal(frac, 0.0);

      return this;
    };


    /**
     * Sets FO field.
     * @param {RecipeIo3Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setFo = function(arr, shouldMerge) {
        return setIoData(this, "fo", arr, shouldMerge);
    };


    /**
     * Sets PAYO field.
     * @param {RecipeIo2Array} arr
     * @param {boolean|unset} [shouldMerge]
     * @return {this}
     */
    CLS_recipeBuilder.prototype.setPayo = function(arr, shouldMerge) {
        return setIoData(this, "payo", arr, shouldMerge);
    };




module.exports = CLS_recipeBuilder;
