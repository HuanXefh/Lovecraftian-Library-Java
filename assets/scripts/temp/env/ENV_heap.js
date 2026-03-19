/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.floating = true;
      blk.placeableLiquid = true;
    };

    blk.flrParent = MDL_content._ct(blk.flrParent, "blk");
    if(blk.flrParent != null) {
      MDL_content.rename(
        blk,
        blk.flrParent.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "heap") + ")",
      );
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Decorative tall blocks for walls.
   * Bullets won't collide with {@link TallBlock}, I can't do much with it.
   * <br> <NAMEGEN>
   * @class ENV_heap
   * @extends ENV_baseProp
   */
  module.exports = newClass().extendClass(PARENT, "ENV_heap").initClass()
  .setParent(TallBlock)
  .setTags("blk-env")
  .setParam({


    /**
     * <PARAM>: See {@link ENV_wall}.
     * @memberof ENV_heap
     * @instance
     */
    flrParent: null,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
