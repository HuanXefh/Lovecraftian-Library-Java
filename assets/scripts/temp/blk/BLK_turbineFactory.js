/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_turbineFactory>} BLKTurbineFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_turbineFactory>} BTurbineFactory
     * @prop {BLKTurbineFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKTurbineFactory} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(!blk.hasLiquids) throw new LCError.NoLiquidModuleError(blk);
        blk.ignoreLiquidFullness = true;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Crafters that produce torque.
         * @class BLK_turbineFactory
         * @extends BLK_baseFactory
         */
        newClass()
        .extendClass(PARENT[0], "BLK_turbineFactory")
        .initClass()
        .setParent("GenericCrafter")
        .setTags("blk-non-fac")
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_turbineFactory
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
         * @class B_turbineFactory
         * @extends B_baseFactory
         */
        newClass()
        .extendClass(PARENT[1], "B_turbineFactory")
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({})
        .setMethod({}),


    ];
