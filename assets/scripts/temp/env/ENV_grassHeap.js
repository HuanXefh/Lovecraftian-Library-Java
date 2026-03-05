/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * <NAMEGEN>
   * Heap blocks that can hide some units.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_heap");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.solid = false;
    };
  };


  function comp_drawBase(blk, t) {
    LCDraw.tree(blk.region, blk.customShadowRegion, t, blk.shadowOffset, 0.6, 0.6, 0.6, PARAM.treeAlpha, blk.layGrass + Mathf.randomSeed(t.pos(), 0.0, 0.015), PARAM.drawWobble, PARAM.checkTreeDst);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "ENV_grassHeap").initClass()
  .setParent(TallBlock)
  .setTags("blk-env", "blk-tall0grass")
  .setParam({
    // @PARAM: See {ENV_baseTree}.
    layGrass: 76.0,
    // @PARAM: See {ENV_baseTree}.
    hidable: false,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    drawBase: function(t) {
      comp_drawBase(this, t);
    }
    .setProp({
      noSuper: true,
    }),


  });
