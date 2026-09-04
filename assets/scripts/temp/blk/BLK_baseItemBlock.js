/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.isExposed = MDL_cond.isExposedBlock(blk);
  };


  function comp_setStats(blk) {
    if(blk.hasItems) blk.stats.add(fetchStat("lovec", "blk0item-unloadable"), blk.unloadable);
    if(blk.isExposed) blk.stats.add(fetchStat("lovec", "blk0item-exposed"), true);
  };


  function comp_updateTile(b) {
    if(
      !Vars.net.client()
        && b.block.delegee.isExposed
        && b.items != null && b.items.any() && !b.block.delegee.noReac
        && Mathf.chance(0.025)
    ) {
      b.items.each(item => MDL_reaction.handleReaction(item, "GROUP: air", 40.0, b));
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Blocks related to item distribution and storage.
     * Item reaction will happen in these blocks.
     * @class BLK_baseItemBlock
     * @extends BLK_baseBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseItemBlock").initClass()
    .setParent(null)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof BLK_baseItemBlock
       * @instance
       */
      isExposed: false,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    /**
     * @class B_baseItemBlock
     * @extends B_baseBlock
     */
    newClass().extendClass(PARENT[1], "B_baseItemBlock").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
