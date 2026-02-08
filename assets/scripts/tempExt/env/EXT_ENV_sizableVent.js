/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {ENV_vent} that vent size is the only thing to change.
   * You can make 2x2 vents with this for example with {ventSize: 2}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseFloor");
  const INTF = require("lovec/temp/intf/INTF_ENV_sizableVent");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).implement(INTF).initClass()
  .setParent(SteamVent)
  .setTags("blk-env", "blk-vent")
  .setParam({})
  .setMethod({}),
