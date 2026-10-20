/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseStorageBlock>} BLKBaseStorageBlock
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseStorageBlock>} BBaseStorageBlock
     * @prop {BLKBaseStorageBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BBaseStorageBlock} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        if(!b.block.separateItemCapacity) return b.items.total() < b.getMaximumAccepted(item);
        if(b.block.delegee.singleTypeOnly) return !b.items.any() || b.items.total() === b.items.get(item);
        return true;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Base template for blocks that store items.
         * @class BLK_baseStorageBlock
         * @extends BLK_baseItemBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseStorageBlock")
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({


            /**
             * `PARAM`: If true, this storage block can only store one type of item.
             * @memberof BLK_baseStorageBlock
             * @instance
             * @type {boolean}
             */
            singleTypeOnly: false,


        })
        .setMethod({}),


        /**
         * @class B_baseStorageBlock
         * @extends B_baseItemBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_baseStorageBlock")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                boolMode: "and",
            }),


        }),


    ];
