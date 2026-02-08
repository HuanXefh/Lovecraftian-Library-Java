/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Decorative tall blocks for walls.
   * Bullets won't collide with {TallBlock}, I can't do much with it.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


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


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(TallBlock)
  .setTags("blk-env")
  .setParam({
    // @PARAM: See {ENV_wall}.
    flrParent: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
