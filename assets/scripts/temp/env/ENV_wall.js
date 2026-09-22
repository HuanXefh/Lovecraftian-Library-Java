/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<StaticWall, ENV_wall>} ENVWall
     */


    const PARENT = require("lovec/temp/env/ENV_baseProp");


    /* <------------------------------ auxiliary ------------------------------ */


    /**
     * @private
     * @type {number}
     */
    const DARK_LERP_A = 0.35;


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {ENVWall} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.flrParent = MDL_content.getCt(blk.flrParent, ContentGetModes.BLK);
        if(blk.flrParent != null) {
            if(blk.flrParent.wall === Blocks.air) {
                blk.flrParent.wall = blk
            };
            MDL_content.rename(
                blk,
                blk.flrParent.localizedName + MDL_text.getSpace() + "(" + MDL_bundle.getTerm("lovec", "wall") + ")",
            );

            // Set wall color to darkened version of floor color
            blk.mapColor = blk.flrParent.mapColor.cpy().lerp(Color.black, DARK_LERP_A);
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
         * `PARAM`: Parent floor of this wall.
         * @memberof ENV_wall
         * @instance
         * @type {Floor|null}
         */
        flrParent: null,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


    });
