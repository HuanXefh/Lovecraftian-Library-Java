/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */

    /**
     * @typedef {TemplateInstance<LiquidJunction, BLK_fluidJunction>} BLKFluidJunction
     */


    /**
     * @typedef {TemplateInstance<LiquidJunction.LiquidJunctionBuild, B_fluidJunction>} BFluidJunction
     * @prop {BLKFluidJunction} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFluidJunction} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {Building|null}
     */
    function comp_getLiquidDestination(b, b_f, liq) {
        return !b.enabled || MDL_cond.isAuxiliaryFluid(liq) ?
            b :
            b.super$getLiquidDestination(b_f, liq);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Just vanilla liquid junction.
         * Does not transport auxiliary fluid.
         * <br> `SINGLESIZE`
         * @class BLK_fluidJunction
         * @extends BLK_baseFluidDistributor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidJunction")
        .initTemplate()
        .setParent(LiquidJunction)
        .setTags()
        .setParam({


            /* <------------------------------ vanilla ------------------------------> */


            solid: false,
            underBullets: true,


        })
        .setMethod({


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_fluidJunction
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


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_fluidJunction
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isGateBlk: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_fluidJunction
         * @extends B_baseFluidDistributor
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidJunction")
        .initTemplate()
        .setParent(LiquidJunction.LiquidJunctionBuild)
        .setParam({})
        .setMethod({


            getLiquidDestination: function(b_f, liq) {
                return comp_getLiquidDestination(this, b_f, liq);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                // Do nothing
            }
            .setProp({
                override: true,
            }),


            read: function(rd, revi) {
                // Do nothing
            }
            .setProp({
                override: true,
            }),


            /**
             * @override
             * @memberof B_fluidJunction
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                // Do nothing
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


        }),


    ];
