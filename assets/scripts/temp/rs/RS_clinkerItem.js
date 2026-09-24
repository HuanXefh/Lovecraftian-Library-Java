/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Item, RS_clinkerItem>} RSClinkerItem
     */


    const PARENT = require("lovec/temp/rs/RS_intermediateItem");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Items produced by roasting blend items.
     * <br> `NAMEGEN`
     * @class RS_clinkerItem
     * @extends RS_intermediateItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_clinkerItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-intmd", "rs-clinker")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_clinkerItem
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-clinker-item",


    })
    .setMethod({


        /**
         * `REALIZED`
         * @override
         * @memberof RS_clinkerItem
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-clinker");
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
