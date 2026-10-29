/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseHarvester>} BLKBaseHarvester
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseHarvester>} BBaseHarvester
     * @prop {BLKBaseHarvester} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseMiner");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseHarvester} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.drills;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Miners that obtain resource mostly based on attributes instead of `itemDrop`.
         * @class BLK_baseHarvester
         * @extends BLK_baseMiner
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseHarvester")
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
         * @class B_baseHarvester
         * @extends B_baseMiner
         */
        newClass()
        .extendClass(PARENT[1], "B_baseHarvester")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
