/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0heat-heatprod"), blk.heatProd, fetchStatUnit("lovec", "heatunits"));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * @class BLK_heatProducer
     * @extends BLK_baseFactory
     */
    newClass().extendClass(PARENT[0], "BLK_heatProducer").initClass()
    .setParent(GenericCrafter)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Heat produced at 100% efficiency.
       * @memberof BLK_heatProducer
       * @instance
       */
      heatProd: 0.0,


    })
    .setMethod({


      setStats: function() {
        comp_setStats(this);
      },


    }),


    /**
     * @class B_heatProducer
     * @extends B_baseFactory
     */
    newClass().extendClass(PARENT[1], "B_heatProducer").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_heatProducer
       * @instance
       */
      blk$heatProd: "!REPLACE",


    })
    .setMethod({


      ex_getHeatProd: function() {
        return this.blk$heatProd * this.efficiency;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
