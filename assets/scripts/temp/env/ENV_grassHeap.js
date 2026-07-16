/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_heap");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.solid = false;
  };


  function comp_drawBase(blk, t) {
    LCDrawf.tree(blk.region, blk.customShadowRegion, t, blk.size * Vars.tilesize * 1.2, blk.shadowOffset, 0.6, 0.6, 0.6, PARAM.TREE_ALPHA, blk.layGrass + Mathf.randomSeed(t.pos(), 0.0, 0.015), PARAM.SHOULD_DRAW_WOBBLE, PARAM.SHOULD_CHECK_TREE_DISTANCE);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Heap blocks that can hide some units.
   * <br> `NAMEGEN`
   * @class ENV_grassHeap
   * @extends ENV_heap
   */
  module.exports = newClass().extendClass(PARENT, "ENV_grassHeap").initClass()
  .setParent(TallBlock)
  .setTags("env-grass-tall")
  .setParam({


    /**
     * `PARAM`: See {@link ENV_baseTree}.
     * @memberof ENV_grassHeap
     * @instance
     */
    layGrass: 76.0,
    /**
     * `PARAM`: See {@link ENV_baseTree}.
     * @memberof ENV_grassHeap
     * @instance
     */
    hidable: false,


    /* <------------------------------ vanilla ------------------------------ */


    rotationRand: 30.0,


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
