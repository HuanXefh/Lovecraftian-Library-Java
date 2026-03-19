/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseOverlay");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.wallOre = true;

    if(blk.overwriteVanillaProp) {
      blk.needsSurface = false;
    };

    MDL_content.rename(
      blk,
      blk.itemDrop.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "wall-ore") + ")",
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Vanilla ore overlay, only for wall ores.
   * @class ENV_wallOre
   * @extends ENV_baseOverlay
   */
  module.exports = newClass().extendClass(PARENT, "ENV_wallOre").initClass()
  .setParent(OreBlock)
  .setTags("blk-env", "blk-wore")
  .setParam({})
  .setParamAlias([
    /**
     * <PARAM>: See {@link ENV_ore}.
     * @type {boolean} showOreOnMinimap
     * @memberof ENV_wallOre
     * @instance
     */
    "showOreOnMinimap", "useColor", false,
  ])
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
