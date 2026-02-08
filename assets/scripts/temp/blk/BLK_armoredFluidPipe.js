/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Similar to vanilla armored conduit.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidPipe");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(ArmoredConduit)
    .setTags("blk-liq", "blk-fcond")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(ArmoredConduit.ArmoredConduitBuild)
    .setParam({})
    .setMethod({}),


  ];
