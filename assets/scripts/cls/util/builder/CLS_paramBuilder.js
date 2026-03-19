/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Base class for most parameter builders.
   * `this.builderObj` should be defined in child classes.
   * @class
   */
  const CLS_paramBuilder = newClass().initAbstrClass();


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
