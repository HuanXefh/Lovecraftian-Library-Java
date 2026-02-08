/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods for liquid module.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_puddle = require("lovec/frag/FRAG_puddle");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const DB_fluid = require("lovec/db/DB_fluid");


  /* <---------- liquid module ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds liquid to some building, with {b_f} as the source.
   * Use negative {rate} for consumption.
   * Set {returnFrac} to {true} for efficiency calculation.
   * ---------------------------------------- */
  const addLiquid = function(b, b_f, liq, rate, forced, returnFrac, noDelta) {
    let amtTrans = 0.0;
    if(b.liquids == null || (!forced && rate > 0.0 && !b.acceptLiquid(tryVal(b_f, b), liq))) return amtTrans;
    if(rate == null) rate = 0.0;
    if(Math.abs(rate) < 0.0001) return amtTrans;

    let delta = noDelta ?
      (
        b_f == null ?
        1.0 :
        b_f.efficiency * b.timeScale
      ) :
      (
        b_f == null ?
          Time.delta :
          b_f.edelta()
      );
    amtTrans = rate > 0.0 ?
      Math.min(rate * delta, b.block.liquidCapacity - b.liquids.get(liq)) :
      -Math.min(-rate * delta, b.liquids.get(liq));
    b.handleLiquid(tryVal(b_f, b), liq, amtTrans);

    return returnFrac ? Math.abs(amtTrans / rate) : Math.abs(amtTrans);
  };
  exports.addLiquid = addLiquid;


  /* ----------------------------------------
   * NOTE:
   *
   * Used when a large amount of liquid is produced at once.
   * Use negative {amt} for consumption.
   * ---------------------------------------- */
  const addLiquidBatch = function(b, b_f, liq, amt, forced) {
    let amtTrans = 0.0;
    if(b.liquids == null || (!forced && amt > 0.0 && !b.acceptLiquid(tryVal(b_f, b), liq))) return amtTrans;
    if(amt == null) amt = 0.0;
    if(Math.abs(amt) < 0.0001) return amtTrans;

    amtTrans = amt > 0.0 ?
      Math.min(amt, b.block.liquidCapacity - b.liquids.get(liq)) :
      -Math.min(-amt, b.liquids.get(liq));
    b.handleLiquid(tryVal(b_f, b), liq, amtTrans);

    return Math.abs(amtTrans);
  };
  exports.addLiquidBatch = addLiquidBatch;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building transfer liquid to {b_t}.
   * Uses {edelta} of {b} by default, set {isActiveTrans} to {true} to use {b_t}'s {edelta} instead.
   * ---------------------------------------- */
  const transLiquid = function(b, b_t, liq, rate, isActiveTrans) {
    let amtTrans = 0.0;
    if(b_t == null) return amtTrans;
    if(b.liquids == null || b_t.liquids == null || !b_t.acceptLiquid(b, liq)) return amtTrans;
    if(rate == null) rate = 0.0;
    if(Math.abs(rate) < 0.0001) return amtTrans;

    let amtCur = b.liquids.get(liq);
    if(amtCur < 0.0001) return amtTrans;
    let amtCur_t = b_t.liquids.get(liq);
    let cap_t = b_t.block.liquidCapacity;
    amtTrans = Math.min(Mathf.clamp((isActiveTrans ? b_t.edelta() : b.edelta()) * rate, 0.0, cap_t - amtCur_t), amtCur);

    b_t.handleLiquid(b, liq, amtTrans);
    b.liquids.remove(liq, amtTrans);

    return amtTrans;
  };
  exports.transLiquid = transLiquid;
