/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ import ------------------------------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


  /* <------------------------------ component ------------------------------> */


  function comp_setStats(blk, stats) {
    stats.remove(fetchStat("lovec", "blk0item-unloadable"));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Parent of all item transportation gates.
     * <br> `SINGLESIZE`
     * @class BLK_baseItemGate
     * @extends BLK_baseItemDistributor
     */
    newClass().extendClass(PARENT[0], "BLK_baseItemGate").initClass()
    .setParent(null)
    .setTags()
    .setParam({})
    .setMethod({


      setStats: function(stats) {
        comp_setStats(this, getCtStats(this, stats));
      },


      /**
       * @override
       * @memberof BLK_baseItemGate
       * @instance
       * @return {boolean}
       */
      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_baseItemGate
     * @extends B_baseItemDistributor
     */
    newClass().extendClass(PARENT[1], "B_baseItemGate").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
