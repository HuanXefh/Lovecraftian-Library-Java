/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Item, RS_concentrateItem>} RSConcentrateItem
     */


    const PARENT = require("lovec/temp/rs/RS_intermediateItem");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {RSConcentrateItem} item
     * @return {void}
     */
    function comp_init(item) {
        if(item.intmdParent != null) {
            if(item.flammability < 0.0001) {
                item.flammability = item.intmdParent.flammability * 1.5;
            };
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Items produced by sintering purified dust items.
     * <br> `NAMEGEN`
     * @class RS_concentrateItem
     * @extends RS_intermediateItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_concentrateItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-intmd", "rs-ore0conc")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_concentrateItem
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-concentrate-item",


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        /**
         * `REALIZED`
         * @override
         * @memberof RS_concentrateItem
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-concentrate");
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
