/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    let scr = b => {
      b.delegee.manualStartWarmup = Mathf.lerp(b.delegee.manualStartWarmup, 1.2, blk.manualStartIncRate * 1.65);
      MDL_effect._e_click(b.x, b.y, b.team.color);
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


    /**
     * Click this block fast enough to activate it!
     * @class INTF_BLK_manualStartBlock
     */
    new CLS_interface("INTF_BLK_manualStartBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: See {@link INTF_BLK_manualClickBlock}.
         * @memberof INTF_BLK_manualStartBlock
         * @instance
         */
        manualStartCfgTp: "boolean",
        /**
         * <PARAM>: Warmup increase rate.
         * @memberof INTF_BLK_manualStartBlock
         * @instance
         */
        manualStartIncRate: 0.001,
        /**
         * <PARAM>: Warmup decrease rate.
         * @memberof INTF_BLK_manualStartBlock
         * @instance
         */
        manualStartDecRate: 0.008,
        /**
         * <PARAM>: See {@link INTF_BLK_manualClickBlock}.
         * @memberof INTF_BLK_manualStartBlock
         * @instance
         */
        skipTapConfig: false,


      }),


      init: function() {
        comp_init(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class INTF_B_manualStartBlock
     */
    new CLS_interface("INTF_B_manualStartBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_manualStartBlock
         * @instance
         */
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


      /**
       * See {@link INTF_B_manualClickBlock}.
       * <br> <LATER>
       * @memberof INTF_B_manualStartBlock
       * @instance
       * @param {any} val
       * @return {void}
       */
      ex_onManualStartConfigured: function(val) {

      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_manualStartBlock
       * @instance
       * @return {void}
       */
      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_manualStartBlock
       * @instance
       * @return {number}
       */
      ex_getManualStartFrac: function() {
        return Mathf.clamp(this.manualStartWarmup - 0.2);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * See {@link INTF_B_manualClickBlock}.
       * @memberof INTF_B_manualStartBlock
       * @instance
       * @return {void}
       */
      ex_configureClick: function() {
        comp_ex_configureClick(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_manualStartBlock
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,
          (wr, revi) => {
            wr.f(this.manualStartWarmup);
          },

          (rd, revi) => {
            this.manualStartWarmup = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
