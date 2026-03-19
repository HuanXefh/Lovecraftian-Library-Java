/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureProducer");


  /* <---------- component ----------> */


  function comp_init(blk) {
    // Forced to true for proper blending
    blk.outputsLiquid = true;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A crafter that produces pressure/vacuum.
     * Torque/heat can be produced by a crafter as abstract fluid, but it's different for pressure/vacuum since pressure producers are not all crafters.
     * @class BLK_pressurePump
     * @extends BLK_baseFactory
     * @extends INTF_BLK_pressureProducer
     */
    newClass().extendClass(PARENT[0], "BLK_pressurePump").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-pump")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_pressurePump
     * @extends B_baseFactory
     * @extends INTF_B_pressureProducer
     */
    newClass().extendClass(PARENT[1], "B_pressurePump").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
