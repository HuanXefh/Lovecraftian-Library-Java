/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_durabilityBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = VAR.prio_min;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Any block that can collects something from the environment.
     * @class BLK_baseMiner
     * @extends BLK_baseBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseMiner").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags("blk-min")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_baseMiner
     * @extends B_baseBlock
     */
    newClass().extendClass(PARENT[1], "B_baseMiner").implement(INTF[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      write: function(wr) {
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        this.ex_processData(rd);
      },


    }),


  ];
