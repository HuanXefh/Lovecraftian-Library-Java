/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Non-square generic crafter.
     * @class BLK_multiBlockFactory
     * @extends BLK_baseFactory
     */
    newClass().extendClass(PARENT[0], "BLK_multiBlockFactory").initClass()
    .setParent(MultiBlockCrafter)
    .setTags()
    .setParam({})
    .setMethod({


      setStats: function(stats) {
        this.multiBlockUpdater.setStats(getCtStats(this, stats));
      },


    }),


    /**
     * @class B_multiBlockFactory
     * @extends B_baseFactory
     */
    newClass().extendClass(PARENT[1], "B_multiBlockFactory").initClass()
    .setParent(MultiBlockCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
