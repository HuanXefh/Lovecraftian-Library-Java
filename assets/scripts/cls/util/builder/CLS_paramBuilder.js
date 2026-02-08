/* ----------------------------------------
 * NOTE:
 *
 * The base class for most parameter builders.
 * {builderObj} should be defined in child classes.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_paramBuilder = newClass().initAbstrClass();


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_paramBuilder.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Returns the final object built.
 * ---------------------------------------- */
ptp.build = function() {
  return tryVal(this.builderObj, Object.air);
};


module.exports = CLS_paramBuilder;
