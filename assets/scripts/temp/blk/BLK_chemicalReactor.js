/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_furnaceRecipeFactory");
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
     * Essentially an externally heated furnace with fluid block mechanics.
     * @class BLK_chemicalReactor
     * @extends BLK_furnaceRecipeFactory
     * @extends INTF_BLK_corrosionAcceptor
     * @extends INTF_BLK_fluidHeatAcceptor
     */
    newClass().extendClass(PARENT[0], "BLK_chemicalReactor").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-rc0fac", "blk-chem0reac")
    .setParam({


      /**
       * <PARAM>
       * @override
       * @memberof BLK_chemicalReactor
       * @instance
       */
      furnHeatA: 0.3,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @override
       * @memberof BLK_chemicalReactor
       * @instance
       */
      noFuelInput: true,


    })
    .setMethod({}),


    /**
     * @class B_chemicalReactor
     * @extends B_furnaceRecipeFactory
     * @extends INTF_B_corrosionAcceptor
     * @extends INTF_B_fluidHeatAcceptor
     */
    newClass().extendClass(PARENT[1], "B_chemicalReactor").implement(INTF[1]).implement(INTF_A[1]).initClass()
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
