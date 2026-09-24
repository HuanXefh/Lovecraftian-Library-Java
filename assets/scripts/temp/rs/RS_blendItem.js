/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Item, RS_blendItem>} RSBlendItem
     */


    const PARENT = require("lovec/temp/rs/RS_intermediateItem");


    /* <------------------------------ component ------------------------------ */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Items produced by mixers or ball mills.
     * <br> `NAMEGEN`
     * @class RS_blendItem
     * @extends RS_intermediateItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_blendItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-intmd", "rs-blend")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_blendItem
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-blend-item",


    })
    .setMethod({


        /**
         * `REALIZED`
         * @override
         * @memberof RS_blendItem
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-blend");
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
