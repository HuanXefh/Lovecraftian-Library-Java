/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseItemDistributor>} BLKBaseItemDistributor
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseItemDistributor>} BBaseItemDistributor
     * @prop {BLKBaseItemDistributor} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseItemDistributor} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.transportation;
        blk.priority = TargetPriority.transport;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Parent of all item distribution blocks.
         * @class BLK_baseItemDistributor
         * @extends BLK_baseItemBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseItemDistributor")
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_baseItemDistributor
         * @extends B_baseItemBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_baseItemDistributor")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
