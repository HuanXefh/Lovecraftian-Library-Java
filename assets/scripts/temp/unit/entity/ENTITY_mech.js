/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/unit/entity/ENTITY_groundUnit");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Basic mech units.
   * @class ENTITY_mech
   * @extends ENTITY_groundUnit
   */
  module.exports = newClass().extendClass(PARENT, "ENTITY_mech").initClass()
  .setParent(MechUnit)
  .setParam({})
  .setMethod({});
