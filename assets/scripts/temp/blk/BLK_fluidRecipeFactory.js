/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_corrosionAcceptor");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_fluidHeatAcceptor");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Recipe factories with fluid block mechanics.
     * @class BLK_fluidRecipeFactory
     * @extends BLK_recipeFactory
     * @extends INTF_BLK_corrosionAcceptor
     * @extends INTF_BLK_fluidHeatAcceptor
     */
    newClass().extendClass(PARENT[0], "BLK_fluidRecipeFactory").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-rc0fac")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_fluidRecipeFactory
     * @extends B_recipeFactory
     * @extends INTF_B_corrosionAcceptor
     * @extends INTF_B_fluidHeatAcceptor
     */
    newClass().extendClass(PARENT[1], "B_fluidRecipeFactory").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {

      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
