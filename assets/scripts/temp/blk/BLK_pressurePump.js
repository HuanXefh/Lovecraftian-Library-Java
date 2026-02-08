/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A crafter that produces pressure/vacuum.
   * Torque can be produced by a crafter as abstract fluid, but it's different for pressure/vacuum since pressure producers are not all crafters.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureProducer");


  /* <---------- component ----------> */


  function comp_init(blk) {
    // Forced to {true} for proper blending
    blk.outputsLiquid = true;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-pump")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
