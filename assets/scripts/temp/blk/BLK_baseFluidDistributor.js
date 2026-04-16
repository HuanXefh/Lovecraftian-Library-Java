/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_fluidTypeFilter");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_corrosionAcceptor");
  const INTF_B = require("lovec/temp/intf/INTF_BLK_fluidHeatAcceptor");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = TargetPriority.transport;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Blocks that transport fluids.
     * These blocks will be affected by most fluid-related mechanics, like corrosion.
     * @class BLK_baseFluidDistributor
     * @extends BLK_baseFluidBlock
     * @extends INTF_BLK_fluidTypeFilter
     * @extends INTF_BLK_corrosionAcceptor
     * @extends INTF_BLK_fluidHeatAcceptor
     */
    newClass().extendClass(PARENT[0], "BLK_baseFluidDistributor").implement(INTF[0]).implement(INTF_A[0]).implement(INTF_B[0]).initClass()
    .setParent(null)
    .setTags("blk-liq")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_baseFluidDistributor
     * @extends B_baseFluidBlock
     * @extends INTF_B_fluidTypeFilter
     * @extends INTF_B_corrosionAcceptor
     * @extends INTF_B_fluidHeatAcceptor
     */
    newClass().extendClass(PARENT[1], "B_baseFluidDistributor").implement(INTF[1]).implement(INTF_A[1]).implement(INTF_B[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      write: function(wr) {
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
      },


    }),


  ];
