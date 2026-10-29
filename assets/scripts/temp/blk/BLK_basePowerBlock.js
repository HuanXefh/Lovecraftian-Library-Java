/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_basePowerBlock>} BLKBasePowerBlock
     */


    /**
     * @typedef {TemplateInstance<Building, B_basePowerBlock>} BBasePowerBlock
     * @prop {BLKBasePowerBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBasePowerBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.power;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Any block related to power transmission or generation.
         * @class BLK_basePowerBlock
         * @extends BLK_baseBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_basePowerBlock")
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
         * @class B_basePowerBlock
         * @extends B_baseBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_basePowerBlock")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
