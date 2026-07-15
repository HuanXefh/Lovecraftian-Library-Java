/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseOverlay");


  /* <---------- component ----------> */


  function comp_init(blk) {
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


  /**
   * Vanilla ore overlay, only for ground ores.
   * <br> `NAMEGEN`
   * @class ENV_ore
   * @extends ENV_baseOverlay
   */
  module.exports = newClass().extendClass(PARENT, "ENV_ore").initClass()
  .setParent(OreBlock)
  .setTags()
  .setParam({


    /* <------------------------------ vanilla ------------------------------ */


    needsSurface: false,
    overlayAlpha: 0.5,


  })
  .setParamAlias([
    /**
     * `PARAM`: If true, the ore will be displayed on minimap.
     * @type {boolean} showOreOnMinimap
     * @memberof ENV_ore
     * @instance
     */
    "showOreOnMinimap", "useColor", false,
  ])
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
