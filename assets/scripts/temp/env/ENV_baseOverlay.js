/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseEnvBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Featureless overlay floor.
   * @class ENV_baseOverlay
   * @extends ENV_baseEnvBlock
   */
  module.exports = newClass().extendClass(PARENT, "ENV_baseOverlay").initClass()
  .setParent(OverlayFloor)
  .setTags("blk-env")
  .setParam({})
  .setMethod({});
