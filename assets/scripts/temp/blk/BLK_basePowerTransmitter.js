/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_basePowerTransmitter>} BLKBasePowerTransmitter
     */


    /**
     * @typedef {TemplateInstance<Building, B_basePowerTransmitter>} BBasePowerTransmitter
     * @prop {BLKBasePowerTransmitter} block
     */


    const PARENT = require("lovec/temp/blk/BLK_basePowerBlock");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * Affects real threshold for overload.
     * The threshold must be raised since `lastPowerProduced` fluctuates.
     * @private
     * @type {number}
     */
    const POW_PROD_SCL = 1.075;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBasePowerTransmitter} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.priority = GLB_var.priority.powTrans;

        if(isFinite(blk.delegee.maxPowProdAllowed)) {
            blk.delegee.maxPowProdAllowed *= POW_PROD_SCL;
        };
    };


    /**
     * @private
     * @param {BLKBasePowerTransmitter} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.delegee.setupVanillaStat) {
            stats.remove(Stat.powerUse);
            let powLoss = blk.consPower.usage;
            if(powLoss > 0.0) {
                stats.add(fetchStat("lovec", "blk0pow-powloss"), powLoss * 60.0, StatUnit.powerSecond);
            };
        };

        if(isFinite(blk.delegee.maxPowProdAllowed)) {
            stats.add(fetchStat("lovec", "blk0pow-safepowlvl"), (blk.delegee.maxPowProdAllowed / POW_PROD_SCL * 60.0).roundFixed(2), StatUnit.powerSecond);
        };
    };


    /**
     * @private
     * @param {BLKBasePowerTransmitter} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        if(isFinite(blk.delegee.maxPowProdAllowed)) {
            // Should be displayed last
            Core.app.post(() => {
                blk.addBar("lovec-power-transmitter-overload", b => new Bar(
                    prov(() => Core.bundle.format("bar.lovec-bar-transmitter-overload-amt", b.self.ex_getTransmitterOverloadFrac().perc())),
                    prov(() => Tmp.c1.set(GLB_color.heal).lerp(GLB_color.remove, b.self.ex_getTransmitterOverloadFrac())),
                    () => 1.0,
                ));
            });
        };
    };


    /**
     * @private
     * @param {BLKBasePowerTransmitter} blk
     * @param {Tile|null} t
     * @param {Team} team
     * @param {number} rot
     * @return {boolean}
     */
    const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
        if(t == null) return false;
        if(blk.delegee.ignoreShortCircuitPlacement) return true;
        if(SLCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, team, rot)) {
            thisFun.tmpCond = tryJsProp(blk, "canShortCircuit", false)
                && t.floor().liquidDrop != null
                && MDL_cond.isConductiveLiquid(t.floor().liquidDrop);
        };
        if(thisFun.tmpCond) {
            SLCDrawf.textPlace(blk, t.x, t.y, MDL_bundle.getInfo("lovec", "text-short-circuit"), false);
            return false;
        };
        return true;
    }
    .setProp({
        /**
         * @memberof comp_canPlaceOn
         * @type {Tup4<Block, Tile, Team, number>}
         */
        tmpTup: [],
        /**
         * @memberof comp_canPlaceOn
         * @type {boolean}
         */
        tmpCond: false,
    });


    /**
     * @private
     * @param {BBasePowerTransmitter} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_param.UPDATE_DEEP_SUPPRESSED || !isFinite(b.self.ex_getMaxPowProdAllowed())) return;

        let powProd = b.power.graph.getLastPowerProduced() / Time.delta;
        if(GLB_timer.secHalf) {
            b.delegee.transmitterOverloadFrac = Mathf.approach(b.delegee.transmitterOverloadFrac, powProd > GLB_var.param.powSourceStdProd ? 0.0 : Mathf.clamp(powProd / b.self.ex_getMaxPowProdAllowed()), 0.2);
        };
        if(b.delegee.transmitterOverloadFrac < 1.0 || powProd > GLB_var.param.powSourceStdProd) {
            b.delegee.transmitterOverloadTimeCur = 0.0;
        } else {
            b.delegee.transmitterOverloadTimeCur += Time.delta;
        };
        if(b.delegee.transmitterOverloadTimeCur > 120.0) {
            b.damagePierce(b.maxHealth * GLB_var.param.shortCircuitDmgFrac / 60.0 * b.block.delegee.transmitterOverloadDmgScl);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Any block that transmits power to other blocks.
         * Transmitters can overload and gain damage if the net power produced is too high.
         * Not placeable on conductive floor if vulnerable to short circuit by default.
         * @class BLK_basePowerTransmitter
         * @extends BLK_basePowerBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_basePowerTransmitter")
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({


            /**
             * `PARAM`: If true, placement won't be affected by short circuit.
             * @memberof BLK_basePowerTransmitter
             * @instance
             * @type {boolean}
             */
            ignoreShortCircuitPlacement: false,
            /**
             * `PARAM`: If power produced in the power graph is larger than this, the transmitter will get damaged.
             * @memberof BLK_basePowerTransmitter
             * @instance
             * @type {number}
             */
            maxPowProdAllowed: Infinity,
            /**
             * `PARAM`: Multiplier on transmitter overload damage.
             * @memberof BLK_basePowerTransmitter
             * @instance
             * @type {number}
             */
            transmitterOverloadDmgScl: 1.0,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            canPlaceOn: function(t, team, rot) {
                return comp_canPlaceOn(this, t, team, rot);
            }
            .setProp({
                boolMode: "and",
            }),


        }),


        /**
         * @class B_basePowerTransmitter
         * @extends B_basePowerBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_basePowerTransmitter")
        .initTemplate()
        .setParent(null)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_basePowerTransmitter
             * @instance
             * @type {number}
             */
            transmitterOverloadFrac: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_basePowerTransmitter
             * @instance
             * @type {number}
             */
            transmitterOverloadTimeCur: 0.0,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            /**
             * @memberof B_basePowerTransmitter
             * @instance
             * @func
             * @return {number}
             */
            ex_getMaxPowProdAllowed: function() {
                return this.block.delegee.maxPowProdAllowed;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_basePowerTransmitter
             * @instance
             * @func
             * @return {number}
             */
            ex_getTransmitterOverloadFrac: function() {
                return this.transmitterOverloadFrac;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
