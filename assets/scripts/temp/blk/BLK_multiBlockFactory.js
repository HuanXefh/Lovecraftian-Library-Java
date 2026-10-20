/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<MultiBlockCrafter, BLK_multiBlockFactory>} BLKMultiBlockFactory
     */


    /**
     * @typedef {TemplateInstance<MultiBlockCrafter.MultiBlockCrafterBuild, B_multiBlockFactory>} BMultiBlockFactory
     * @prop {BLKMultiBlockFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Non-square generic crafter.
         * @class BLK_multiBlockFactory
         * @extends BLK_baseFactory
         */
        newClass()
        .extendClass(PARENT[0], "BLK_multiBlockFactory")
        .initTemplate()
        .setParent("MultiBlockCrafter")
        .setTags()
        .setParam({})
        .setMethod({


            setStats: function(stats) {
                this.multiBlockUpdater.setStats(getCtStats(this, stats));
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_multiBlockFactory
             * @instance
             * @func
             * @return {boolean}
             */
            ex_canSwitchDisable: function() {
                return false;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_multiBlockFactory
         * @extends B_baseFactory
         */
        newClass()
        .extendClass(PARENT[1], "B_multiBlockFactory")
        .initTemplate()
        .setParent("MultiBlockCrafterBuild")
        .setParam({})
        .setMethod({}),


    ];
