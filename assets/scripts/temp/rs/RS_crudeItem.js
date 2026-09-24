/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Item, RS_crudeItem>} RSCrudeItem
     */


    const PARENT = require("lovec/temp/rs/RS_intermediateItem");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Items produced by chemical reactors or gathering, that need to be refined.
     * <br> `NAMEGEN`
     * @class RS_crudeItem
     * @extends RS_intermediateItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_crudeItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-intmd", "rs-crd")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_crudeItem
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-crude-item",


    })
    .setMethod({


        /**
         * `REALIZED`
         * @override
         * @memberof RS_crudeItem
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-crude");
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
