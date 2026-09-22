/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<TallBlock, ENV_deposit>} ENVDeposit
     */


    const PARENT = require("lovec/temp/env/ENV_baseProp");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {ENVDeposit} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.floating = true;
        blk.placeableLiquid = true;

        if(blk.itemDrop == null) throw new NullArgumentError(blk.name + ".itemDrop");
        MDL_content.rename(
            blk,
            blk.itemDrop.localizedName + MDL_text.getSpace() + "(" + MDL_bundle.getTerm("lovec", "deposit") + ")",
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
     * <br> `NAMEGEN`
     * @class ENV_deposit
     * @extends ENV_baseProp
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_deposit")
    .initTemplate()
    .setParent(TallBlock)
    .setTags()
    .setParam({


        /* <------------------------------ vanilla ------------------------------ */


        rotationRand: 40.0,
        playerUnmineable: true,
        allowRectanglePlacement: true,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


    });
