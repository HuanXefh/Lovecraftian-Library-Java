/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Status effects that can stack up when applied, and finally burst to trigger something.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/STA_baseStatus");
  const INTF = require("lovec/temp/intf/INTF_STA_burstStatus");


  /* <---------- component ----------> */


  function comp_applied(sta, unit, time, isExtend) {
    if(sta.justApplied) return;

    sta.justApplied = true;
    unit.apply(sta, time + sta.timeGetterTup[0](unit, time));
    sta.justApplied = false;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).implement(INTF).initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({
    // @PARAM: Time getter, the time is added to current time when effect is applied.
    // @ARGS: unit, time
    timeGetterTup: prov(() => [(unit, time) => 300.0]),

    justApplied: false,
  })
  .setMethod({


    applied: function(unit, time, isExtend) {
      comp_applied(this, unit, time, isExtend);
    },


  });
