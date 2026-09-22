/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<TallBlock, ENV_heap>} ENVHeap
     */


    const PARENT = require("lovec/temp/env/ENV_baseProp");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVHeap} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.floating = true;
        blk.placeableLiquid = true;

        blk.flrParent = MDL_content.getCt(blk.flrParent, ContentGetModes.BLK);
        if(blk.flrParent != null) {
            MDL_content.rename(
                blk,
                blk.flrParent.localizedName + MDL_text.getSpace() + "(" + MDL_bundle.getTerm("lovec", "heap") + ")",
            );
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Decorative tall blocks for walls.
     * <br> Bullets won't collide with {@link TallBlock}, I can't do much with it.
     * <br> `NAMEGEN`
     * @class ENV_heap
     * @extends ENV_baseProp
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_heap")
    .initTemplate()
    .setParent(TallBlock)
    .setTags()
    .setParam({


        /**
         * `PARAM`: See {@link ENV_wall}.
         * @memberof ENV_heap
         * @instance
         * @type {Floor|null}
         */
        flrParent: null,


        /* <------------------------------ vanilla ------------------------------> */


        rotationRand: 60.0,
        allowRectanglePlacement: true,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


    });
