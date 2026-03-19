/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Parent template for all logic-related blocks.
     * @class BLK_baseLogicBlock
     * @extendsd BLK_baseBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseLogicBlock").initClass()
    .setParent(null)
    .setTags("blk-log")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_baseLogicBlock
     * @extends B_baseBlock
     */
    newClass().extendClass(PARENT[1], "B_baseLogicBlock").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
