/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles the burst of stackable status effect.
   * Methods of time extension should be defined in classes.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_setStats(sta) {
    if(sta.burstTime > 0.0) sta.stats.add(fetchStat("lovec", "sta-bursttime"), sta.burstTime / 60.0, StatUnit.seconds);
    if(sta.burstDamage > 0.0) sta.stats.add(fetchStat("lovec", "sta-burstdmg"), MDL_text._dmgText(sta.burstDamage, sta.burstDamagePerc));
  };


  function comp_update(sta, unit, staEn) {
    if(sta.burstTime < 0.0001 || staEn.time <= sta.burstTime) return;

    let dmg = sta.burstDamage + unit.maxHealth * sta.burstDamagePerc;
    FRAG_attack.damage(unit, dmg, 0.0, MDL_cond._isHotStatus(sta) ? "heat" : null);
    if(sta.burstScrTup != null) sta.burstScrTup[0](unit);
    sta.burstEff.at(unit.x, unit.y, unit.hitSize * 1.1, sta.burstEffColor);
    staEn.time = 15.0;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = new CLS_interface({


    __PARAM_OBJ_SETTER__: () => ({
      // @PARAM: Duration above which the status effect bursts.
      burstTime: 0.0,
      // @PARAM: Damage applied when the status effect bursts.
      burstDamage: 0.0,
      // @PARAM: Damage as fraction of health.
      burstDamagePerc: 0.0,
      // @PARAM: Effect shown when the status effect bursts.
      burstEff: Fx.none,
      // @PARAM: Color of the effect.
      burstEffColor: Color.white,
      // @PARAM: Script called when the status effect bursts.
      // @ARGS: unit
      burstScrTup: null,
    }),


    setStats: function() {
      comp_setStats(this);
    },


    update: function(unit, staEn) {
      comp_update(this, unit, staEn);
    },


    ex_isStackSta: function() {
      return this.burstTime > 0.0;
    }
    .setProp({
      noSuper: true,
    }),


  });
