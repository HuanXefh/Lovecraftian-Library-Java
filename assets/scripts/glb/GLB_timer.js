/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Timers used everywhere.
   * @module lovec/glb/GLB_timer
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  const timers = {};
  timers.generic = new Interval(10);
  timers.efficiency = new Interval(4);
  timers.param = new Interval(3);
  timers.effect = new Interval(4);
  timers.unit = new Interval(1);
  timers.status = new Interval(1);


  function syncTimer() {
    for(let key in timers) {
      timers[key].clear();
    };
    console.log("[LOVEC] Synced timer state.");
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  TRIGGER.majorSync.addGlobalListener(() => {
    syncTimer();
  });




  MDL_event.onUpdate(() => {

    // Generic timer
    exports.secQuarter = timers.generic.get(0, 15.0);
    exports.secHalf = timers.generic.get(1, 30.0);
    exports.sec = timers.generic.get(2, 60.0);
    exports.secTwo = timers.generic.get(3, 120.0);
    exports.secThree = timers.generic.get(4, 180.0);
    exports.secFive = timers.generic.get(5, 300.0);
    exports.secTen = timers.generic.get(6, 600.0);
    exports.minHalf = timers.generic.get(7, 1800.0);
    exports.min = timers.generic.get(8, 3600.0);
    exports.minTwo = timers.generic.get(9, 7200.0);

    // Timer for building efficiency
    exports.effc = timers.efficiency.get(0, fetchSetting("interval-efficiency", true));

    // Timer for last resource update
    exports.rsCur = timers.efficiency.get(1, 180.0);

    // Timer for liquid calculation update
    exports.liq = timers.efficiency.get(2, VAR.time.liqIntv);

    // Timer for heat calculation update
    exports.heat = timers.efficiency.get(3, VAR.time.heatIntv);

    // Timer for parameter update
    exports.param = timers.param.get(0, VAR.time.paramIntv);
    exports.paramGlobal = timers.param.get(1, VAR.time.paramGlobalIntv);
    exports.paramLarge = timers.param.get(2, VAR.time.paramLargeIntv);

    // Timer for some visual effects
    exports.lightning = timers.effect.get(0, VAR.time.lightningIntv);
    exports.coreSignal = timers.effect.get(1, 32.0);
    exports.trailCircle = timers.effect.get(2, 15.0);
    exports.jetTrail = timers.effect.get(3, 2.0);

    // Timer for generic unit update
    exports.unit = timers.unit.get(VAR.time.unitIntv);

    // Timer for stack status effect update
    exports.stackSta = timers.status.get(VAR.time.stackStaExtDef * 0.5);

  });
