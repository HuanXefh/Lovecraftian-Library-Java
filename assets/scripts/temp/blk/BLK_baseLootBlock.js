/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseLootBlock>} BLKBaseLootBlock
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseLootBlock>} BBaseLootBlock
     * @prop {BLKBaseLootBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");
    const INTF_BLK_lootHandler = require("lovec/temp/intf/INTF_BLK_lootHandler");


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Base template for all loot-related blocks.
         * @class BLK_baseLootBlock
         * @extends BLK_baseItemBlock
         * @extends INTF_BLK_lootHandler
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseLootBlock")
        .implement(INTF_BLK_lootHandler[0])
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({})
        .setMethod({


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_baseLootBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSwitchDisableTarget: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_baseLootBlock
         * @extends B_baseItemBlock
         * @extends INTF_B_lootHandler
         */
        newClass()
        .extendClass(PARENT[1], "B_baseLootBlock")
        .implement(INTF_BLK_lootHandler[1])
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
