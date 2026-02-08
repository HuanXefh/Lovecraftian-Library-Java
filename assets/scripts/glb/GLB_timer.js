/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Timers used everywhere.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- base ----------> */


  const timer_mem = new Interval(3);
  const timer_gn = new Interval(8);
  const timer_effc = new Interval(4);
  const timer_param = new Interval(3);
  const timer_eff = new Interval(2);
  const timer_unit = new Interval(1);
  const timer_stackSta = new Interval(1);


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onUpdate(() => {


    // Internal timer for memory monitor
    exports.memUse = timer_mem.get(0, 50.0);
    exports.memUseMean = timer_mem.get(1, 450.0);
    exports.memPrint = timer_mem.get(2, 3600.0);
    // Generic timer
    exports.secQuarter = timer_gn.get(0, 15.0);
    exports.secHalf = timer_gn.get(1, 30.0);
    exports.sec = timer_gn.get(2, 60.0);
    exports.secTwo = timer_gn.get(3, 120.0);
    exports.secThree = timer_gn.get(4, 180.0);
    exports.secFive = timer_gn.get(5, 300.0);
    exports.min = timer_gn.get(6, 3600.0);
    exports.minTwo = timer_gn.get(7, 7200.0);
    // Timer for building efficiency
    exports.effc = timer_effc.get(0, fetchSetting("interval-efficiency", true));
    // Timer for last resource update
    exports.rsCur = timer_effc.get(1, 180.0);
    // Timer for liquid calculation update
    exports.liq = timer_effc.get(2, VAR.time_liqIntv);
    // Timer for heat calculation update
    exports.heat = timer_effc.get(3, VAR.time_heatIntv);
    // Timer for parameter update
    exports.param = timer_param.get(0, VAR.time_paramIntv);
    exports.paramGlobal = timer_param.get(1, VAR.time_paramGlobalIntv);
    exports.paramLarge = timer_param.get(2, VAR.time_paramLargeIntv);
    // Timer for some visual effects
    exports.lightning = timer_eff.get(0, VAR.time_lightningIntv);
    exports.coreSignal = timer_eff.get(1, 25.0);
    // Timer for generic unit update
    exports.unit = timer_unit.get(VAR.time_unitIntv);
    // Timer for stack status effect update
    exports.stackSta = timer_stackSta.get(VAR.time_stackStaExtDef * 0.5);


  }, 17885422);
