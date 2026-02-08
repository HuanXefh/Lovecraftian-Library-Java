/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Mineable tall blocks.
   * {blk.itemDrop} is required.
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


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(TallBlock)
  .setTags("blk-env", "blk-depo")
  .setParam({})
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
