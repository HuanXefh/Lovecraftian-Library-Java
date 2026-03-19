/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_furnaceBlock");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0heat-tempreq"), blk.heatReq, fetchStatUnit("lovec", "heatunits"));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Crafters with generalized fuel consumption.
     * @class BLK_furnaceFactory
     * @extends BLK_baseFactory
     * @extends INTF_BLK_furnaceBlock
     */
    newClass().extendClass(PARENT[0], "BLK_furnaceFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({


      /**
       * <PARAM>: Heat required.
       * @memberof BLK_boiler
       * @instance
       */
      heatReq: 150.0,


    })
    .setMethod({


      setStats: function() {
        comp_setStats(this);
      },


    }),


    /**
     * @class B_furnaceFactory
     * @extends B_baseFactory
     * @extends INTF_B_furnaceBlock
     */
    newClass().extendClass(PARENT[1], "B_furnaceFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      write: function(wr) {
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
      },


      /**
       * @override
       * @memberof B_boiler
       * @instance
       * @return {number}
       */
      ex_getHeatTg: function() {
        return this.block.delegee.heatReq;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
