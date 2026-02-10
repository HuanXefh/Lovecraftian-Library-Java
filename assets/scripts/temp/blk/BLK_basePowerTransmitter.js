/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Any block that transmits power to other blocks.
   * Not placeable on conductive floor if vulnerable to short circuit by default.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_basePowerBlock");
  const VAR = require("lovec/glb/GLB_var");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = VAR.prio_powTrans;
  };


  function comp_setStats(blk) {
    if(blk.overwriteVanillaStat) {
      blk.stats.remove(Stat.powerUse);
      let powLoss = MDL_content._powConsAmt(blk);
      if(powLoss > 0.0) blk.stats.add(fetchStat("lovec", "blk0pow-powloss"), powLoss * 60.0, StatUnit.powerSecond);
    };
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(blk.ignoreShortCircuitPlacement) return true;

    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, team, rot)) {
      thisFun.tmpTup[4] = tryJsProp(blk, "canShortCircuit", false)
        && t.floor().liquidDrop != null
        && MDL_cond._isConductiveLiquid(t.floor().liquidDrop);
    };

    if(thisFun.tmpTup[4]) {
      MDL_draw._d_textPlace(blk, t.x, t.y, MDL_bundle._info("lovec", "text-short-circuit"), false);
      return false;
    } else {
      return true;
    };
  }
  .setProp({
    tmpTup: [],
  });


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_basePowerTransmitter").initClass()
    .setParent(null)
    .setTags("blk-pow", "blk-pow0trans")
    .setParam({
      // @PARAM: If {true}, placement won't be affected by short circuit.
      ignoreShortCircuitPlacement: false,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_basePowerTransmitter").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
