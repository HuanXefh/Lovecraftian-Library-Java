/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<LiquidRouter, BLK_fluidUnloader>} BLKFluidUnloader
     */


    /**
     * @typedef {TemplateInstance<LiquidRouter.LiquidRouterBuild, B_fluidUnloader>} BFluidUnloader
     * @prop {BLKFluidUnloader} block
     */


    const PARENT = require("lovec/temp/blk/BLK_fluidRouter");
    const INTF_BLK_contentSelector = require("lovec/temp/intf/INTF_BLK_contentSelector");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFluidUnloader} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.rotate = true;
    };


    /**
     * @private
     * @param {BLKFluidUnloader} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.sideReg1 = fetchRegion(blk, "-side1", "-side");
        blk.delegee.sideReg2 = fetchRegion(blk, "-side2", "-side");
    };


    /**
     * @private
     * @param {BFluidUnloader} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.unloadTarget = b.back();
        if(b.delegee.unloadTarget == null || b.delegee.unloadTarget.liquids == null || MDL_cond.isFluidConduit(b.delegee.unloadTarget.block) || MDL_cond.isGate(b.delegee.unloadTarget.block)) {
            b.delegee.unloadTarget = null;
        };
    };


    /**
     * @private
     * @param {BFluidUnloader} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.delegee.unloadTarget != null && b.delegee.ctTarget != null) {
            LCCraftingHandler.transLiquid(b.delegee.unloadTarget, b, b.delegee.ctTarget, 2.0, true);
        };
    };


    /**
     * @private
     * @param {BFluidUnloader} b
     * @return {void}
     */
    function comp_draw(b) {
        LCDrawf.side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg2, b.rotation);
    };


    /**
     * @private
     * @param {BFluidUnloader} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        b.self.ex_drawSelected();
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * @class BLK_fluidUnloader
         * @extends BLK_fluidRouter
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidUnloader")
        .implement(INTF_BLK_contentSelector[0])
        .initTemplate()
        .setParent(LiquidRouter)
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_fluidUnloader
             * @instance
             * @type {TextureRegion}
             */
            sideReg1: null,
            /**
             * `INTERNAL`
             * @memberof BLK_fluidUnloader
             * @instance
             * @type {TextureRegion}
             */
            sideReg2: null,
            /**
            * `INTERNAL`
            * <br> `REALIZED`
            * @override
            * @memberof BLK_fluidUnloader
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
             * @memberof BLK_fluidUnloader
             * @instance
             * @func
             * @return {Array<Liquid>}
             */
            ex_findSelectionTargets: function() {
                return GLB_varGen.nonAuxs;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_fluidUnloader
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


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_fluidUnloader
             * @instance
             * @func
             * @return {boolean}
             */
            ex_noSideOutput: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_fluidUnloader
         * @extends B_fluidRouter
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidUnloader")
        .implement(INTF_BLK_contentSelector[1])
        .initTemplate()
        .setParent(LiquidRouter.LiquidRouterBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_fluidUnloader
             * @instance
             * @type {Building|null}
             */
            unloadTarget: null,


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            acceptLiquid: function(b_f, liq) {
                return false;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            canDumpLiquid: function(b_t, liq) {
                return this.relativeTo(b_t) === this.rotation;
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            draw: function() {
                comp_draw(this);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


            /**
             * `REALIZED`
             * @memberof B_fluidUnloader
             * @instance
             * @func
             * @return {void}
             */
            ex_onSelectorUpdate: function() {
                this.liquids.clear();
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
