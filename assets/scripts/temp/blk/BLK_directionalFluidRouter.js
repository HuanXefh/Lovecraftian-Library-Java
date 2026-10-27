/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<LiquidRouter, BLK_directionalFluidRouter>} BLKDirectionalFluidRouter
     */


    /**
     * @typedef {TemplateInstance<LiquidRouter.LiquidRouterBuild, B_directionalFluidRouter>} BDirectionalFluidRouter
     * @prop {BLKDirectionalFluidRouter} block
     */


    const PARENT = require("lovec/temp/blk/BLK_fluidRouter");
    const INTF_BLK_pressureBlock = require("lovec/temp/intf/INTF_BLK_pressureBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKDirectionalFluidRouter} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.rotate = true;
    };


    /**
     * @private
     * @param {BLKDirectionalFluidRouter} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.sideReg1 = fetchRegion(blk, "-side1", "-side");
        blk.delegee.sideReg2 = fetchRegion(blk, "-side2", "-side");
    };


    /**
     * @private
     * @param {BDirectionalFluidRouter} b
     * @return {void}
     */
    function comp_draw(b) {
        SLCDrawf.side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg2, b.rotation);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Liquid router with rotation, so that it supports pressure transportation.
         * @class BLK_directionalFluidRouter
         * @extends BLK_fluidRouter
         */
        newClass()
        .extendClass(PARENT[0], "BLK_directionalFluidRouter")
        .implement(INTF_BLK_pressureBlock[0])
        .initTemplate()
        .setParent("LiquidRouter")
        .setTags()
        .setParam({


            /**
             * @inheritdoc
             * @memberof BLK_directionalFluidRouter
             * @instance
             * @type {boolean}
             */
            noPresExplode: true,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_directionalFluidRouter
             * @instance
             * @type {TextureRegion}
             */
            sideReg1: null,
            /**
             * `INTERNAL`
             * @memberof BLK_directionalFluidRouter
             * @instance
             * @type {TextureRegion}
             */
            sideReg2: null,
            /**
            * `INTERNAL`
            * <br> `REALIZED`
            * @override
            * @memberof BLK_directionalFluidRouter
            * @instance
            * @type {boolean}
            */
            isPresRouter: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_directionalFluidRouter
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
         * @class B_directionalFluidRouter
         * @extends B_fluidRouter
         */
        newClass()
        .extendClass(PARENT[1], "B_directionalFluidRouter")
        .implement(INTF_BLK_pressureBlock[1])
        .initTemplate()
        .setParent("LiquidRouter.LiquidRouterBuild")
        .setParam({})
        .setMethod({


            acceptLiquid: function(b_f, liq) {
                return SLCGeometry.accept(b_f, this, MDL_cond.isFluidRouter(b_f.block), false);
            }
            .setProp({
                boolMode: "and",
            }),


            draw: function() {
                comp_draw(this);
            },


        }),


    ];
