/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/unit/entity/ENTITY_baseAirUnit");
  const INTF = require("lovec/temp/intf/INTF_ENTITY_tetheredEntity");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * An air unit linked to some building.
   * @class ENTITY_tetheredAirUnit
   * @extends ENTITY_baseAirUnit
   * @extends INTF_ENTITY_tetheredEntity
   */
  module.exports = newClass().extendClass(PARENT, "ENTITY_tetheredAirUnit").implement(INTF).initClass()
  .setParent(UnitEntity)
  .setParam({})
  .setMethod({});
