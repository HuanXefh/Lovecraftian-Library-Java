/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<LiquidRouter, BLK_fluidRouter>} BLKFluidRouter
     */


    /**
     * @typedef {TemplateInstance<LiquidRouter.LiquidRouterBuild, B_fluidRouter>} BFluidRouter
     * @prop {BLKFluidRouter} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFluidRouter} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.delegee.setupVanillaProp) {
            if(blk.size === 1) {
                blk.solid = false;
                blk.underBullets = true;
            };
        };

        if(blk.delegee.fldType === "liquid") {
            blk.delegee.noPresExplode = true;
        };
        if(!blk.delegee.noPresExplode) {
            blk.delegee.presExploRad = FRAG_attack.getPresExploRad(blk.size);
            blk.delegee.presExploDmg = FRAG_attack.getPresExploDmg(blk.size);
        };
    };


    /**
     * @private
     * @param {BLKFluidRouter} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(!blk.delegee.noPresExplode) {
            stats.add(fetchStat("lovec", "blk-canexplode"), true);
            stats.add(fetchStat("lovec", "blk-explor"), blk.delegee.presExploRad / Vars.tilesize, StatUnit.blocks);
            stats.add(fetchStat("lovec", "blk-explodmg"), blk.delegee.presExploDmg);
        };
    };


    /**
     * @private
     * @param {BLKFluidRouter} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        if(!blk.delegee.noPresExplode) {
            SLCDrawf.diskWarning(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.delegee.presExploRad);
        };
    };


    /**
     * @private
     * @param {BFluidRouter} b
     * @return {void}
     */
    function comp_onDestroyed(b) {
        if(b.block.delegee.noPresExplode) return;
        let liqCur = b.liquids.current();
        if(MDL_cond.isAuxiliaryFluid(liqCur) || (!liqCur.gas && !liqCur.willBoil())) return;
        let frac = b.liquids.get(liqCur) / b.block.liquidCapacity;
        if(frac < 0.01) return;

        FRAG_attack.explosion(
            b.x, b.y,
            b.block.delegee.presExploDmg * frac,
            b.block.delegee.presExploRad * frac,
            12.0 * frac,
        );
    };


    /**
     * @private
     * @param {BFluidRouter} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(!b.block.delegee.noPresExplode) {
            SLCDrawf.diskWarning(b.x, b.y, b.block.delegee.presExploRad);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Vanilla liquid router.
         * @class BLK_fluidRouter
         * @extends BLK_baseFluidDistributor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidRouter")
        .initTemplate()
        .setParent("LiquidRouter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: If true, pressure explosion will be disabled.
             * @memberof BLK_fluidRouter
             * @instance
             * @type {boolean}
             */
            noPresExplode: false,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_fluidRouter
             * @instance
             * @type {number}
             */
            presExploRad: 0.0,
            /**
             * `INTERNAL`
             * @memberof BLK_fluidRouter
             * @instance
             * @type {number}
             */
            presExploDmg: 0.0,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


        }),


        /**
         * @class B_fluidRouter
         * @extends B_baseFluidDistributor
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidRouter")
        .initTemplate()
        .setParent("LiquidRouter.LiquidRouterBuild")
        .setParam({})
        .setMethod({


            onDestroyed: function() {
                comp_onDestroyed(this);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


        }),


    ];
