/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Similar to vanilla armored conveyor.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_conveyor");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(ArmoredConveyor)
    .setTags("blk-dis", "blk-conv")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(ArmoredConveyor.ArmoredConveyorBuild)
    .setParam({})
    .setMethod({}),


  ];
