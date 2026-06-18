/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to terrain type calculation.
   * The proper name should be "biome", but it's too late for me too.
   * @module lovec/mdl/MDL_terrain
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- auxiliary ----------> */


  const usedMatGrps = (function() {
    let arr = [];
    MDL_event._c_onInit(() => {
      Vars.content.blocks().each(
        blk => tryJsProp(blk, "tempTags", Array.air).includes("blk-mat0flr"),
        blk => usedMatGrps.pushUnique(tryJsProp(blk, "matGrp", "none")),
      );
      usedMatGrps.pull("none");
    });
    return arr;
  })();
  const warnedMatGrps = [];


  const terGetters = [];
  const bankTerGetters = [];
  const bankTerMatGrps = {};


  function warnUnusedMatGrp(matGrp) {
    if(!warnedMatGrps.includes(matGrp) && !usedMatGrps.includes(matGrp)) {
      console.warn("[LOVEC] Material group ${1} is not used by any block!".format(matGrp.color(Pal.accent)));
      warnedMatGrps.push(matGrp);
    };
  };


  /**
   * <ARGS>: countMap, ters.
   * <br> <ARGS>: countMap, ter1, ter2, ter3, ...
   */
  function sumCountTers(countMap) {
    let count = 0;
    if(arguments[1] instanceof Array) {
      arguments[1].forEachFast(ter => {
        count += countMap.get(ter, 0);
      });
    } else {
      let i = 1, iCap = arguments.length;
      while(i < iCap) {
        count += countMap.get(arguments[i], 0);
        i++;
      };
    };
    return count;
  };


  /* <---------- base ----------> */


  /**
   * Registers a new terrain type composed of given material groups.
   * @param {string} ter
   * @param {Array<string>} matGrps
   * @return {void}
   */
  const newTerGetter = function(ter, matGrps) {
    terGetters.push((map, count, thr) => sumCountTers(map, matGrps) / count < thr ? "!PENDING" : ter);
  };
  exports.newTerGetter = newTerGetter;


  /**
   * Registers a new bank terrain type with given material group as the liquid part.
   * @param {string} ter
   * @param {string} liqMatGrp
   * @return {void}
   */
  const newBankTerGetter = function(ter, liqMatGrp) {
    bankTerGetters.push((map, count, thr) => map.get(liqMatGrp, 0) / count < thr * VAR.param.terBankLiqFrac || sumCountTers(map, tryVal(bankTerMatGrps[ter], Array.air)) / count < thr * VAR.param.terBankGroundFrac ? "!PENDING" : ter);
  };
  exports.newBankTerGetter = newBankTerGetter;


  /**
  * Sets ground part for a bank terrain type with given material groups.
  * Does not remove previously added ones.
  * @param {string} nm
  * @param {Array<string>} matGrps
  * @return {void}
  */
  const setBankTerMatGrps = function(nm, matGrps) {
    if(bankTerMatGrps[nm] == null) {
      bankTerMatGrps[nm] = [];
    };
    matGrps.forEachFast(matGrp => {
      warnUnusedMatGrp(matGrp);
      bankTerMatGrps[nm].pushUnique(matGrp);
    });
  };
  exports.setBankTerMatGrps = setBankTerMatGrps;


  /**
   * Gets terrain type at some tile.
   * @param {Tile} t
   * @param {number|unset} [size]
   * @param {number|unset} [checkR]
   * @return {string|null} - Terrain type "transition" is null.
   */
  const _ter = function thisFun(t, size, checkR) {
    if(t == null) return null;
    if(size == null) size = 1;
    if(checkR == null) checkR = 5;

    let ts = MDL_pos._tsRect(thisFun.tmpTs, t, checkR, size);
    if(ts.length === 0) return null;
    let count = Math.pow(checkR * 2 + size, 2);
    while(ts.length < count) {
      ts.push(null);
    };

    thisFun.countMap.clear();
    let ter;
    ts.forEachFast(ot => {
      if(PARAM.ENABLE_TEST_DRAW && ot != null) {
        Fx.placeBlock.at(ot);
      };
      ter = ot == null ?
        null :
        tryJsProp(ot.floor(), "matGrp", null);
      if(ter != null) {
        thisFun.countMap.put(ter, thisFun.countMap.get(ter, 0) + 1);
      };
    });

    let tmpTer;
    ter = null;
    terGetters.forEachFast(getter => {
      tmpTer = getter(thisFun.countMap, count, VAR.param.terFlrThr);
      if(tmpTer !== "!PENDING") ter = tmpTer;
    });
    bankTerGetters.forEachFast(getter => {
      tmpTer = getter(thisFun.countMap, count, VAR.param.terFlrThr);
      if(tmpTer !== "!PENDING") ter = tmpTer;
    });

    return ter;
  }
  .setProp({
    tmpTs: [],
    countMap: new ObjectMap(),
  });
  exports._ter = _ter;


  /**
   * <BUNDLE>: "term.common-term-ter-<ter>.name".
   * @param {string|unset} [ter]
   * @return {string}
   */
  const _terB = function(ter) {
    return Vars.headless ? "" : MDL_bundle._term("common", "ter-" + (tryVal(ter, "transition")));
  };
  exports._terB = _terB;


  /* <---------- component ----------> */


  /**
   * Used to show current terrain type at some tile.
   * @param {Block} blk
   * @param {number} tx
   * @param {number} ty
   * @param {number} rot
   * @param {boolean} valid
   * @param {number|unset} [offTy]
   * @return {void}
   */
  const comp_drawPlace_ter = function thisFun(blk, tx, ty, rot, valid, offTy) {
    let t = Vars.world.tile(tx, ty);
    if(t == null) return;
    if(checkTupChange(thisFun.tmpTup, true, blk, t, rot)) {
      thisFun.tmpTup[3] = _terB(_ter(t, blk.size, tryFun(blk.ex_getTerrainCheckR, blk, 5)));
    };

    MDL_draw._d_textPlace(blk, tx, ty, MDL_bundle._info("lovec", "text-terrain") + " " + thisFun.tmpTup[3], valid, offTy);
  }
  .setProp({
    tmpTup: [],
  });
  exports.comp_drawPlace_ter = comp_drawPlace_ter;
