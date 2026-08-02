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
   * @class ENTITY_airUnit
   * @extends ENTITY_baseUnitEntity
   */
  module.exports = newClass().extendClass(PARENT, "ENTITY_airUnit").initClass()
  .setParent(UnitEntity)
  .setParam({})
  .setMethod({});
