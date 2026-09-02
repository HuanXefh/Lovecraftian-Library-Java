/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Mainly used for recipe registration to TMI.
   * @module lovec/mod/MOD_tmi
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


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
    CLASSES.DrillParser = fetchClass("tmi.recipe.parser.DrillParser");
    CLASSES.GenericCrafterParser = fetchClass("tmi.recipe.parser.GenericCrafterParser");
    CLASSES.PumpParser = fetchClass("tmi.recipe.parser.PumpParser");
    CLASSES.ThermalGeneratorParser = fetchClass("tmi.recipe.parser.ThermalGeneratorParser");
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
  const getTmiRcType = function(typeStr) {
    return tryVal(CLASSES.RecipeType[typeStr], CLASSES.RecipeType.factory);
  };
  exports.getTmiRcType = getTmiRcType;


  /**
   * Gets TMI recipe item for `ct_gn`.
   * @param {ContentGn} ct_gn
   * @return {RecipeItem}
   */
  const getTmiCt = function(ct_gn) {
    if(typeof ct_gn === "string") {
      switch(ct_gn) {
        case "power" : return CLASSES.PowerMark.INSTANCE;
        case "heat" : return CLASSES.HeatMark.INSTANCE;
      };
    };
    let ct = MDL_content.getCt(ct_gn, null, true);
    if(ct == null) {
      printObj(ct_gn);
      throw new Error("Cannot resolve content for TMI: " + ct_gn);
    };

    return CLASSES.TooManyItems.itemsManager.getItem(ct);
  };
  exports.getTmiCt = getTmiCt;


  /**
   * Creates a new empty recipe to be registered later.
   * @param {string} typeStr
   * @param {ContentGn} ct_gn
   * @param {number|unset} [time]
   * @param {boolean|unset} [reqBooster]
   * @return {Recipe}
   */
  const makeRawRc = function(typeStr, ct_gn, time, reqBooster) {
    let rawRc = new CLASSES.Recipe(getTmiRcType(typeStr), getTmiCt(ct_gn), tryVal(time, 0.0));
    if(reqBooster) {
      rawRc.setBaseEff(0.0);
    };

    return rawRc;
  };
  exports.makeRawRc = makeRawRc;


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
   * @return {RecipeParser}
   */
  const regisParser = function(obj) {
    processClassLoader(null, VAR.extendInd.tmi);
    let rcParser = extend(CLASSES.RecipeParser, obj);
    processClassLoader(null, VAR.extendInd.tmi);
    CLASSES.TooManyItems.recipesManager.registerParser(rcParser);

    return rcParser;
  };
  exports.regisParser = regisParser;


  /* <------------------------------ recipe ------------------------------ */


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
      rawRc.addMaterialFloat(getTmiCt(ct_gn), amt) :
      rawRc.addMaterialPersec(getTmiCt(ct_gn), amt);

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
    rawRc.addMaterialPersec(getTmiCt("power"), amt)
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
    rawRc.addMaterial(getTmiCt("heat"), amt)
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
    rawRc.addMaterialPersec(getTmiCt(ct_gn), amt)
    .setType(CLASSES.RecipeItemType.BOOSTER)
    .setOptional()
    .setEfficiency(boostEffc)
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
      rawRc.addMaterialFloat(getTmiCt(ct_gn), amt) :
      rawRc.addMaterialPersec(getTmiCt(ct_gn), amt);

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
      rawRc.addProductionFloat(getTmiCt(ct_gn), amt) :
      rawRc.addProductionPersec(getTmiCt(ct_gn), amt);

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
    rawRc.addProductionPersec(getTmiCt("power"), amt)
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
    rawRc.addProduction(getTmiCt("heat"), amt)
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
   * @param {number|unset} [attrRcType]
   * @param {boolean|unset} [hideEffc]
   * @return {Recipe}
   */
  const addAttr = function(rawRc, rcGrp, ct_gn, val, size, reqAttr, attrRcType, hideEffc) {
    let rcStack = rawRc.addMaterial(getTmiCt(ct_gn), attrRcType === AttrRcTypes.PROP ? 1 : attrRcType === AttrRcTypes.WALL ? size : Math.pow(size, 2))
    .setType(CLASSES.RecipeItemType.ATTRIBUTE)
    .setOptional(tryVal(!reqAttr, true))
    .setEfficiency(tryVal(val, 1.0))
    .setGroup(rcGrp);

    if(!hideEffc) rcStack.setFormat({format(f) {
      return ((reqAttr ? "" : "+") + tryVal(val, 0.0).perc(0)).color(tryVal(val, 0.0) > 0.0 ? Pal.heal : Pal.remove);
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
   * @param {number} amt
   * @return {Recipe}
   */
  const addMineTile = function(rawRc, rcGrp, blk_gn, realEffc, amt) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    if(blk == null || blk.itemDrop == null) return rawRc;

    rawRc.addMaterial(getTmiCt(blk), amt)
    .setType(CLASSES.RecipeItemType.ATTRIBUTE)
    .setEfficiency(realEffc)
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
      rawRc.addMaterialFloat(getTmiCt(ct_gn), amt) :
      rawRc.addMaterialPersec(getTmiCt(ct_gn), amt);

    rcStack
    .setType(CLASSES.RecipeItemType.BOOSTER)
    .setOptional(!reqOpt)
    .setEfficiency(mtp)
    .setGroup(rcGrp)
    .setFormat({format(f) {
      return (!isContinuous ? amt.amount() : ((amt * 60.0).amount() + "/"  + StatUnit.seconds.localized())) + "\n" + ((reqOpt ? "" : "+") + mtp.perc(0)).color(mtp > 0.0 ? Pal.heal : Pal.remove);
    }});

    return rawRc;
  };
  exports.addOpt = addOpt;


  /**
   * Generic parse method for most factory blocks.
   * Should be called on CLIENT LOAD, or consumers added by `setConsumer` won't be parsed.
   * @param {Block} blk
   * @param {Recipe} rawRc
   * @param {number|unset} [boostEffc]
   */
  const baseParse = function(blk, rawRc, boostEffc) {
    blk.consumers.forEachFast(cons => {
      switch(cons.getClass()) {
        case ConsumePower :
          addConsPow(rawRc, cons.usage);
          break;
        case ConsumeItems :
          for(let itmStack of cons.items) {
            addCons(rawRc, itmStack.item, itmStack.amount);
          };
          break;
        case ConsumeLiquid :
          cons.booster ?
            addConsBooster(rawRc, cons.liquid, cons.amount, tryVal(boostEffc, 1.0)) :
            addCons(rawRc, cons.liquid, cons.amount, true);
          break;
        case ConsumeLiquids :
          for(let liqStack of cons.liquids) {
            addCons(rawRc, liqStack.liquid, liqStack.amount, true);
          };
          break;
      };
      if(cons.ex_setTmiRc != null) {
        cons.ex_setTmiRc(blk, rawRc, boostEffc);
      };
    });

    if(blk.outputItems != null) for(let itmStack of blk.outputItems) {
      addProd(rawRc, itmStack.item, itmStack.amount);
    };
    if(blk.outputLiquids != null) for(let liqStack of blk.outputLiquids) {
      addProd(rawRc, liqStack.liquid, liqStack.amount, true);
    };

    if(checkCreatedByTemp(blk)) {
      if(blk.ex_isSubInsOf("INTF_BLK_pressureProducer") && !blk.delegee.presProd.fEqual(0.0)) {
        addProd(rawRc, blk.delegee.presProd > 0.0 ? "loveclab-aux0aux-pressure" : "loveclab-aux0aux-vacuum", Math.abs(blk.delegee.presProd), true);
      };
    };
  };
  exports.baseParse = baseParse;


  /**
   * Builds the sub info table of `rawRc`.
   * @param {Recipe} rawRc
   * @param {string|(function(Table): void)} str0tableM
   * @param {boolean|unset} [shouldPrepend]
   * @return {Recipe}
   */
  const addSubInfo = function(rawRc, str0tableM, shouldPrepend) {
    typeof str0tableM !== "string" ?
      (shouldPrepend ? rawRc.prependSubInfo(str0tableM) : rawRc.appendSubInfo(str0tableM)) :
      (shouldPrepend ? rawRc.prependSubInfo(tb => {tb.add(str0tableM).left(); tb.row()}) : rawRc.appendSubInfo(tb => {tb.row(); tb.add(str0tableM).left()}));

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
          MDL_table.rcCtIcon(tb1, ct, amt, p).padRight(72.0);
          tb1.add(MDL_text.getStat(
            MDL_bundle.getTerm("lovec", "efficiency-multiplier"),
            mtp.perc(0),
          )).center().padRight(6.0);
          tb1.row();
          i += 4;
        }, true);
      }).row();
      MDL_table.br(tb);
    });

    return rawRc;
  };
  exports.addSubInfo_opt = addSubInfo_opt;


  /* <------------------------------ registration ------------------------------ */


  /**
   * Registers recipes for dynamic attribute factory (or miner).
   * @param {Block} blk
   * @param {Array} attrRsArr
   * @param {string|unset} [typeStr_ow]
   * @return {void}
   */
  const regisRc_dynamicAttributeBlock = function(blk, attrRsArr, typeStr_ow) {
    if(!ENABLED) return;

    MDL_event.onLoad(() => {
      attrRsArr.forEachRow(2, (nameAttr, nameRs) => {
        let rs = MDL_content.getCt(nameRs, "rs");
        if(rs == null) return;

        let rawRc = makeRawRc(tryVal(typeStr_ow, "factory"), blk, blk.ex_getCraftTime(), true);
        let rcGrp = new CLASSES.RecipeItemGroup();
        baseParse(blk, rawRc);

        MDL_attr.getBlkAttrArr(nameAttr).forEachRow(3, (oblk, attrVal, nameAttr) => {
          addAttr(rawRc, rcGrp, oblk, attrVal, blk.size, true, blk.delegee.attrRcType);
        });
        addProd(rawRc, rs, blk.ex_getDynaAttrProdSpd(rs) / (rs instanceof Liquid ? 60.0 : (1.0 / blk.ex_getCraftTime())), rs instanceof Liquid);

        rawRc.complete();
        regisRc(rawRc);
      }, true);
    });
  };
  exports.regisRc_dynamicAttributeBlock = regisRc_dynamicAttributeBlock;


  /**
   * Registers extra recipes for {@link BLK_terrainDynamicDrill}.
   * @param {Block} blk
   * @param {ObjectMap} terItmMapMap
   * @return {void}
   */
  const regisRc_terrainDynamicDrill = function(blk, terItmMapMap) {
    if(!ENABLED) return;

    MDL_event.onLoad(() => {
      terItmMapMap.each((nameItm, terItmMap) => {
        let itm = MDL_content.getCt(nameItm, "rs");
        if(itm == null) return;
        let oreGrpMap = new ObjectMap();
        terItmMap.each((ter, nameRs) => {
          let rs = MDL_content.getCt(nameRs, "rs");
          if(rs == null) return;
          if(!oreGrpMap.containsKey(rs)) oreGrpMap.put(rs, new CLASSES.RecipeItemGroup());

          let rawRc = makeRawRc("collecting", blk, blk.drillTime / Math.pow(blk.size, 2), true);
          baseParse(blk, rawRc, Math.pow(blk.liquidBoostIntensity, 2));
          Vars.content.blocks().each(
            oblk => oblk.itemDrop === itm && ((oblk instanceof OverlayFloor) ? !oblk.wallOre : (oblk instanceof Floor)),
            oblk => addMineTile(rawRc, oreGrpMap.get(rs), oblk, blk.drillTime / blk.getDrillTime(itm), blk.size),
          );
          addProd(rawRc, rs, 1);
          addSubInfo(rawRc, MDL_text.getStat(fetchStat("lovec", "blk-terreq").localized(), MDL_terrain.getTerB(ter)));

          rawRc.complete();
          regisRc(rawRc);
        });
      });
    });
  };
  exports.regisRc_terrainDynamicDrill = regisRc_terrainDynamicDrill;


  /**
   * Registers recipes fpr {@link BLK_rangeWallDrill}.
   * @param {Block} blk
   * @return {void}
   */
  const regisRc_rangeWallDrill = function thisFun(blk) {
    if(!ENABLED) return;

    MDL_event.onLoad(() => {
      let oreGrpMap = new ObjectMap();
      thisFun.modeBlksMap[blk.mineMode].forEachFast(oblk => {
        if(!blk.ex_canMine(oblk, oblk.itemDrop, 1.0)) return;

        let blkTarget;
        if(blk.shouldDropPay) {
          blkTarget = MDL_content.getCt(DB_HANDLER.read("item-payload-block", oblk.itemDrop.name, null), "blk");
          if(blkTarget == null) return;
        };
        if(!oreGrpMap.containsKey(oblk.itemDrop)) oreGrpMap.put(oblk.itemDrop, new CLASSES.RecipeItemGroup());

        let rawRc = !blk.shouldDropPay ?
          makeRawRc("collecting", blk, blk.drillTime, true) :
          makeRawRc("collecting", blk, blk.drillTime * blkTarget.requirements[0] / Math.pow(blk.range, 2), true);
        baseParse(blk, rawRc, blk.optionalBoostIntensity);
        addMineTile(rawRc, oreGrpMap.get(oblk.itemDrop), oblk, blk.drillTime / blk.getDrillTime(oblk.itemDrop), Math.pow(blk.range, 2));
        !blk.shouldDropPay ?
          addProd(rawRc, oblk.itemDrop, Math.pow(blk.range, 2)) :
          addProd(rawRc, blkTarget, 1);

        rawRc.complete();
        regisRc(rawRc);
      });
    });
  }
  .setProp({
    modeBlksMap: (function() {
      let obj = {};
      MDL_event.onInit(() => {
        obj.floor = Vars.content.blocks().select(blk => blk.itemDrop != null && blk instanceof Floor && !blk.wallOre).toArray();
        obj.wall = Vars.content.blocks().select(blk => blk.itemDrop != null && (blk.solid || (blk instanceof Floor && blk.wallOre))).toArray();
        obj.both = obj.floor.concat(obj.wall);
      });
      return obj;
    })(),
  });
  exports.regisRc_rangeWallDrill = regisRc_rangeWallDrill;


  /**
   * Registers building recipe for {@link BLK_constructionCore}.
   * @param {Block} blk
   * @return {void}
   */
  const regisRc_constructionCore = function(blk) {
    if(!ENABLED) return;

    MDL_event.onLoad(() => {
      let blksReq = blk.ex_calcBlksReq([]);
      let rawRc = makeRawRc("building", blk.delegee.placeBlk, blk.constructionTimeReq);

      blksReq.forEachRow(2, (oblk, amt) => {
        addCons(rawRc, oblk, amt);
      });
      addSubInfo(rawRc, tb => {
        tb.row();
        blk.ex_buildConstructionPlan(tb);
      });

      rawRc.complete();
      regisRc(rawRc);
    });
  };
  exports.regisRc_constructionCore = regisRc_constructionCore;


  /**
   * Registers item output for {@link BLK_crop}.
   * @param {Block} blk
   * @return {void}
   */
  const regisRc_crop = function(blk) {
    if(!ENABLED) return;

    MDL_event.onLoad(() => {
      let i = 0;
      let iCap = blk.delegee.cropData.iCap();
      let itm, amt, p;
      while(i < iCap) {
        itm = blk.delegee.cropData[i].itm;
        amt = blk.delegee.cropData[i].amt;
        p = blk.delegee.cropData[i].p;
        if(itm != null && amt * p > 0.0) {
          let rawRc = makeRawRc("factory", blk, blk.ex_calcStageTotalTime(i) - blk.ex_calcStageTotalTime(blk.delegee.cropData[i].stageTo));
          addProd(rawRc, itm, amt * p);

          rawRc.complete();
          regisRc(rawRc);
        };
        i++;
      };
    });
  };
  exports.regisRc_crop = regisRc_crop;


  /**
   * Registers liquid output for {@link BLK_rainCollector}.
   * @param {Block} blk
   * @return {void}
   */
  const regisRc_rainCollector = function(blk) {
    if(!ENABLED) return;

    MDL_event.onLoad(() => {
      Vars.content.weathers().each(
        wea => wea instanceof RainWeather,
        wea => {
          let rawRc = makeRawRc("collecting", blk, 300.0);

          baseParse(blk, rawRc);
          addProd(rawRc, wea.liquid, blk.delegee.liqProdRate, true);

          rawRc.complete();
          regisRc(rawRc);
        },
      );
    });
  };
  exports.regisRc_rainCollector = regisRc_rainCollector;


  /**
   * Registers recipes for the recipe factory.
   * @param {Block} blk
   * @param {RecipeModule} rcMdl
   * @return {void}
   */
  const regisRc_recipeFactory = function thisFun(blk) {
    if(!ENABLED) return;

    if(thisFun.tmpSeq.size === 0) {
      Vars.content.items().each(itm => thisFun.tmpSeq.add(itm));
      Vars.content.liquids().each(liq => thisFun.tmpSeq.add(liq));
    };

    let
      rawRc,
      ciAlterChecked,
      biAlterChecked,
      amtCi,
      amtBi,
      amtCo,
      amtBo,
      rcGrp;

    MDL_event.onLoadDelayTask(5.0, () => {
      CLS_recipe.getBlkRcsMap().get(blk).forEachFast(rc => {
        rawRc = makeRawRc("factory", blk, blk.craftTime * rc.rcTimeScl);

        // Power
        if(blk.consPower != null) {
          addConsPow(rawRc, blk.consPower.usage);
        };

        // Erekir heat
        if(rc.erekirHeatReq > 0.0) addConsHeatErekir(rawRc, rc.erekirHeatReq);
        if(rc.erekirHeatProd > 0.0) addProdHeatErekir(rawRc, rc.erekirHeatProd);

        // Regular IO
        ciAlterChecked = false;
        biAlterChecked = false;
        thisFun.tmpSeq.each(ct0 => {
          amtCi = 0.0;
          amtBi = 0.0;
          amtCo = 0.0;
          amtBo = 0.0;

          // CI
          rc.ci.forEachRow(2, (tmp, amt) => {
            if(!(tmp instanceof Array)) {
              if(tmp === ct0) amtCi += amt;
            } else if(!ciAlterChecked) {
              rcGrp = new CLASSES.RecipeItemGroup();
              tmp.forEachRow(2, (tmp1, amt1) => {
                addConsAlter(rawRc, rcGrp, tmp1, amt1, true);
              });
              ciAlterChecked = true;
            };
          });

          // BI
          rc.bi.forEachRow(3, (tmp, amt, p) => {
            if(!(tmp instanceof Array)) {
              if(tmp === ct0) amtBi += amt * p;
            } else if(!biAlterChecked) {
              rcGrp = new CLASSES.RecipeItemGroup();
              tmp.forEachRow(3, (tmp1, amt1, p1) => {
                addConsAlter(rawRc, rcGrp, tmp1, amt1 * p1, false);
              });
              biAlterChecked = true;
            };
          });

          // AUX
          rc.aux.forEachRow(2, (ct, amt) => {
            if(ct === ct0) amtCi += amt;
          });

          // OPT (skipped here)

          // PAYI
          rc.payi.forEachRow(2, (nameCt, amt) => {
            addCons(rawRc, nameCt, amt, false);
          });

          // CO
          rc.co.forEachRow(2, (ct, amt) => {
            if(ct === ct0) amtCo += amt;
          });

          // BO
          rc.bo.forEachRow(3, (ct, amt, p) => {
            if(ct === ct0) amtBo += amt * p * (1.0 - rc.failP);
          });

          // FO
          rc.fo.forEachRow(3, (ct, amt, p) => {
            if(ct === ct0) amtBo += amt * p * rc.failP;
          });

          // PAYO
          rc.payo.forEachRow(2, (nameCt, amt) => {
            addProd(rawRc, nameCt, amt, false);
          });

          if(amtCi > 0.0) addCons(rawRc, ct0, amtCi, true);
          if(amtBi > 0.0) addCons(rawRc, ct0, amtBi, false);
          if(amtCo > 0.0) addProd(rawRc, ct0, amtCo, true);
          if(amtBo > 0.0) addProd(rawRc, ct0, amtBo, false);
        });

        // OPT
        rcGrp = new CLASSES.RecipeItemGroup();
        rc.opt.forEachRow(4, (ct, amt, p, mtp) => {
          addOpt(rawRc, rcGrp, ct, amt * p, mtp, false, rc.reqOpt);
        });
        if(rc.reqOpt) {
          addSubInfo(rawRc, MDL_text.getStat(MDL_bundle.getTerm("lovec", "require-optional"), Core.bundle.get("yes")));
        };
        addSubInfo_opt(rawRc, rc.opt);

        // Stat
        if(rc.isGen) addSubInfo(rawRc, MDL_bundle.getTerm("lovec", "generated-recipe").color(Color.gray));
        if(rc.failP > 0.0) addSubInfo(rawRc, MDL_text.getStat(MDL_bundle.getTerm("lovec", "chance-to-fail"), rc.failP.perc(1)));

        // For furnaces
        if(blk.ex_isSubInsOf("BLK_furnaceRecipeFactory") || blk.ex_isSubInsOf("BLK_electricFurnaceRecipeFactory")) {
          // Specific
          let fuelArr = Array.air;
          if(blk.ex_isSubInsOf("INTF_BLK_furnaceBlock")) {
            fuelArr = MDL_fuel.getFuelArr(blk);
          };

          // Stat
          if(rc.tempReq > 0.0) addSubInfo(rawRc, MDL_text.getStat(fetchStat("lovec", "blk0heat-tempreq").localized(), Strings.fixed(rc.tempReq, 2), fetchStatUnit("lovec", "heatunits").localized()));
          if(isFinite(rc.tempAllowed)) addSubInfo(rawRc, MDL_text.getStat(MDL_bundle.getTerm("lovec", "temperature-allowed"), Strings.fixed(rc.tempAllowed, 2), fetchStatUnit("lovec", "heatunits").localized()));
          if(fuelArr.length > 0) addSubInfo(rawRc, tb => {
            tb.row();
            tb.add(MDL_text.getStat(MDL_bundle.getTerm("lovec", "fuel"))).left();
            tb.row();
            MDL_table.setCtLi(tb, fuelArr, null, 10);
          });
        };

        rawRc.complete();
        regisRc(rawRc);
      }, true);
    });
  }
  .setProp({
    tmpSeq: new Seq(),
  });
  exports.regisRc_recipeFactory = regisRc_recipeFactory;
