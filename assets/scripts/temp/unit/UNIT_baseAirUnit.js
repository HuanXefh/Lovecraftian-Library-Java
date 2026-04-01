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
  module.exports = newClass().extendClass(PARENT, "UNIT_baseAirUnit").initClass()
  .setParent(UnitType)
  .setTags()
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof UNIT_baseAirUnit
     * @instance
     */
    entityName: "lovec-air",


  })
  .setMethod({});
