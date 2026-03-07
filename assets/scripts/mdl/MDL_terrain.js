/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to terrain calculation.
   * The proper name should be "biome", but it's too late for me too.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  /**
   * A list of terrain types populated on CLIENT LOAD.
   * See {@link ENV_materialFloor} and {@link ENV_liquidMaterialFloor}.
   * @type {Array<string>}
   */
  const ters = (function() {
    const arr = [];

    MDL_event._c_onLoad(() => {
      Vars.content.blocks().each(
        blk => tryJsProp(blk, "tempTags", Array.air).includes("blk-mat0flr"),
        blk => ters.pushUnique(tryJsProp(blk, "matGrp", "none")),
      );
      ters.pull("none");
    });

    return arr;
  })();
  exports.ters = ters;


  /** Parameters used to check bank terrain type. */
  const bankLiqParams = {
    liqFrac: 0.55,
    groundFrac: 0.45,
    /** These solid terrain types will be used for "river". */
    bankGroundTers: [
      "dirt",
      "grass",
      "gravel",
      "ice",
      "rock",
      "sand",
      "snow",
    ],
    /** These solid terrain types will be used for "beach". */
    beachGroundTers: [
      "gravel",
      "ice",
      "rock",
      "sand",
      "snow",
    ],
  };
  exports.bankLiqParams = bankLiqParams;


  /**
   * Gets terrain type at some tile.
   * You can register new terrain types by pushing more getters into this function.
   * @param {Tile} t
   * @param {number|unset} [size]
   * @param {number|unset} [checkR]
   * @return {string|null} - Transition is null.
   */
  const _ter = function thisFun(t, size, checkR) {
    if(t == null) return null;

    let ts = MDL_pos._tsRect(t, tryVal(checkR, 5), tryVal(size, 1), thisFun.tmpTs);
    let count = ts.iCap();
    if(count === 0) return null;

    thisFun.countMap.clear();
    let ter;
    ts.forEachFast(ot => {
      ter = tryJsProp(ot.floor(), "matGrp", null);
      if(ter != null) thisFun.countMap.put(ter, thisFun.countMap.get(ter, 0) + 1);
    });

    let tmpTer;
    ter = null;
    thisFun.terGetters.forEachFast(getter => {
      tmpTer = getter(thisFun.countMap, count, VAR.blk_terFlrThr);
      if(tmpTer !== "!PENDING") ter = tmpTer;
    });
    thisFun.complexTerGetters.forEachFast(getter => {
      tmpTer = getter(thisFun.countMap, count, VAR.blk_terFlrThr);
      if(tmpTer !== "!PENDING") ter = tmpTer;
    });

    return ter;
  }
  .setProp({
    tmpTs: [],
    countMap: new ObjectMap(),
    terGetters: [
      (map, count, thr) => sumCountTers(map, "dirt", "grass") / count < thr ? "!PENDING" : "dirt",
      (map, count, thr) => sumCountTers(map, "lava") / count < thr ? "!PENDING" : "lava",
      (map, count, thr) => sumCountTers(map, "puddle") / count < thr ? "!PENDING" : "puddle",
      (map, count, thr) => sumCountTers(map, "river") / count < thr ? "!PENDING" : "river",
      (map, count, thr) => sumCountTers(map, "gravel", "rock") / count < thr ? "!PENDING" : "rock",
      (map, count, thr) => sumCountTers(map, "salt") / count < thr ? "!PENDING" : "salt",
      (map, count, thr) => sumCountTers(map, "gravel", "sand") / count < thr ? "!PENDING" : "sand",
      (map, count, thr) => sumCountTers(map, "sea") / count < thr ? "!PENDING" : "sea",
      (map, count, thr) => sumCountTers(map, "grass", "ice", "snow") / count < thr ? "!PENDING" : "snow",
    ],
    complexTerGetters: [
      (map, count, thr) => map.get("river", 0) / count < thr * bankLiqParams.liqFrac || sumCountTers(map, bankLiqParams.bankGroundTers) / count < thr * bankLiqParams.groundFrac ? "!PENDING" : "bank",
      (map, count, thr) => map.get("beach", 0) / count < thr * bankLiqParams.liqFrac || sumCountTers(map, bankLiqParams.beachGroundTers) / count < thr * bankLiqParams.groundFrac ? "!PENDING" : "beach",
    ],
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


  /**
   * Used to count floor blocks matching some terrain type(s).
   * <br> <ARGS>: countMap, ters.
   * <br> <ARGS>: countMap, ter1, ter2, ter3, ...
   * @param {ObjectMap} countMap
   * @return {number}
   */
  const sumCountTers = function(countMap) {
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
  exports.sumCountTers = sumCountTers;


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
    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, rot)) {
      thisFun.tmpTup[3] = _terB(_ter(t, blk.size, tryFun(blk.ex_getTerrainCheckR, blk, 5)));
    };

    MDL_draw._d_textPlace(blk, tx, ty, MDL_bundle._info("lovec", "text-terrain") + " " + thisFun.tmpTup[3], valid, offTy);
  }
  .setProp({
    tmpTup: [],
  });
  exports.comp_drawPlace_ter = comp_drawPlace_ter;
