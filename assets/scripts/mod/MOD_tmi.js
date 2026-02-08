/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Mainly used for recipe registration to TMI.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_fuel = require("lovec/mdl/MDL_fuel");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- base ----------> */


  const ENABLED = fetchMod("tmi") != null;
  exports.ENABLED = ENABLED;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the corresponding TMI recipe type.
   * ---------------------------------------- */
  const _tp = function(tpStr) {
    return tryVal(RecipeType[tpStr], RecipeType.factory);
  };
  exports._tp = _tp;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the TMI recipe item for {ct_gn}.
   * Use {"power"} for {PowerMark} defined in Kotlin, and similar for heat.
   * I don't use vanilla heat, it's kept for other modders.
   * ---------------------------------------- */
  const _ct = function(ct_gn) {
    if(typeof ct_gn === "string") {
      switch(ct_gn) {
        case "power" : return PowerMark.INSTANCE;
        case "heat" : return HeatMark.INSTANCE;
      };
    };

    return TooManyItems.itemsManager.getItem(MDL_content._ct(ct_gn, null, true));
  };
  exports._ct = _ct;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a new empty recipe to be registered later.
   * ---------------------------------------- */
  const _rawRc = function(tpStr, ct_gn, time, reqBooster) {
    let rawRc = new Recipe(_tp(tpStr), _ct(ct_gn), tryVal(time, 0.0));
    if(reqBooster) {
      rawRc.setEff(Recipe.getDefaultEff(0.0));
    };

    return rawRc;
  };
  exports._rawRc = _rawRc;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a raw recipe to TMI recipe manager.
   * Remember to complete it before registration.
   * ---------------------------------------- */
  const regisRc = function(rawRc) {
    TooManyItems.recipesManager.addRecipe(rawRc, true);
  };
  exports.regisRc = regisRc;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a consumption term to the raw recipe.
   * ---------------------------------------- */
  const addCons = function(rawRc, ct_gn, amt, isContinuous) {
    !isContinuous ?
      rawRc.addMaterialFloat(_ct(ct_gn), amt) :
      rawRc.addMaterialPersec(_ct(ct_gn), amt);

    return rawRc;
  };
  exports.addCons = addCons;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a production term to the raw recipe.
   * ---------------------------------------- */
  const addProd = function(rawRc, ct_gn, amt, isContinuous) {
    !isContinuous ?
      rawRc.addProductionFloat(_ct(ct_gn), amt) :
      rawRc.addProductionPersec(_ct(ct_gn), amt);

    return rawRc;
  };
  exports.addProd = addProd;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds an attribute term to the raw recipe.
   * ---------------------------------------- */
  const addAttr = function(rawRc, ct_gn, val, size, reqAttr, hideEffc) {
    let rcStack = rawRc.addMaterial(_ct(ct_gn), Math.pow(size, 2))
    .setOptional(tryVal(!reqAttr, true))
    .setEff(tryVal(val, 1.0))
    .setAttribute(true);

    if(!hideEffc) rcStack.setFormat({format(f) {
      return ((reqAttr ? "" : "+") + val.perc(0)).color(val > 0.0 ? Pal.heal : Pal.remove);
    }});

    return rawRc;
  };
  exports.addAttr = addAttr;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds an optional consumption term to the raw recipe.
   * ---------------------------------------- */
  const addOpt = function(rawRc, ct_gn, amt, mtp, isContinuous, reqOpt) {
    let rcStack = !isContinuous ?
      rawRc.addMaterialFloat(_ct(ct_gn), amt) :
      rawRc.addMaterialPersec(_ct(ct_gn), amt);

    rcStack.setEff(reqOpt ? mtp : (mtp - 1.0))
    .setBooster(true)
    .setOptional(true)
    .setFormat({format(f) {
      return (!isContinuous ? amt.ui() : ((amt * 60.0).ui() + "/"  + StatUnit.seconds.localized()))
      + "\n" + ((reqOpt ? "" : "+") + mtp.perc(0)).color(mtp > 0.0 ? Pal.heal : Pal.remove);
    }});

    return rawRc;
  };
  exports.addOpt = addOpt;


  /* ----------------------------------------
   * NOTE:
   *
   * Builds the sub info table of {rawRc}.
   * ---------------------------------------- */
  const addSubInfo = function(rawRc, str0tableF, shouldPrepend) {
    typeof str0tableF !== "string" ?
      (shouldPrepend ? rawRc.prependSubInfo(str0tableF) : rawRc.appendSubInfo(str0tableF)) :
      (shouldPrepend ? rawRc.prependSubInfo(tb => {tb.add(str0tableF).left(); tb.row()}) : rawRc.appendSubInfo(tb => {tb.row(); tb.add(str0tableF).left()}));

    return rawRc;
  };
  exports.addSubInfo = addSubInfo;


  /* ----------------------------------------
   * NOTE:
   *
   * Generic parse method for most factory blocks.
   * ---------------------------------------- */
  const baseParse = function(blk, rawRc) {
    blk.consumers.forEachFast(cons => {
      switch(cons.getClass()) {
        case ConsumePower :
          addCons(rawRc, "power", cons.usage, true);
          break;
        case ConsumeItems :
          for(let itmStack in cons.items) {
            addCons(rawRc, itmStack.item, itmStack.amount);
          };
          break;
        case ConsumeLiquid :
          addCons(rawRc, cons.liquid, cons.amount, true);
          break;
        case ConsumeLiquids :
          for(let liqStack in cons.liquids) {
            addCons(rawRc, liqStack.liquid, liqStack.amount, true);
          };
          break;
      };
    });

    if(blk.outputItems != null) for(let itmStack in blk.outputItems) {
      addProd(rawRc, itmStack.item, itmStack.amount);
    };
    if(blk.outputLiquids != null) for(let liqStack in blk.outputLiquids) {
      addProd(rawRc, liqStack.liquid, liqStack.amount);
    };
  };
  exports.baseParse = baseParse;


  /* <---------- lovec ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Register recipes for the dynamic attribute factory (or miner).
   * ---------------------------------------- */
  const _r_dynaAttr = function(blk, attrRsMap, tpStr_ow) {
    if(!ENABLED) return;

    MDL_event._c_onLoad(() => {
      attrRsMap.forEachRow(2, (nmAttr, nmRs) => {
        let rs = MDL_content._ct(nmRs, "rs");
        if(rs == null) return;

        let rawRc = _rawRc(tryVal("factory"), blk, blk.ex_getCraftTime(), true);

        baseParse(blk, rawRc);
        MDL_attr._blkAttrMap(nmAttr).forEachRow(3, (oblk, attrVal, nmAttr) => {
          addAttr(rawRc, oblk, attrVal, blk.size, true);
        });
        addProd(rawRc, rs, blk.ex_getDynaAttrProdAmt(rs), rs instanceof Liquid);

        rawRc.complete();
        regisRc(rawRc);
      });
    });
  };
  exports._r_dynaAttr = _r_dynaAttr;


  /* ----------------------------------------
   * NOTE:
   *
   * Register pressure/vacuum output for the pressure pump.
   * ---------------------------------------- */
  const _r_presPump = function(blk, prodAmt, isVac) {
    if(!ENABLED) return;
    if(prodAmt < 0.0001) return;

    MDL_event._c_onLoad(() => {
      let rawRc = _rawRc("factory", blk, -1.0);

      baseParse(blk, rawRc);
      addProd(rawRc, isVac ? VARGEN.auxVac : VARGEN.auxPres, prodAmt, true);

      rawRc.complete();
      regisRc(rawRc);
    });
  };
  exports._r_presPump = _r_presPump;


  /* ----------------------------------------
   * NOTE:
   *
   * Builds sub info for optional input.
   * ---------------------------------------- */
  const addSubInfo_opt = function(rawRc, opt) {
    if(opt == null || opt.length === 0) return rawRc;

    addSubInfo(rawRc, tb => {
      tb.row();
      tb.table(Styles.none, tb1 => {
        let i = 0;
        opt.forEachRow(4, (ct, amt, p, mtp) => {
          tb1.add("[" + Strings.fixed(i / 4.0 + 1.0, 0) + "]").center().color(Pal.accent).padRight(36.0);
          MDL_table.__rcCt(tb1, ct, amt, p).padRight(72.0);
          tb1.add(MDL_text._statText(
            MDL_bundle._term("lovec", "efficiency-multiplier"),
            mtp.perc(0),
          )).center().padRight(6.0);
          tb1.row();
          i += 4;
        });
      }).row();
      MDL_table.__break(tb);
    });

    return rawRc;
  };
  exports.addSubInfo_opt = addSubInfo_opt;


  /* ----------------------------------------
   * NOTE:
   *
   * Register recipes for the recipe factory.
   * ---------------------------------------- */
  const _r_recipe = function thisFun(blk, rcMdl) {
    if(!ENABLED) return;

    if(thisFun.tmpSeq.size === 0) {
      Vars.content.items().each(itm => thisFun.tmpSeq.add(itm));
      Vars.content.liquids().each(liq => thisFun.tmpSeq.add(liq));
    };

    MDL_event._c_onLoad(() => {
      MDL_recipe._rcHeaders(rcMdl).forEachFast(rcHeader => {
        let ci = MDL_recipe._ci(rcMdl, rcHeader);
        let bi = MDL_recipe._bi(rcMdl, rcHeader);
        let aux = MDL_recipe._aux(rcMdl, rcHeader);
        let reqOpt = MDL_recipe._reqOpt(rcMdl, rcHeader);
        let opt = MDL_recipe._opt(rcMdl, rcHeader);
        let co = MDL_recipe._co(rcMdl, rcHeader);
        let bo = MDL_recipe._bo(rcMdl, rcHeader);
        let failP = MDL_recipe._failP(rcMdl, rcHeader);
        let fo = MDL_recipe._fo(rcMdl, rcHeader);

        let isGen = MDL_recipe._isGen(rcMdl, rcHeader);

        let rawRc = _rawRc("factory", blk, blk.craftTime * MDL_recipe._timeScl(rcMdl, rcHeader));

        if(blk.consPower != null) {
          addCons(rawRc, "power", blk.consPower.usage, true);
        };

        thisFun.tmpSeq.each(ct0 => {
          let amtCi = 0.0, amtBi = 0.0, amtCo = 0.0, amtBo = 0.0;

          // CI
          ci.forEachRow(2, (ct, amt) => {
            if(ct === ct0) amtCi += amt;
          });

          // BI
          bi.forEachRow(3, (tmp, amt, p) => {
            if(!(tmp instanceof Array)) {
              if(tmp === ct0) amtBi += amt * p;
            } else {
              tmp.forEachRow(3, (tmp1, amt1, p1) => {
                if(tmp1 === ct0) amtBi += amt1 * p1;
              });
            };
          });

          // AUX
          aux.forEachRow(2, (ct, amt) => {
            if(ct === ct0) amtCi += amt;
          });

          // OPT (skipped here)

          // CO
          co.forEachRow(2, (ct, amt) => {
            if(ct === ct0) amtCo += amt;
          });

          // BO
          bo.forEachRow(3, (ct, amt, p) => {
            if(ct === ct0) amtBo += amt * p * (1.0 - failP);
          });

          // FO
          fo.forEachRow(3, (ct, amt, p) => {
            if(ct === ct0) amtBo += amt * p * failP;
          });

          if(amtCi > 0.0) addCons(rawRc, ct0, amtCi, true);
          if(amtBi > 0.0) addCons(rawRc, ct0, amtBi, false);
          if(amtCo > 0.0) addProd(rawRc, ct0, amtCo, true);
          if(amtBo > 0.0) addProd(rawRc, ct0, amtBo, false);
        });

        opt.forEachRow(4, (ct, amt, p, mtp) => {
          addOpt(rawRc, ct, amt * p, mtp, false, reqOpt);
        });
        if(reqOpt) addSubInfo(rawRc, MDL_text._statText(MDL_bundle._term("lovec", "require-optional"), Core.bundle.get("yes")));
        addSubInfo_opt(rawRc, opt);

        if(isGen) addSubInfo(rawRc, MDL_bundle._term("lovec", "generated-recipe").color(Color.gray));
        if(failP > 0.0) addSubInfo(rawRc, MDL_text._statText(MDL_bundle._term("lovec", "chance-to-fail"), failP.perc(1)));

        if(MDL_cond._isFurnace(blk)) {
          let tempReq = MDL_recipe._tempReq(rcMdl, rcHeader);
          let tempAllowed = MDL_recipe._tempAllowed(rcMdl, rcHeader);
          let fuelArr = MDL_fuel._fuelArr(blk);

          if(tempReq > 0.0) addSubInfo(rawRc, MDL_text._statText(fetchStat("lovec", "blk0heat-tempreq").localized(), Strings.fixed(tempReq, 2), fetchStatUnit("lovec", "heatunits").localized()));
          if(isFinite(tempAllowed)) addSubInfo(rawRc, MDL_text._statText(MDL_bundle._term("lovec", "temperature-allowed"), Strings.fixed(tempAllowed, 2), fetchStatUnit("lovec", "heatunits").localized()));
          if(fuelArr.length > 0) addSubInfo(rawRc, tb => {
            tb.row();
            tb.add(MDL_text._statText(MDL_bundle._term("lovec", "fuel"))).left();
            tb.row();
            MDL_table.setDisplay_ctLi(tb, fuelArr, null, 10);
          });
        };

        rawRc.complete();
        regisRc(rawRc);
      });
    });
  }
  .setProp({
    tmpSeq: new Seq(),
  });
  exports._r_recipe = _r_recipe;
