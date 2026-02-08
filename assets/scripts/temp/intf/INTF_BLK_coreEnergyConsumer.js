/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles core energy consumption and efficiency.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_effect = require("lovec/mdl/MDL_effect");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.useCep = DB_block.db["param"]["cep"]["use"].read(blk.name) != null;
  };


  function comp_setStats(blk) {
    let cepProv = FRAG_faci._cepProv(blk);
    if(cepProv > 0.0) blk.stats.add(fetchStat("lovec", "blk0misc-cepprov"), cepProv);
    let cepUse = FRAG_faci._cepUse(blk);
    if(cepUse > 0.0) blk.stats.add(fetchStat("lovec", "blk0misc-cepuse"), cepUse);
  };


  function comp_setBars(blk) {
    if(
      !(blk instanceof CoreBlock)
        && DB_block.db["param"]["cep"]["use"].read(blk.name) == null
        && DB_block.db["param"]["cep"]["prov"].read(blk.name) == null
    ) return;

    blk.addBar("lovec-cep", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-cep-amt", FRAG_faci._cepUseCur(b.team) + "/" + FRAG_faci._cepCapCur(b.team))),
      prov(() => FRAG_faci._cepFracCur(b.team) <= 1.0 ? Pal.accent : Tmp.c1.set(Color.scarlet).lerp(Color.clear, Math.abs(Math.sin(Time.globalTime * 0.03)))),
      () => FRAG_faci._cepFracCur(b.team) > 1.0 ? 1.0 : Mathf.clamp(1.0 - FRAG_faci._cepFracCur(b.team)),
    ));
  };


  function comp_updateTile(b) {
    if(!b.block.delegee.useCep) return;

    if(TIMER.effc) {
      b.cepEffc = FRAG_faci._cepEffcCur(b.team);
    };
    if(TIMER.coreSignal && b.efficiency > 0.0 && b.shouldConsume()) {
      MDL_effect.showAt_coreSignal(b.x, b.y, b.team, b.block.size * 0.6 * Vars.tilesize);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.block.delegee.useCep) {
      b.efficiency *= b.cepEffc;
    };
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
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
        useCep: false,
      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        cepEffc: 1.0,
      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
