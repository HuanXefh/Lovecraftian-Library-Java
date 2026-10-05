/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_recipeHandler>} INTFBLKRecipeHandler
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_recipeHandler>} INTFBRecipeHandler
     * @prop {INTFBLKRecipeHandler} block
     */


    const PARENT = require("lovec/temp/intf/INTF_BLK_payloadBlock");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {number}
     */
    const STOP_TIME = 300.0;


    let
        /**
         * @private
         * @type {number}
         */
        i,
        /**
         * @private
         * @type {number}
         */
        iCap,
        /**
         * @private
         * @type {number}
         */
        j,
        /**
         * @private
         * @type {number}
         */
        jCap,
        /**
         * @private
         * @type {Object}
         */
        tmp,
        /**
         * @private
         * @type {Object}
         */
        tmp1,
        /**
         * @private
         * @type {number}
         */
        amt,
        /**
         * @private
         * @type {number}
         */
        p,
        /**
         * @private
         * @type {boolean}
         */
        cond,
        /**
         * @private
         * @type {number}
         */
        val,
        /**
         * @private
         * @type {number}
         */
        tmpVal,
        /**
         * @private
         * @type {number}
         */
        scl,
        /**
         * @private
         * @type {number}
         */
        inc,
        /**
         * @private
         * @type {RecipeModule}
         */
        rcMdl,
        /**
         * @private
         * @type {string}
         */
        header;


    /**
     * @private
     * @param {Building} b
     * @return {boolean}
     */
    function checkSelectedUnloader(b) {
        // Unloaders must be configured, otherwise auto-selection will break
        return b.block instanceof Unloader ?
            b.sortItem != null :
            b.block instanceof DirectionalUnloader ?
                b.unloadItem != null :
                true;
    };


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKRecipeHandler} blk
     * @return {void}
     */
    function comp_init(blk) {
        // Have to keep these to prevent crash on specific client sides like MindustryX
        if(blk.outputItems != null || blk.outputLiquids != null) {
            console.warn("[LOVEC] Do not set outputs for multi-crafter ${1} using vanilla fields. Define a recipe module instead!".format(blk.name.color(Pal.accent)));
        };
        blk.outputItems = [];
        blk.outputLiquids = [];

        CLS_recipe.register(blk, blk.delegee.rcMdl);

        MDL_event.onLoad(() => {
            blk.outputsLiquid = MDL_recipe.checkAnyFldOutput(blk.delegee.rcMdl, false);
            blk.hasConsumers = true;

            blk.delegee.isErekirHeatConsumer = MDL_recipe.checkErekirHeatInput(blk.delegee.rcMdl);
            blk.delegee.isErekirHeatProducer = MDL_recipe.checkErekirHeatOutput(blk.delegee.rcMdl);
            if(blk.delegee.isErekirHeatConsumer && blk.delegee.isErekirHeatProducer) {
                console.warn("[LOVEC] Block ${1} is both heat consumer and producer, which can lead to broken heat calculation!".format(blk.name.color(Pal.accent)));
            };
        });
    };


    /**
     * @private
     * @param {INTFBLKRecipeHandler} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        // Fixes flashing liquid bar bug in old Multi-Crafter Lib
        // Liquid bars are created in `b.displayBars` for dynamic amount of bars
        blk.removeBar("liquid");
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {void}
     */
    function comp_created(b) {
        // Use empty recipe to prevent null pointer in this frame
        b.delegee.rc = CLS_recipe.get(b.block, "SPEC: empty");

        // Recipe header is not read yet, delay check
        MDL_event.onDelayRun(0.0, () => {
            // noinspection JSValidateTypes
            rcMdl = b.block.delegee.rcMdl;
            if(MDL_recipe.checkHeaderValid(rcMdl, b.delegee.rcHeader)) {
                b.self.ex_updateRcParam(rcMdl, b.delegee.rcHeader, true);
            } else {
                // Recipe may be removed, default to first one
                header = MDL_recipe.getFirstHeader(rcMdl);
                b.self.ex_updateRcParam(rcMdl, header, true);
                b.delegee.rcHeader = header;
            };

            // Without this consumption is bugged
            b.self.ex_resetRcParam();
        });
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_param.UPDATE_SUPPRESSED || DEBUG.skipRcUpdate) return;

        b.delegee.rc.updateAutoSelection(b);

        b.self.ex_updateRcParam(b.block.delegee.rcMdl, b.delegee.rcHeader, false);
        b.self.ex_onRcUpdate();
        b.delegee.hasStopped = b.delegee.stopTimeCur > STOP_TIME;

        b.delegee.rc.updateErekirHeat(b);

        if(b.efficiency < 0.0001 || !b.shouldConsume()) {
            // Crafter is inactive
            b.warmup = Mathf.approachDelta(b.warmup, 0.0, b.block.warmupSpeed);
            if(b.delegee.hasRun) {
                b.delegee.stopTimeCur = b.warmup < 0.1 ?
                    (b.delegee.stopTimeCur + Time.delta) :
                    0.0;
            };
        } else {
            // Crafter is active
            b.warmup = Mathf.approachDelta(b.warmup, b.warmupTarget(), b.block.warmupSpeed);
            b.progress += b.delegee.lastProgInc * b.warmup;
            if(b.warmup > 0.9) {
                b.delegee.hasRun = true;
                b.delegee.stopTimeCur = b.efficiency < 0.3 ?
                    (b.delegee.stopTimeCur + Time.delta) :
                    0.0;
            };
            if(b.progress >= 1.0) {
                b.progress %= 1.0;
                b.craft();
            };

            b.delegee.rc.craftContinuous(b, b.delegee.lastLiqProgInc);
            b.delegee.rc.consumeContinuous(b, b.delegee.lastLiqProgInc);
            if(Mathf.chanceDelta(b.block.updateEffectChance * b.warmup)) {
                MDL_effect.showAround(b.x, b.y, b.block.updateEffect, b.block.size * 0.5 * Vars.tilesize, 0.0);
            };
            b.self.ex_onRcRun();
            if(b.delegee.hasStopped) {
                b.self.ex_onRcStoppedRun();
            };
        };

        b.totalProgress += b.warmup * b.edelta();
        if(!b.block.delegee.disableDump) {
            b.delegee.rc.dump(b);
        };
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        // Efficiency is overwritten
        b.efficiency = b.shouldConsume() && (b.block.consumesPower && b.power != null ? b.power.status > 0.01 : true) ?
            b.delegee.rcEffc :
            0.0;

        b.self.ex_postUpdateEfficiencyMultiplier();
        if(b.delegee.rc.erekirHeatReq > 0.0) {
            b.efficiency *= b.delegee.erekirHeatEffc;
        };
        if(!b.delegee.rc.validCheck(b)) {
            b.efficiency = 0.0;
        };
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {void}
     */
    function comp_craft(b) {
        b.delegee.rc.craftBatch(b, b.self.ex_calcFailP());
        b.delegee.rc.craftPay(b);
        b.delegee.rc.consumeBatch(b);

        b.self.ex_onRcCraft();
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        if(b.items == null || b.items.get(item) >= b.getMaximumAccepted(item)) return false;
        if(
            b.delegee.blk$useAutoSelection && b.delegee.rc.keyItemHeaderMap != null
                && item !== b.delegee.keyCt && b_f !== b && checkSelectedUnloader(b_f)
                && b.delegee.rc.keyItemHeaderMap.containsKey(item) && !b.delegee.rc.checkOutput(item)
        ) {
            b.delegee.keyCt = item;
        };

        if(b.delegee.itemAcceptCacheArr[item.id] == null) {
            b.delegee.itemAcceptCacheArr[item.id] = b.delegee.rc.checkInput(item);
        };

        return b.delegee.itemAcceptCacheArr[item.id];
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {boolean}
     */
    function comp_acceptLiquid(b, b_f, liq) {
        if(b.liquids == null || b.liquids.get(liq) >= b.block.liquidCapacity) return false;
        if(
            b.delegee.blk$useAutoSelection && GLB_timer.sec && b.delegee.rc.keyFldHeaderMap != null
                && liq !== b.delegee.keyCt && b_f !== b
                && b.delegee.rc.keyFldHeaderMap.containsKey(liq) && !b.delegee.rc.checkOutput(liq)
        ) {
            b.delegee.keyCt = liq;
        };

        if(b.delegee.liqAcceptCacheArr[liq.id] == null) {
            b.delegee.liqAcceptCacheArr[liq.id] = b.delegee.rc.checkInput(liq);
        };

        return b.delegee.liqAcceptCacheArr[liq.id];
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @param {Table} tb
     * @return {void}
     */
    const comp_displayConsumption = function thisFun(b, tb) {
        tb.left();

        // BI
        i = 0;
        iCap = b.delegee.rc.bi.iCap();
        while(i < iCap) {
            tmp = b.delegee.rc.bi[i];
            if(!(tmp instanceof Array)) {
                amt = b.delegee.rc.bi[i + 1];
                if(amt > 0) {
                    MDL_table.reqRs(tb, b, tmp, amt);
                };
            } else {
                thisFun.tmpCts.clear();
                thisFun.tmpAmts.clear();
                j = 0;
                jCap = tmp.iCap();
                while(j < jCap) {
                    tmp1 = tmp[j];
                    amt = tmp[j + 1];
                    if(amt > 0) {
                        thisFun.tmpCts.push(tmp1);
                        thisFun.tmpAmts.push(amt);
                    };
                    j += 3;
                };
                if(thisFun.tmpCts.length > 0) {
                    MDL_table.reqMultiCt(tb, b, thisFun.tmpCts, thisFun.tmpAmts);
                };
            };
            i += 3;
        };

        // CI
        i = 0;
        iCap = b.delegee.rc.ci.iCap();
        while(i < iCap) {
            tmp = b.delegee.rc.ci[i];
            if(!(tmp instanceof Array)) {
                if(b.delegee.rc.ci[i + 1] > 0.0) MDL_table.reqRs(tb, b, tmp);
            } else {
                thisFun.tmpCts.clear();
                j = 0;
                jCap = tmp.iCap();
                while(j < jCap) {
                    tmp1 = tmp[j];
                    if(tmp[j + 1] > 0.0) {
                        thisFun.tmpCts.push(tmp1);
                    };
                    j += 2;
                };
                if(thisFun.tmpCts.length > 0) {
                    MDL_table.reqMultiCt(tb, b, thisFun.tmpCts);
                };
            };
            i += 2;
        };

        // AUX
        i = 0;
        iCap = b.delegee.rc.aux.iCap();
        while(i < iCap) {
            tmp = b.delegee.rc.aux[i];
            if(b.delegee.rc.aux[i + 1] > 0.0) {
                MDL_table.reqRs(tb, b, tmp);
            };
            i += 2;
        };

        // OPT
        if(b.delegee.rc.reqOpt) {
            thisFun.tmpCts.clear();
            thisFun.tmpAmts.clear();
            i = 0;
            iCap = b.delegee.rc.opt.iCap();
            while(i < iCap) {
                tmp = b.delegee.rc.opt[i];
                amt = b.delegee.rc.opt[i + 1];
                if(amt > 0) {
                    thisFun.tmpCts.push(tmp);
                    thisFun.tmpAmts.push(amt);
                };
                i += 4;
            };
            if(thisFun.tmpCts.length > 0) {
                MDL_table.reqMultiCt(tb, b, thisFun.tmpCts, thisFun.tmpAmts);
            };
        };

        // PAYI
        if(b.delegee.hasPayInput) {
            i = 0;
            iCap = b.delegee.rc.payi.iCap();
            while(i < iCap) {
                tmp = MDL_content.getCt(b.delegee.rc.payi[i], null, true);
                amt = b.delegee.rc.payi[i + 1];
                if(amt > 0) {
                    MDL_table.reqCt(tb, tmp, amt, ct => tryVal(b.delegee.payReqObj[ct.name], 0))
                };
                i += 2;
            };
        };
    }
    .setProp({
        /**
         * @memberof comp_displayConsumption
         * @type {Array<UnlockableContent>}
         */
        tmpCts: [],
        /**
         * @memberof comp_displayConsumption
         * @type {Array<number>}
         */
        tmpAmts: [],
    });


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @param {Table} tb
     * @return {void}
     */
    const comp_displayBars = function thisFun(b, tb) {
        if(b.block.delegee.isErekirHeatConsumer) {
            tb.add(new Bar(
                prov(() => Core.bundle.format("bar.heatpercent", (b.delegee.erekirHeatI + 0.01).roundFixed(1), (b.delegee.erekirHeatEffc * 100.0 + 0.01).roundFixed(1))),
                prov(() => Pal.lightOrange),
                () => Mathf.clamp(b.heatFrac()),
            ));
            tb.row();
        };
        if(b.block.delegee.isErekirHeatProducer) {
            tb.add(new Bar(
                "bar.heat",
                Pal.lightOrange,
                () => Mathf.clamp(b.heatFrac()),
            ));
            tb.row();
        };

        if(b.delegee.rc.attr != null) {
            tb.add(new Bar(
                prov(() => Core.bundle.format("bar.efficiency", Math.round(b.delegee.attrEffc * 100.0))),
                prov(() => Pal.lightOrange),
                () => Mathf.clamp(b.delegee.attrEffc),
            )).growX();
            tb.row();
        };

        thisFun.addedLiqs.clear();
        b.delegee.rc.inputFlds.forEachFast(liq => {
            if(thisFun.addedLiqs.includes(liq)) return;
            thisFun.addLiqBar(tb, b, liq);
            thisFun.addedLiqs.push(liq);
        }, true);
        b.delegee.rc.outputFlds.forEachFast(liq => {
            if(thisFun.addedLiqs.includes(liq)) return;
            thisFun.addLiqBar(tb, b, liq);
            thisFun.addedLiqs.push(liq);
        }, true);
    }
    .setProp({
        /**
         * @memberof comp_displayBars
         * @type {Array<Liquid>}
         */
        addedLiqs: [],
        /**
         * @memberof comp_displayBars
         * @param {Table} tb
         * @param {INTFBRecipeHandler} b
         * @param {Liquid} liq
         * @return {void}
         */
        addLiqBar: (tb, b, liq) => {
            tb.add(new Bar(
                liq.localizedName,
                tryVal(liq.barColor, liq.color),
                () => MDL_cond.isAuxiliaryFluid(liq) && !MDL_cond.isNoCapAuxiliaryFluid(liq) ? Mathf.clamp(b.liquids.get(liq) / GLB_var.param.auxCap) : (b.liquids.get(liq) / b.block.liquidCapacity),
            )).growX();
            tb.row();
        },
    });


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        LCDraw.contentIcon(b.x, b.y, Vars.content.byName(b.delegee.rc.rcIconName), b.block.size, 0.75);
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {void}
     */
    function comp_drawStatus(b) {
        if(!b.block.enableDrawStatus) return;
        LCDrawf.blockStatus(b.x, b.y, b.block.size, b.status().color);
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {void}
     */
    function comp_ex_onRcParamUpdate(b) {
        b.delegee.rcEffc = b.self.ex_calcRcEffcTarget();
        b.delegee.lastProgInc = b.self.ex_calcProgInc(b.block.craftTime);
        b.delegee.lastLiqProgInc = b.self.ex_calcProgInc(1.0);
        b.delegee.lastCanAdd = b.delegee.rc.checkCanAdd(b);

        b.self.ex_updateAttrEffc();
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {void}
     */
    function comp_ex_updateAttrEffc(b) {
        b.delegee.attrEffc = b.delegee.rc.calcAttrEffc(b.delegee.attrSum);
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @param {RecipeModule} rcMdl
     * @param {string} rcHeader
     * @param {boolean} forceLoad
     * @return {void}
     */
    function comp_ex_updateRcParam(b, rcMdl, rcHeader, forceLoad) {
        if(rcHeader !== b.delegee.rcHeader || forceLoad) {
            b.self.ex_loadRcParam(rcMdl, rcHeader);
        };
        if(b.self.ex_shouldUpdateRcParam()) {
            b.self.ex_onRcParamUpdate();
        };
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {void}
     */
    function comp_ex_resetRcParam(b) {
        b.delegee.itemAcceptCacheArr.clear();
        b.delegee.liqAcceptCacheArr.clear();
        forceUpdateBlockFrag();

        if(!GLB_param.UPDATE_SUPPRESSED) {
            b.progress = 0.0;
            if(b.liquids != null) {
                b.liquids.clear();
            };
        };
        b.efficiency = 0.0;
        b.delegee.lastOptEffc = 1.0;
        b.delegee.rcEffcMeanArr.clear();

        b.proximity.each(ob => {
            ob.onProximityUpdate();
        });
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @param {RecipeModule} rcMdl
     * @param {string} rcHeader
     * @return {void}
     */
    function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
        b.delegee.rc = CLS_recipe.get(b.block, rcHeader);

        MDL_event.onDelayRun(0.0, () => {
            b.delegee.hasPayInput = b.delegee.rc.hasPayInput;
            b.delegee.hasPayOutput = b.delegee.rc.hasPayOutput;
            if(b.delegee.hasPayInput) {
                b.delegee.rc.payi.forEachRow(2, (tmp, amt) => {
                    if(amt > 0 && b.delegee.payReqObj[tmp] == null) {
                        b.delegee.payReqObj[tmp] = 0;
                    };
                }, true);
            };

            b.delegee.attrSum = MDL_attr.calcSumRect(b.tile, 0, b.block.size, b.delegee.attr, AttrModes.FLOOR);
            b.self.ex_updateAttrEffc();

            Object.clear(b.delegee.consTmpObj);
            Object.clear(b.delegee.prodTmpObj);
        });
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @param {number} time
     * @return {number}
     */
    function comp_ex_calcProgInc(b, time) {
        if(b.block.ignoreLiquidFullness) {
            inc = b.edelta() / time / b.delegee.rc.rcTimeScl;
        } else {
            val = 1.0;
            scl = 1.0;
            cond = false;
            iCap = b.delegee.rc.co.iCap();
            if(b.liquids != null && iCap > 0) {
                val = 0.0;
                i = 0;
                while(i < iCap) {
                    tmp = b.delegee.rc.co[i];
                    amt = b.delegee.rc.co[i + 1];
                    tmpVal = amt < 0.0001 ? 1.0 : (b.block.liquidCapacity - b.liquids.get(tmp)) / (amt * b.edelta());
                    val = Math.max(val, tmpVal);
                    if(!MDL_cond.isAuxiliaryFluid(tmp)) {
                        scl = Math.min(scl, tmpVal);
                    };
                    cond = true;
                    i += 2;
                };
            };
            if(!cond) {
                val = 1.0;
            };
            inc = b.edelta() / time * (b.block.dumpExtraLiquid ? Math.min(val, 1.0) : scl) / b.delegee.rc.rcTimeScl;
        };

        return isNaN(inc) ?
            0.0 :
            inc;
    };


    /**
     * @private
     * @param {INTFBRecipeHandler} b
     * @return {number}
     */
    function comp_ex_calcRcEffcTarget(b) {
        b.delegee.rcEffcMeanArr.push(b.delegee.rc.calcEffc(b));
        return b.delegee.rcEffcMeanArr.getMean() * b.delegee.attrEffc;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles basic multi-crafter methods, should be implemented after {@link INTF_BLK_recipeSelector}.
         * Does not affect stats and recipe selection.
         * @class INTF_BLK_recipeHandler
         * @extends INTF_BLK_payloadBlock
         */
        new CLS_interface({


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Recipe module (.js file) for this block (as string), usually the block name without mod name. The file should be located at `scripts/auxFi/rc`. Converted to actual object later.
                     * @memberof INTF_BLK_recipeHandler
                     * @instance
                     * @type {string|RecipeModule}
                     */
                    rcMdl: null,
                    /**
                     * `PARAM`: Mod (as string) to search module from.
                     * @memberof INTF_BLK_recipeHandler
                     * @instance
                     * @type {String}
                     */
                    rcSourceMod: null,
                    /**
                     * `PARAM`: Warmup rate of Erekir heat output.
                     * @memberof INTF_BLK_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    erekirHeatWarmupRate: 0.05,
                    /**
                     * `PARAM`: If true, this crafter will select recipe automatically. Make sure every recipe is assigned with a unique key content!
                     * @memberof INTF_BLK_recipeHandler
                     * @instance
                     * @type {boolean}
                     */
                    useAutoSelection: false,
                    /**
                     * `PARAM`: Whether this block does not actively dump resources.
                     * @memberof INTF_BLK_recipeHandler
                     * @instance
                     * @type {boolean}
                     */
                    disableDump: false,
                    /**
                     * `PARAM`: Effect used when this crafter fails its recipe.
                     * @memberof INTF_BLK_recipeHandler
                     * @instance
                     * @type {Effect}
                     */
                    failEff: GLB_eff.smogFail,


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Whether this block consumes Erekir heat.
                     * @memberof INTF_BLK_recipeHandler
                     * @instance
                     * @type {boolean}
                     */
                    isErekirHeatConsumer: false,
                    /**
                     * `INTERNAL`: Whether this block produces Erekir heat.
                     * @memberof INTF_BLK_recipeHandler
                     * @instance
                     * @type {boolean}
                     */
                    isErekirHeatProducer: false,


                };
            }
            .setProp({
                mergeMode: "object",
            }),


            __paramParserM__: function() {
                return [
                    "rcMdl", function(val) {
                        // Convert name to actual recipe module object
                        if(val == null) throw new LCError.NullArgumentError("rcMdl");
                        let nameMod = this.rcSourceMod;
                        if(nameMod == null) throw new LCError.NullArgumentError("rcSourceMod");
                        return MDL_recipe.getRcMdl(nameMod, val);
                    },
                ]
            }
            .setProp({
                mergeMode: "array",
            }),


            init: function() {
                comp_init(this);
            },


            setBars: function() {
                comp_setBars(this);
            },


            consumesItem: function(item) {
                return MDL_recipe.checkInput(item, this.delegee.rcMdl);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            consumesLiquid: function(liq) {
                return MDL_recipe.checkInput(liq, this.delegee.rcMdl);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            outputsItems: function() {
                return MDL_recipe.checkAnyItemOutput(this.delegee.rcMdl);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            })
            .setCache(),


        })
        .extendInterface(PARENT[0], "INTF_BLK_recipeHandler"),


        /**
         * @class INTF_B_recipeHandler
         * @extends INTF_B_payloadBlock
         */
        new CLS_interface({


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Recipe header currently selected.
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {string}
                     */
                    rcHeader: "",
                    /**
                     * `INTERNAL`: Recipe selected. See {@link CLS_recipe}.
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {CLS_recipe}
                     */
                    rc: null,
                    /**
                     * `INTERNAL`: Efficiency for current recipe.
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    rcEffc: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {MathMeanArray}
                     */
                    rcEffcMeanArr: tprov(() => new MathMeanArray(5)),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    erekirHeatI: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    erekirHeatO: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {TDynamic<JavaArray<java.lang.Float>>}
                     */
                    erekirSideHeats: tprov(() => Array.newFArr(4)),
                    /**
                     * `INTERNAL`: Efficiency related to Erekir heat. Used only when Erekir heat is involved.
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    erekirHeatEffc: 0.0,
                    /**
                     * `INTERNAL`: Attribute sum for current recipe.
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    attrSum: 0.0,
                    /**
                     * `INTERNAL`: Attribute efficiency for current recipe.
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    attrEffc: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    lastProgInc: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    lastLiqProgInc: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {boolean}
                     */
                    lastCanAdd: false,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    lastOptEffc: 1.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {UnlockableContent|null}
                     */
                    keyCt: null,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {UnlockableContent|null}
                     */
                    lastKeyCt: null,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {TDynamic<Array<boolean>>}
                     */
                    itemAcceptCacheArr: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {TDynamic<Array<boolean>>}
                     */
                    liqAcceptCacheArr: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {TDynamic<Object<string, number>>}
                     */
                    consTmpObj: tprov(() => ({})),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {TDynamic<Object<string, number>>}
                     */
                    prodTmpObj: tprov(() => ({})),
                    /**
                     * `INTERNAL`: Whether this building has been active before.
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {boolean}
                     */
                    hasRun: false,
                    /**
                     * `INTERNAL`: Whether this building is inactive right now after being active before.
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {boolean}
                     */
                    hasStopped: false,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {number}
                     */
                    stopTimeCur: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {boolean|TmpStateTag}
                     */
                    blk$useAutoSelection: TmpStateTag.needReplace,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {boolean|TmpStateTag}
                     */
                    blk$isErekirHeatConsumer: TmpStateTag.needReplace,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_recipeHandler
                     * @instance
                     * @type {boolean|TmpStateTag}
                     */
                    blk$isErekirHeatProducer: TmpStateTag.needReplace,


                };
            }
            .setProp({
                mergeMode: "object",
            }),


            created: function() {
                comp_created(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            }
            .setProp({
                override: true,
                final: true,
            }),


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            acceptLiquid: function(b_f, liq) {
                return comp_acceptLiquid(this, b_f, liq);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            shouldConsume: function() {
                return this.enabled && this.delegee.lastCanAdd && (this.delegee.rc.erekirHeatReq <= 0.0 || this.delegee.erekirHeatI > 0.0);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            craft: function() {
                comp_craft(this);
            }
            .setProp({
                noSuper: true,
            }),


            warmupTarget: function() {
                // `b.cheating()` should not be checked here because Anuke said no
                // Yep, it's intentional that heat is required even when cheating
                return this.delegee.rc.erekirHeatReq <= 0.0 ? 1.0 : Mathf.clamp(this.delegee.erekirHeatI / this.delegee.rc.erekirHeatReq);
            }
            .setProp({
                noSuper: true,
                mergeMode: function(valPrev, val) {
                    return val * valPrev;
                },
            }),


            heatRequirement: function() {
                return this.delegee.rc.erekirHeatReq;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            heat: function() {
                return this.delegee.erekirHeatO;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            sideHeat: function() {
                return this.delegee.erekirSideHeats;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            heatFrac: function() {
                return this.block.delegee.isErekirHeatConsumer ?
                    this.delegee.erekirHeatI / this.delegee.rc.erekirHeatReq :
                    this.block.delegee.isErekirHeatProducer ?
                        this.delegee.erekirHeatO / this.delegee.rc.erekirHeatProd :
                        0.0;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            displayConsumption: function(tb) {
                comp_displayConsumption(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            displayBars: function(tb) {
                comp_displayBars(this, tb);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


            drawStatus: function() {
                comp_drawStatus(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Called every several frames to update some universal parameters.
             * To update additional parameters, override {@link INTF_B_recipeHandler#ex_updateRcParam} instead.
             * @memberof INTF_B_recipeHandler
             * @instance
             * @return {void}
             */
            ex_onRcParamUpdate: function() {
                comp_ex_onRcParamUpdate(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_recipeHandler
             * @instance
             * @return {void}
             */
            ex_onRcUpdate: function() {
                if(this.delegee.rc.scrTup != null) {
                    this.delegee.rc.scrTup[0](this);
                };
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_recipeHandler
             * @instance
             * @return {void}
             */
            ex_onRcRun: function() {
                if(this.delegee.rc.scrTup != null) {
                    this.delegee.rc.scrTup[1](this);
                };
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_recipeHandler
             * @instance
             * @return {void}
             */
            ex_onRcStoppedRun: function() {
                if(this.delegee.rc.scrTup != null) {
                    this.delegee.rc.scrTup[3](this);
                };
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_recipeHandler
             * @instance
             * @return {void}
             */
            ex_onRcCraft: function() {
                if(this.delegee.rc.scrTup != null) {
                    this.delegee.rc.scrTup[2](this);
                };
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_recipeHandler
             * @instance
             * @return {void}
             */
            ex_onRcFail: function() {
                if(this.delegee.rc.scrTup != null) {
                    this.delegee.rc.scrTup[4](this);
                };
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Multi-crafter efficiency should be updated here, as it's been reset in `b.updateEfficiencyMultiplier`.
             * <br> `b.updateEfficiencyMultiplier` is final now and cannot be mixed.
             * <br> `LATER`
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @return {void}
             */
            ex_postUpdateEfficiencyMultiplier: function() {

            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Updates attribute efficiency.
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @return {void}
             */
            ex_updateAttrEffc: function() {
                comp_ex_updateAttrEffc(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Updates parameters related to a specific recipe.
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @param {RecipeModule} rcMdl
             * @param {string} rcHeader
             * @param {boolean} forceLoad - If true, some parameters will be loaded even if header is not changed.
             * @return {void}
             */
            ex_updateRcParam: function(rcMdl, rcHeader, forceLoad) {
                comp_ex_updateRcParam(this, rcMdl, rcHeader, forceLoad);
            }
            .setProp({
                noSuper: true,
                argLen: 3,
            }),


            /**
             * Called whenever recipe is changed.
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func ex_resetRcParam
             * @return {void}
             */
            ex_resetRcParam: function() {
                comp_ex_resetRcParam(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * When recipe is changed, this method will be called to load some recipe-specific parameters.
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @param {RecipeModule} rcMdl
             * @param {string} header
             * @return {void}
             */
            ex_loadRcParam: function(rcMdl, rcHeader) {
                comp_ex_loadRcParam(this, rcMdl, rcHeader);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * Creates effect when recipe is changed.
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @return {void}
             */
            ex_showRcChangeEff: function() {
                GLB_eff.fadePlacePack[this.block.size].at(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @override
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @param {Building} b_f
             * @param {Payload} pay
             * @return {boolean}
             */
            ex_acceptPay: function thisFun(b_f, pay) {
                if(pay == null) return false;
                let ct = pay.content();
                if(this.delegee.blk$useAutoSelection && this.delegee.rc.keyPayHeaderMap != null && ct !== this.delegee.keyCt && b_f !== this && this.delegee.rc.keyPayHeaderMap.containsKey(ct)) {
                    this.delegee.keyCt = ct;
                };
                return thisFun.funPrev.apply(this, arguments);
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 2,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @param {string} nameCt
             * @return {number}
             */
            ex_getPayConsAmt: function(nameCt) {
                return this.delegee.rc.payi.read(nameCt, 0);
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberOf INTF_B_recipeHandler
             * @instance
             * @func
             * @param {string} nameCt
             * @return {number}
             */
            ex_getPayProdAmt: function(nameCt) {
                return this.delegee.rc.payo.read(nameCt, 0);
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * Override this method to change param update frequency.
             * <br> `LATER`
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @return {boolean}
             */
            ex_shouldUpdateRcParam: function() {
                return GLB_timer.effc;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @param {number} time
             * @return {number}
             */
            ex_calcProgInc: function(time) {
                return comp_ex_calcProgInc(this, time);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @return {number}
             */
            ex_calcRcEffcTarget: function() {
                return comp_ex_calcRcEffcTarget(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Override this method for dynamic chance to fail.
             * <br> `LATER`
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @return {number}
             */
            ex_calcFailP: function() {
                return this.delegee.rc.failP;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @return {Effect}
             */
            ex_getFailEff: function() {
                return tryVal(this.delegee.rc.failEff, this.block.delegee.failEff);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getBlkPol: function() {
                return MDL_pollution.getBlkPol(this.block) + this.delegee.rc.pol;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @param {UnlockableContent|null} ct
             * @return {number}
             * @lovecAttached
             */
            ex_getConsAmt: function(ct) {
                return ct == null ? 0.0 : tryVal(this.delegee.consTmpObj[ct.name], 0.0);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @memberof INTF_B_recipeHandler
             * @instance
             * @func
             * @param {UnlockableContent|null} ct
             * @return {number}
             * @lovecAttached
             */
            ex_getProdAmt: function(ct) {
                return ct == null ? 0.0 : tryVal(this.delegee.prodTmpObj[ct.name], 0.0);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_recipeHandler
             * @instance
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        wr.str(this.delegee.rcHeader);
                        wr.bool(this.delegee.hasStopped);
                        wr.f(this.delegee.erekirHeatO);
                    },
                    rd => {
                        this.delegee.rcHeader = rd.str();
                        this.delegee.hasStopped = rd.bool();
                        if(this.delegee.LCReviSub >= 1) {
                            this.delegee.erekirHeatO = rd.f();
                        };
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        })
        .extendInterface(PARENT[1], "INTF_B_recipeHandler"),


    ];
