/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles impact wave creation.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const TRIGGER = require("lovec/glb/BOX_trigger");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk-impactr"), blk.impactRad / Vars.tilesize, StatUnit.blocks);
  };


  function comp_drawPlace(blk, tx, ty, rot) {
    MDL_draw._d_pulseCircle(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.impactRad);
  };


  function comp_ex_calcImpactDmg(blk, b) {
    return FRAG_attack._impactDmg(blk.size, blk.ex_calcImpactIntv(b));
  };


  function comp_ex_calcImpactDur(blk, b) {
    return FRAG_attack._impactDur(blk.ex_calcImpactIntv(b));
  };


  function comp_ex_calcImpactMinRad(blk, b) {
    return FRAG_attack._impactMinRad(blk.size);
  };


  function comp_drawSelect(b) {
    MDL_draw._d_pulseCircle(b.x, b.y, b.block.ex_calcImpactRad(b));
  };


  function comp_createImpactWave(b) {
    TRIGGER.impactWave.fire(b.x, b.y, b.block.ex_calcImpactDmg(b), b.block.ex_calcImpactRad(b));
    FRAG_attack._a_impact(
      b.x, b.y,
      b.block.ex_calcImpactDmg(b),
      b.block.ex_calcImpactDur(b),
      b.block.ex_calcImpactRad(b),
      b.block.ex_calcImpactMinRad(b),
      b.block.ex_calcImpactShake(b),
    );
    MDL_effect.showAt_dust(b.x, b.y, FRAG_attack._impactDustRad(b.block.size), Math.pow(b.block.size, 2));
    MDL_effect.showAt_colorDust(b.x, b.y, FRAG_attack._impactDustRad(b.block.size) * 1.5, b.tile);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Impact wave radius.
        impactRad: 40.0,
      }),


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot) {
        comp_drawPlace(this, tx, ty, rot);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns expected interval between each impact wave.
       * This affects things like impact damage by default.
       * ---------------------------------------- */
      ex_calcImpactIntv: function(b) {
        return 60.0;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_calcImpactDmg: function(b) {
        return comp_ex_calcImpactDmg(this, b);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_calcImpactDur: function(b) {
        return comp_ex_calcImpactDur(this, b);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_calcImpactRad: function(b) {
        return this.impactRad;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_calcImpactMinRad: function(b) {
        return comp_ex_calcImpactMinRad(this, b);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_calcImpactShake: function(b) {
        return 1.0;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


    // Building
    new CLS_interface({


      drawSelect: function() {
        comp_drawSelect(this);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Use this method to create a impact wave.
       * ---------------------------------------- */
      ex_createImpactWave: function() {
        comp_createImpactWave(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
