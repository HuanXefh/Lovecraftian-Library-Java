/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const INTF = require("lovec/temp/intf/INTF_BLK_payloadBlock");


  /* <---------- auxiliary ----------> */


  const STOP_TIME = 300.0;


  let
    i,
    iCap,
    j,
    jCap,
    tmp,
    tmp1,
    amt,
    p,
    cond,
    val,
    tmpVal,
    scl,
    inc,
    rcMdl,
    header;


  function checkSelectedUnloader(b) {
    // Unloaders must be configured, otherwise auto-selection will break
    return b.block instanceof Unloader ?
      b.sortItem != null :
        b.block instanceof DirectionalUnloader ?
          b.unloadItem != null :
          true;
  };


  /* <---------- component ----------> */


  function comp_init(blk) {
    // Have to keep these to prevent crash on specific client sides like MindustryX
    blk.outputItems = [];
    blk.outputLiquids = [];

    MDL_event._c_onLoad(() => {
      blk.outputsLiquid = MDL_recipe._hasAnyOutput_liq(blk.rcMdl, false);
      blk.hasConsumers = true;

      blk.isErekirHeatConsumer = MDL_recipe._hasErekirHeatInput(blk.rcMdl);
      blk.isErekirHeatProducer = MDL_recipe._hasErekirHeatOutput(blk.rcMdl);
      if(blk.isErekirHeatConsumer && blk.isErekirHeatProducer) {
        console.warn("[LOVEC] Block ${1} is both heat consumer and producer, which can lead to broken heat calculation!".format(blk.name.color(Pal.accent)));
      };

      Core.app.post(() => MDL_recipe.initRc(blk.rcMdl, blk));
    });
  };


  function comp_setBars(blk) {
    // Flashing liquid bar bug in Multi-Crafter Lib
    blk.removeBar("liquid");

    blk.addBar("lovec-prog", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.progress.perc(0))),
      prov(() => Pal.ammo),
      () => Mathf.clamp(b.progress, 0.0, 1.0),
    ));

    // Liquid bars are defined in `b.displayBars` for dynamic amount of bars
  };


  function comp_created(b) {
    b.useAutoSelection = b.block.delegee.useAutoSelection;

    Time.run(0.0, () => {
      rcMdl = b.block.delegee.rcMdl;
      if(MDL_recipe._hasHeader(rcMdl, b.rcHeader)) {
        b.ex_updateRcParam(rcMdl, b.rcHeader, true);
      } else {
        header = MDL_recipe._firstHeader(rcMdl);
        b.ex_updateRcParam(rcMdl, header, true);
        b.rcHeader = header;
      };

      // Without this consumption is bugged
      b.ex_resetRcParam();
    });
  };


  function comp_updateTile(b) {
    if(PARAM.UPDATE_SUPPRESSED || DEBUG.skipRcUpdate) return;

    // Change recipe for auto-selection if key content is changed
    if(b.useAutoSelection && b.keyCt != null && b.lastKeyCt !== b.keyCt) {
      b.lastKeyCt = b.keyCt;
      header = (
        b.keyCt instanceof Item ?
          b.keyItmHeaderMap :
          b.keyCt instanceof Liquid ?
            b.keyFldHeaderMap :
            b.keyPayHeaderMap
      ).get(b.keyCt);
      if(header != null) {
        b.configure(header);
      };
    };

    b.ex_updateRcParam(b.block.delegee.rcMdl, b.rcHeader, false);
    if(b.scrTup != null) b.ex_onRcUpdate();
    b.hasStopped = b.stopTimeCur > STOP_TIME;

    // Update Erekir heat
    if(b.erekirHeatReq > 0.0) {
      b.erekirHeatI = b.calculateHeat(b.erekirSideHeats);
      b.erekirHeatEffc = Mathf.clamp(b.erekirHeatI / b.erekirHeatReq)
    };
    if(b.erekirHeatProd > 0.0) {
      b.erekirHeatO = Mathf.approachDelta(b.erekirHeatO, b.erekirHeatProd * b.efficiency, b.block.delegee.erekirHeatWarmupRate * b.delta());
    };

    if(b.efficiency < 0.0001 || !b.shouldConsume()) {
      // Crafter is inactive
      b.warmup = Mathf.approachDelta(b.warmup, 0.0, b.block.warmupSpeed);
      if(b.hasRun) {
        b.stopTimeCur = b.warmup < 0.1 ?
          (b.stopTimeCur + Time.delta) :
          0.0;
      };
    } else {
      // Crafter is active
      b.warmup = Mathf.approachDelta(b.warmup, b.warmupTarget(), b.block.warmupSpeed);
      b.progress += b.lastProgInc * b.warmup;
      if(b.warmup > 0.9) {
        b.hasRun = true;
        b.stopTimeCur = b.efficiency < 0.3 ?
          (b.stopTimeCur + Time.delta) :
          0.0;
      };
      if(b.progress >= 1.0) {
        b.progress %= 1.0;
        b.craft();
      };

      FRAG_recipe.produce_liq(b, b.lastLiqProgInc, b.rcTimeScl);
      FRAG_recipe.consume_liq(b, b.lastLiqProgInc, b.rcTimeScl);
      if(Mathf.chanceDelta(b.block.updateEffectChance * b.warmup)) {
        MDL_effect.showAround(b.x, b.y, b.block.updateEffect, b.block.size * 0.5 * Vars.tilesize, 0.0);
      };
      b.ex_onRcRun();
      if(b.hasStopped) {
        b.ex_onRcStoppedRun();
      };
    };

    b.totalProgress += b.warmup * b.edelta();
    if(!b.block.delegee.disableDump) {
      FRAG_recipe.dump(b, b.dumpTup);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    // Efficiency is overwritten
    b.efficiency = b.shouldConsume() && (b.block.consumesPower && b.power != null ? b.power.status > 0.01 : true) ?
      b.rcEffc :
      0.0;

    if(b.erekirHeatReq > 0.0) b.efficiency *= b.erekirHeatEffc;
    b.ex_postUpdateEfficiencyMultiplier();
    if(b.validTup != null && !b.validTup[0](b)) b.efficiency = 0.0;
  };


  function comp_acceptItem(b, b_f, itm) {
    if(b.items == null || b.items.get(itm) >= b.getMaximumAccepted(itm)) return false;
    if(b.useAutoSelection && b.keyItmHeaderMap != null && itm !== b.keyCt && b_f !== b && checkSelectedUnloader(b_f) && b.keyItmHeaderMap.containsKey(itm) && !FRAG_recipe._hasOutput(itm, b.co, b.bo, b.fo)) {
      b.keyCt = itm;
    };

    if(b.itmAcceptCacheArr[itm.id] == null) {
      b.itmAcceptCacheArr[itm.id] = FRAG_recipe._hasInput(itm, b.ci, b.bi, b.aux, b.opt);
    };

    return b.itmAcceptCacheArr[itm.id];
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(b.liquids == null || b.liquids.get(liq) >= b.block.liquidCapacity) return false;
    if(b.useAutoSelection && b.keyFldHeaderMap != null && liq !== b.keyCt && b_f !== b && b.keyFldHeaderMap.containsKey(liq) && !FRAG_recipe._hasOutput(liq, b.co, b.bo, b.fo)) {
      b.keyCt = liq;
    };

    if(b.liqAcceptCacheArr[liq.id] == null) {
      b.liqAcceptCacheArr[liq.id] = FRAG_recipe._hasInput(liq, b.ci, b.bi, b.aux, b.opt);
    };

    return b.liqAcceptCacheArr[liq.id];
  };


  function comp_craft(b) {
    FRAG_recipe.produce_itm(b, b.ex_calcFailP());
    FRAG_recipe.consume_itm(b);
    MDL_effect.showAt(b.x, b.y, b.block.craftEffect, 0.0);

    if(b.hasPayInput) {
      i = 0;
      iCap = b.payi.iCap();
      while(i < iCap) {
        Object.mapIncre(b.payReqObj, b.payi[i], -b.payi[i + 1]);
        i += 2;
      };
    };
    if(b.hasPayOutput) {
      i = 0;
      iCap = b.payo.iCap();
      while(i < iCap) {
        Object.mapIncre(b.payStockObj, b.payo[i], b.payo[i + 1]);
        i += 2;
      };
    };

    b.ex_onRcCraft();
  };


  const comp_displayConsumption = function thisFun(b, tb) {
    tb.left();

    // BI
    i = 0;
    iCap = b.bi.iCap();
    while(i < iCap) {
      tmp = b.bi[i];
      if(!(tmp instanceof Array)) {
        amt = b.bi[i + 1];
        if(amt > 0) MDL_table.__reqRs(tb, b, tmp, amt);
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
          MDL_table.__reqMultiCt(tb, b, thisFun.tmpCts, thisFun.tmpAmts);
        };
      };
      i += 3;
    };

    // CI
    i = 0;
    iCap = b.ci.iCap();
    while(i < iCap) {
      tmp = b.ci[i];
      if(!(tmp instanceof Array)) {
        if(b.ci[i + 1] > 0.0) MDL_table.__reqRs(tb, b, tmp);
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
          MDL_table.__reqMultiCt(tb, b, thisFun.tmpCts);
        };
      };
      i += 2;
    };

    // AUX
    i = 0;
    iCap = b.aux.iCap();
    while(i < iCap) {
      tmp = b.aux[i];
      if(b.aux[i + 1] > 0.0) {
        MDL_table.__reqRs(tb, b, tmp);
      };
      i += 2;
    };

    // OPT
    if(b.reqOpt) {
      thisFun.tmpCts.clear();
      thisFun.tmpAmts.clear();
      i = 0;
      iCap = b.opt.iCap();
      while(i < iCap) {
        tmp = b.opt[i];
        amt = b.opt[i + 1];
        if(amt > 0) {
          thisFun.tmpCts.push(tmp);
          thisFun.tmpAmts.push(amt);
        };
        i += 4;
      };
      if(thisFun.tmpCts.length > 0) {
        MDL_table.__reqMultiCt(tb, b, thisFun.tmpCts, thisFun.tmpAmts);
      };
    };

    // PAYI
    if(b.hasPayInput) {
      i = 0;
      iCap = b.payi.iCap();
      while(i < iCap) {
        tmp = MDL_content._ct(b.payi[i], null, true);
        amt = b.payi[i + 1];
        if(amt > 0) {
          MDL_table.__reqCt(tb, tmp, amt, ct => tryVal(b.payReqObj[ct.name], 0))
        };
        i += 2;
      };
    };
  }
  .setProp({
    tmpCts: [],
    tmpAmts: [],
  });


  const comp_displayBars = function thisFun(b, tb) {
    if(b.erekirHeatReq > 0.0) {
      tb.add(new Bar(
        prov(() => Core.bundle.format("bar.heatpercent", (b.erekirHeatI + 0.01).roundFixed(1), (b.erekirHeatEffc * 100.0 + 0.01).roundFixed(1))),
        prov(() => Pal.lightOrange),
        () => Mathf.clamp(b.erekirHeatI / b.erekirHeatReq),
      ));
      tb.row();
    };
    if(b.erekirHeatProd > 0.0) {
      tb.add(new Bar(
        "bar.heat",
        Pal.lightOrange,
        () => Mathf.clamp(b.erekirHeatO / b.erekirHeatProd),
      ));
      tb.row();
    };

    if(b.attr != null) {
      tb.add(new Bar(
        prov(() => Core.bundle.format("bar.efficiency", Math.round(b.attrEffc * 100.0))),
        prov(() => Pal.lightOrange),
        () => Mathf.clamp(b.attrEffc),
      )).growX();
      tb.row();
    };

    FRAG_recipe._inputLiqs(thisFun.tmpArr, b.ci, b.bi, b.aux);
    FRAG_recipe._outputLiqs(thisFun.tmpArr1, b.co, b.bo);

    thisFun.addedLiqs.clear();
    thisFun.tmpArr.forEachFast(liq => {
      if(thisFun.addedLiqs.includes(liq)) return;
      thisFun.addLiqBar(tb, b, liq);
      thisFun.addedLiqs.push(liq);
    });
    thisFun.tmpArr1.forEachFast(liq => {
      if(thisFun.addedLiqs.includes(liq)) return;
      thisFun.addLiqBar(tb, b, liq);
      thisFun.addedLiqs.push(liq);
    });
  }
  .setProp({
    tmpArr: [],
    tmpArr1: [],
    addedLiqs: [],
    addLiqBar: (tb, b, liq) => {
      tb.add(new Bar(
        liq.localizedName,
        tryVal(liq.barColor, liq.color),
        () => MDL_cond._isAuxiliaryFluid(liq) && !MDL_cond._isNoCapAuxiliaryFluid(liq) ? Mathf.clamp(b.liquids.get(liq) / VAR.param.auxCap) : (b.liquids.get(liq) / b.block.liquidCapacity),
      )).growX();
      tb.row();
    },
  });


  function comp_drawSelect(b) {
    LCDraw.contentIcon(b.x, b.y, Vars.content.byName(b.rcIconNm), b.block.size, 0.75);
  };


  function comp_drawStatus(b) {
    if(!b.block.enableDrawStatus) return;
    MDL_draw._reg_blkStatus(b.x, b.y, b.block.size, b.status().color);
  };


  function comp_ex_onRcParamUpdate(b) {
    b.rcEffc = b.ex_calcRcEffcTg();
    b.lastProgInc = b.ex_calcProgInc(b.block.craftTime);
    b.lastLiqProgInc = b.ex_calcProgInc(1.0);
    b.lastCanAdd = FRAG_recipe._canAdd(b);
    b.dumpTup = FRAG_recipe._dumpTup(b.dumpTup, b);

    b.ex_updateAttrEffc();
  };


  function comp_ex_updateAttrEffc(b) {
    b.attrEffc = b.attr == null ?
      1.0 :
      Mathf.clamp(
        MATH_interp.lerp(
          0.0,
          1.0,
          b.attrSum + b.attr.env(),
          b.attrMin,
          b.attrMax,
        ) * b.attrBoostScl,
        0.0,
        b.attrBoostCap,
      );
  };


  function comp_ex_updateRcParam(b, rcMdl, rcHeader, forceLoad) {
    if(rcHeader !== b.rcHeader || forceLoad) {
      b.ex_loadRcParam(rcMdl, rcHeader);
    };
    if(b.ex_shouldUpdateRcParam()) {
      b.ex_onRcParamUpdate();
    };
  };


  function comp_ex_resetRcParam(b) {
    b.itmAcceptCacheArr.clear();
    b.liqAcceptCacheArr.clear();
    HUD_HANDLER.forceUpdateBlockFrag();

    if(!PARAM.UPDATE_SUPPRESSED) {
      b.progress = 0.0;
      if(b.liquids != null) b.liquids.clear();
    };
    b.efficiency = 0.0;
    b.lastOptEffc = 1.0;
    b.rcEffcWinMean.clear();

    b.proximity.each(ob => {
      ob.onProximityUpdate();
    });
  };


  function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
    b.ci = MDL_recipe._ci(b.ci, rcMdl, rcHeader);
    b.bi = MDL_recipe._bi(b.bi, rcMdl, rcHeader);
    b.aux = MDL_recipe._aux(b.aux, rcMdl, rcHeader);
    b.reqOpt = MDL_recipe._reqOpt(rcMdl, rcHeader);
    b.opt = MDL_recipe._opt(b.opt, rcMdl, rcHeader);
    b.payi = MDL_recipe._payi(b.payi, rcMdl, rcHeader);
    b.co = MDL_recipe._co(b.co, rcMdl, rcHeader);
    b.bo = MDL_recipe._bo(b.bo, rcMdl, rcHeader);
    b.failP = MDL_recipe._failP(rcMdl, rcHeader);
    b.fo = MDL_recipe._fo(b.fo, rcMdl, rcHeader);
    b.payo = MDL_recipe._payo(b.payo, rcMdl, rcHeader);
    b.rcIconNm = MDL_recipe._iconNm(rcMdl, rcHeader);
    b.rcTimeScl = MDL_recipe._timeScl(rcMdl, rcHeader);
    b.rcPol = MDL_recipe._pol(rcMdl, rcHeader);
    b.ignoreItemFullness = MDL_recipe._ignoreItemFullness(rcMdl, rcHeader);
    b.erekirHeatReq = MDL_recipe._erekirHeatReq(rcMdl, rcHeader);
    b.erekirHeatProd = MDL_recipe._erekirHeatProd(rcMdl, rcHeader);

    let nmAttr = MDL_recipe._attr(rcMdl, rcHeader);
    b.attr = nmAttr == null ?
      null :
      Attribute.getOrNull(nmAttr);

    b.attrMin = MDL_recipe._attrMin(rcMdl, rcHeader) * Math.pow(b.block.size, 2);
    b.attrMax = MDL_recipe._attrMax(rcMdl, rcHeader) * Math.pow(b.block.size, 2);
    b.attrBoostScl = MDL_recipe._attrBoostScl(rcMdl, rcHeader);
    b.attrBoostCap = MDL_recipe._attrBoostCap(rcMdl, rcHeader);
    b.failEff = MDL_recipe._failEff(rcMdl, rcHeader);
    b.validTup = MDL_recipe._validTup(b.validTup, rcMdl, rcHeader);
    b.scrTup = MDL_recipe._scrTup(b.scrTup, rcMdl, rcHeader);
    b.rcDrawer = MDL_recipe._drawer(rcMdl, rcHeader);

    if(b.useAutoSelection) {
      b.keyItmHeaderMap = MDL_recipe._keyCtHeaderMap(b.keyItmHeaderMap, rcMdl, RecipeKeyResourceModes.ITEM);
      b.keyFldHeaderMap = MDL_recipe._keyCtHeaderMap(b.keyFldHeaderMap, rcMdl, RecipeKeyResourceModes.FLUID);
      b.keyPayHeaderMap = MDL_recipe._keyCtHeaderMap(b.keyPayHeaderMap, rcMdl, RecipeKeyResourceModes.PAYLOAD);
    };

    Time.run(0.0, () => {
      b.hasPayInput = FRAG_recipe._hasInput_pay(b.payi);
      b.hasPayOutput = FRAG_recipe._hasOutput_pay(b.payo);
      if(b.hasPayInput) {
        b.payi.forEachRow(2, (tmp, amt) => {
          if(amt > 0 && b.payReqObj[tmp] == null) {
            b.payReqObj[tmp] = 0;
          };
        });
      };

      b.attrSum = MDL_attr._sumRect(b.tile, 0, b.block.size, b.attr, AttrModes.FLOOR);
      b.ex_updateAttrEffc();

      Object.clear(b.consTmpObj);
      Object.clear(b.prodTmpObj);
    });
  };


  function comp_ex_calcProgInc(b, time) {
    if(b.block.ignoreLiquidFullness) {
      inc = b.edelta() / time / b.rcTimeScl;
    } else {
      val = 1.0;
      scl = 1.0;
      cond = false;
      iCap = b.co.iCap();
      if(b.liquids != null && iCap > 0) {
        val = 0.0;
        i = 0;
        while(i < iCap) {
          tmp = b.co[i];
          amt = b.co[i + 1];
          tmpVal = amt < 0.0001 ? 1.0 : (b.block.liquidCapacity - b.liquids.get(tmp)) / (amt * b.edelta());
          val = Math.max(val, tmpVal);
          if(!MDL_cond._isAuxiliaryFluid(tmp)) {
            scl = Math.min(scl, tmpVal);
          };
          cond = true;
          i += 2;
        };
      };
      if(!cond) val = 1.0;
      inc = b.edelta() / time * (b.block.dumpExtraLiquid ? Math.min(val, 1.0) : scl) / b.rcTimeScl;
    };

    return isNaN(inc) ?
      0.0 :
      inc;
  };


  function comp_ex_calcRcEffcTg(b) {
    b.rcEffcWinMean.add(FRAG_recipe._effc(b));
    return (b.rcEffcWinMean.hasEnoughData() ? b.rcEffcWinMean.mean() : b.rcEffcWinMean.latest()) * b.attrEffc;
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


      __PARAM_OBJ_SETTER__: (() => ({


        /**
         * <PARAM>: Recipe module (.js file) for this block (as string), usually the block name without mod name. The file should be located at "scripts/auxFi/rc".
         * @memberof INTF_BLK_recipeHandler
         * @instance
         */
        rcMdl: null,
        /**
         * <PARAM>: Mod (as string) to search module from.
         * @memberof INTF_BLK_recipeHandler
         * @instance
         */
        rcSourceMod: null,
        /**
         * <PARAM>: Warmup rate of Erekir heat output.
         * @memberof INTF_BLK_recipeHandler
         * @instance
         */
        erekirHeatWarmupRate: 0.05,
        /**
         * <PARAM>: If true, this crafter will select recipe automatically.
         * @memberof INTF_BLK_recipeHandler
         * @instance
         */
        useAutoSelection: false,
        /**
         * <PARAM>: Whether this block does not actively dump resources.
         * @memberof INTF_BLK_recipeHandler
         * @instance
         */
        disableDump: false,
        /**
         * <PARAM>: Effect used when this crafter fails its recipe.
         * @memberof INTF_BLK_recipeHandler
         * @instance
         */
        failEff: EFF.rcFailSmog,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Whether this block consumes Erekir heat.
         * @memberof INTF_BLK_recipeHandler
         * @instance
         */
        isErekirHeatConsumer: false,
        /**
         * <INTERNAL>: Whether this block produces Erekir heat.
         * @memberof INTF_BLK_recipeHandler
         * @instance
         */
        isErekirHeatProducer: false,


      }))
      .setProp({
        mergeMode: "object",
      }),
      __PARAM_PARSER_SETTER__: (() => [
        "rcMdl", function(val) {
          if(val == null) ERROR_HANDLER.throw("nullArgument", "rcMdl");
          let nmMod = this.rcSourceMod;
          if(nmMod == null) ERROR_HANDLER.throw("nullArgument", "rcSourceMod");

          return MDL_recipe._rcMdl(nmMod, val);
        },
      ])
      .setProp({
        mergeMode: "array",
      }),


      init: function() {
        comp_init(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      consumesItem: function(itm) {
        return MDL_recipe._hasInput(itm, this.rcMdl);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      consumesLiquid: function(liq) {
        return MDL_recipe._hasInput(liq, this.rcMdl);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      outputsItems: function() {
        return MDL_recipe._hasAnyOutput_itm(this.rcMdl);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      })
      .setCache(),


    }).extendInterface(INTF[0], "INTF_BLK_recipeHandler"),


    /**
     * @class INTF_B_recipeHandler
     * @extends INTF_B_payloadBlock
     */
    new CLS_interface({


      __PARAM_OBJ_SETTER__: (() => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Recipe selected.
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        rcHeader: "",
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        ci: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        bi: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        aux: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        reqOpt: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        opt: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        payi: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        co: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        bo: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        failP: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        fo: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        payo: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        rcIconNm: "error",
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        rcTimeScl: 1.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        rcPol: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        ignoreItemFullness: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        erekirHeatReq: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        erekirHeatProd: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        attr: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        attrMin: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        attrMax: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        attrBoostScl: 1.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        attrBoostCap: 1.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        rcDrawer: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        validTup: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        scrTup: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        dumpTup: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        rcEffc: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        rcEffcWinMean: prov(() => new WindowedMean(5)),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        erekirHeatI: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        erekirHeatO: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        erekirSideHeats: prov(() => Array.newFArr(4)),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        erekirHeatEffc: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        attrSum: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        attrEffc: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        lastProgInc: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        lastLiqProgInc: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        lastCanAdd: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        lastOptEffc: 1.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        useAutoSelection: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        keyItmHeaderMap: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        keyFldHeaderMap: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        keyPayHeaderMap: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        keyCt: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        lastKeyCt: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        itmAcceptCacheArr: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        liqAcceptCacheArr: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        consTmpObj: prov(() => ({})),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        prodTmpObj: prov(() => ({})),
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        hasRun: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        hasStopped: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        stopTimeCur: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        failEff: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        blk$isErekirHeatConsumer: "!REPLACE",
        /**
         * <INTERNAL>
         * @memberof INTF_B_recipeHandler
         * @instance
         */
        blk$isErekirHeatProducer: "!REPLACE",


      }))
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


      acceptItem: function(b_f, itm) {
        return comp_acceptItem(this, b_f, itm);
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
        return this.enabled && this.lastCanAdd && (this.erekirHeatReq <= 0.0 || this.erekirHeatI > 0.0);
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
        return this.erekirHeatReq <= 0.0 ? 1.0 : Mathf.clamp(this.erekirHeatI / this.erekirHeatReq);
      }
      .setProp({
        noSuper: true,
        mergeMode: function(valPrev, val) {
          return val * valPrev;
        },
      }),


      heatRequirement: function() {
        return this.erekirHeatReq;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      heat: function() {
        return this.erekirHeatO;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      sideHeat: function() {
        return this.erekirSideHeats;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      heatFrac: function() {
        return this.erekirHeatO / this.erekirHeatProd;
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
        if(this.scrTup != null) this.scrTup[0](this);
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
        if(this.scrTup != null) this.scrTup[1](this);
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
        if(this.scrTup != null) this.scrTup[3](this);
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
        if(this.scrTup != null) this.scrTup[2](this);
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
        if(this.scrTup != null) this.scrTup[4](this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Multi-crafter efficiency should be updated here, as it's been reset.
       * `b.updateEfficiencyMultiplier` is final now and cannot be mixed.
       * <br> <LATER>
       * @memberof INTF_B_recipeHandler
       * @instance
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
       * @return {void}
       */
      ex_showRcChangeEff: function() {
        EFF.placeFadePack[this.block.size].at(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof INTF_B_recipeHandler
       * @instance
       * @param {Building} b_f
       * @param {Payload} pay
       * @return {boolean}
       */
      ex_acceptPay: function thisFun(b_f, pay) {
        if(pay == null) return false;
        let ct = pay.content();
        if(this.useAutoSelection && this.keyPayHeaderMap != null && ct !== this.keyCt && b_f !== this && this.keyPayHeaderMap.containsKey(ct)) {
          this.keyCt = ct;
        };

        return thisFun.funPrev.apply(this, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 2,
      }),


      /**
       * @override
       * @memberof INTF_B_recipeHandler
       * @instance
       * @param {string} nmCt
       * @return {number}
       */
      ex_getPayConsAmt: function(nmCt) {
        return this.payi.read(nmCt, 0);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof INTF_B_recipeHandler
       * @instance
       * @param {string} nmCt
       * @return {number}
       */
      ex_getPayProdAmt: function(nmCt) {
        return this.payo.read(nmCt, 0);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_recipeHandler
       * @instance
       * @return {boolean}
       */
      ex_shouldUpdateRcParam: function() {
        return TIMER.effc;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_recipeHandler
       * @instance
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
       * @return {number}
       */
      ex_calcRcEffcTg: function() {
        return comp_ex_calcRcEffcTg(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Override this method for dynamic chance to fail.
       * @memberof INTF_B_recipeHandler
       * @instance
       * @return {number}
       */
      ex_calcFailP: function() {
        return this.failP;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_recipeHandler
       * @instance
       * @return {Effect}
       */
      ex_getFailEff: function() {
        return tryVal(this.failEff, this.block.delegee.failEff);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_recipeHandler
       * @instance
       * @return {number}
       */
      ex_getBlkPol: function() {
        return MDL_pollution._blkPol(this.block) + this.rcPol;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_recipeHandler
       * @instance
       * @param {UnlockableContent|null} ct
       * @return {number}
       */
      ex_getConsAmt: function(ct) {
        return ct == null ? 0.0 : tryVal(this.consTmpObj[ct.name], 0.0);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_recipeHandler
       * @instance
       * @param {UnlockableContent|null} ct
       * @return {number}
       */
      ex_getProdAmt: function(ct) {
        return ct == null ? 0.0 : tryVal(this.prodTmpObj[ct.name], 0.0);
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
            wr.str(this.rcHeader);
            wr.bool(this.hasStopped);
            wr.f(this.erekirHeatO);
          },

          rd => {
            this.rcHeader = rd.str();
            this.hasStopped = rd.bool();

            if(this.LCReviSub >= 1) {
              this.erekirHeatO = rd.f();
            };
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }).extendInterface(INTF[1], "INTF_B_recipeHandler"),


  ];
