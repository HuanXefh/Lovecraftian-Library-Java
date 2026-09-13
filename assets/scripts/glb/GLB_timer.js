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


    /**
     * @type {Object<string, Interval>}
     */
    const timers = {
        generic: new Interval(10),
        update: new Interval(7),
        param: new Interval(3),
        effect: new Interval(4),
    };


    /**
     * @return {void}
     */
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

        exports.effc = timers.update.get(0, fetchSetting("interval-efficiency", true));
        exports.effcPay = timers.update.get(1, 30.0);
        exports.rsCur = timers.update.get(2, 180.0);
        exports.liq = timers.update.get(3, VAR.time.liqIntv);
        exports.heat = timers.update.get(4, VAR.time.heatIntv);
        exports.unit = timers.update.get(5, VAR.time.unitIntv);
        exports.stackSta = timers.update.get(6, VAR.time.stackStaExtDef * 0.5);

        exports.param = timers.param.get(0, VAR.time.paramIntv);
        exports.paramGlobal = timers.param.get(1, VAR.time.paramGlobalIntv);
        exports.paramLarge = timers.param.get(2, VAR.time.paramLargeIntv);

        exports.lightning = timers.effect.get(0, VAR.time.lightningIntv);
        exports.coreSignal = timers.effect.get(1, 32.0);
        exports.trailCircle = timers.effect.get(2, 15.0);
        exports.jetTrail = timers.effect.get(3, 2.0);


    });
