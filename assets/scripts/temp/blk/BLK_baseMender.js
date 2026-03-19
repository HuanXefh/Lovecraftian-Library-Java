/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseProjector");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Any block that can repair blocks and/or units.
     * @class BLK_baseMender
     * @extends BLK_baseProjector
     */
    newClass().extendClass(PARENT[0], "BLK_baseMender").initClass()
    .setParent(null)
    .setTags("blk-proj", "blk-mend")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_baseMender
     * @extends B_baseProjector
     */
    newClass().extendClass(PARENT[1], "B_baseMender").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
