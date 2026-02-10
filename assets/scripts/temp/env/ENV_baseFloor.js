/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Very normal floor.
   * ---------------------------------------- */


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


  module.exports = newClass().extendClass(PARENT, "ENV_baseFloor").initClass()
  .setParent(Floor)
  .setTags("blk-env")
  .setParam({})
  .setParamAlias([
    "cacheLay", "cacheLayer", CacheLayer.normal,
  ])
  .setMethod({});
