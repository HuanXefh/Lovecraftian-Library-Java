/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to fuels, used mostly for {INTF_BLK_furnaceBlock}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets fuel point of some resource.
   * Returns consumption rate if it's a fluid.
   * ---------------------------------------- */
  const _fuelPon = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    return rs == null ?
      0.0 :
      DB_item.db["param"]["fuel"][rs instanceof Item ? "item" : "fluid"].read(rs.name, Array.airZero)[0];
  }
  .setCache();
  exports._fuelPon = _fuelPon;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets fuel level of some resource.
   * ---------------------------------------- */
  const _fuelLvl = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    return rs == null ?
      0.0 :
      DB_item.db["param"]["fuel"][rs instanceof Item ? "item" : "fluid"].read(rs.name, Array.airZero)[1];
  }
  .setCache();
  exports._fuelLvl = _fuelLvl;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list of available fuels for some block.
   * ---------------------------------------- */
  const _fuelArr = function(blk_gn) {
    const arr = [];

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null || tryJsProp(blk, "noFuelInput", false)) return arr;

    let allowedFuels = tryJsProp(blk, "allowedFuels");
    if(allowedFuels != null) {
      return allowedFuels.map(nmRs => MDL_content._ct(nmRs, "rs")).pullAll(null);
    };

    switch(tryJsProp(blk, "fuelType", "item")) {
      case "item" :
        arr.pushAll(VARGEN.fuelItms);
        break;
      case "liquid" :
        arr.pushAll(VARGEN.fuelLiqs);
        break;
      case "gas" :
        arr.pushAll(VARGEN.fuelGases);
        break;
      default :
        arr.pushAll(VARGEN.fuelItms);
        arr.pushAll(VARGEN.fuelLiqs);
        arr.pushAll(VARGEN.fuelGases);
    };

    return arr.inSituFilter(rs => !tryJsProp(blk, "blockedFuels", Array.air).includes(rs.name));
  }
  .setCache();
  exports._fuelArr = _fuelArr;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether some resource can be consumed by this block as fuel.
   * ---------------------------------------- */
  const _hasFuelInput = function(blk_gn, rs_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null || tryJsProp(blk, "noFuelInput", false)) return false;
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;
    let allowedFuels = tryJsProp(blk, "allowedFuels");
    if(allowedFuels != null) {
      return allowedFuels.includes(rs.name);
    };
    if(tryJsProp(blk, "blockedFuels", Array.air).includes(rs.name)) return false;

    switch(tryJsProp(blk, "fuelType", "item")) {
      case "item" : return VARGEN.fuelItms.includes(rs);
      case "liquid" : return VARGEN.fuelLiqs.includes(rs);
      case "gas" : return VARGEN.fuelGases.includes(rs);
      default : return VARGEN.fuelItms.includes(rs) || VARGEN.fuelLiqs.includes(rs) || VARGEN.fuelGases.includes(rs);
    };
  }
  .setCache();
  exports._hasFuelInput = _hasFuelInput;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the prefered fuel tuple for some building.
   * ---------------------------------------- */
  const _fuelTup = function thisFun(b) {
    if(tryJsProp(b.block, "noFuelInput", false)) return null;

    let
      fuelType = tryJsProp(b.block, "fuelType", "item"),
      blockedFuels = tryJsProp(b.block, "blockedFuels", Array.air),
      allowedFuels = tryJsProp(b.block, "allowedFuels"),
      fuelSel = tryJsProp(b, "fuelSel", null),
      fuel = null,
      fuelLvl = 0.0,
      fuelSpare = null,
      fuelLvlSpare = 0.0;

    // If a fuel is selected, return it instead
    if(fuelSel != null) {
      return [fuelSel, _fuelPon(fuelSel), _fuelLvl(fuelSel)];
    };

    // Find the fuel with highest fuel level
    let tmpLvl;
    if(b.items != null && fuelType.equalsAny(thisFun.filterTup1)) VARGEN.fuelItms.forEachFast(itm => {
      if((allowedFuels != null ? !allowedFuels.includes(itm.name) : blockedFuels.includes(itm.name)) || !b.items.has(itm)) return;
      tmpLvl = _fuelLvl(itm);
      if(tmpLvl > fuelLvl) {
        fuelSpare = fuel;
        fuelLvlSpare = fuelLvl;
        fuel = itm;
        fuelLvl = tmpLvl;
      };
    });
    if(b.liquids != null) {
      if(fuelType.equalsAny(thisFun.filterTup2)) VARGEN.fuelLiqs.forEachFast(liq => {
        if((allowedFuels != null ? !allowedFuels.includes(liq.name) : blockedFuels.includes(liq.name)) || b.liquids.get(liq < 0.01)) return;
        tmpLvl = _fuelLvl(liq);
        if(tmpLvl > fuelLvl) {
          fuelSpare = fuel;
          fuelLvlSpare = fuelLvl;
          fuel = liq;
          fuelLvl = tmpLvl;
        };
      });
      if(fuelType.equalsAny(thisFun.filterTup3)) VARGEN.fuelGases.forEachFast(gas => {
        if((allowedFuels != null ? !allowedFuels.includes(gas.name) : blockedFuels.includes(gas.name)) || b.liquids.get(gas < 0.01)) return;
        tmpLvl = _fuelLvl(gas);
        if(tmpLvl > fuelLvl) {
          fuelSpare = fuel;
          fuelLvlSpare = fuelLvl;
          fuel = gas;
          fuelLvl = tmpLvl;
        };
      });
    };

    // If the building produces the target fuel, try using the one with second highest level
    if(fuel != null && MDL_recipeDict._prodAmt(fuel, b.block) > 0.0 && fuelSpare != null) {
      fuel = fuelSpare;
      fuelLvl = fuelLvlSpare;
    };

    return fuel == null ?
      null :
      [fuel, _fuelPon(fuel), fuelLvl];
  }
  .setProp({
    filterTup1: ["item", "any"],
    filterTup2: ["liquid", "any"],
    filterTup3: ["gas", "any"],
  });
  exports._fuelTup = _fuelTup;
