/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Essentially an externally heated furnace with fluid block mechanics.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-chem0reac")
    .setParam({
      noFuelInput: true,                // Reactor is not a furnace, it just requires heating
      furnHeatA: 0.3,
    })
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).implement(INTF_A[1]).initClass()
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
