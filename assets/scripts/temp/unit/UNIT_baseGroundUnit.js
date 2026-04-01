/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/unit/UNIT_baseUnit");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Parent of all ground units.
   * @class UNIT_baseGroundUnit
   * @extends UNIT_baseUnit
   */
  module.exports = newClass().extendClass(PARENT, "UNIT_baseGroundUnit").initClass()
  .setParent(null)
  .setTags()
  .setParam({})
  .setMethod({});
