/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Item, RS_chunksItem>} RSChunksItem
     */


    const PARENT = require("lovec/temp/rs/RS_intermediateItem");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {RSChunksItem} item
     * @return {void}
     */
    function comp_init(item) {
        if(item.intmdParent != null) {
            if(item.flammability < 0.0001) {
                item.flammability = item.intmdParent.flammability * 1.25;
            };
            if(item.explosiveness < 0.0001) {
                item.explosiveness = item.intmdParent.explosiveness * 1.25;
            };
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Items produced by rock crushers.
     * <br> `NAMEGEN`
     * @class RS_chunksItem
     * @extends RS_intermediateItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_chunksItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-intmd", "rs-chunks")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_chunksItem
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-chunks-item",


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        /**
         * `REALIZED`
         * @override
         * @memberof RS_chunksItem
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-chunks");
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
