/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/STA_baseStatus");
  const INTF = require("lovec/temp/intf/INTF_STA_burstStatus");


  /* <---------- component ----------> */


  function comp_update(sta, unit, staEn) {
    if(sta.burstTime < 0.0001 || !TIMER.stackSta) return;
    let t = unit.tileOn();
    if(t == null || !MDL_cond._isOnFloor(unit)) return;

    let flr = t.floor();
    let puddle = Puddles.get(t);
    if(puddle != null && puddle.liquid.effect === sta) {
      unit.apply(sta, staEn.time + VAR.time_stackStaExtDef);
    } else if(flr.status === sta && flr.statusDuration > 0.0) {
      unit.apply(sta, staEn.time + VAR.time_stackStaExtDef * (flr.shallow ? 1.0 : 2.0));
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Variant of {@link STA_burstStatus} related to liquid floor and puddle.
   * @class STA_liquidStatus
   * @extends STA_baseStatus
   * @extends INTF_STA_burstStatus
   */
  module.exports = newClass().extendClass(PARENT, "STA_liquidStatus").implement(INTF).initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({})
  .setMethod({


    update: function(unit, staEn) {
      comp_update(this, unit, staEn);
    },


  });
