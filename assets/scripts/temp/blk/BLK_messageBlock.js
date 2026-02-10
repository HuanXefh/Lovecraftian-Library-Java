/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Simply vanilla message block.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0], "BLK_messageBlock").initClass()
    .setParent(MessageBlock)
    .setTags("blk-log")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1], "BLK_messageBlock").initClass()
    .setParent(MessageBlock.MessageBuild)
    .setParam({})
    .setMethod({}),


  ];
