/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to fluids and abstract fluids.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_text = require("lovec/mdl/MDL_text");


  const DB_block = require("lovec/db/DB_block");
  const DB_fluid = require("lovec/db/DB_fluid");


  /* <---------- auxiliay ----------> */


  function halfLogWrap(val, val_hf, val_max, base) {
    return base == null ? (
      1.0 - 0.5 * (Math.log(val_max + 1.0) - Math.log(val + 1.0)) / (Math.log(val_max + 1.0) - Math.log(val_hf + 1.0))
    ) : (
      1.0 - 0.5 * (Mathf.log(base, val_max + 1.0) - Mathf.log(base, val + 1.0)) / (Mathf.log(base, val_max + 1.0) - Mathf.log(base, val_hf + 1.0))
    );
  };


  /* <---------- base (group) ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the elementary group of a fluid.
   * An elementary group is a collection of fluids similar in properties.
   * ---------------------------------------- */
  const _eleGrp = function(liq_gn) {
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return null;

    let obj = DB_fluid.db["group"]["elementary"];
    for(let key in obj) {
      if(obj[key].includes(liq.name)) return key;
    };

    return null;
  };
  exports._eleGrp = _eleGrp;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name of elementary group from the bundle.
   * For {"acidAq"}, this will return {"term.common-term-grp-acidaq.name"}.
   * The same for other groups.
   * ---------------------------------------- */
  const _eleGrpB = function(liq_gn) {
    let eleGrp = _eleGrp(liq_gn);
    if(eleGrp == null) return "!ERR";

    return MDL_bundle._term("common", "grp-" + eleGrp);
  };
  exports._eleGrpB = _eleGrpB;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the material group of a block, mostly for corrosion calculation.
   * This is not floor material, which is related to terrain instead.
   * ---------------------------------------- */
  const _matGrp = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return null;

    let obj = DB_block.db["group"]["material"];
    for(let key in obj) {
      if(obj[key].includes(blk.name)) return key;
    };

    return null;
  };
  exports._matGrp = _matGrp;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name of material group from the bundle.
   * ---------------------------------------- */
  const _matGrpB = function(blk_gn) {
    let matGrp = _matGrp(blk_gn);
    if(matGrp == null) return "!ERR";

    return MDL_bundle._term("common", "grp-" + matGrp);
  };
  exports._matGrpB = _matGrpB;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list of fluid tags of the fluid.
   * Fluid tags provide extra multipliers on corrosion damage.
   * ---------------------------------------- */
  const _fTags = function(liq_gn) {
    const arr0 = [];

    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return arr0;

    Object._it(DB_fluid.db["group"]["fTag"], (key, arr) => {
      if(arr.includes(liq.name)) arr0.push(key);
    });

    return arr0;
  }
  .setCache();
  exports._fTags = _fTags;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the tag text of fluid tags based on the bundle.
   * ---------------------------------------- */
  const _fTagsB = function(liq_gn) {
    return MDL_text._tagText(
      _fTags(liq_gn).cpy().substitute(tag => MDL_bundle._term("common", "grp-" + tag))
    );
  };
  exports._fTagsB = _fTagsB;


  /* <---------- base (param) ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets density of a fluid.
   * ---------------------------------------- */
  const _dens = function(liq_gn) {
    let dens = 1.0;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return dens;

    dens = DB_HANDLER.read("liq-dens", liq);
    if(dens == null) {
      let dens_def = liq.gas ? 0.00121 : 1.0;
      let eleGrp = _eleGrp(liq);
      dens = eleGrp == null ? dens_def : DB_fluid.db["grpParam"]["dens"].read(eleGrp, dens_def);
    };

    return dens;
  };
  exports._dens = _dens;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets boiling point of a fluid.
   * ---------------------------------------- */
  const _boilPon = function(liq_gn) {
    let boilPon = 100.0;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return boilPon;

    if(liq.solvent != null) {
      boilPon = DB_fluid.db["grpParam"]["solventBoil"].read(liq.solvent);
      if(boilPon != null) return boilPon;
    };

    boilPon = DB_HANDLER.read("liq-boil-pon", liq);
    if(boilPon == null) {
      let eleGrp = _eleGrp(liq);
      boilPon = eleGrp == null ?
        100.0 :
        DB_fluid.db["grpParam"]["boil"].read(eleGrp, 100.0);
    };

    return boilPon;
  };
  exports._boilPon = _boilPon;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets fluid heat of a fluid.
   * This will affect temperature.
   * ---------------------------------------- */
  const _fHeat = function(liq_gn) {
    let def = 26.0, fHeat = def;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return fHeat;

    fHeat = DB_HANDLER.read("liq-fheat", liq, def);

    return fHeat;
  };
  exports._fHeat = _fHeat;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets wrapped temperature.
   * ---------------------------------------- */
  const _tempWrap = function(liq_gn) {
    return halfLogWrap(_fHeat(liq_gn), 26.0, 1500.0);
  };
  exports._tempWrap  = _tempWrap;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets wrapped viscosity.
   * ---------------------------------------- */
  const _viscWrap = function(liq_gn) {
    let viscWrap = 0.5;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return viscWrap;

    let visc = DB_HANDLER.read("liq-visc", liq);
    if(visc != null) {
      viscWrap = halfLogWrap(visc, 0.98, 2800.0);
    } else {
      if(liq.gas) {
        viscWrap = 0.15;
      } else {
        let eleGrp = _eleGrp(liq);
        viscWrap = eleGrp == null ? 0.5 : DB_fluid.db["grpParam"]["viscWrap"].read(eleGrp, 0.5);
      };
    };

    return viscWrap;
  };
  exports._viscWrap = _viscWrap;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the maximum pressure allowed in a block.
   * ---------------------------------------- */
  const _presRes = function(blk_gn) {
    let res = 5.0;
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return res;

    res = DB_HANDLER.read("blk-pres-res", blk);
    if(res == null) {
      let matGrp = _matGrp(blk);
      res = matGrp == null ? 5.0 : DB_block.db["grpParam"]["presRes"].read(matGrp, 5.0);
    };

    return res;
  };
  exports._presRes = _presRes;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the maximum vacuum allowed in a block.
   * ---------------------------------------- */
  const _vacRes = function(blk_gn) {
    let res = -5.0;
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return res;

    res = DB_HANDLER.read("blk-vac-res", blk);
    if(res == null) {
      let matGrp = _matGrp(blk);
      res = matGrp == null ? -5.0 : DB_block.db["grpParam"]["vacRes"].read(matGrp, -5.0);
    };

    return res;
  };
  exports._vacRes = _vacRes;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the pressure in a building.
   * Can be negative which is for vacuum.
   * ---------------------------------------- */
  const _pres = function(b) {
    return tryFun(
      b.ex_getPres, b,
      b.liquids == null ? 0.0 : (b.liquids.get(VARGEN.auxPres) - b.liquids.get(VARGEN.auxVac))
    );
  };
  exports._pres = _pres;


  /* <---------- corrosion ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets corrosion power of a fluid.
   * ---------------------------------------- */
  const _corPow = function(liq_gn) {
    let corPow = 0.0;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return corPow;

    corPow = DB_HANDLER.read("liq-cor-pow", liq);
    if(corPow == null) {
      let eleGrp = _eleGrp(liq);
      corPow = eleGrp == null ? 0.0 : corPow = DB_fluid.db["grpParam"]["corrosion"].read(eleGrp, 0.0);
    };

    return corPow;
  };
  exports._corPow = _corPow;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets multiplier on corrosion damage based on fluid and material of the block.
   * ---------------------------------------- */
  const _corMtp = function(blk_gn, liq_gn) {
    let corMtp = 1.0;
    let blk = MDL_content._ct(blk_gn, "blk");
    let liq = MDL_content._ct(liq_gn, "rs");
    if(blk == null || liq == null) return corMtp;
    let eleGrp = tryJsProp(liq, "eleGrp", null);
    let matGrp = tryJsProp(blk, "matGrp", null);
    if(eleGrp == null || matGrp == null) return corMtp;

    let matEleSclArr = DB_fluid.db["grpParam"]["matEleScl"][matGrp];
    corMtp = matEleSclArr == null ? 1.0 : matEleSclArr.read(eleGrp, 1.0);
    let tagMtp, matFTagSclArr;
    tryJsProp(liq, "fTags", Array.air).forEachFast(tag => {
      matFTagSclArr = DB_fluid.db["grpParam"]["matFTagScl"][matGrp];
      tagMtp = matFTagSclArr == null ? 1.0 : matFTagSclArr.read(tag, 1.0);
      corMtp *= tagMtp;
    });

    return corMtp;
  };
  exports._corMtp = _corMtp;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets corrosion resistance of the block.
   * ---------------------------------------- */
  const _corRes = function(blk_gn) {
    let corRes = 1.0;
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return corRes;

    corRes = DB_HANDLER.read("blk-cor-res", blk);
    if(corRes == null) {
      let matGrp = _matGrp(blk);
      corRes = matGrp == null ? 1.0 : DB_block.db["grpParam"]["corRes"].read(matGrp, 1.0);
    };

    return corRes;
  };
  exports._corRes = _corRes;


  /* <---------- heat ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the maximum heat that this block can withstand.
   * ---------------------------------------- */
  const _heatRes = function(blk_gn) {
    let heatRes = Infinity;
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return heatRes;

    heatRes = DB_HANDLER.read("blk-heat-res", blk);
    if(heatRes == null) {
      let matGrp = _matGrp(blk);
      heatRes = matGrp == null ? Infinity : DB_block.db["grpParam"]["heatRes"].read(matGrp, Infinity);
    };

    return heatRes;
  };
  exports._heatRes = _heatRes;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets heat in a building.
   * ---------------------------------------- */
  const _heat_b = function(b) {
    return tryFun(
      b.ex_getHeat, b,
      b.liquids == null ? 0.0 : b.liquids.get(VARGEN.auxHeat) * 100.0,
    );
  };
  exports._heat_b = _heat_b;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current fluid heat in a building.
   * ---------------------------------------- */
  const _fHeat_b = function(b, forceCalc) {
    let def = PARAM.glbHeat;
    if(!forceCalc) {
      if(tryJsProp(b, "fHeatCur") != null) return b.delegee.fHeatCur;
    };
    if(b.liquids == null) return def;

    let liqCur = b.liquids.current();
    let amt = b.liquids.get(liqCur);
    if(amt < 0.01) return def;
    let cap = b.block.liquidCapacity;
    if(cap < 0.0001) return def;
    let fHeatBase = DB_HANDLER.read("liq-fheat", liqCur, def);

    return fHeatBase * (1.0 + amt / cap * 0.2);
  };
  exports._fHeat_b = _fHeat_b;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the range heat at {t}.
   * ---------------------------------------- */
  const _rHeat = function(t) {
    if(t == null) return 0.0;

    // Heat from building and global heat
    let rHeat = t.build == null ?
      PARAM.glbHeat :
      (_heat_b(t.build) * 0.25 + _fHeat_b(t.build) * 0.5 + PARAM.glbHeat);
    // Heat from attribute
    rHeat += t.floor().attributes.get(Attribute.get("lovec-attr0env-heat")) * 100.0;
    // Heat from nearby buildings
    let rHeatSpare = 0.0, countSpare = 0, ot;
    (4)._it(1, ind => {
      ot = t.nearby(ind);
      if(ot != null && ot.build != null) {
        rHeatSpare += _heat_b(ot.build);
        countSpare++;
      };
    });
    if(countSpare > 0) rHeat += rHeatSpare / countSpare;

    return rHeat;
  };
  exports._rHeat = _rHeat;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the range heat resistance for a unit type.
   * ---------------------------------------- */
  const _rHeatRes = function(utp) {
    return Math.sqrt(utp.health) * utp.hitSize * 0.75;
  };
  exports._rHeatRes = _rHeatRes;
