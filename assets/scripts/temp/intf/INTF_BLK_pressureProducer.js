/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_pressureProducer>} INTFBLKPressureProducer
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_pressureProducer>} INTFBPressureProducer
     * @prop {INTFBLKPressureProducer} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKPressureProducer} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(!blk.hasLiquids) throw new LCError.NoLiquidModuleError(blk);

        if(!blk.delegee.presProd.fEqual(0.0)) {
            MDL_event.onLoadPost(() => {
                MDL_recipeDict.addFldProdTerm(blk, blk.delegee.presProd > 0.0 ? GLB_varGen.auxPres : GLB_varGen.auxVac, Math.abs(blk.delegee.presProd), null);
            });
        };
    };


    /**
     * @private
     * @param {INTFBLKPressureProducer} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(!blk.delegee.presProd.fEqual(0.0)) {
            stats.add(blk.delegee.presProd > 0.0 ? fetchStat("lovec", "blk0liq-presoutput") : fetchStat("lovec", "blk0liq-vacoutput"), Math.abs(blk.delegee.presProd * 60.0), StatUnit.perSecond);
        };
    };


    /**
     * @private
     * @param {INTFBPressureProducer} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.self.ex_updatePresDumpTs();
        b.self.ex_updatePresDumpTargets();
    };


    /**
     * @private
     * @param {INTFBPressureProducer} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.presDumpTargets.clear();
    };


    /**
     * @private
     * @param {INTFBPressureProducer} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_param.UPDATE_SUPPRESSED) return;
        let presProd = b.self.ex_calcPresDumpRate();
        if(presProd.fEqual(0.0)) return;
        let aux = presProd > 0.0 ? GLB_varGen.auxPres : GLB_varGen.auxVac;

        LCCraftingHandler.addLiquid(b, b, aux, Math.abs(presProd) / b.timeScale, true);
        if(!b.self.ex_dumpPres(Math.abs(presProd), presProd < 0.0)) {
            b.dumpLiquid(aux, 2.0);
        };
    };


    /**
     * @private
     * @param {INTFBPressureProducer} b
     * @return {void}
     */
    function comp_ex_updatePresDumpTs(b) {
        b.delegee.presDumpTs.clear();
        b.block.delegee.presDumpPons.forEachFast(pon => {
            b.delegee.presDumpTs.push(LCPos.getTileRectRotCenter(GLB_var.world.tile(b.tileX() + pon.x, b.tileY() + pon.y), GLB_var.world.tile(b.tileX(), b.tileY()), b.rotation, 1, b.block.size));
        }, true);
    };


    /**
     * @private
     * @param {INTFBPressureProducer} b
     * @return {void}
     */
    function comp_ex_updatePresDumpTargets(b) {
        b.delegee.presDumpTargets.clear();
        let fldType1, fldType2;
        if(b.delegee.presDumpTs.length > 0) {
            let ob;
            b.delegee.presDumpTs.forEachFast(ot => {
                ob = ot.build;
                if(ob == null || ob.team !== b.team) return;
                if(ob.block instanceof MultiBlockLinkBlock) {
                    ob = ob.linkedBuild;
                };
                if(tryJsProp(ob, "presBase") == null) return;
                if(ob.block.rotate && (!MDL_cond.isNoSideBlock(ob.block) ? ob.relativeTo(b) === ob.rotation : b.relativeTo(ob) !== ob.rotation)) return;
                fldType1 = b.block.delegee.presFldType;
                fldType2 = tryJsProp(ob.block, "fldType", "any");
                if(fldType1 !== "any" && fldType2 !== "any" && fldType1 !== fldType2) return;
                b.delegee.presDumpTargets.push(ob);
            }, true);
        } else {
            b.proximity.each(ob => {
                if(tryJsProp(ob, "presBase") == null) return;
                if(ob.block.rotate && (!MDL_cond.isNoSideBlock(ob.block) ? ob.relativeTo(b) === ob.rotation : b.relativeTo(ob) !== ob.rotation)) return;
                fldType1 = b.block.delegee.presFldType;
                fldType2 = tryJsProp(ob.block, "fldType", "any");
                if(fldType1 !== "any" && fldType2 !== "any" && fldType1 !== fldType2) return;
                b.delegee.presDumpTargets.push(ob);
            });
        };
    };


    /**
     * @private
     * @param {INTFBPressureProducer} b
     * @param {number} rate
     * @param {boolean} isVac
     * @return {boolean}
     */
    function comp_ex_dumpPres(b, rate, isVac) {
        if(b.delegee.presDumpTargets.length === 0) return false;
        let b_t = b.delegee.presDumpTargets[b.delegee.presDumpIncre % b.delegee.presDumpTargets.length];
        b.delegee.presDumpIncre++;
        if(!b_t.isAdded() || b_t.isPayload()) return false;
        let amtTrans = LCCraftingHandler.addLiquid(b, b, !isVac ? GLB_varGen.auxPres : GLB_varGen.auxVac, -(rate - 0.0001));
        if(amtTrans < 0.0001) return false;
        b_t.delegee.presBase = b_t.delegee.presBase + amtTrans * (isVac ? -1.0 : 1.0);
        return true;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles pressure production methods.
         * @class INTF_BLK_pressureProducer
         */
        new CLS_interface("INTF_BLK_pressureProducer", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Pressure produced by this block per frame, negative for vacuum.
                     * @memberof INTF_BLK_pressureProducer
                     * @instance
                     * @type {number}
                     */
                    presProd: 0.0,
                    /**
                     * `PARAM`: Fluid type restriction for pressure dumping. See {@link INTF_BLK_fluidTypeFilter#fldType}.
                     * @memberof INTF_BLK_pressureProducer
                     * @instance
                     * @type {string}
                     */
                    presFldType: "any",
                    /**
                     * `PARAM`: Dump positions (relative to tile center). Leave empty if not used.
                     * @memberof INTF_BLK_pressureProducer
                     * @instance
                     * @type {TDynamic<Array<Point2>>}
                     */
                    presDumpPons: tprov(() => []),


                };
            },


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class INTF_B_pressureProducer
         */
        new CLS_interface("INTF_B_pressureProducer", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_pressureProducer
                     * @instance
                     * @type {TDynamic<Array<Tile>>}
                     */
                    presDumpTs: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_pressureProducer
                     * @instance
                     * @type {TDynamic<Array<Building>>}
                     */
                    presDumpTargets: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_pressureProducer
                     * @instance
                     * @type {number}
                     */
                    presDumpIncre: 0,


                };
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


            /**
             * @memberof INTF_B_pressureProducer
             * @instance
             * @func
             * @return {void}
             */
            ex_updatePresDumpTs: function() {
                comp_ex_updatePresDumpTs(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_pressureProducer
             * @instance
             * @func
             * @return {void}
             */
            ex_updatePresDumpTargets: function() {
                comp_ex_updatePresDumpTargets(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_pressureProducer
             * @instance
             * @func
             * @param {number} rate
             * @param {boolean} isVac
             * @return {void}
             */
            ex_dumpPres: function(rate, isVac) {
                comp_ex_dumpPres(this, rate, isVac);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * Override this method for dynamic dump rate.
             * Efficiency should not be involved!
             * <br> `LATER`
             * @memberof INTF_B_pressureProducer
             * @instance
             * @func
             * @return {number}
             */
            ex_calcPresDumpRate: function() {
                return this.block.delegee.presProd;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
