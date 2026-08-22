/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidRouter");


  /* <---------- component ----------> */


  function comp_init(blk) {
    // Should always be solid to avoid bugs
    blk.solid = true;
    blk.underBullets = false;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Multi-block version of liquid router.
     * @class BLK_multiBlockFluidRouter
     * @extends BLK_fluidRouter
     */
    newClass().extendClass(PARENT[0], "BLK_multiBlockFluidRouter").initClass()
    .setParent(MultiBlockLiquidRouter)
    .setTags()
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_multiBlockFluidRouter
     * @extends B_fluidRouter
     */
    newClass().extendClass(PARENT[1], "B_multiBlockFluidRouter").initClass()
    .setParent(MultiBlockLiquidRouterBuild)
    .setParam({})
    .setMethod({}),


  ];
