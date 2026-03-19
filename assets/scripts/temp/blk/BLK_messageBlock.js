/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Vanilla message block.
     * @class BLK_messageBlock
     * @extends BLK_baseLogicBlock
     */
    newClass().extendClass(PARENT[0], "BLK_messageBlock").initClass()
    .setParent(MessageBlock)
    .setTags("blk-log")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_messageBlock
     * @extends B_baseLogicBlock
     */
    newClass().extendClass(PARENT[1], "B_messageBlock").initClass()
    .setParent(MessageBlock.MessageBuild)
    .setParam({})
    .setMethod({}),


  ];
