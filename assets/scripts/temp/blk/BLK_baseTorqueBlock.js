/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_torqueBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Base template for all torque related blocks (no producer).
     * @class BLK_baseTorqueBlock
     * @extends BLK_baseBlock
     * @extends INTF_BLK_torqueBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseTorqueBlock").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags()
    .setParam({})
    .setMethod({}),


    /**
     * @class B_baseTorqueBlock
     * @extends B_baseBlock
     * @extends INTF_B_torqueBlock
     */
    newClass().extendClass(PARENT[1], "B_baseTorqueBlock").implement(INTF[1]).initClass()
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
