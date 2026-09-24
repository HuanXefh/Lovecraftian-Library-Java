/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Item, RS_dustItem>} RSDustItem
     */


    const PARENT = require("lovec/temp/rs/RS_intermediateItem");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {RSDustItem} item
     * @return {void}
     */
    function comp_init(item) {
        if(item.intmdParent != null) {
            if(item.flammability < 0.0001) {
                item.flammability = item.intmdParent.flammability * 1.5;
            };
            if(item.explosiveness < 0.0001) {
                item.explosiveness = item.intmdParent.explosiveness * 1.5;
            };
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Items produced by pulverizers.
     * <br> `NAMEGEN`
     * @class RS_dustItem
     * @extends RS_intermediateItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_dustItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-intmd", "rs-dust")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_dustItem
         * @instance
         * @return {string}
         */
        recolorRegStr: "lovec-gen-dust-item",


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        /**
         * `REALIZED`
         * @override
         * @memberof RS_dustItem
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-dust");
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
