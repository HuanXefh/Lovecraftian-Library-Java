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

    if(blk.itemDrop == null) ERROR_HANDLER.throw("noItemDrop", blk.name);
    MDL_content.rename(
      blk,
      blk.itemDrop.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "deposit") + ")",
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Mineable tall blocks.
   * `blk.itemDrop` is required.
   * <br> <NAMEGEN>
   * @class ENV_deposit
   * @extends ENV_baseProp
   */
  module.exports = newClass().extendClass(PARENT, "ENV_deposit").initClass()
  .setParent(TallBlock)
  .setTags("blk-env", "blk-depo")
  .setParam({})
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
