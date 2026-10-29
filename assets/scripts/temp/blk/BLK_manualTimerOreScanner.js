/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_manualTimerOreScanner>} BLKManualTimerOreScanner
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_manualTimerOreScanner>} BManualTimerOreScanner
     * @prop {BLKManualTimerOreScanner} block
     */


    const PARENT = require("lovec/temp/blk/BLK_oreScanner");
    const INTF_BLK_manualTimerBlock = require("lovec/temp/intf/INTF_BLK_manualTimerBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BManualTimerOreScanner} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        MDL_table.btnCfg(tb, b, () => b.self.ex_configureClick(), GLB_varGen.icons.boost);
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * {@link BLK_oreScanner} but has to be manually charged.
         * @class BLK_manualTimerOreScanner
         * @extends BLK_oreScanner
         * @extends INTF_BLK_manualTimerBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_manualTimerOreScanner")
        .implement(INTF_BLK_manualTimerBlock[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags("blk-scan", "blk-non-fac")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_manualTimerOreScanner
             * @instance
             * @type {string}
             */
            manualTimerCfgType: "string",
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_manualTimerOreScanner
             * @instance
             * @type {boolean}
             */
            skipTapConfig: true,


        })
        .setMethod({}),


        /**
         * @class B_manualTimerOreScanner
         * @extends B_oreScanner
         * @extends INTF_B_manualTimerBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_manualTimerOreScanner")
        .implement(INTF_BLK_manualTimerBlock[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({})
        .setMethod({


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
