/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * <NAMEGEN>
   * Vanilla ore overlay, only for ground ores.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseOverlay");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.needsSurface = false;
      if(blk.overlayAlpha.fEqual(1.0)) blk.overlayAlpha = 0.5;
    };

    MDL_content.rename(
      blk,
      blk.itemDrop.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "ground-ore") + ")",
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "ENV_ore").initClass()
  .setParent(OreBlock)
  .setTags("blk-env", "blk-ore")
  .setParam({})
  .setParamAlias([
    "showOreOnMinimap", "useColor", false,
  ])
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
