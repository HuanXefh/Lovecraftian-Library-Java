/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Status effects that trigger something when the unit is dead.
   * ---------------------------------------- */


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


  module.exports = newClass().extendClass(PARENT, "STA_deathStatus").initClass()
  .setParent(StatusEffect)
  .setTags("sta-death")
  .setParam({
    // @PARAM: Script called when the unit is destroyed.
    // @ARGS: unit
    killedScrTup: null,
  })
  .setMethod({});
