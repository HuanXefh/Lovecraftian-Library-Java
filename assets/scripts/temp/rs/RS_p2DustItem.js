/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Item, RS_p2DustItem>} RSP2DustItem
     */


    const PARENT = require("lovec/temp/rs/RS_dustItem");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Dust items produced in T2 purification.
     * <br> `NAMEGEN`
     * @class RS_p2DustItem
     * @extends RS_dustItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_p2DustItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-intmd", "rs-dust", "rs-p2")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_p2DustItem
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-p2-dust-item",


    })
    .setMethod({


        /**
         * `REALIZED`
         * @override
         * @memberof RS_p2DustItem
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-p2-dust");
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
