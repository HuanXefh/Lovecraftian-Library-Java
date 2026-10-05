/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_pressureBlock>} INTFBLKPressureBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_pressureBlock>} INTFBPressureBlock
     * @prop {INTFBLKPressureBlock} block
     */


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {number}
     */
    const PRES_RES_TOL = 0.5;


    /**
     * @private
     * @type {number}
     */
    const PRES_THR_TOL = 0.15;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKPressureBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.presRes = MDL_flow.getPresRes(blk);
        blk.delegee.vacRes = MDL_flow.getVacRes(blk);
    };


    /**
     * @private
     * @param {INTFBLKPressureBlock} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0liq-presres"), blk.delegee.presRes);
        stats.add(fetchStat("lovec", "blk0liq-vacres"), -blk.delegee.vacRes);
        if(!blk.delegee.presThr.fEqual(0.0)) {
            stats.add(blk.delegee.presThr > 0.0 ? fetchStat("lovec", "blk0liq-presreq") : fetchStat("lovec", "blk0liq-vacreq"), Math.abs(blk.delegee.presThr));
        };
    };


    /**
     * @private
     * @param {INTFBLKPressureBlock} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("lovec-pressure", b => new Bar(
            prov(() => Core.bundle.format(b.delegee.presTmp >= 0.0 ? "bar.lovec-bar-pressure-amt" : "bar.lovec-bar-vacuum-amt", Strings.fixed(Math.abs(b.delegee.presTmp), 2))),
            prov(() => b.delegee.presTmp >= 0.0 ? Color.valueOf(Tmp.c1, "cce5ff") : Color.valueOf(Tmp.c1, "e1d5e5")),
            () => Mathf.clamp(Math.abs(b.delegee.presTmp + b.delegee.presExtra) / Math.max(b.delegee.presTmp >= 0.0 ? blk.delegee.presRes : -blk.delegee.vacRes, 0.0001)),
        ));
    };


    /**
     * @private
     * @param {INTFBPressureBlock} b
     * @return {void}
     */
    function comp_onDestroyed(b) {
        if(Math.abs(b.delegee.presTmp) > 0.5) {
            Damage.damage(b.x, b.y, b.block.size * Vars.tilesize * 2.5, b.maxHealth * Math.abs(b.delegee.presTmp) * 0.2);
            Fx.explosion.at(b.x, b.y, b.block.size * Vars.tilesize * 2.5);
        };
    };


    /**
     * @private
     * @param {INTFBPressureBlock} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.presTransCount = 0;
        b.delegee.presTransCountTmpBs.clear();
        MDL_event.onDelayRun(60.0, () => {
            b.self.ex_updatePresFetchTargets();
            b.self.ex_updatePresSupplyTargets();
        });
    };


    /**
     * @private
     * @param {INTFBPressureBlock} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.presFetchTargets.clear();
        b.delegee.presSupplyTargets.clear();
    };


    /**
     * @private
     * @param {INTFBPressureBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_param.UPDATE_SUPPRESSED) return;

        if(GLB_timer.secQuarter) {
            b.self.ex_updatePresTarget();
            b.delegee.presTmp = (b.delegee.presTmp + b.delegee.presTarget) * 0.5;
            if(Math.abs(b.delegee.presTmp) < 0.005) {
                b.delegee.presTmp = 0.0;
            };
        };
        if(Math.abs(b.delegee.presTmp) > 0.0) {
            b.noSleep();
            if(b.next != null && b.next() != null) {
                b.next().noSleep();
            };
        };

        if(GLB_timer.sec && Math.abs(b.delegee.presTmp) > 0.0) {
            b.self.ex_updatePresSupplyTargets();
        };

        // Apply damage if over limit
        if(
            !GLB_param.UPDATE_DEEP_SUPPRESSED && GLB_timer.secQuarter && LCRand.chance(UTIL_rand.get("pressure"), 0.25)
                && (
                    (b.delegee.presTmp + b.presExtra) > 0.0 ?
                        ((b.delegee.presTmp + b.presExtra) > (b.block.delegee.presRes + PRES_RES_TOL)) :
                        ((b.delegee.presTmp + b.presExtra) < (b.block.delegee.vacRes - PRES_RES_TOL))
                )
        ) {
            b.damagePierce((b.maxHealth * GLB_var.param.presDmgFrac + GLB_var.param.presDmgMin) * (
                b.delegee.presTmp > 0.0 ?
                    (b.delegee.presTmp / Math.max(b.block.delegee.presRes, 0.0001)) :
                    (-b.delegee.presTmp / Math.max(-b.block.delegee.vacRes, 0.0001))
            ));
        };

        // Pressure drop
        b.delegee.presBase -= b.delegee.presBase.fEqual(0.0, 0.005) ? b.delegee.presBase : (b.delegee.presBase / 60.0 * Time.delta);

        // Supply abstract fluid
        if(!b.block.delegee.skipPresSupply && b.delegee.presSupplyTargets.length > 0 && Math.abs(b.delegee.presTmp) > 0.0) {
            b.delegee.presSupplyIncre++;
            let b_t = b.delegee.presSupplyTargets[b.delegee.presSupplyIncre % b.delegee.presSupplyTargets.length];
            if(b_t.isAdded() && b_t.enabled && !b_t.isPayload()) {
                let addAmt = Math.abs(b.delegee.presTmp.roundFixed(0)) / 60.0;
                let consAmt = MDL_recipeDict.getConsAmtByBuild(b.delegee.presTmp > 0.0 ? GLB_varGen.auxPres : GLB_varGen.auxVac, b_t);
                LCCraftingHandler.addLiquid(b_t, null, b.delegee.presTmp > 0.0 ? GLB_varGen.auxPres : GLB_varGen.auxVac, addAmt, false, false, true);
                if(consAmt > 0.0 && addAmt > (consAmt + 5.5 / 60.0)) {
                    b_t.damagePierce((b_t.maxHealth * GLB_var.param.presDmgFrac + GLB_var.param.presDmgMin) / 5.0);
                };
            };
        };
    };


    /**
     * @private
     * @param {INTFBPressureBlock} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        let presThr = b.block.delegee.presThr;
        if(presThr.fEqual(0.0)) return true;
        return presThr > 0.0 ?
            b.delegee.presTmp >= presThr - PRES_THR_TOL :
            b.delegee.presTmp <= presThr + PRES_THR_TOL;
    };


    /**
     * @private
     * @param {INTFBPressureBlock} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {boolean}
     */
    function comp_acceptLiquid(b, b_f, liq) {
        let presThr = b.block.delegee.presThr;
        if(presThr.fEqual(0.0)) return true;
        return presThr > 0.0 ?
            b.delegee.presTmp >= presThr - 0.15 :
            b.delegee.presTmp <= presThr + 0.15;
    };


    /**
     * @private
     * @param {INTFBPressureBlock} b
     * @return {void}
     */
    function comp_ex_updatePresFetchTargets(b) {
        b.delegee.presFetchTargets.clear();
        // Find all possible pressure sources
        b.proximity.each(ob => {
            if(ob.block instanceof MultiBlockLinkBlock) {
                ob = ob.linkedBuild;
            };
            if(ob.ex_getPres != null && ob.ex_checkPresFetchValid(b) && !b.delegee.presTransCountTmpBs.includes(ob)) {
                b.delegee.presTransCount++;
                b.delegee.presTransCountTmpBs.push(ob);
            };
            if(ob.ex_getPres != null && b.self.ex_checkPresFetchValid(ob) && (ob.ex_checkPresSupplyValid == null || ob.ex_checkPresSupplyValid(b))) {
                b.delegee.presFetchTargets.push(ob);
            };
        });
    };


    /**
     * @private
     * @param {INTFBPressureBlock} b
     * @return {void}
     */
    function comp_ex_updatePresSupplyTargets(b) {
        b.delegee.presSupplyTargets.clear();
        // Find all possible pressure consumers
        b.proximity.each(ob => {
            ob = ob.getLiquidDestination(b, GLB_varGen.auxPres);
            if(ob == null) return;
            if(ob.block instanceof MultiBlockLinkBlock) {
                ob = ob.linkedBuild;
            };
            if((ob.acceptLiquid(b, GLB_varGen.auxPres) || ob.acceptLiquid(b, GLB_varGen.auxVac)) && b.self.ex_checkPresSupplyValid(ob)) {
                b.delegee.presSupplyTargets.push(ob);
            };
        });
    };


    /**
     * @private
     * @param {INTFBPressureBlock} b
     * @return {void}
     */
    function comp_ex_updatePresTarget(b) {
        b.delegee.presTarget = b.delegee.presBase;
        b.delegee.presFetchTargets.forEachFast(ob => {
            if(ob.isAdded() && ob.enabled && !ob.isPayload()) {
                b.delegee.presTarget += tryFun(ob.ex_getPres, ob, 0.0) * tryFun(ob.ex_getPresTransScl, ob, 1.0, b);
            };
        }, true);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles methods for pressure.
         * Only used for rotatable blocks for now, due to how pressure is transferred.
         * @class INTF_BLK_pressureBlock
         */
        new CLS_interface("INTF_BLK_pressureBlock", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Pressure required for this block to operate, negative for vacuum.
                     * @memberof INTF_BLK_pressureBlock
                     * @instance
                     * @type {number}
                     */
                    presThr: 0.0,
                    /**
                     * `PARAM`: If true, this block does not supply pressure/vacuum for nearby consumers.
                     * @memberof INTF_BLK_pressureBlock
                     * @instance
                     * @type {boolean}
                     */
                    skipPresSupply: false,
                    /**
                     * `PARAM`: If true, pressure will be transferred in three directions.
                     * @memberof INTF_BLK_pressureBlock
                     * @instance
                     * @type {boolean}
                     */
                    isPresRouter: false,


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Pressure resistance.
                     * @memberof INTF_BLK_pressureBlock
                     * @instance
                     * @type {number}
                     */
                    presRes: 0.0,
                    /**
                     * `INTERNAL`: Vacuum resistance.
                     * @memberof INTF_BLK_pressureBlock
                     * @instance
                     * @type {number}
                     */
                    vacRes: 0.0,


                };
            },


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


        }),


        /**
         * @class INTF_B_pressureBlock
         */
        new CLS_interface("INTF_B_pressureBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL` Gained from other buildings that actively dump pressure. See {@link INTF_BLK_pressureProducer}.
                     * @memberof INTF_B_pressureBlock
                     * @instance
                     * @type {number}
                     */
                    presBase: 0.0,
                    /**
                     * `INTERNAL` Current real amount of pressure.
                     * @memberof INTF_B_pressureBlock
                     * @instance
                     * @type {number}
                     */
                    presTmp: 0.0,
                    /**
                     * `INTERNAL` Target pressure, very volatile. Sum of base pressure and transferred pressure.
                     * @memberof INTF_B_pressureBlock
                     * @instance
                     * @type {number}
                     */
                    presTarget: 0.0,
                    /**
                     * `INTERNAL`: Will be added for bars and pressure damage check, has no effect on pressure transferred.
                     * @memberof INTF_B_pressureBlock
                     * @instance
                     * @type {number}
                     */
                    presExtra: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_pressureBlock
                     * @instance
                     * @type {TDynamic<Array<Building>>}
                     */
                    presFetchTargets: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_pressureBlock
                     * @instance
                     * @type {number}
                     */
                    presTransCount: 0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_pressureBlock
                     * @instance
                     * @type {TDynamic<Array<Building>>}
                     */
                    presTransCountTmpBs: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_pressureBlock
                     * @instance
                     * @type {TDynamic<Array<Building>>}
                     */
                    presSupplyTargets: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_pressureBlock
                     * @instance
                     * @type {number}
                     */
                    presSupplyIncre: 0,


                };
            },


            onDestroyed: function() {
                comp_onDestroyed(this);
            },


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                boolMode: "and",
            }),


            acceptLiquid: function(b_f, liq) {
                return comp_acceptLiquid(this, b_f, liq);
            }
            .setProp({
                boolMode: "and",
            }),


            /**
             * @memberof INTF_B_pressureBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updatePresFetchTargets: function() {
                comp_ex_updatePresFetchTargets(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_pressureBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updatePresSupplyTargets: function() {
                comp_ex_updatePresSupplyTargets(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_pressureBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updatePresTarget: function() {
                comp_ex_updatePresTarget(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_pressureBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_checkIsPresRouter: function() {
                return this.block.delegee.isPresRouter;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_pressureBlock
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_checkPresFetchSideValid: function(ob) {
                return this.self.ex_checkIsPresRouter() ?
                    false :
                    !MDL_cond.isNoSideBlock(this.block) ?
                        true :
                        (MDL_cond.isFluidConduit(this.block) && MDL_cond.isFluidConduit(ob.block));
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_B_pressureBlock
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_checkPresFetchValid: function(ob) {
                return LCGeometry.accept(
                    ob, this, tryFun(ob.ex_checkIsPresRouter, ob, false),
                    this.self.ex_checkPresFetchSideValid(ob),
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_B_pressureBlock
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_checkPresSupplyValid: function(ob) {
                return LCGeometry.accept(this, ob, this.self.ex_checkIsPresRouter(), true);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @memberof INTF_B_pressureBlock
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getPres: function() {
                return this.delegee.presTmp;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Extra multiplier on pressure transferred to another pressure block.
             * @memberof INTF_B_pressureBlock
             * @instance
             * @func
             * @param {Building} b_t
             * @return {number}
             */
            ex_getPresTransScl: function(b_t) {
                return !this.self.ex_checkIsPresRouter() || this.delegee.presTransCount === 0 ? 1.0 : (1.0 / this.delegee.presTransCount);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_BLK_pressureBlock
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        wr.f(this.delegee.presTmp);
                    },
                    rd => {
                        let pres = rd.f();
                        this.delegee.presTmp = pres;
                        this.delegee.presTarget = pres;
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
