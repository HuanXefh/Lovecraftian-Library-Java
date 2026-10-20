/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseItemGate>} BLKBaseItemGate
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseItemGate>} BBaseItemGate
     * @prop {BLKBaseItemGate} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseItemGate} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(fetchStat("lovec", "blk0item-unloadable"));
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Parent of all item transportation gates.
         * <br> `SINGLESIZE`
         * @class BLK_baseItemGate
         * @extends BLK_baseItemDistributor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseItemGate")
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({})
        .setMethod({


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_baseItemGate
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSingleSized: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_baseItemGate
         * @extends B_baseItemDistributor
         */
        newClass()
        .extendClass(PARENT[1], "B_baseItemGate")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
