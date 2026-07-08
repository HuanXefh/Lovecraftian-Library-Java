/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to fuels, used mostly for {@link INTF_BLK_furnaceBlock}.
   * @module lovec/mdl/MDL_fuel
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Gets fuel point of some resource.
   * Returns consumption rate if it's a fluid.
   * @param {ResourceGn} rs_gn
   * @return {number}
   */
  const _fuelPon = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    return rs == null ?
      0.0 :
      DB_item.db["param"]["fuel"][rs instanceof Item ? "item" : "fluid"].read(rs.name, Array.airZero)[0];
  }
  .setCache();
  exports._fuelPon = _fuelPon;


  /**
   * Gets fuel level (1% of target temperature) of some resource.
   * @param {ResourceGn} rs_gn
   * @return {number}
   */
  const _fuelLvl = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    return rs == null ?
      0.0 :
      DB_item.db["param"]["fuel"][rs instanceof Item ? "item" : "fluid"].read(rs.name, Array.airZero)[1];
  }
  .setCache();
  exports._fuelLvl = _fuelLvl;


  /** @global */
  const FuelTypes = new CLS_enum({
    ALL: 0xff,
    ITEM: 1 << 0,
    LIQUID: 1 << 1,
    GAS: 1 << 2,
  })
  .globalize("FuelTypes");


  /**
   * Gets available fuels for some block.
   * @param {BlockGn} blk_gn
   * @return {Resource[]}
   */
  const _fuelArr = function(blk_gn) {
    let arr = [];

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null || tryJsProp(blk, "noFuelInput", false)) return arr;

    let allowedFuels = tryJsProp(blk, "allowedFuels");
    if(allowedFuels != null) {
      return allowedFuels.map(nameRs => MDL_content._ct(nameRs, "rs")).compact();
    };

    let fuelType = tryJsProp(blk, "fuelType", FuelTypes.ITEM);
    if((fuelType & FuelTypes.ITEM) !== 0) arr.pushAll(VARGEN.fuelItms);
    if((fuelType & FuelTypes.LIQUID) !== 0) arr.pushAll(VARGEN.fuelLiqs);
    if((fuelType & FuelTypes.GAS) !== 0) arr.pushAll(VARGEN.fuelGases);

    return arr.inSituFilter(rs => !tryJsProp(blk, "blockedFuels", Array.air).includes(rs.name));
  }
  .setCache();
  exports._fuelArr = _fuelArr;


  /**
   * Whether some resource can be consumed by this block as fuel.
   * @param {BlockGn} blk_gn
   * @param {ResourceGn} rs_gn
   * @return {boolean}
   */
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

    switch(tryJsProp(blk, "fuelType", FuelTypes.ITEM)) {
      case FuelTypes.ITEM : return VARGEN.fuelItms.includes(rs);
      case FuelTypes.LIQUID : return VARGEN.fuelLiqs.includes(rs);
      case FuelTypes.GAS : return VARGEN.fuelGases.includes(rs);
    };
    return VARGEN.fuelItms.includes(rs) || VARGEN.fuelLiqs.includes(rs) || VARGEN.fuelGases.includes(rs);
  }
  .setCache();
  exports._hasFuelInput = _hasFuelInput;


  /**
   * Gets preferred fuel tuple for some building, which should be a furnace.
   * @param {Building} b
   * @return {[Resource, number, number]|null} <TUP>: fuel, fuelPon, fuelLvl.
   */
  const _fuelTup = function(b) {
    if(tryJsProp(b.block, "noFuelInput", false)) return null;

    let
      fuelType = tryJsProp(b.block, "fuelType", FuelTypes.ITEM),
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

    // Find fuel with the highest fuel level
    let tmpLvl;
    if(b.items != null && (fuelType & FuelTypes.ITEM) !== 0) VARGEN.fuelItms.forEachFast(itm => {
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
      if((fuelType & FuelTypes.LIQUID) !== 0) VARGEN.fuelLiqs.forEachFast(liq => {
        if((allowedFuels != null ? !allowedFuels.includes(liq.name) : blockedFuels.includes(liq.name)) || b.liquids.get(liq < 0.01)) return;
        tmpLvl = _fuelLvl(liq);
        if(tmpLvl > fuelLvl) {
          fuelSpare = fuel;
          fuelLvlSpare = fuelLvl;
          fuel = liq;
          fuelLvl = tmpLvl;
        };
      });
      if((fuelType & FuelTypes.GAS) !== 0) VARGEN.fuelGases.forEachFast(gas => {
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

    // If the building produces the target fuel, try using the one with second-highest level
    if(fuel != null && MDL_recipeDict._prodAmt_b(fuel, b) > 0.0 && fuelSpare != null) {
      fuel = fuelSpare;
      fuelLvl = fuelLvlSpare;
    };

    return fuel == null ?
      null :
      [fuel, _fuelPon(fuel), fuelLvl];
  };
  exports._fuelTup = _fuelTup;
