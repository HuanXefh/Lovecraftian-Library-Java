/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The block will be charged when player clicks it.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    let scr = b => {
      b.delegee.timeClickCur = Math.min(b.delegee.timeClickCur + blk.manualTimerClickInc, blk.manualTimerCap);
      MDL_effect.showAt_click(b.x, b.y, b.team);
      Sounds.click.at(b);
    };
    switch(blk.manualTimerCfgTp) {
      case "boolean" :
        blk.config(JAVA.boolean, (b, bool) => {
          if(bool) scr(b);
          b.ex_onManualTimerConfigured(bool);
        });
        break;
      case "string" :
        blk.config(JAVA.string, (b, str) => {
          if(str === "SPEC: click") scr(b);
          b.ex_onManualTimerConfigured(str);
        });
        break;
      case "float" :
        blk.config(JAVA.float, (b, f) => {
          scr(b);
          b.ex_onManualTimerConfigured(f);
        });
        break;
      default :
        throw new Error("Unsupported config type: " + blk.manualTimerCfgTp);
    };

    blk.ex_addLogicGetter(LAccess.ammo, b => b.delegee.timeClickCur / 60.0);
    blk.ex_addLogicGetter(LAccess.ammoCapacity, b => blk.manualTimerCap / 60.0);
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0misc-maxdur"), blk.manualTimerCap / 3600.0, StatUnit.minutes);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-timer", b => new Bar(
      prov(() => MDL_bundle._info("lovec", "text-remaining-time") + " " + Strings.fixed(b.delegee.timeClickCur / 60.0, 0) + " " + StatUnit.seconds.localized()),
      prov(() => Tmp.c1.set(Pal.remove).lerp(Pal.heal, Mathf.clamp(b.delegee.timeClickCur / blk.manualTimerCap))),
      () => 1.0,
    ));
  };


  function comp_updateTile(b) {
    if(b.efficiency > 0.0) b.timeClickCur = Mathf.maxZero(b.timeClickCur - b.edelta());
  };


  function comp_configTapped(b) {
    if(b.block.delegee.skipTapConfig) return true;

    Vars.state.paused ?
      MDL_ui.show_fadeInfo("lovec", "paused-manual-click") :
      b.ex_configureClick();

    return false;
  };


  function comp_ex_configureClick(b) {
    let cfgVal = null;
    switch(b.block.delegee.manualTimerCfgTp) {
      case "boolean" :
        cfgVal = true;
        break;
      case "string" :
        cfgVal = "SPEC: click";
        break;
      case "float" :
        cfgVal = -Number.n8;
        break;
    };
    if(cfgVal != null) b.configure(cfgVal);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Type of parameter used for config.
        manualTimerCfgTp: "boolean",
        // @PARAM: Maximum of the timer in frames.
        manualTimerCap: Number.n8,
        // @PARAM: Time increased by on single click in frames.
        manualTimerClickInc: 60.0,
        // @PARAM: Change this if you have a button to click.
        skipTapConfig: false,
      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        timeClickCur: 0.0,
      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      shouldConsume: function() {
        return this.timeClickCur > 0.0;
      }
      .setProp({
        boolMode: "and",
      }),


      configTapped: function() {
        return comp_configTapped(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Called whenever this building is configured.
       * ---------------------------------------- */
      ex_onManualTimerConfigured: function(val) {

      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * Call this to apply one click.
       * ---------------------------------------- */
      ex_configureClick: function() {
        comp_ex_configureClick(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,
          (wr, revi) => {
            wr.f(this.timeClickCur);
          },

          (rd, revi) => {
            if(revi < 1) {
              rd.s();
            };

            this.timeClickCur = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
