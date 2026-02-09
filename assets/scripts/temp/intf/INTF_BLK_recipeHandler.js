/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles basic multi-crafter methods, should be implemented after a recipe selector.
   * Does not affect stats and recipe selection.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const INTF = require("lovec/temp/intf/INTF_BLK_payloadBlock");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");


  const MATH_interp = require("lovec/math/MATH_interp");


  const FRAG_recipe = require("lovec/frag/FRAG_recipe");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    // Have to keep these to prevent crash on specific client sides like MindustryX
    blk.outputItems = [];
    blk.outputLiquids = [];

    MDL_event._c_onLoad(() => {
      blk.outputsLiquid = MDL_recipe._hasAnyOutput_liq(blk.rcMdl, false);
      blk.hasConsumers = true;

      Core.app.post(() => MDL_recipe.initRc(blk.rcMdl, blk));
    });
  };


  function comp_setBars(blk) {
    blk.removeBar("liquid");                // Flashing liquid bar bug in Multi-Crafter Lib

    blk.addBar("lovec-prog", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.progress.perc(0))),
      prov(() => Pal.ammo),
      () => Mathf.clamp(b.progress, 0.0, 1.0),
    ));

    // Liquid bars are defined in {b.displayBars} for dynamic amount of bars
  };


  function comp_created(b) {
    Time.run(1.0, () => {
      let rcMdl = b.block.delegee.rcMdl;
      if(MDL_recipe._hasHeader(rcMdl, b.rcHeader)) {
        b.ex_updateRcParam(rcMdl, b.rcHeader, true);
      } else {
        let tmpHeader = MDL_recipe._firstHeader(rcMdl);
        b.ex_updateRcParam(rcMdl, tmpHeader, true);
        b.rcHeader = tmpHeader;
      };

      // Without this consumption is bugged
      b.ex_resetRcParam();
    });
  };


  function comp_updateTile(b) {
    if(PARAM.updateSuppressed) return;

    b.ex_updateRcParam(b.block.delegee.rcMdl, b.rcHeader, false);
    if(b.scrTup != null) b.ex_onRcUpdate();

    if(b.efficiency < 0.0001 || !b.shouldConsume()) {
      b.warmup = Mathf.approachDelta(b.warmup, 0.0, b.block.warmupSpeed);
      if(b.warmup < 0.1 && b.hasRun) b.hasStopped = true;
    } else {
      b.warmup = Mathf.approachDelta(b.warmup, b.warmupTarget(), b.block.warmupSpeed);
      b.progress += b.lastProgInc * b.warmup;
      if(b.warmup > 0.9) {
        b.hasRun = true;
        b.hasStopped = b.efficiency < 0.4;
      };
      if(b.progress >= 1.0) {
        b.progress %= 1.0;
        b.craft();
      };

      FRAG_recipe.produce_liq(b, b.lastLiqProgInc, b.rcTimeScl, b.co);
      FRAG_recipe.consume_liq(b, b.lastLiqProgInc, b.rcTimeScl, b.ci, b.aux);
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
      FRAG_recipe.dump(b, b.co, b.dumpTup);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency = b.rcEffc;
    b.ex_postUpdateEfficiencyMultiplier();
    if(b.validTup != null && !b.validTup[0](b)) b.efficiency = 0.0;
  };


  function comp_acceptItem(b, b_f, itm) {
    if(b.items == null) return false;
    if(b.items.get(itm) >= b.getMaximumAccepted(itm)) return false;
    if(b.itmAcceptCacheMap.containsKey(itm)) return b.itmAcceptCacheMap.get(itm);

    let cond = FRAG_recipe._hasInput(itm, b.ci, b.bi, b.aux, b.opt);
    b.itmAcceptCacheMap.put(itm, cond);

    return cond;
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(b.liquids == null) return false;
    if(b.liquids.get(liq) >= b.block.liquidCapacity) return false;
    if(b.liqAcceptCacheMap.containsKey(liq)) return b.liqAcceptCacheMap.get(liq);

    let cond = FRAG_recipe._hasInput(liq, b.ci, b.bi, b.aux, b.opt);
    b.liqAcceptCacheMap.put(liq, cond);

    return cond;
  };


  function comp_craft(b) {
    FRAG_recipe.produce_itm(b, b.bo, b.ex_calcFailP(), b.fo);
    FRAG_recipe.consume_itm(b, b.bi, b.opt);
    MDL_effect.showAt(b.x, b.y, b.block.craftEffect, 0.0);

    if(b.hasPayInput) {
      let i = 0, iCap = b.payi.iCap();
      while(i < iCap) {
        b.payReqObj[b.payi[i]] = tryVal(b.payReqObj[b.payi[i]], 0) - b.payi[i + 1];
        i += 2;
      };
    };
    if(b.hasPayOutput) {
      let i = 0, iCap = b.payo.iCap();
      while(i < iCap) {
        b.payStockObj[b.payo[i]] = tryVal(b.payStockObj[b.payo[i]], 0) + b.payo[i + 1];
        i += 2;
      };
    };

    b.ex_onRcCraft();
  };


  const comp_displayConsumption = function thisFun(b, tb) {
    tb.left();

    let i, iCap, j, jCap;

    // BI
    i = 0, iCap = b.bi.iCap();
    while(i < iCap) {
      let tmp = b.bi[i];
      if(!(tmp instanceof Array)) {
        let amt = b.bi[i + 1];
        MDL_table.__reqRs(tb, b, tmp, amt);
      } else {
        thisFun.tmpArr.clear();
        j = 0, jCap = tmp.iCap();
        while(j < jCap) {
          let tmp1 = tmp[j];
          thisFun.tmpArr.push(tmp1);
          j += 3;
        };
        MDL_table.__reqMultiRs(tb, b, thisFun.tmpArr);
      };
      i += 3;
    };

    // CI
    i = 0, iCap = b.ci.iCap();
    while(i < iCap) {
      let tmp = b.ci[i];
      MDL_table.__reqRs(tb, b, tmp);
      i += 2;
    };

    // AUX
    i = 0, iCap = b.aux.iCap();
    while(i < iCap) {
      let tmp = b.aux[i];
      MDL_table.__reqRs(tb, b, tmp);
      i += 2;
    };

    // OPT
    if(b.reqOpt) {
      thisFun.tmpArr.clear();
      i = 0, iCap = b.opt.iCap();
      while(i < iCap) {
        let tmp = b.opt[i];
        thisFun.tmpArr.push(tmp);
        i += 4;
      };
      MDL_table.__reqMultiRs(tb, b, thisFun.tmpArr);
    };

    // PAYI
    if(b.hasPayInput) {
      i = 0, iCap = b.payi.iCap();
      while(i < iCap) {
        let tmp = MDL_content._ct(b.payi[i], null, true);
        let amt = b.payi[i + 1];
        MDL_table.__reqCt(tb, tmp, amt, () => tryVal(b.payReqObj[tmp.name], 0));
        i += 2;
      };
    };
  }
  .setProp({
    tmpArr: [],
  });


  const comp_displayBars = function thisFun(b, tb) {
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

    thisFun.tmpArr.forEachFast(liq => thisFun.addLiqBar(tb, b, liq));
    thisFun.tmpArr1.forEachFast(liq => thisFun.addLiqBar(tb, b, liq));
  }
  .setProp({
    tmpArr: [],
    tmpArr1: [],
    addLiqBar: (tb, b, liq) => {
      tb.add(new Bar(
        liq.localizedName,
        tryVal(liq.barColor, liq.color),
        () => MDL_cond._isAuxiliaryFluid(liq) && !MDL_cond._isNoCapAuxiliaryFluid(liq) ? Mathf.clamp(b.liquids.get(liq) / VAR.ct_auxCap) : (b.liquids.get(liq) / b.block.liquidCapacity),
      )).growX();
      tb.row();
    },
  });


  function comp_drawSelect(b) {
    LCDraw.contentIcon(b.x, b.y, Vars.content.byName(b.rcIconNm), b.block.size);
  };


  function comp_drawStatus(b) {
    if(!b.block.enableDrawStatus) return;
    MDL_draw._reg_blkStatus(b.x, b.y, b.block.size, b.status().color);
  };


  function comp_ex_onRcParamUpdate(b) {
    b.rcEffc = b.ex_calcRcEffcTg();
    b.lastProgInc = b.ex_calcProgInc(b.block.craftTime);
    b.lastLiqProgInc = b.ex_calcProgInc(1.0);
    b.lastCanAdd = FRAG_recipe._canAdd(b, b.ignoreItemFullness, b.co, b.bo, b.fo);
    b.dumpTup = FRAG_recipe._dumpTup(b, b.dumpTup, b.bo, b.fo);
  };


  function comp_ex_updateRcParam(b, rcMdl, rcHeader, forceLoad) {
    if(rcHeader !== b.rcHeader || forceLoad) {
      b.ex_loadRcParam(rcMdl, rcHeader);
    };
    if(b.ex_getTimerEffcState()) {
      b.ex_onRcParamUpdate();
    };
  };


  function comp_ex_resetRcParam(b) {
    b.itmAcceptCacheMap.clear();
    b.liqAcceptCacheMap.clear();
    HUD_HANDLER.placeFrag.forceUpdate();

    if(!PARAM.updateSuppressed) {
      b.progress = 0.0;
      if(b.liquids != null) b.liquids.clear();
    };
    b.efficiency = 0.0;

    b.proximity.each(ob => {
      ob.onProximityUpdate();
    });
  };


  function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
    b.ci = MDL_recipe._ci(rcMdl, rcHeader, b.ci);
    b.bi = MDL_recipe._bi(rcMdl, rcHeader, b.bi);
    b.aux = MDL_recipe._aux(rcMdl, rcHeader, b.aux);
    b.reqOpt = MDL_recipe._reqOpt(rcMdl, rcHeader);
    b.opt = MDL_recipe._opt(rcMdl, rcHeader, b.opt);
    b.payi = MDL_recipe._payi(rcMdl, rcHeader, b.payi);
    b.co = MDL_recipe._co(rcMdl, rcHeader, b.co);
    b.bo = MDL_recipe._bo(rcMdl, rcHeader, b.bo);
    b.failP = MDL_recipe._failP(rcMdl, rcHeader);
    b.fo = MDL_recipe._fo(rcMdl, rcHeader, b.fo);
    b.payo = MDL_recipe._payo(rcMdl, rcHeader, b.payo);
    b.rcIconNm = MDL_recipe._iconNm(rcMdl, rcHeader);
    b.rcTimeScl = MDL_recipe._timeScl(rcMdl, rcHeader);
    b.rcPol = MDL_recipe._pol(rcMdl, rcHeader);
    b.ignoreItemFullness = MDL_recipe._ignoreItemFullness(rcMdl, rcHeader);
    b.attr = (function(nmAttr) {return nmAttr == null ? null : Attribute.getOrNull(nmAttr)})(MDL_recipe._attr(rcMdl, rcHeader));
    b.attrMin = MDL_recipe._attrMin(rcMdl, rcHeader) * Math.pow(b.block.size, 2);
    b.attrMax = MDL_recipe._attrMax(rcMdl, rcHeader) * Math.pow(b.block.size, 2);
    b.attrBoostScl = MDL_recipe._attrBoostScl(rcMdl, rcHeader);
    b.attrBoostCap = MDL_recipe._attrBoostCap(rcMdl, rcHeader);
    b.validTup = MDL_recipe._validTup(rcMdl, rcHeader, b.validTup);
    b.scrTup = MDL_recipe._scrTup(rcMdl, rcHeader, b.scrTup);

    Time.run(1.0, () => {
      b.hasPayInput = FRAG_recipe._hasInput_pay(b.payi);
      b.hasPayOutput = FRAG_recipe._hasOutput_pay(b.payo);
      b.attrEffc = b.attr == null ?
        1.0 :
        Mathf.clamp(MATH_interp.lerp(0.0, 1.0, MDL_attr._sum_rect(b.tile, 0, b.block.size, b.attr, "floor"), b.attrMin, b.attrMax) * b.attrBoostScl, 0.0, b.attrBoostCap);
    });
  };


  function comp_ex_calcProgInc(b, time) {
    let inc = 1.0;
    if(b.block.ignoreLiquidFullness) {
      inc = b.edelta() / time / b.rcTimeScl;
    } else {
      let val = 1.0, scl = 1.0, hasLiquidOutput = false;
      let iCap = b.co.iCap();
      if(b.liquids != null && iCap > 0) {
        val = 0.0;
        let i = 0, liq, amt, tmpVal;
        while(i < iCap) {
          liq = b.co[i];
          amt = b.co[i + 1];
          tmpVal = (b.block.liquidCapacity - b.liquids.get(liq)) / (amt * b.edelta());
          val = Math.max(val, tmpVal);
          scl = Math.min(scl, tmpVal);
          hasLiquidOutput = true;
          i += 2;
        };
      };
      if(!hasLiquidOutput) val = 1.0;
      inc = b.edelta() / time * (b.block.dumpExtraLiquid ? Math.min(val, 1.0) : scl) / b.rcTimeScl;
    };

    return inc;
  };


  function comp_ex_calcRcEffcTg(b) {
    return FRAG_recipe._effc(b, b.ci, b.bi, b.aux, b.reqOpt, b.opt) * b.attrEffc;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: (() => ({
        // @PARAM: Recipe module for this block (as string), usually the block name without mod name prefix.
        rcMdl: null,
        // @PARAM: Mod to search module from (as string).
        rcSourceMod: null,
        // @PARAM: Whether this recipe block cannot actively dump resources.
        disableDump: false,
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


    }).extendInterface(INTF[0]),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: (() => ({
        rcHeader: "",
        ci: prov(() => []),
        bi: prov(() => []),
        aux: prov(() => []),
        reqOpt: false,
        opt: prov(() => []),
        payi: prov(() => []),
        co: prov(() => []),
        bo: prov(() => []),
        failP: 0.0,
        fo: prov(() => []),
        payo: prov(() => []),
        rcIconNm: "error",
        rcTimeScl: 1.0,
        rcPol: 0.0,
        ignoreItemFullness: false,
        attr: null,
        attrMin: 0.0,
        attrMax: 0.0,
        attrBoostScl: 1.0,
        attrBoostCap: 1.0,
        validTup: null,
        scrTup: null,
        dumpTup: null,
        rcEffc: 0.0,
        attrEffc: 0.0,
        lastProgInc: 0.0,
        lastLiqProgInc: 0.0,
        lastCanAdd: false,
        itmAcceptCacheMap: prov(() => new ObjectMap()),
        liqAcceptCacheMap: prov(() => new ObjectMap()),
        hasRun: false,
        hasStopped: false,
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
        override: true,
      }),


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      shouldConsume: function() {
        return this.enabled && this.lastCanAdd;
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


      /* ----------------------------------------
      * NOTE:
      *
      * Called frequently but not every frame, updates some universal parameters.
      * ---------------------------------------- */
      ex_onRcParamUpdate: function() {
        comp_ex_onRcParamUpdate(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_onRcUpdate: function() {
        if(this.scrTup != null) this.scrTup[0](this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_onRcRun: function() {
        if(this.scrTup != null) this.scrTup[1](this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_onRcStoppedRun: function() {
        if(this.scrTup != null) this.scrTup[3](this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_onRcCraft: function() {
        if(this.scrTup != null) this.scrTup[2](this);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
      * NOTE:
      *
      * @LATER
      * Multi-crafter efficiency should be updated here to work properly, as it's been reset in this interface.
      * {b.updateEfficiencyMultiplier} is final now and cannot be mixed.
      * ---------------------------------------- */
      ex_postUpdateEfficiencyMultiplier: function() {

      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
      * NOTE:
      *
      * Container of all parameter update methods.
      * ---------------------------------------- */
      ex_updateRcParam: function(rcMdl, rcHeader, forceLoad) {
        comp_ex_updateRcParam(this, rcMdl, rcHeader, forceLoad);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /* ----------------------------------------
      * NOTE:
      *
      * Called whenever recipe is changed.
      * ---------------------------------------- */
      ex_resetRcParam: function() {
        comp_ex_resetRcParam(this);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
      * NOTE:
      *
      * Loads some recipe-specific parameters when recipe is changed.
      * ---------------------------------------- */
      ex_loadRcParam: function(rcMdl, rcHeader) {
        comp_ex_loadRcParam(this, rcMdl, rcHeader);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      ex_showRcChangeEff: function() {
        EFF.squareFadePack[this.block.size].at(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getPayConsAmt: function(nmCt) {
        return this.payi.read(nmCt, 0);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      ex_getPayProdAmt: function(nmCt) {
        return this.payo.read(nmCt, 0);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      ex_calcProgInc: function(time) {
        return comp_ex_calcProgInc(this, time);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
      * NOTE:
      *
      * Returns the base efficiency, not called every frame since it's costy.
      * ---------------------------------------- */
      ex_calcRcEffcTg: function() {
        return comp_ex_calcRcEffcTg(this);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
      * NOTE:
      *
      * The final probability of failure.
      * Change this for dynamic chance to fail.
      * ---------------------------------------- */
      ex_calcFailP: function() {
        return this.failP;
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
      * NOTE:
      *
      * Some parameters will be updated when this returns {true}.
      * ---------------------------------------- */
      ex_getTimerEffcState: function() {
        return TIMER.effc;
      }
      .setProp({
        noSuper: true,
      }),


      ex_getBlkPol: function() {
        return MDL_pollution._blkPol(this.block) + this.rcPol;
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,
          (wr, revi) => {
            wr.str(this.rcHeader);
            wr.bool(this.hasStopped);
          },

          (rd, revi) => {
            this.rcHeader = rd.str();
            this.hasStopped = rd.bool();

            if(revi >= 2 && revi <= 4) {
              MDL_io._rd_objStrNum(rd, this.payReqObj);
              MDL_io._rd_objStrNum(rd, this.payStockObj);
            };
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }).extendInterface(INTF[1]),


  ];
