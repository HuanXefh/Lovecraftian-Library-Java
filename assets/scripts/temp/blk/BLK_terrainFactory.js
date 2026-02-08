/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Factories affected by terrain type.
   * Unlike fields like {blk.envRequired}, terrain type is determined by surrounding blocks. See {MDL_terrain}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_terrainHandler");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
