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
   * Featureless floor.
   * @class ENV_baseFloor
   * @extends ENV_baseEnvBlock
   */
  module.exports = newClass().extendClass(PARENT, "ENV_baseFloor").initClass()
  .setParent(Floor)
  .setTags("blk-env")
  .setParam({})
  .setParamAlias([
    "cacheLay", "cacheLayer", CacheLayer.normal,
  ])
  .setMethod({});
