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


    /**
     * Similar to vanilla armored conveyor.
     * <br> <SINGLESIZE>
     * @class BLK_armoredConveyor
     * @extends BLK_conveyor
     */
    newClass().extendClass(PARENT[0], "BLK_armoredConveyor").initClass()
    .setParent(ArmoredConveyor)
    .setTags("blk-dis", "blk-conv")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_armoredConveyor
     * @extends B_conveyor
     */
    newClass().extendClass(PARENT[1], "B_armoredConveyor").initClass()
    .setParent(ArmoredConveyor.ArmoredConveyorBuild)
    .setParam({})
    .setMethod({}),


  ];
