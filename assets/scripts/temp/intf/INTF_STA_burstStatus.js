/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


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


  /**
   * Handles burst of stackable status effects.
   * Does not handle how duration is extended, which should be done in templates.
   * @class INTF_STA_burstStatus
   */
  module.exports = new CLS_interface("INTF_STA_burstStatus", {


    __PARAM_OBJ_SETTER__: () => ({


      /**
       * <PARAM>: Duration above which this status effect bursts.
       * @memberof INTF_STA_burstStatus
       * @instance
       */
      burstTime: 0.0,
      /**
       * <PARAM>: Damage dealt when this status effect bursts.
       * @memberof INTF_STA_burstStatus
       * @instance
       */
      burstDamage: 0.0,
      /**
       * <PARAM>: Damage as fraction of maximum health.
       * @memberof INTF_STA_burstStatus
       * @instance
       */
      burstDamagePerc: 0.0,
      /**
       * <PARAM>: Effect shown when this status effect bursts.
       * @memberof INTF_STA_burstStatus
       * @instance
       */
      burstEff: Fx.none,
      /**
       * <PARAM>: Color of burst effect.
       * @memberof INTF_STA_burstStatus
       * @instance
       */
      burstEffColor: Color.white,
      /**
       * <PARAM>: Called when this status effect bursts.
       * <br> <ARGS>: unit.
       * @memberof INTF_STA_burstStatus
       * @instance
       */
      burstScrTup: null,


    }),


    setStats: function() {
      comp_setStats(this);
    },


    update: function(unit, staEn) {
      comp_update(this, unit, staEn);
    },


    /**
     * Whether this status effect is actually a burst status effect.
     * @memberof INTF_STA_burstStatus
     * @instance
     * @return {boolean}
     */
    ex_isStackSta: function() {
      return this.burstTime > 0.0;
    }
    .setProp({
      noSuper: true,
    }),


  });
