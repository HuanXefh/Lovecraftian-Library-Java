/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * Base class for most parameter builders.
     * @class
     */
    const CLS_paramBuilder = newClass().initAbstrClass();


    /** @private */
    CLS_paramBuilder.prototype.init = function() {


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
     * Builds the final object.
     * @return {Object}
     */
    CLS_paramBuilder.prototype.build = function() {
        return tryVal(this.builderObj, Object.air);
    };




module.exports = CLS_paramBuilder;
