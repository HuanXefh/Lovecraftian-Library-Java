/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<LiquidJunction, BLK_fluidFilter>} BLKFluidFilter
     */


    /**
     * @typedef {TemplateInstance<LiquidJunction.LiquidJunctionBuild, B_fluidFilter>} BFluidFilter
     * @prop {BLKFluidFilter} block
     */


    const PARENT = require("lovec/temp/blk/BLK_fluidJunction");
    const INTF_BLK_contentSelector = require("lovec/temp/intf/INTF_BLK_contentSelector");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFluidFilter} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.drawCached = false;
        blk.drawDynamic = true;
    };


    /**
     * @private
     * @param {BLKFluidFilter} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.topReg = fetchRegion(blk, "-top");
    };


    /**
     * @private
     * @param {BFluidFilter} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {Building|null}
     */
    function comp_getLiquidDestination(b, b_f, liq) {
        return !b.enabled || liq !== b.delegee.ctTarget || MDL_cond.isAuxiliaryFluid(liq) ?
            b :
            b.super$getLiquidDestination(b_f, liq);
    };


    /**
     * @private
     * @param {BFluidFilter} b
     * @return {void}
     */
    function comp_draw(b) {
        Draw.rect(b.block.region, b.x, b.y);
        if(b.delegee.ctTarget != null) {
            LiquidBlock.drawTiledFrames(b.block.size, b.x, b.y, 1.0, 1.0, 1.0, 1.0, b.delegee.ctTarget, 1.0);
        };
        Draw.rect(b.block.delegee.topReg, b.x, b.y);
    };


    /**
     * @private
     * @param {BFluidFilter} b
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
         * Fluid junction that only allows selected fluid to pass.
         * Unlike item filter gate, this has no side output since no need.
         * <br> `SINGLESIZE`
         * @class BLK_fluidFilter
         * @extends BLK_fluidJunction
         * @extends INTF_BLK_contentSelector
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidFilter")
        .implement(INTF_BLK_contentSelector[0])
        .initTemplate()
        .setParent("LiquidJunction")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_fluidFilter
             * @instance
             * @type {TextureRegion}
             */
            topReg: null,


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
             * @memberof BLK_fluidFilter
             * @instance
             * @func
             * @return {Array<Liquid>}
             */
            ex_findSelectionTargets: function() {
                return Vars.content.liquids().select(liq => !MDL_cond.isAuxiliaryFluid(liq)).toArray();
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_fluidFilter
         * @extends B_fluidJunction
         * @extends INTF_B_contentSelector
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidFilter")
        .implement(INTF_BLK_contentSelector[1])
        .initTemplate()
        .setParent("LiquidJunction.LiquidJunctionBuild")
        .setParam({})
        .setMethod({


            getLiquidDestination: function(b_f, liq) {
                return comp_getLiquidDestination(this, b_f, liq);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            config: function() {
                return this.delegee.ctTarget;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


            write: function(wr) {
                this.self.ex_processData(wr);
                MDL_io.ct(wr, this.delegee.ctTarget);
            }
            .setProp({
                override: true,
            }),


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
                this.delegee.ctTarget = MDL_io.ct(rd);
            }
            .setProp({
                override: true,
            }),


        }),


    ];
