/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(!blk.hasLiquids) ERROR_HANDLER.throw("noLiquidModule", blk.name);
    blk.ignoreLiquidFullness = true;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Crafters that produce torque.
     * @class BLK_turbineFactory
     * @extends BLK_baseFactory
     */
    newClass().extendClass(PARENT[0], "BLK_turbineFactory").initClass()
    .setParent(GenericCrafter)
    .setTags("blk-non-fac")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_turbineFactory
     * @extends B_baseFactory
     */
    newClass().extendClass(PARENT[1], "B_turbineFactory").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
