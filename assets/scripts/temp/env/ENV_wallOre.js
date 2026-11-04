/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<OreBlock, ENV_wallOre>} ENVWallOre
     */


    const PARENT = require("lovec/temp/env/ENV_oreOverlay");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVWallOre} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.wallOre = true;

        MDL_content.rename(
            blk,
            blk.itemDrop.localizedName + MDL_text.getSpace() + "(" + MDL_bundle.getTerm("lovec", "wall-ore") + ")",
        );
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    /**
     * Vanilla ore overlay, for wall ores only.
     * @class ENV_wallOre
     * @extends ENV_oreOverlay
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_wallOre")
    .initTemplate()
    .setParent("OreBlock")
    .setTags()
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`: Has to fixed to match large walls.
         * @memberof ENV_wallOre
         * @instance
         * @type {number}
         */
        largeThr: 0.5,


        /* <------------------------------ vanilla ------------------------------> */


        needsSurface: false,


    })
    .setParamAlias([
        /**
         * `PARAM`: See {@link ENV_ore#showOreOnMinimap}.
         * <br> `ALIAS`: `useColor`.
         * @memberof ENV_wallOre
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
