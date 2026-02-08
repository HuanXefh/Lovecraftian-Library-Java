/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Memory monitor for testing purpose.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const MATH_statistics = require("lovec/math/MATH_statistics");


  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- base ----------> */


  const memUseData = [];
  const memUseMeanData = [];
  let memUseMax = 0.0;
  let memMonitorCount = 1;
  let memMonitorRunning = false;
  let memMonitorInit = false;


  const _memUse = function() {
    return Math.round(Core.app.getJavaHeap() / 1048576);
  };
  exports._memUse = _memUse;


  const _memUseMax = function() {
    return memUseMax;
  };
  exports._memUseMax = _memUseMax;


  const _memUseMean = function() {
    return memUseData.mean();
  };
  exports._memUseMean = _memUseMean;


  const _memIncSlp = function() {
    return MATH_statistics.linearReg(memUseMeanData, null)[0];
  };
  exports._memIncSlp = _memIncSlp;


  const _memLeakSig = function() {
    let memUseMeanMean = memUseMeanData.mean();

    return (memUseMeanMean - MATH_statistics.linearReg(memUseMeanData, null)[1]) / memUseMeanMean;
  };
  exports._memLeakSig = _memLeakSig;


  function initMemMonitor() {
    memUseData.clear();
    memUseMeanData.clear();
    memUseMax = 0.0;
    memMonitorCount = 1;
    memMonitorRunning = false;
    memMonitorInit = true;

    _i_memMonitorInit();
  };


  function _i_memMonitor() {
    Log.info(String.multiline(
      "[LOVEC] Memory monitor result ([$1]):".format(memMonitorCount),
      "- Sample points: " + memUseData.length,
      "- Mean sample points: " + memUseMeanData.length,
      "- Memory use mean: [$1] MB".format(Strings.fixed(memUseMeanData.mean(), 3)),
      "- Max memory used: [$1] MB".format(_memUseMax()),
      "- Memory increase slope: " + Strings.fixed(_memIncSlp(), 8),
      "- Memory leak significance: " + _memLeakSig().perc(3),
    ));
    memMonitorCount++;
  };


  function _i_memMonitorStart() {
    Log.info("[LOVEC] Memory monitor started.");
  };


  function _i_memMonitorEnd() {
    Log.info("[LOVEC] Memory monitor ended.");
  };


  function _i_memMonitorInit() {
    Log.info("[LOVEC] Memory monitor initialized.");
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_event._c_onUpdate(() => {
    if(PARAM.enableMemoryMonitor) {
      if(Vars.state.isGame()) {
        if(!memMonitorInit) initMemMonitor();
        if(!memMonitorRunning) {
          _i_memMonitorStart();
          memMonitorRunning = true;
        };
        if(_memUse() > memUseMax) memUseMax = _memUse();
        if(TIMER.memUse) memUseData.push(_memUse());
        if(TIMER.memUseMean) memUseMeanData.push(_memUseMean());
        if(TIMER.memPrint) _i_memMonitor();
      } else {
        if(memMonitorRunning) {
          _i_memMonitorEnd();
          memMonitorRunning = false;
          memMonitorInit = false;
        };
      };
    } else {
      if(memMonitorRunning) {
        _i_memMonitorEnd();
        memMonitorRunning = false;
        memMonitorInit = false;
      };
    };
  }, 75912248);
