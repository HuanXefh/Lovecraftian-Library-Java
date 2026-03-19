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
   * Basic mech units.
   * @class ENTITY_mech
   * @extends ENTITY_baseUnitEntity
   */
  module.exports = newClass().extendClass(PARENT, "ENTITY_mech").initClass()
  .setParent(MechUnit)
  .setParam({})
  .setMethod({});
