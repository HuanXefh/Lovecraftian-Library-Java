/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<LiquidRouter, BLK_fluidOverflowGate>} BLKFluidOverflowGate
     */


    /**
     * @typedef {TemplateInstance<LiquidRouter.LiquidRouterBuild, B_fluidOverflowGate>} BFluidOverflowGate
     * @prop {BLKFluidOverflowGate} block
     */


    const PARENT = require("lovec/temp/blk/BLK_fluidRouter");
    const INTF_BLK_pressureBlock = require("lovec/temp/intf/INTF_BLK_pressureBlock");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * Due to how fluids are transported, this value should be lower than 1.0.
     * @private
     * @type {number}
     */
    const FULL_THRESHOLD = 0.9;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFluidOverflowGate} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.rotate = true;
    };


    /**
     * @private
     * @param {BLKFluidOverflowGate} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.sideReg1 = fetchRegion(blk, "-side1", "-side");
        blk.delegee.sideReg2 = fetchRegion(blk, "-side2", "-side");
    };


    /**
     * @private
     * @param {BFluidOverflowGate} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.liq) {
            let ob = b.nearby(b.rotation), liq = b.liquids.current();
            b.delegee.isFrontFull = ob == null || ob.liquids == null || !ob.acceptLiquid(b, liq) || ob.liquids.get(liq) / ob.block.liquidCapacity >= FULL_THRESHOLD;
        };
    };


    /**
     * @private
     * @param {BFluidOverflowGate} b
     * @return {void}
     */
    function comp_draw(b) {
        SLCDrawf.side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg2, b.rotation);
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Liquid router with rotation, so that it supports pressure transportation.
         * @class BLK_fluidOverflowGate
         * @extends BLK_fluidRouter
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidOverflowGate")
        .implement(INTF_BLK_pressureBlock[0])
        .initTemplate()
        .setParent("LiquidRouter")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_fluidOverflowGate
             * @instance
             * @type {TextureRegion}
             */
            sideReg1: null,
            /**
             * `INTERNAL`
             * @memberof BLK_fluidOverflowGate
             * @instance
             * @type {TextureRegion}
             */
            sideReg2: null,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_fluidOverflowGate
             * @instance
             * @type {boolean}
             */
            isPresRouter: false,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_fluidOverflowGate
             * @instance
             * @type {boolean}
             */
            noPresExplode: true,


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
             * @memberof BLK_fluidOverflowGate
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
         * @class B_fluidOverflowGate
         * @extends B_fluidRouter
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidOverflowGate")
        .implement(INTF_BLK_pressureBlock[1])
        .initTemplate()
        .setParent("LiquidRouter.LiquidRouterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_fluidOverflowGate
             * @instance
             * @type {boolean}
             */
            isFrontFull: false,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            acceptLiquid: function(b_f, liq) {
                return SLCGeometry.accept(b_f, this, MDL_cond.isFluidRouter(b_f.block), false);
            }
            .setProp({
                boolMode: "and",
            }),


            canDumpLiquid: function(b_t, liq) {
                return !this.delegee.isFrontFull ?
                    this.relativeTo(b_t) === this.rotation :
                    Mathf.mod(this.relativeTo(b_t) + this.rotation, 2) !== 0;
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            draw: function() {
                comp_draw(this);
            },


        }),


    ];
