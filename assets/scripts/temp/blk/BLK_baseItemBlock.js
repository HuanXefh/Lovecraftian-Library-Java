/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * These blocks are related to item distribution and storage.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");


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


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(null)
    .setTags()
    .setParam({
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


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
