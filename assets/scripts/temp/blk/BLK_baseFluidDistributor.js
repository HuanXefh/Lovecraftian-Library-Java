/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks that transport fluids.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).implement(INTF_A[0]).implement(INTF_B[0]).initClass()
    .setParent(null)
    .setTags("blk-liq")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).implement(INTF_A[1]).implement(INTF_B[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      write: function(wr) {
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);

        if(LCRevi < 1) {
          rd.s();
        };
      },


    }),


  ];
