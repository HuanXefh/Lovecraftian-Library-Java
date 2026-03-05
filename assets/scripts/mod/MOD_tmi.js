/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Mainly used for recipe registration to TMI.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  const ENABLED = fetchMod("tmi") != null;
  exports.ENABLED = ENABLED;


  const CLASSES = {};
  if(ENABLED) {
    CLASSES.TooManyItems = fetchClass("tmi.TooManyItems");
    CLASSES.Recipe = fetchClass("tmi.recipe.Recipe");
    CLASSES.RecipeItemGroup = fetchClass("tmi.recipe.RecipeItemGroup");
    CLASSES.RecipeParser = fetchClass("tmi.recipe.RecipeParser");
    CLASSES.RecipeType = fetchClass("tmi.recipe.RecipeType");
    CLASSES.AttributeCrafterParser = fetchClass("tmi.recipe.parser.AttributeCrafterParser");
    CLASSES.BeamDrillParser = fetchClass("tmi.recipe.parser.BeamDrillParser");
    CLASSES.GenericCrafterParser = fetchClass("tmi.recipe.parser.GenericCrafterParser");
    CLASSES.WallCrafterParser = fetchClass("tmi.recipe.parser.WallCrafterParser");
    CLASSES.HeatMark = fetchClass("tmi.recipe.types.HeatMark");
    CLASSES.PowerMark = fetchClass("tmi.recipe.types.PowerMark");
    CLASSES.RecipeItem = fetchClass("tmi.recipe.types.RecipeItem");
    CLASSES.RecipeItemType = fetchClass("tmi.recipe.types.RecipeItemType");
  };
  exports.CLASSES = CLASSES;


  /**
   * Gets the corresponding TMI recipe type by name.
   * @param {string} typeStr
   * @return {RecipeType}
   */
  const _tmiRcType = function(typeStr) {
    return tryVal(CLASSES.RecipeType[typeStr], CLASSES.RecipeType.factory);
  };
  exports._tmiRcType = _tmiRcType;


  /**
   * Gets TMI recipe item for `ct_gn`.
   * @param {ContentGn} ct_gn
   * @return {RecipeItem}
   */
  const _tmiCT = function(ct_gn) {
    if(typeof ct_gn === "string") {
      switch(ct_gn) {
        case "power" : return CLASSES.PowerMark.INSTANCE;
        case "heat" : return CLASSES.HeatMark.INSTANCE;
      };
    };

    return CLASSES.TooManyItems.itemsManager.getItem(MDL_content._ct(ct_gn, null, true));
  };
  exports._tmiCT = _tmiCT;


  /**
   * Creates a new empty recipe to be registered later.
   * @param {string} tpStr
   * @param {ContentGn} ct_gn
   * @param {number|unset} [time]
   * @param {boolean|unset} [reqBooster]
   * @return {Recipe}
   */
  const _rawRc = function(tpStr, ct_gn, time, reqBooster) {
    let rawRc = new CLASSES.Recipe(_tmiRcType(tpStr), _tmiCT(ct_gn), tryVal(time, 0.0));
    if(reqBooster) {
      rawRc.setBaseEff(0.0);
    };

    return rawRc;
  };
  exports._rawRc = _rawRc;


  /**
   * Adds a raw recipe to TMI recipe manager.
   * The recipe should be completed before registration.
   * @param {Recipe} rawRc
   * @return {void}
   */
  const regisRc = function(rawRc) {
    CLASSES.TooManyItems.recipesManager.addRecipe(rawRc, true);
  };
  exports.regisRc = regisRc;


  /**
   * Adds a recipe parser to TMI recipe manager, which is created in {@link extend} from `obj`.
   * @param {Object} obj
   * @return {void}
   */
  const regisParser = function(obj) {
    processClassLoader();
    let rcParser = extend(CLASSES.RecipeParser, obj);
    processClassLoader();

    CLASSES.TooManyItems.recipesManager.registerParser(rcParser);
  };
  exports.regisParser = regisParser;


  /* <---------- recipe ----------> */


  /**
   * Adds a consumption term to the raw recipe.
   * @param {Recipe} rawRc
   * @param {ContentGn} ct_gn
   * @param {number} amt
   * @param {boolean|unset} [isContinuous]
   * @return {Recipe}
   */
  const addCons = function(rawRc, ct_gn, amt, isContinuous) {
    !isContinuous ?
      rawRc.addMaterialFloat(_tmiCT(ct_gn), amt) :
      rawRc.addMaterialPersec(_tmiCT(ct_gn), amt);

    return rawRc;
  };
  exports.addCons = addCons;


  /**
   * Adds a power consumption term to the raw recipe.
   * @param {Recipe} rawRc
   * @param {number} amt
   * @return {Recipe}
   */
  const addConsPow = function(rawRc, amt) {
    rawRc.addMaterialPersec(_tmiCT("power"), amt)
    .setType(CLASSES.RecipeItemType.POWER);

    return rawRc;
  };
  exports.addConsPow = addConsPow;


  /**
   * Adds an Erekir heat consumption term to the raw recipe.
   * Not used in ProjReind.
   * @param {Recipe} rawRc
   * @param {number} amt
   * @return {Recipe}
   */
  const addConsHeatErekir = function(rawRc, amt) {
    rawRc.addMaterial(_tmiCT("heat"), amt)
    .setType(CLASSES.RecipeItemType.POWER)
    .floatFormat();

    return rawRc;
  };
  exports.addConsHeatErekir = addConsHeatErekir;


  /**
   * Adds a liquid booster term to the raw recipe.
   * @param {Recipe} rawRc
   * @param {ContentGn} ct_gn
   * @param {number} amt
   * @param {number} boostEffc
   * @return {Recipe}
   */
  const addConsBooster = function(rawRc, ct_gn, amt, boostEffc) {
    rawRc.addMaterialPersec(_tmiCT(ct_gn), amt)
    .setType(CLASSES.RecipeItemType.BOOSTER)
    .setOptional()
    .setEff(boostEffc)
    .boostAndConsFormat(boostEffc);

    return rawRc;
  };
  exports.addConsBooster = addConsBooster;


  /**
   * Adds an alternate consumption term to the raw recipe.
   * @param {Recipe} rawRc
   * @param {RecipeItemGroup} rcGrp
   * @param {ContentGn} ct_gn
   * @param {number} amt
   * @param {boolean|unset} [isContinuous]
   * @return {Recipe}
   */
  const addConsAlter = function(rawRc, rcGrp, ct_gn, amt, isContinuous) {
    let rcStack = !isContinuous ?
      rawRc.addMaterialFloat(_tmiCT(ct_gn), amt) :
      rawRc.addMaterialPersec(_tmiCT(ct_gn), amt);

    rcStack
    .setGroup(rcGrp);

    return rawRc;
  };
  exports.addConsAlter = addConsAlter;


  /**
   * Adds a production term to the raw recipe.
   * @param {Recipe} rawRc
   * @param {ContentGn} ct_gn
   * @param {number} amt
   * @param {boolean|unset} [isContinuous]
   * @return {Recipe}
   */
  const addProd = function(rawRc, ct_gn, amt, isContinuous) {
    !isContinuous ?
      rawRc.addProductionFloat(_tmiCT(ct_gn), amt) :
      rawRc.addProductionPersec(_tmiCT(ct_gn), amt);

    return rawRc;
  };
  exports.addProd = addProd;


  /**
   * Adds a power production term to the raw recipe.
   * @param {Recipe} rawRc
   * @param {number} amt
   * @return {Recipe}
   */
  const addProdPow = function(rawRc, amt) {
    rawRc.addProductionPersec(_tmiCT("power"), amt)
    .setType(CLASSES.RecipeItemType.POWER);

    return rawRc;
  };
  exports.addProdPow = addProdPow;


  /**
   * Adds an Erekir heat consumption term to the raw recipe.
   * Not used in ProjReind.
   * @param {Recipe} rawRc
   * @param {number} amt
   * @return {Recipe}
   */
  const addProdHeatErekir = function(rawRc, amt) {
    rawRc.addProduction(_tmiCT("heat"), amt)
    .setType(CLASSES.RecipeItemType.POWER)
    .floatFormat();

    return rawRc;
  };
  exports.addProdHeatErekir = addProdHeatErekir;


  /**
   * Adds an attribute term to the raw recipe.
   * @param {Recipe} rawRc
   * @param {RecipeItemGroup} rcGrp
   * @param {ContentGn} ct_gn
   * @param {number} val
   * @param {number} size
   * @param {boolean|unset} [reqAttr]
   * @param {boolean|unset} [isWallEffc]
   * @param {boolean|unset} [hideEffc]
   * @return {Recipe}
   */
  const addAttr = function(rawRc, rcGrp, ct_gn, val, size, reqAttr, isWallEffc, hideEffc) {
    let rcStack = rawRc.addMaterial(_tmiCT(ct_gn), isWallEffc ? size : Math.pow(size, 2))
    .setType(CLASSES.RecipeItemType.ATTRIBUTE)
    .setOptional(tryVal(!reqAttr, true))
    .setEff((isWallEffc ? size : Math.pow(size, 2)) * tryVal(val, 1.0))
    .setGroup(rcGrp);

    if(!hideEffc) rcStack.setFormat({format(f) {
      return ((reqAttr ? "" : "+") + val.perc(0)).color(val > 0.0 ? Pal.heal : Pal.remove);
    }});

    return rawRc;
  };
  exports.addAttr = addAttr;


  /**
   * Adds a mining tile term to the raw recipe.
   * @param {Recipe} rawRc
   * @param {RecipeItemGroup} rcGrp
   * @param {BlockGn} blk_gn
   * @param {number} realEffc
   * @param {number} size
   * @param {boolean|unset} [isWallEffc]
   * @return {Recipe}
   */
  const addMineTile = function(rawRc, rcGrp, blk_gn, realEffc, size, isWallEffc) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null || blk.itemDrop == null) return rawRc;

    rawRc.addMaterial(_tmiCT(blk), isWallEffc ? size : Math.pow(size, 2))
    .setType(CLASSES.RecipeItemType.ATTRIBUTE)
    .setEff(realEffc)
    .emptyFormat()
    .setGroup(rcGrp);

    return rawRc;
  };
  exports.addMineTile = addMineTile;


  /**
   * Adds an optional consumption term to the raw recipe.
   * @param {Recipe} rawRc
   * @param {RecipeItemGroup} rcGrp
   * @param {ContentGn} ct_gn
   * @param {number} amt
   * @param {number} mtp
   * @param {boolean|unset} [isContinuous]
   * @param {boolean|unset} [reqOpt]
   * @return {Recipe}
   */
  const addOpt = function(rawRc, rcGrp, ct_gn, amt, mtp, isContinuous, reqOpt) {
    let rcStack = !isContinuous ?
      rawRc.addMaterialFloat(_tmiCT(ct_gn), amt) :
      rawRc.addMaterialPersec(_tmiCT(ct_gn), amt);

    rcStack
    .setBooster(true)
    .setOptional(!reqOpt)
    .setEff(mtp)
    .setGroup(rcGrp)
    .setFormat({format(f) {
      return (!isContinuous ? amt.ui() : ((amt * 60.0).ui() + "/"  + StatUnit.seconds.localized())) + "\n" + ((reqOpt ? "" : "+") + mtp.perc(0)).color(mtp > 0.0 ? Pal.heal : Pal.remove);
    }});

    return rawRc;
  };
  exports.addOpt = addOpt;


  /**
   * Generic parse method for most factory blocks.
   * @param {Block} blk
   * @param {Recipe} rawRc
   * @param {number|unset} [boostEffc]
   */
  const baseParse = function(blk, rawRc, boostEffc) {
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
          cons.booster ?
            addConsBooster(rawRc, cons.liquid, cons.amount, tryVal(boostEffc, 1.0)) :
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


  /**
   * Builds the sub info table of `rawRc`.
   * @param {Recipe} rawRc
   * @param {string|(function(Table): void)} str0tableF
   * @param {boolean|unset} [shouldPrepend]
   * @return {Recipe}
   */
  const addSubInfo = function(rawRc, str0tableF, shouldPrepend) {
    typeof str0tableF !== "string" ?
      (shouldPrepend ? rawRc.prependSubInfo(str0tableF) : rawRc.appendSubInfo(str0tableF)) :
      (shouldPrepend ? rawRc.prependSubInfo(tb => {tb.add(str0tableF).left(); tb.row()}) : rawRc.appendSubInfo(tb => {tb.row(); tb.add(str0tableF).left()}));

    return rawRc;
  };
  exports.addSubInfo = addSubInfo;


  /**
   * Builds sub info for optional input.
   * @param {Recipe} rawRc
   * @param {Array} opt
   * @return {Recipe}
   */
  const addSubInfo_opt = function(rawRc, opt) {
    if(opt.length === 0) return rawRc;

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


  /* <---------- registration ----------> */


  /**
   * Registers recipes for dynamic attribute factory (or miner).
   * @param {Block} blk
   * @param {Array} attrRsArr
   * @param {string|unset} [typeStr_ow]
   * @param {boolean|unset} [isWallEffc]
   * @return {void}
   */
  const _r_dynaAttr = function(blk, attrRsArr, typeStr_ow, isWallEffc) {
    if(!ENABLED) return;

    MDL_event._c_onLoad(() => {
      attrRsArr.forEachRow(2, (nmAttr, nmRs) => {
        let rs = MDL_content._ct(nmRs, "rs");
        if(rs == null) return;

        let rawRc = _rawRc(tryVal(typeStr_ow, "factory"), blk, blk.ex_getCraftTime(), true);
        let rcGrp = new CLASSES.RecipeItemGroup();
        baseParse(blk, rawRc);

        MDL_attr._blkAttrArr(nmAttr).forEachRow(3, (oblk, attrVal, nmAttr) => {
          addAttr(rawRc, rcGrp, oblk, attrVal, blk.size, true, isWallEffc);
        });
        addProd(rawRc, rs, blk.ex_getDynaAttrProdAmt(rs), rs instanceof Liquid);

        rawRc.complete();
        regisRc(rawRc);
      });
    });
  };
  exports._r_dynaAttr = _r_dynaAttr;


  /**
   * Registers liquid output for rain collector.
   * @param {Block} blk
   * @return {void}
   */
  const _r_rainCollector = function(blk) {
    if(!ENABLED) return;

    MDL_event._c_onLoad(() => {
      Vars.content.weathers().each(
        wea => wea instanceof RainWeather,
        wea => {
          let rawRc = _rawRc("collecting", blk, 300.0);

          baseParse(blk, rawRc);
          addProd(rawRc, wea.liquid, blk.delegee.liqProdRate, true);

          rawRc.complete();
          regisRc(rawRc);
        },
      );
    });
  };
  exports._r_rainCollector = _r_rainCollector;


  /**
   * Registers recipes for the recipe factory.
   * @param {Block} blk
   * @param {RecipeModule} rcMdl
   * @return {void}
   */
  const _r_recipe = function thisFun(blk, rcMdl) {
    if(!ENABLED) return;

    if(thisFun.tmpSeq.size === 0) {
      Vars.content.items().each(itm => thisFun.tmpSeq.add(itm));
      Vars.content.liquids().each(liq => thisFun.tmpSeq.add(liq));
    };

    MDL_event._c_onLoad(() => {
      MDL_recipe._rcHeaders(rcMdl).forEachFast(rcHeader => {
        // IO
        let ci = MDL_recipe._ci(rcMdl, rcHeader);
        let bi = MDL_recipe._bi(rcMdl, rcHeader);
        let aux = MDL_recipe._aux(rcMdl, rcHeader);
        let reqOpt = MDL_recipe._reqOpt(rcMdl, rcHeader);
        let opt = MDL_recipe._opt(rcMdl, rcHeader);
        let payi = MDL_recipe._payi(rcMdl, rcHeader);
        let co = MDL_recipe._co(rcMdl, rcHeader);
        let bo = MDL_recipe._bo(rcMdl, rcHeader);
        let failP = MDL_recipe._failP(rcMdl, rcHeader);
        let fo = MDL_recipe._fo(rcMdl, rcHeader);
        let payo = MDL_recipe._payo(rcMdl, rcHeader);
        // Specific
        let isGen = MDL_recipe._isGen(rcMdl, rcHeader);

        let rawRc = _rawRc("factory", blk, blk.craftTime * MDL_recipe._timeScl(rcMdl, rcHeader));

        // Power
        if(blk.consPower != null) {
          addConsPow(rawRc, blk.consPower.usage);
        };

        // Regular IO
        let ciAlterChecked = false, biAlterChecked = false;
        thisFun.tmpSeq.each(ct0 => {
          let amtCi = 0.0, amtBi = 0.0, amtCo = 0.0, amtBo = 0.0;

          // CI
          ci.forEachRow(2, (tmp, amt) => {
            if(!(tmp instanceof Array)) {
              if(tmp === ct0) amtCi += amt;
            } else if(!ciAlterChecked) {
              let rcGrpCi = new CLASSES.RecipeItemGroup();
              tmp.forEachRow(2, (tmp1, amt1) => {
                addConsAlter(rawRc, rcGrpCi, tmp1, amt1, true);
              });
              ciAlterChecked = true;
            };
          });

          // BI
          bi.forEachRow(3, (tmp, amt, p) => {
            if(!(tmp instanceof Array)) {
              if(tmp === ct0) amtBi += amt * p;
            } else if(!biAlterChecked) {
              let rcGrpBi = new CLASSES.RecipeItemGroup();
              tmp.forEachRow(3, (tmp1, amt1, p1) => {
                addConsAlter(rawRc, rcGrpBi, tmp1, amt1 * p1, false);
              });
              biAlterChecked = true;
            };
          });

          // AUX
          aux.forEachRow(2, (ct, amt) => {
            if(ct === ct0) amtCi += amt;
          });

          // OPT (skipped here)

          // PAYI
          payi.forEachRow(2, (nmCt, amt) => {
            addCons(rawRc, nmCt, amt, false);
          });

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

          // PAYO
          payo.forEachRow(2, (nmCt, amt) => {
            addProd(rawRc, nmCt, amt, false);
          });

          if(amtCi > 0.0) addCons(rawRc, ct0, amtCi, true);
          if(amtBi > 0.0) addCons(rawRc, ct0, amtBi, false);
          if(amtCo > 0.0) addProd(rawRc, ct0, amtCo, true);
          if(amtBo > 0.0) addProd(rawRc, ct0, amtBo, false);
        });

        // OPT
        let rcGrpOpt = new CLASSES.RecipeItemGroup();
        opt.forEachRow(4, (ct, amt, p, mtp) => {
          addOpt(rawRc, rcGrpOpt, ct, amt * p, mtp, false, reqOpt);
        });
        if(reqOpt) {
          addSubInfo(rawRc, MDL_text._statText(MDL_bundle._term("lovec", "require-optional"), Core.bundle.get("yes")));
        };
        addSubInfo_opt(rawRc, opt);

        // Stat
        if(isGen) addSubInfo(rawRc, MDL_bundle._term("lovec", "generated-recipe").color(Color.gray));
        if(failP > 0.0) addSubInfo(rawRc, MDL_text._statText(MDL_bundle._term("lovec", "chance-to-fail"), failP.perc(1)));

        // BLK_furnaceRecipeFactory
        if(MDL_cond._isFurnace(blk)) {
          // Specific
          let tempReq = MDL_recipe._tempReq(rcMdl, rcHeader);
          let tempAllowed = MDL_recipe._tempAllowed(rcMdl, rcHeader);
          let fuelArr = MDL_fuel._fuelArr(blk);

          // Stat
          if(tempReq > 0.0) addSubInfo(rawRc, MDL_text._statText(fetchStat("lovec", "blk0heat-tempreq").localized(), Strings.fixed(tempReq, 2), fetchStatUnit("lovec", "heatunits").localized()));
          if(isFinite(tempAllowed)) addSubInfo(rawRc, MDL_text._statText(MDL_bundle._term("lovec", "temperature-allowed"), Strings.fixed(tempAllowed, 2), fetchStatUnit("lovec", "heatunits").localized()));
          if(fuelArr.length > 0) addSubInfo(rawRc, tb => {
            tb.row();
            tb.add(MDL_text._statText(MDL_bundle._term("lovec", "fuel"))).left();
            tb.row();
            MDL_table._l_ctLi(tb, fuelArr, null, 10);
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
