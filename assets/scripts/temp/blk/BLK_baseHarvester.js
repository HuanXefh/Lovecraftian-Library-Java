/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseMiner");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.drills;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Miners that obtain resource mostly based on attributes instead of `itemDrop`.
     * @class BLK_baseHarvester
     * @extends BLK_baseMiner
     */
    newClass().extendClass(PARENT[0], "BLK_baseHarvester").initClass()
    .setParent(null)
    .setTags("blk-min", "blk-harv")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_baseHarvester
     * @extends B_baseMiner
     */
    newClass().extendClass(PARENT[1], "B_baseHarvester").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
