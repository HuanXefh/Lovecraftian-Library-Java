/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Collection of recipe generators.
   * @module lovec/tp/TP_recipeGen
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Recipe generator: auxiliary fluid producer.
   * Produces auxiliary fluid base on temperature.
   */
  const _g_auxTemp = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      tg = readParam(metaObj, "tg"),
      maxTemp = readParam(metaObj, "maxTemp"),
      tempGap = readParam(metaObj, "tempGap", 300.0);

    if(tg == null) ERROR_HANDLER.throw("nullArgument", "tg");
    if(maxTemp == null) ERROR_HANDLER.throw("nullArgument", "maxTemp");

    this.setCateg("aux");
    let i = 1, tempCur = tempGap;
    while(tempCur <= maxTemp) {
      this.handleSingle(
        rc,
        tg,
        metaObj,
        {
          tag: i,
          tempReq: tempCur,
          liqO: tg,
          amtO: i / 6.0,
        },
      );
      i++;
      tempCur += tempGap;
    };
  });
  exports._g_auxTemp = _g_auxTemp;


  /**
   * Recipe generator: assembler.
   * Crafts various items, and payloads sometimes.
   */
  const _g_assembler = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      mode = readParam(metaObj, "mode", Array.air);

    this.setCateg("assembly");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["assembly"][mode],
      null,
      metaObj,
    );
  });
  exports._g_assembler = _g_assembler;


  /**
   * Recipe generator: alloy furnace.
   * Converts materials into alloy metal.
   */
  const _g_alloyFurnace = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("alloying");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["alloying"],
      null,
      metaObj,
    );
  });
  exports._g_alloyFurnace = _g_alloyFurnace;


  /**
   * Recipe generator: brick kiln.
   * Converts brick blend to brick.
   */
  const _g_brickKiln = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("brick-baking");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["brickBaking"],
      null,
      metaObj,
    );
  });
  exports._g_brickKiln = _g_brickKiln;


  /**
   * Recipe generator: carbonization furnace.
   * Handles recipes for charcoal, active carbon, etc.
   */
  const _g_carbonizationFurnace = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("carbonization");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["carbonization"],
      null,
      metaObj,
    );
  });
  exports._g_carbonizationFurnace = _g_carbonizationFurnace;


  /**
   * Recipe generator: caster.
   * Converts materials into casting target items.
   */
  const _g_caster = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("casting");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["casting"],
      null,
      metaObj,
    );
  });
  exports._g_caster = _g_caster;


  /**
   * Recipe generator: condenser.
   * Converts evaporized liquid into liquid.
   */
  const _g_condenser = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("condensation");

    // Steam condensation recipe on top of everything
    const STEAM_REFUND_FRAC = 0.75;
    this.handleSingle(
      rc,
      "loveclab-gas0misc-steam",
      metaObj,
      {
        liqI: "GROUP: steam",
        liqO: "loveclab-liq0ore-water",
        amtO: readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)) * STEAM_REFUND_FRAC,
      },
    );

    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["condensation"],
      null,
      metaObj,
    );
  });
  exports._g_condenser = _g_condenser;


  /**
   * Recipe generator: crusher.
   * Crushes biotic materials into biomass powder.
   */
  const _g_crusherBiomass = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      tg = readParam(metaObj, "tg", "loveclab-item0bio-biomass-powder"),
      noSawdust = readParam(metaObj, "noSawdust", false);

    this.setCateg("crushing");

    if(!noSawdust) {
      this.setTag("sawdust");
      this.handleSingle(
        rc,
        "loveclab-item0bio-log",
        metaObj,
        {
          tint: Pal.heal,
          itmI: "loveclab-item0bio-log",
          itmO: "loveclab-item0bio-sawdust",
        },
      );
      this.setTag();
    };

    this.handleNmNumArr(
      rc,
      DB_item.db["group"]["biomass"],
      null,
      (mtp, paramObj) => {
        paramObj.amtI = readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)) * mtp;
      },
      metaObj,
      (itm, metaObj) => ({
        keyRs: itm.name,
        itmI: itm,
        itmO: tg,
      }),
    );
  });
  exports._g_crusherBiomass = _g_crusherBiomass;


  const _g_dryer = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      includeItem = readParam(metaObj, "includeItem", true),
      includeLiquid = readParam(metaObj, "includeLiquid", false),
      includeGas = readParam(metaObj, "includeGas", false),
      mode = readParam(metaObj, "neutral", false);

    let arr = [];
    if(includeItem) arr.pushAll(DB_recipe.db["genData"]["dryingItem"]);
    if(includeLiquid) {
      arr.pushAll(DB_recipe.db["genData"]["dryingLiquid"]);
      if(mode === neutral || mode === "acidic") arr.pushAll(DB_recipe.db["genData"]["dryingLiquidAcidic"]);
      if(mode === neutral || mode === "basic") arr.pushAll(DB_recipe.db["genData"]["dryingLiquidBasic"]);
    };
    if(includeGas) {
      arr.pushAll(DB_recipe.db["genData"]["dryingGas"]);
      if(mode === neutral || mode === "acidic") arr.pushAll(DB_recipe.db["genData"]["dryingGasAcidic"]);
      if(mode === neutral || mode === "basic") arr.pushAll(DB_recipe.db["genData"]["dryingGasBasic"]);
    };

    this.setCateg("drying");
    this.handle2Arr(
      rc,
      arr,
      null,
      metaObj,
    );
  });
  exports._g_dryer = _g_dryer;


  /**
   * Recipe generator: freeze dryer.
   * Removes moisture through sublimation of ice.
   */
  const _g_dryerFreeze = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("drying");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["dryingFreeze"],
      null,
      metaObj,
    );
  });
  exports._g_dryerFreeze = _g_dryerFreeze;


  /**
   * Recipe generator: filter.
   * Separates items from slurry, or liquids from morbid solution.
   */
  const _g_filter = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      isItemFilter = readParam(metaObj, "isItemFilter", false);

    this.setCateg("filtration");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"][isItemFilter ? "filtration" : "filtrationLiquid"],
      null,
      metaObj,
    );
  });
  exports._g_filter = _g_filter;


  /**
   * Recipe generator: forge.
   * Converts materials into forging target items.
   */
  const _g_forge = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("forging");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["forging"],
      null,
      metaObj,
    );
  });
  exports._g_forge = _g_forge;


  /**
   * Recipe generator: heat exchanger.
   * Produces heat from hot fluids.
   */
  const _g_heaterExchange = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("heating");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["heatingExchange"],
      null,
      metaObj,
    );
  });
  exports._g_heaterExchange = _g_heaterExchange;


  /**
   * Recipe generator: gas heater.
   * Heats up some gases.
   */
  const _g_heaterGas = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("heating");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["heatingGas"],
      null,
      metaObj,
    );
  });
  exports._g_heaterGas = _g_heaterGas;


  /**
   * Recipe generator: mixer.
   * Mixes materials into blend.
   */
  const _g_mixer = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      isBallMill = readParam(metaObj, "isBallMill", false);

    metaObj.useCalculatedHardness = isBallMill;
    this.setCateg(isBallMill ? "ball-mill-mixing" : "mixing");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"][isBallMill ? "ballMillMixing" : "mixing"],
      null,
      metaObj,
    );
  });
  exports._g_mixer = _g_mixer;


  /**
   * Recipe generator: liquid mixer.
   * Mixes items and liquids to produce a solution.
   */
  const _g_mixerLiquid = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("liquid-mixing");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["mixingLiquid"],
      null,
      metaObj,
    );
    this.handleCtLi(
      rc,
      VARGEN.intmds["rs-sol"].filter(liq => liq.delegee.intmdParent != null && DB_HANDLER.read("liq-solvent", liq.delegee.solvent) != null),
      null,
      metaObj,
      (liq, metaObj) => {
        let liqSolv = DB_HANDLER.read("liq-solvent", liq.delegee.solvent);
        return {
          tag: liqSolv.name,
          liqI: liqSolv,
          itmI: liq.delegee.intmdParent,
          liqO: liq,
        };
      },
      liq => liq.delegee.intmdParent.name,
    );
  });
  exports._g_mixerLiquid = _g_mixerLiquid;


  /**
   * Recipe generator: pulverizer.
   * Converts ore items into dust.
   */
  const _g_pulverizer = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("pulverization");

    this.setTag("specific");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["pulverization"],
      null,
      metaObj,
    );
    this.setTag();

    this.handleCtLi(
      rc,
      VARGEN.intmds["rs-dust"].filter(itm => !DB_recipe.db["genData"]["pulverization"].colIncludes(itm.name, 2, 0) && !itm.ex_getIntmdTags().includesAny("rs-p1", "rs-p2") && !VARGEN.intmds["rs-chunks"].some(oitm => itm.delegee.intmdParent === oitm.delegee.intmdParent)),
      null,
      metaObj,
      (itm, metaObj) => ({
        itmI: itm.delegee.intmdParent,
        itmO: itm,
      }),
    );
  });
  exports._g_pulverizer = _g_pulverizer;


  /**
   * Recipe generator: purifier.
   * Purifies ore chunks/dusts.
   */
  const _g_purifier = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      tier = readParam(metaObj, "tier", 1);

    this.setCateg("purification");
    if(tier !== 0) {
      this.handle2Arr(
        rc,
        DB_recipe.db["genData"][tier === 2 ? "purificationII" : "purificationI"],
        null,
        metaObj,
      );
    } else {
      metaObj.paramObjF = paramObj => {
        if(MDL_cond._isWaste(paramObj.bo[0])) {
          // No purification target in the recipe
          paramObj.shouldSkip = true;
          return;
        };
        // Discard byproducts, double waste output amount
        paramObj.bo = paramObj.bo.slice(0, 6);
        paramObj.bo[4] *= 2.0;
      };
      this.handle2Arr(
        rc,
        DB_recipe.db["genData"]["purificationI"],
        null,
        metaObj,
      );
    };
  });
  exports._g_purifier = _g_purifier;


  /**
   * Recipe generator: purifier.
   * Purifies ore chunks/dusts. Specially designed for magnetic separators.
   */
  const _g_purifierMagnetic = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("purification");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["purificationMagnetic"],
      null,
      metaObj,
    );
  });
  exports._g_purifierMagnetic = _g_purifierMagnetic;


  /**
   * Recipe generator: mixing reactor.
   * Handles regular chemical reactions.
   */
  const _g_reactorMixing = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      isGas = readParam(metaObj, "isGas", false);

    this.setCateg(isGas ? "gas-reaction" : "liquid-reaction");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"][isGas ? "reactionGas" : "reactionLiquid"],
      null,
      metaObj,
    );
  });
  exports._g_reactorMixing = _g_reactorMixing;


  /**
   * Recipe generator: furnace reactor.
   * Handles reactions under high temperature.
   */
  const _g_reactorMelt = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("melt-reaction");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["reactionMelt"],
      null,
      metaObj,
    );
  });
  exports._g_reactorMelt = _g_reactorMelt;


  /**
   * Recipe generator: burner.
   * Handles combustion reactions.
   */
  const _g_reactorBurn = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      fuelType = readParam(metaObj, "fuelType", FuelTypes.ITEM);

    let arr = [];
    if((fuelType & FuelTypes.ITEM) !== 0) arr.pushAll(DB_recipe.db["genData"]["reactionBurnSolid"]);
    if((fuelType & FuelTypes.LIQUID) !== 0) arr.pushAll(DB_recipe.db["genData"]["reactionBurnLiquid"]);
    if((fuelType & FuelTypes.GAS) !== 0) arr.pushAll(DB_recipe.db["genData"]["reactionBurnGas"]);

    this.setCateg("combustion");
    this.handle2Arr(
      rc,
      arr,
      null,
      metaObj,
    );
  });
  exports._g_reactorBurn = _g_reactorBurn;


  /**
   * Recipe generator: roasting furnace.
   * Converts items to their roasted form.
   */
  const _g_roastingFurnace = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      isConcentrate = readParam(metaObj, "isConcentrate", false);

    this.setCateg("roasting");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"][!isConcentrate ? "roasting" : "concentrateRoasting"],
      null,
      metaObj,
    );
  });
  exports._g_roastingFurnace = _g_roastingFurnace;


  /**
   * Recipe generator: rock crusher.
   * Converts ore items into chunks.
   */
  const _g_rockCrusher = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("rock-crushing");

    this.setTag("specific");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"]["rockCrushing"],
      null,
      metaObj,
    );
    this.setTag();

    this.handleCtLi(
      rc,
      VARGEN.intmds["rs-chunks"].filter(itm => !DB_recipe.db["genData"]["rockCrushing"].colIncludes(itm.name, 2, 0) && !itm.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")),
      null,
      metaObj,
      (itm, metaObj) => ({
        keyRs: itm.delegee.intmdParent.name,
        itmI: itm.delegee.intmdParent,
        itmO: itm,
      }),
    );
  });
  exports._g_rockCrusher = _g_rockCrusher;


  /**
   * Recipe generator: rock crusher.
   * Converts some rocks into aggregate.
   * See {@link DB_item}.
   */
  const _g_rockCrusherAggregate = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      tg = readParam(metaObj, "tg", "loveclab-item0buil-coarse-aggregate"),
      noAggregateConvert = readParam(metaObj, "noAggregateConvert", false);

    this.setCateg("aggregate-crushing");

    if(!noAggregateConvert) {
      this.handleSingle(
        rc,
        "loveclab-item0buil-coarse-aggregate",
        metaObj,
        {
          keyRs: "loveclab-item0buil-coarse-aggregate",
          itmI: "loveclab-item0buil-coarse-aggregate",
          itmO: "loveclab-item0buil-fine-aggregate",
        },
      );
    };

    this.handleNmNumArr(
      rc,
      DB_item.db["group"]["aggregate"],
      null,
      (mtp, paramObj) => {
        paramObj.amtI = readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)) * mtp;
      },
      metaObj,
      (itm, metaObj) => ({
        keyRs: itm.name,
        itmI: itm,
        itmO: tg,
      }),
    );
  });
  exports._g_rockCrusherAggregate = _g_rockCrusherAggregate;


  /**
   * Recipe generator: rock crusher.
   * Converts raw ore blocks into corresponding ore items.
   * See {@link BLK_rawOreBlock}.
   */
  const _g_rockCrusherRawOreBlock = new CLS_recipeGenerator(function(rc, metaObj) {
    this.setCateg("raw-ore-block-crushing");
    this.handleCtLi(
      rc,
      VARGEN.rawOreBlks,
      blk => MDL_content._ct(Object.findKeyByVal(DB_HANDLER.getDataObj("itm-pay-blk"), blk.name, null), "rs"),
      metaObj,
      (itm, metaObj) => ({
        payI: DB_HANDLER.read("itm-pay-blk", itm.name),
        itmO: itm,
        amtO: readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)) * MDL_content._ct(DB_HANDLER.read("itm-pay-blk", itm.name), "blk").requirements[0].amount,
      }),
    );
  });
  exports._g_rockCrusherRawOreBlock = _g_rockCrusherRawOreBlock;


  /**
   * Recipe generator: sintering furnace.
   * Converts dust items back into their parent items (the ore at most time).
   */
  const _g_sinteringFurnace = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      isConcentrate = readParam(metaObj, "isConcentrate", false);

    if(!isConcentrate) {
      this.setCateg("sintering");
      this.handleCtLi(
        rc,
        VARGEN.intmds["rs-dust"].filter(itm => !itm.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")),
        null,
        metaObj,
        (itm, metaObj) => ({
          keyRs: itm.name,
          tempReq: DB_HANDLER.read("itm-sint-temp", itm.delegee.intmdParent, -1.0),
          itmI: itm,
          itmO: itm.delegee.intmdParent,
        }),
      );
    } else {
      this.setCateg("concentrate-sintering");
      this.handleCtLi(
        rc,
        VARGEN.intmds["rs-chunks"].concat(VARGEN.intmds["rs-dust"]).filter(itm => itm.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")),
        null,
        metaObj,
        (itm, metaObj) => ({
          keyRs: itm.name,
          tempReq: DB_HANDLER.read("itm-sint-temp", itm.delegee.intmdParent, -1.0),
          itmI: itm,
          itmO: MDL_content._intmd(itm.delegee.intmdParent, "rs-ore0conc"),
        }),
        itm => itm.delegee.intmdParent.name,
      );
    };
  });
  exports._g_sinteringFurnace = _g_sinteringFurnace;


  /**
   * Recipe generator: smelter.
   * Converts ore items (or concentrate items) to their refined form.
   */
  const _g_smelter = new CLS_recipeGenerator(function(rc, metaObj) {
    let
      isConcentrate = readParam(metaObj, "isConcentrate", false);

    this.setCateg("smelting");
    this.handle2Arr(
      rc,
      DB_recipe.db["genData"][!isConcentrate ? "smelting" : "concentrateSmelting"],
      null,
      metaObj,
    );
  });
  exports._g_smelter = _g_smelter;
