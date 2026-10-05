/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<StaticWall, ENV_wall>} ENVWall
     */


    const PARENT = require("lovec/temp/env/ENV_baseProp");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {number}
     */
    const DARK_LERP_A = 0.35;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVWall} blk
     * @return {void}
     */
    function comp_init(blk) {
        // noinspection JSValidateTypes
        blk.delegee.flrParent = MDL_content.getCt(blk.delegee.flrParent, ContentGetModes.BLK);
        if(blk.delegee.flrParent != null) {
            if(blk.delegee.flrParent.wall === Blocks.air) {
                blk.delegee.flrParent.wall = blk
            };
            MDL_content.rename(
                blk,
                blk.delegee.flrParent.localizedName + MDL_text.getSpace() + "(" + MDL_bundle.getTerm("lovec", "wall") + ")",
            );

            // Set wall color to darkened version of floor color
            blk.mapColor = blk.delegee.flrParent.mapColor.cpy().lerp(Color.black, DARK_LERP_A);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Most common terrain walls.
     * <br> `NAMEGEN`
     * @class ENV_wall
     * @extends ENV_baseProp
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_wall")
    .initTemplate()
    .setParent(StaticWall)
    .setTags()
    .setParam({


        /**
         * `PARAM`: Parent floor of this wall. Converted to block on INIT.
         * @memberof ENV_wall
         * @instance
         * @type {string|Floor|null}
         */
        flrParent: null,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


    });
