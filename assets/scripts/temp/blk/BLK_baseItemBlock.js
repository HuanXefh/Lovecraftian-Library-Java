/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.isExposed = MDL_cond._isExposedBlock(blk);
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0itm-unloadable"), blk.unloadable);

    if(blk.isExposed) blk.stats.add(fetchStat("lovec", "blk0itm-exposed"), true);
  };


  function comp_updateTile(b) {
    if(
      b.block.delegee.isExposed
        && b.items != null && b.items.any() && !b.block.delegee.noReac
        && Mathf.chance(0.025)
    ) {
      b.items.each(itm => MDL_reaction.handleReaction(itm, "GROUP: air", 40.0, b));
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
       * <INTERNAL>
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
