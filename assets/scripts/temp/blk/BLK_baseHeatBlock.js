/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_heatBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Any block related to Lovec heat.
     * Heaters are not included, since every factory type can be a heater in Lovec.
     * @class BLK_baseHeatBlock
     * @extends BLK_baseBlock
     * @extends INTF_BLK_heatBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseHeatBlock").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags()
    .setParam({})
    .setMethod({}),


    /**
     * @class B_baseHeatBlock
     * @extends B_baseBlock
     * @extends INTF_B_heatBlock
     */
    newClass().extendClass(PARENT[1], "B_baseHeatBlock").implement(INTF[1]).initClass()
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
