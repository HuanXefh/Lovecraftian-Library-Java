/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_heatProducer>} BLKHeatProducer
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_heatProducer>} BHeatProducer
     * @prop {BLKHeatProducer} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKHeatProducer} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0heat-heatprod"), blk.delegee.heatProd, fetchStatUnit("lovec", "heatunits"));
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * @class BLK_heatProducer
         * @extends BLK_baseFactory
         */
        newClass()
        .extendClass(PARENT[0], "BLK_heatProducer")
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Heat produced at 100% efficiency.
             * @memberof BLK_heatProducer
             * @instance
             * @type {number}
             */
            heatProd: 0.0,


        })
        .setMethod({


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class B_heatProducer
         * @extends B_baseFactory
         */
        newClass()
        .extendClass(PARENT[1], "B_heatProducer")
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_heatProducer
             * @instance
             * @type {number|TmpStateTag}
             */
            blk$heatProd: TmpStateTag.needReplace,


        })
        .setMethod({


            /**
             * `REALIZED`
             * @memberof B_heatProducer
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getHeatProd: function() {
                return this.delegee.blk$heatProd * this.efficiency;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
