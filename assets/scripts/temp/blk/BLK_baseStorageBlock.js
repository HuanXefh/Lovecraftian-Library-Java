/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Base template for blocks that store items.
     * @class BLK_baseStorageBlock
     * @extends BLK_baseItemBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseStorageBlock").initClass()
    .setParent(null)
    .setTags()
    .setParam({})
    .setMethod({}),


    /**
     * @class B_baseStorageBlock
     * @extends B_baseItemBlock
     */
    newClass().extendClass(PARENT[1], "B_baseStorageBlock").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
