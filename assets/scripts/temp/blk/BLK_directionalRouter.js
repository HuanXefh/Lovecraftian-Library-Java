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
     * Vanilla directional router.
     * <br> <SINGLESIZE>
     * @class BLK_directionalRouter
     * @extends BLK_baseItemGate
     */
    newClass().extendClass(PARENT[0], "BLK_directionalRouter").initClass()
    .setParent(DuctRouter)
    .setTags("blk-dis", "blk-gate")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_directionalRouter
     * @extends B_baseItemGate
     */
    newClass().extendClass(PARENT[1], "B_directionalRouter").initClass()
    .setParent(DuctRouter.DuctRouterBuild)
    .setParam({})
    .setMethod({}),


  ];
