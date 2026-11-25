/*
  ================================================================================
  Section: Introduction
  ================================================================================
*/


    /**
     * Timers used everywhere.
     * @module lovec/glb/GLB_timer
     */


/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /**
     * @type {Object<string, Interval>}
     */
    const timers = {
        generic: new Interval(14),
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
  ================================================================================
  Section: Application
  ================================================================================
*/




    BOX_trigger.majorSync.addGlobalListener(() => {
        syncTimer();
    });




    MDL_event.onUpdate(() => {

        exports.frameTwo = timers.generic.get(0, 2.0);
        exports.frameThree = timers.generic.get(1, 3.0);
        exports.frameFour = timers.generic.get(2, 4.0);
        exports.frameFive = timers.generic.get(3, 5.0);
        exports.secQuarter = timers.generic.get(4, 15.0);
        exports.secHalf = timers.generic.get(5, 30.0);
        exports.sec = timers.generic.get(6, 60.0);
        exports.secTwo = timers.generic.get(7, 120.0);
        exports.secThree = timers.generic.get(8, 180.0);
        exports.secFive = timers.generic.get(9, 300.0);
        exports.secTen = timers.generic.get(10, 600.0);
        exports.minHalf = timers.generic.get(11, 1800.0);
        exports.min = timers.generic.get(12, 3600.0);
        exports.minTwo = timers.generic.get(13, 7200.0);

        exports.effc = timers.update.get(0, fetchSetting("interval-efficiency", true));
        exports.effcPay = timers.update.get(1, 30.0);
        exports.rsCur = timers.update.get(2, 180.0);
        exports.liq = timers.update.get(3, GLB_var.timeParam.liqIntv);
        exports.heat = timers.update.get(4, GLB_var.timeParam.heatIntv);
        exports.unit = timers.update.get(5, GLB_var.timeParam.unitIntv);
        exports.stackSta = timers.update.get(6, GLB_var.timeParam.stackStaExtDef * 0.5);

        exports.param = timers.param.get(0, GLB_var.timeParam.paramIntv);
        exports.paramGlobal = timers.param.get(1, GLB_var.timeParam.paramGlobalIntv);
        exports.paramLarge = timers.param.get(2, GLB_var.timeParam.paramLargeIntv);

        exports.lightning = timers.effect.get(0, GLB_var.timeParam.lightningIntv);
        exports.coreSignal = timers.effect.get(1, 32.0);
        exports.trailCircle = timers.effect.get(2, 15.0);
        exports.jetTrail = timers.effect.get(3, 2.0);


    });
