/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<OverlayFloor, ENV_depthLiquid>} ENVDepthLiquid
     */


    const PARENT = require("lovec/temp/env/ENV_baseOverlay");
    const INTF_ENV_depthOverlay = require("lovec/temp/intf/INTF_ENV_depthOverlay");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {F2Array<AttrGn, ResourceGn>}
     */
    const DYNA_ATTR_DATA = DB_item.db["map"]["attr"]["dpliq"];


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVDepthLiquid} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.rsDrop = MDL_attr.getDynaAttrRs(DYNA_ATTR_DATA, blk);
        if(blk.rsDrop == null) throw new NullArgumentError(blk.name + ".liquidDrop");
        MDL_content.rename(
            blk,
            blk.rsDrop.localizedName + MDL_text.getSpace() + "(" + blk.ex_getDepthName() + ")",
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Similar to {@link ENV_depthOre}, but for liquid.
     * <br> `NAMEGEN`
     * @class ENV_depthLiquid
     * @extends ENV_baseOverlay
     * @extends INTF_ENV_depthOverlay
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_depthLiquid")
    .implement(INTF_ENV_depthOverlay)
    .initTemplate()
    .setParent(OverlayFloor)
    .setTags("env-dpliq")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * @memberof ENV_depthLiquid
         * @instance
         * @type {Liquid}
         */
        rsDrop: null,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        /**
         * `REALIZED`
         * @memberof ENV_depthLiquid
         * @instance
         * @func
         * @return {Liquid}
         */
        ex_getRsDrop: function() {
            return this.rsDrop;
        }
        .setProp({
            noSuper: true,
        }),


    });
