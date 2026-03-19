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


    /**
     * Similar to vanilla armored conduit.
     * <br> <SINGLESIZE>
     * @class BLK_armoredFluidPipe
     * @extends BLK_fluidPipe
     */
    newClass().extendClass(PARENT[0], "BLK_armoredFluidPipe").initClass()
    .setParent(ArmoredConduit)
    .setTags("blk-liq", "blk-fcond")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_armoredFluidPipe
     * @extends B_fluidPipe
     */
    newClass().extendClass(PARENT[1], "B_armoredFluidPipe").initClass()
    .setParent(ArmoredConduit.ArmoredConduitBuild)
    .setParam({})
    .setMethod({}),


  ];
