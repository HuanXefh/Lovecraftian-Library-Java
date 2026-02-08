/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to terrain calculation.
   * The proper name should be "biome", but it's too late for me too.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A list of terrain types, populated on CLIENT LOAD.
   * See {ENV_materialFloor} and {ENV_liquidMaterialFloor}.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Parameters used to check bank terrain type.
   * ---------------------------------------- */
  const bankLiqParams = {
    liqFrac: 0.55,
    groundFrac: 0.45,
    bankGroundTers: [
      "dirt",
      "grass",
      "gravel",
      "ice",
      "rock",
      "sand",
      "snow",
    ],
    beachGroundTers: [
      "gravel",
      "ice",
      "rock",
      "sand",
      "snow",
    ],
  };
  exports.bankLiqParams = bankLiqParams;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the terrain type at some tile.
   * You can push more getters to this function for customized terrain types.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name for some terrain type from the bundle.
   * Format: {"term.common-term-ter-xxx.name"}.
   * ---------------------------------------- */
  const _terB = function(ter) {
    return Vars.headless ? "" : MDL_bundle._term("common", "ter-" + (tryVal(ter, "transition")));
  };
  exports._terB = _terB;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: countMap, ters
   * @ARGS: countMap, ter1, ter2, ter3, ...
   * Used to count floor blocks matching some terrain type or types.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Used to show current terrain type at some tile.
   * ---------------------------------------- */
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
