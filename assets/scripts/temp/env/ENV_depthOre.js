/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<OverlayFloor, ENV_baseOverlay>} ENVBaseOverlay
     */


    const PARENT = require("lovec/temp/env/ENV_baseOverlay");
    const INTF_ENV_depthOverlay = require("lovec/temp/intf/INTF_ENV_depthOverlay");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVBaseOverlay} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.playerUnmineable = true;

        if(blk.itemDrop == null) throw new NullArgumentError(blk.name + ".itemDrop");
        MDL_content.rename(
            blk,
            blk.itemDrop.localizedName + MDL_text.getSpace() + "(" + blk.ex_getDepthName() + ")",
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Underground ore that is only mineable by certain drills, and requires scanning.
     * <br> `NAMEGEN`
     * @class ENV_depthOre
     * @extends ENV_baseOverlay
     * @extends INTF_ENV_depthOverlay
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_depthOre")
    .implement(INTF_ENV_depthOverlay)
    .initTemplate()
    .setParent(OverlayFloor)
    .setTags("env-dpore")
    .setParam({})
    .setMethod({


        init: function() {
            comp_init(this);
        },


    });
