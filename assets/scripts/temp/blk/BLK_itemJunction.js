/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Vanilla item junction.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_itemJunction").initClass()
    .setParent(Junction)
    .setTags("blk-dis", "blk-gate")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1], "BLK_itemJunction").initClass()
    .setParent(Junction.JunctionBuild)
    .setParam({})
    .setMethod({}),


  ];
