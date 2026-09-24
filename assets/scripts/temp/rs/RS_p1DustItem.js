/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Item, RS_p1DustItem>} RSP1DustItem
     */


    const PARENT = require("lovec/temp/rs/RS_dustItem");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Dust items produced in T1 purification.
     * <br> `NAMEGEN`
     * @class RS_p1DustItem
     * @extends RS_dustItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_p1DustItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-intmd", "rs-dust", "rs-p1")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_p1DustItem
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-p1-dust-item",


    })
    .setMethod({


        /**
         * `REALIZED`
         * @override
         * @memberof RS_p1DustItem
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-p1-dust");
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
