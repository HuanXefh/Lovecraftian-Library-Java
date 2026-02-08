/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Click this block fast enough to activate it!
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    let scr = b => {
      b.delegee.manualStartWarmup = Mathf.lerp(b.delegee.manualStartWarmup, 1.2, blk.manualStartIncRate * 1.65);
      MDL_effect.showAt_click(b.x, b.y, b.team);
      Sounds.click.at(b);
    };
    switch(blk.manualStartCfgTp) {
      case "boolean" :
        blk.config(JAVA.boolean, (b, bool) => {
          if(bool) scr(b);
          b.ex_onManualStartConfigured(bool);
        });
        break;
      case "string" :
        blk.config(JAVA.string, (b, str) => {
          if(str === "SPEC: click") scr(b);
          b.ex_onManualStartConfigured(str);
        });
        break;
      case "float" :
        blk.config(JAVA.float, (b, f) => {
          scr(b);
          b.ex_onManualStartConfigured(f);
        });
        break;
      default :
        throw new Error("Unsupported config type: " + blk.manualStartCfgTp);
    };
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-warmup", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-warmup-amt", b.ex_getManualStartFrac().perc())),
      prov(() => Pal.ammo),
      () => b.ex_getManualStartFrac(),
    ));
  };


  function comp_updateTile(b) {
    if(b.efficiency < 0.0001 || !b.shouldConsume()) {
      b.manualStartWarmup = Mathf.lerpDelta(b.manualStartWarmup, 0.0, b.block.delegee.manualStartDecRate);
    } else {
      b.manualStartWarmup = Mathf.lerpDelta(b.manualStartWarmup, 1.4, b.block.delegee.manualStartIncRate);
    };
    if(b.manualStartWarmup < 0.001) {
      b.manualStartWarmup = 0.0;
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.ex_getManualStartFrac();
  };


  function comp_configTapped(b) {
    if(b.block.delegee.skipTapConfig) return true;

    Vars.state.paused ?
      MDL_ui.show_fadeInfo("lovec", "paused-manual-click") :
      b.ex_configureClick();

    return false;
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_configureClick(b) {
    let cfgVal = null;
    switch(b.block.delegee.manualStartCfgTp) {
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
        manualStartCfgTp: "boolean",
        // @PARAM: Rate at which the warmup increases.
        manualStartIncRate: 0.001,
        // @PARAM: Rate at which the warmup decreases.
        manualStartDecRate: 0.008,
        // @PARAM: Change this if you have a button to click.
        skipTapConfig: false,
      }),


      init: function() {
        comp_init(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        manualStartWarmup: 0.0,
      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


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
      ex_onManualStartConfigured: function(val) {

      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getManualStartFrac: function() {
        return Mathf.clamp(this.manualStartWarmup - 0.2);
      }
      .setProp({
        noSuper: true,
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
            wr.f(this.manualStartWarmup);
          },

          (rd, revi) => {
            if(revi < 1) {
              rd.s();
            };

            this.manualStartWarmup = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
