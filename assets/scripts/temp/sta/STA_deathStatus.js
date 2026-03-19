/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/STA_baseStatus");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * A status effect that triggers something when the unit is killed.
   * @class STA_deathStatus
   * @extends STA_baseStatus
   */
  module.exports = newClass().extendClass(PARENT, "STA_deathStatus").initClass()
  .setParent(StatusEffect)
  .setTags("sta-death")
  .setParam({


    /**
     * <PARAM>: Script called when the unit is killed.
     * <br> <ARGS>: unit.
     * @memberof STA_deathStatus
     * @instance
     */
    killedScrTup: null,

    
  })
  .setMethod({});
