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


  /**
   * A status effect that bursts if applied multiple times.
   * @class STA_burstStatus
   * @extends STA_baseStatus
   * @extends INTF_STA_burstStatus
   */
  module.exports = newClass().extendClass(PARENT, "STA_burstStatus").implement(INTF).initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({


    /**
     * <PARAM>: Gets time added when this effect is applied each time.
     * <ARGS>: unit, time.
     * @memberof STA_burstStatus
     * @instance
     */
    timeGetterTup: prov(() => [(unit, time) => 300.0]),


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof STA_burstStatus
     * @instance
     */
    justApplied: false,


  })
  .setMethod({


    applied: function(unit, time, isExtend) {
      comp_applied(this, unit, time, isExtend);
    },


  });
