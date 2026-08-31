/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to fluids and abstract fluids.
   * @module lovec/mdl/MDL_flow
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ auxiliary ------------------------------ */


  function halfLogWrap(val, val_hf, val_max, base) {
    return base == null ? (
      1.0 - 0.5 * (Math.log(val_max + 1.0) - Math.log(val + 1.0)) / (Math.log(val_max + 1.0) - Math.log(val_hf + 1.0))
    ) : (
      1.0 - 0.5 * (Mathf.log(base, val_max + 1.0) - Mathf.log(base, val + 1.0)) / (Mathf.log(base, val_max + 1.0) - Mathf.log(base, val_hf + 1.0))
    );
  };


  /* <------------------------------ base (group) ------------------------------ */


  /**
   * Gets elementary group of a fluid, null if not found.
   * @param {LiquidGn} liq_gn
   * @returns {string|null}
   */
  const getEleGrp = function(liq_gn) {
    let liq = MDL_content.getCt(liq_gn, "rs");
    if(liq == null) return null;

    let obj = DB_fluid.db["group"]["elementary"];
    for(let key in obj) {
      if(obj[key].includes(liq.name)) return key;
    };

    return null;
  }
  .setCache();
  exports.getEleGrp = getEleGrp;


  /**
   * `BUNDLE`: "term.common-term-grp-<eleGrp>.name".
   * @param {LiquidGn} liq_gn
   * @return {string}
   */
  const getEleGrpB = function(liq_gn) {
    let eleGrp = getEleGrp(liq_gn);
    if(eleGrp == null) return TmpStateTag.error;

    return MDL_bundle.getTerm("common", "grp-" + eleGrp);
  }
  .setCache();
  exports.getEleGrpB = getEleGrpB;


  /**
   * Gets material group of a block, mostly for corrosion calculation.
   * Not floor material in {@link ENV_materialFloor}!
   * @param {BlockGn} blk_gn
   * @returns {string|null}
   */
  const getMatGrp = function(blk_gn) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    if(blk == null) return null;

    let obj = DB_block.db["group"]["material"];
    for(let key in obj) {
      if(obj[key].includes(blk.name)) return key;
    };

    return null;
  }
  .setCache();
  exports.getMatGrp = getMatGrp;


  /**
   * `BUNDLE`: "term.common-term-grp-<matGrp>.name".
   * @param {BlockGn} blk_gn
   * @return {string}
   */
  const getMatGrpB = function(blk_gn) {
    let matGrp = getMatGrp(blk_gn);
    if(matGrp == null) return TmpStateTag.error;

    return MDL_bundle.getTerm("common", "grp-" + matGrp);
  }
  .setCache();
  exports.getMatGrpB = getMatGrpB;


  /**
   * Gets fluid tags of the given fluid.
   * @param {LiquidGn} liq_gn
   * @return {Array<string>}
   */
  const getFTags = function(liq_gn) {
    let arr0 = [];

    let liq = MDL_content.getCt(liq_gn, "rs");
    if(liq == null) return arr0;

    Object.eachPair(DB_fluid.db["group"]["fTag"], (key, arr) => {
      if(arr.includes(liq.name)) arr0.push(key);
    });

    return arr0;
  }
  .setCache();
  exports.getFTags = getFTags;


  /**
   * Gets fluid tag text of the given fluid.
   * <br> `BUNDLE`: "term.common-grp-<fldTag>.name".
   * @param {LiquidGn} liq_gn
   * @return {string}
   */
  const getFTagsB = function(liq_gn) {
    return MDL_text.getTagText(
      getFTags(liq_gn).map(tag => MDL_bundle.getTerm("common", "grp-" + tag))
    );
  }
  .setCache();
  exports.getFTagsB = getFTagsB;


  /* <------------------------------ base (param) ------------------------------ */


  /**
   * Gets density of a fluid.
   * <br> `DB`: liquid-density.
   * @param {LiquidGn} liq_gn
   * @return {number}
   */
  const getDens = function(liq_gn) {
    let dens = 1.0;
    let liq = MDL_content.getCt(liq_gn, "rs");
    if(liq == null) return dens;

    dens = DB_HANDLER.read("liquid-density", liq);
    if(dens == null) {
      let dens_def = liq.gas ? 0.00129 : 1.0;
      let eleGrp = getEleGrp(liq);
      dens = eleGrp == null ? dens_def : DB_fluid.db["grpParam"]["dens"].read(eleGrp, dens_def);
    };

    return dens;
  }
  .setCache();
  exports.getDens = getDens;


  /**
   * Gets boiling point of a fluid (in HU).
   * <br> `DB`: liquid-boiling-point.
   * @param {LiquidGn} liq_gn
   * @return {number}
   */
  const getBoilPon = function(liq_gn) {
    let boilPon = 100.0;
    let liq = MDL_content.getCt(liq_gn, "rs");
    if(liq == null) return boilPon;

    if(liq.solvent != null) {
      boilPon = DB_fluid.db["grpParam"]["solventBoil"].read(liq.solvent);
      if(boilPon != null) return boilPon;
    };

    boilPon = DB_HANDLER.read("liquid-boiling-point", liq);
    if(boilPon == null) {
      let eleGrp = getEleGrp(liq);
      boilPon = eleGrp == null ?
        100.0 :
        DB_fluid.db["grpParam"]["boil"].read(eleGrp, 100.0);
    };

    return boilPon;
  }
  .setCache();
  exports.getBoilPon = getBoilPon;


  /**
   * Gets fluid heat of a fluid.
   * <br> `DB`: liquid-fluid-heat.
   * @param {LiquidGn} liq_gn
   * @return {number}
   */
  const getFHeat = function(liq_gn) {
    let def = 26.0, fHeat = def;
    let liq = MDL_content.getCt(liq_gn, "rs");
    if(liq == null) return fHeat;

    fHeat = DB_HANDLER.read("liquid-fluid-heat", liq, def);

    return fHeat;
  }
  .setCache();
  exports.getFHeat = getFHeat;


  /**
   * Gets wrapped temperature of a fluid.
   * @param {LiquidGn} liq_gn
   * @return {number}
   */
  const getTempWrap = function(liq_gn) {
    return halfLogWrap(getFHeat(liq_gn), 26.0, 1500.0);
  }
  .setCache();
  exports.getTempWrap  = getTempWrap;


  /**
   * Gets wrapped viscosity of a fluid.
   * <br> `DB`: liquid-viscosity.
   * @param {LiquidGn} liq_gn
   * @return {number}
   */
  const getViscWrap = function(liq_gn) {
    let viscWrap = 0.5;
    let liq = MDL_content.getCt(liq_gn, "rs");
    if(liq == null) return viscWrap;

    let visc = DB_HANDLER.read("liquid-viscosity", liq);
    if(visc != null) {
      viscWrap = halfLogWrap(visc, 0.98, 2800.0);
    } else {
      if(liq.gas) {
        viscWrap = 0.15;
      } else {
        let eleGrp = getEleGrp(liq);
        viscWrap = eleGrp == null ? 0.5 : DB_fluid.db["grpParam"]["viscWrap"].read(eleGrp, 0.5);
      };
    };

    return viscWrap;
  }
  .setCache();
  exports.getViscWrap = getViscWrap;


  /**
   * Gets maximum pressure allowed for a block.
   * <br> `DB`: block-pressure-resistance.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const getPresRes = function(blk_gn) {
    let res = 5.0;
    let blk = MDL_content.getCt(blk_gn, "blk");
    if(blk == null) return res;

    res = DB_HANDLER.read("block-pressure-resistance", blk);
    if(res == null) {
      let matGrp = getMatGrp(blk);
      res = matGrp == null ? 5.0 : DB_block.db["grpParam"]["presRes"].read(matGrp, 5.0);
    };

    return res;
  }
  .setCache();
  exports.getPresRes = getPresRes;


  /**
   * Gets maximum vacuum allowed for a block.
   * <br> `DB`: block-vacuum-resistance.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const getVacRes = function(blk_gn) {
    let res = -5.0;
    let blk = MDL_content.getCt(blk_gn, "blk");
    if(blk == null) return res;

    res = DB_HANDLER.read("block-vacuum-resistance", blk);
    if(res == null) {
      let matGrp = getMatGrp(blk);
      res = matGrp == null ? -5.0 : DB_block.db["grpParam"]["vacRes"].read(matGrp, -5.0);
    };

    return res;
  }
  .setCache();
  exports.getVacRes = getVacRes;


  /**
   * Gets pressure in a building, can be negative for vacuum.
   * @param {Building} b
   * @return {number}
   */
  const getPresByBuild = function(b) {
    return tryFun(
      b.ex_getPres, b,
      b.liquids == null ? 0.0 : (b.liquids.get(VARGEN.auxPres) - b.liquids.get(VARGEN.auxVac))
    );
  };
  exports.getPresByBuild = getPresByBuild;


  /* <------------------------------ corrosion ------------------------------ */


  /**
   * Gets corrosion power of a fluid.
   * <br> `DB`: liq-core-pow.
   * @param {LiquidGn} liq_gn
   * @return {number}
   */
  const getCorPow = function(liq_gn) {
    let corPow = 0.0;
    let liq = MDL_content.getCt(liq_gn, "rs");
    if(liq == null) return corPow;

    corPow = DB_HANDLER.read("liquid-corrosion-power", liq);
    if(corPow == null) {
      let eleGrp = getEleGrp(liq);
      corPow = eleGrp == null ? 0.0 : corPow = DB_fluid.db["grpParam"]["corrosion"].read(eleGrp, 0.0);
    };

    return corPow;
  }
  .setCache();
  exports.getCorPow = getCorPow;


  /**
   * Calculates multiplier on corrosion damage for a pair of block and fluid.
   * @param {BlockGn} blk_gn
   * @param {LiquidGn} liq_gn
   * @return {number}
   */
  const calcCorMtp = function(blk_gn, liq_gn) {
    let corMtp = 1.0;
    let blk = MDL_content.getCt(blk_gn, "blk");
    let liq = MDL_content.getCt(liq_gn, "rs");
    if(blk == null || liq == null) return corMtp;
    let eleGrp = tryJsProp(liq, "eleGrp", null);
    let matGrp = tryJsProp(blk, "matGrp", null);
    if(matGrp == null) return corMtp;

    let matEleSclArr = DB_fluid.db["grpParam"]["matEleScl"][matGrp];
    corMtp = eleGrp == null || matEleSclArr == null ? 1.0 : matEleSclArr.read(eleGrp, 1.0);
    let tagMtp, matFTagSclArr;
    tryJsProp(liq, "fTags", Array.air).forEachFast(tag => {
      matFTagSclArr = DB_fluid.db["grpParam"]["matFTagScl"][matGrp];
      tagMtp = matFTagSclArr == null ? 1.0 : matFTagSclArr.read(tag, 1.0);
      corMtp *= tagMtp;
    }, true);

    return corMtp;
  }
  .setCache();
  exports.calcCorMtp = calcCorMtp;


  /**
   * Gets corrosion resistance of a block.
   * <br> `DB`: block-corrosion-resistance.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const getCorRes = function(blk_gn) {
    let corRes = 1.0;
    let blk = MDL_content.getCt(blk_gn, "blk");
    if(blk == null) return corRes;

    corRes = DB_HANDLER.read("block-corrosion-resistance", blk);
    if(corRes == null) {
      let matGrp = getMatGrp(blk);
      corRes = matGrp == null ? 1.0 : DB_block.db["grpParam"]["corRes"].read(matGrp, 1.0);
    };

    return corRes;
  }
  .setCache();
  exports.getCorRes = getCorRes;


  /* <------------------------------ heat ------------------------------ */


  /**
   * Gets maximum heat allowed for a block.
   * <br> `DB`: block-heat-resistance.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const getHeatRes = function(blk_gn) {
    let heatRes = Infinity;
    let blk = MDL_content.getCt(blk_gn, "blk");
    if(blk == null) return heatRes;

    heatRes = DB_HANDLER.read("block-heat-resistance", blk);
    if(heatRes == null) {
      let matGrp = getMatGrp(blk);
      heatRes = matGrp == null ? Infinity : DB_block.db["grpParam"]["heatRes"].read(matGrp, Infinity);
    };

    return heatRes;
  }
  .setCache();
  exports.getHeatRes = getHeatRes;


  /**
   * Gets heat in a building.
   * @param {Building} b
   * @return {number}
   */
  const getHeatInBuild = function(b) {
    return tryFun(
      b.ex_getHeat, b,
      b.liquids == null ? 0.0 : b.liquids.get(VARGEN.auxHeat) * 100.0,
    );
  };
  exports.getHeatInBuild = getHeatInBuild;


  /**
   * Gets current fluid heat in a building.
   * @param {Building} b
   * @param {boolean|unset} [forceCalc] - If true, this method will always calculate heat based on liquid module.
   * @return {number}
   */
  const getFHeatInBuild = function(b, forceCalc) {
    let def = PARAM.GLOBAL_HEAT;
    if(!forceCalc) {
      if(tryJsProp(b, "fHeatCur") != null) return b.delegee.fHeatCur;
    };
    if(b.liquids == null) return def;

    let liqCur = b.liquids.current();
    let amt = b.liquids.get(liqCur);
    if(amt < 0.01) return def;
    let cap = b.block.liquidCapacity;
    if(cap < 0.0001) return def;
    let fHeatBase = DB_HANDLER.read("liquid-fluid-heat", liqCur, def);

    return fHeatBase * (1.0 + amt / cap * 0.2);
  };
  exports.getFHeatInBuild = getFHeatInBuild;


  /**
   * Calculates range heat at some tile.
   * @param {Tile|null} t
   * @return {number}
   */
  const calcRHeat = function(t) {
    if(t == null) return 0.0;

    // Heat from building and global heat
    let rHeat = t.build == null ?
      PARAM.GLOBAL_HEAT :
      (getHeatInBuild(t.build) * 0.25 + getFHeatInBuild(t.build) * 0.5 + PARAM.GLOBAL_HEAT);
    // Heat from attribute
    rHeat += t.floor().attributes.get(Attribute.get("lovec-attr0env-heat")) * 100.0;
    // Heat from puddle
    let puddle = Puddles.get(t);
    if(puddle != null) {
      rHeat += getFHeat(puddle.liquid) * 0.75;
    };
    // Heat from nearby buildings
    let rHeatSpare = 0.0, countSpare = 0, ot;
    for(let i = 0; i < 4; i++) {
      ot = t.nearby(i);
      if(ot != null && ot.build != null) {
        rHeatSpare += getHeatInBuild(ot.build);
        countSpare++;
      };
    };
    if(countSpare > 0) rHeat += rHeatSpare / countSpare;

    return rHeat;
  };
  exports.calcRHeat = calcRHeat;


  /**
   * Gets range heat resistance of a unit type.
   * @param {UnitType} utp
   * @return {number}
   */
  const getRHeatRes = function(utp) {
    return Math.sqrt(utp.health) * utp.hitSize * 0.7;
  };
  exports.getRHeatRes = getRHeatRes;
