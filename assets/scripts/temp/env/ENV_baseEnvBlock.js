/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The basic template for environmental blocks.
   * This template does not change anything.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.itemDrop != null) {
      if(blk.dropHardness < 0.0) blk.dropHardness = blk.itemDrop.hardness;
    } else {
      blk.dropHardness = 0.0;
    };
  };


  function comp_setStats(blk) {
    if(blk.itemDrop != null) blk.stats.add(fetchStat("lovec", "rs-hardness"), blk.dropHardness * blk.dropHardnessMtp);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "ENV_baseEnvBlock").initClass()
  .setParent(null)
  .setTags("blk-env")
  .setParam({
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaStat: true,
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaProp: true,
    // @PARAM: If not negative, this will be used as hardness of the item drop. Only affects placement, does not affect drill time!
    dropHardness: -1.0,
    // @PARAM: Multiplier on hardness of the item drop.
    dropHardnessMtp: 1.0,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
