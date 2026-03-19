/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/unit/entity/ENTITY_baseUnitEntity");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Basic air units.
   * @class ENTITY_baseAirUnit
   * @extends ENTITY_baseUnitEntity
   */
  module.exports = newClass().extendClass(PARENT, "ENTITY_baseAirUnit").initClass()
  .setParent(UnitEntity)
  .setParam({})
  .setMethod({});
