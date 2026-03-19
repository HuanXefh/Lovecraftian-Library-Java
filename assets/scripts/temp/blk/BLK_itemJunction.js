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


    /**
     * Vanilla item junction.
     * <br> <SINGLESIZE>
     * @class BLK_itemJunction
     * @extends BLK_baseItemGate
     */
    newClass().extendClass(PARENT[0], "BLK_itemJunction").initClass()
    .setParent(Junction)
    .setTags("blk-dis", "blk-gate")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_itemJunction
     * @extends B_baseItemGate
     */
    newClass().extendClass(PARENT[1], "B_itemJunction").initClass()
    .setParent(Junction.JunctionBuild)
    .setParam({})
    .setMethod({}),


  ];
