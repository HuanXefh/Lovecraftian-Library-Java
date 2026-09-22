/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<OreBlock, ENV_ore>} ENVOre
     */


    const PARENT = require("lovec/temp/env/ENV_baseOverlay");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVOre} blk
     * @return {void}
     */
    function comp_init(blk) {
        MDL_content.rename(
            blk,
            blk.itemDrop.localizedName + MDL_text.getSpace() + "(" + MDL_bundle.getTerm("lovec", "ground-ore") + ")",
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Vanilla ore overlay, for ground ores only.
     * <br> See {@link ENV_wallOre} for wall ones.
     * <br> `NAMEGEN`
     * @class ENV_ore
     * @extends ENV_baseOverlay
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_ore")
    .initTemplate()
    .setParent(OreBlock)
    .setTags()
    .setParam({


        /* <------------------------------ vanilla ------------------------------> */


        needsSurface: false,
        overlayAlpha: 0.5,


    })
    .setParamAlias([
        /**
         * `PARAM`: If true, this ore will be displayed on minimap.
         * <br> `ALIAS`: `useColor`.
         * @memberof ENV_ore
         * @instance
         * @name showOreOnMinimap
         * @type {boolean}
         */
        "showOreOnMinimap", "useColor", false,
    ])
    .setMethod({


        init: function() {
            comp_init(this);
        },


    });
