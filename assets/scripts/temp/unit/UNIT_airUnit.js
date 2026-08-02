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
   * @class UNIT_airUnit
   * @extends UNIT_baseUnit
   */
  module.exports = newClass().extendClass(PARENT, "UNIT_airUnit").initClass()
  .setParent(UnitType)
  .setTags("dmg0type-air")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * `INTERNAL`
     * @override
     * @memberof UNIT_airUnit
     * @instance
     */
    entityName: "lovec-air",


  })
  .setMethod({});
