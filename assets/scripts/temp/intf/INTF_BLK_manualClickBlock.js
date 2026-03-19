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
      b.delegee.manualClickFrac = Mathf.lerp(b.delegee.manualClickFrac, 1.25, 0.125);
      MDL_effect._e_click(b.x, b.y, b.team.color);
      Sounds.click.at(b);
    };
    switch(blk.manualClickCfgTp) {
      case "boolean" :
        blk.config(JAVA.boolean, (b, bool) => {
          if(bool) scr(b);
          b.ex_onManualClickConfigured(bool);
        });
        break;
      case "string" :
        blk.config(JAVA.string, (b, str) => {
          if(str === "SPEC: click") scr(b);
          b.ex_onManualClickConfigured(str);
        });
        break;
      case "float" :
        blk.config(JAVA.float, (b, f) => {
          scr(b);
          b.ex_onManualClickConfigured(f);
        });
        break;
      default :
        throw new Error("Unsupported config type: " + blk.manualClickCfgTp);
    };
  };


  function comp_updateTile(b) {
    if(TIMER.secQuarter) {
      b.manualClickFrac = Mathf.maxZero(b.manualClickFrac - 0.03);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= Math.min(b.manualClickFrac, 1.0);
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
    switch(b.block.delegee.manualClickCfgTp) {
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
     * The block only operates when a player keeps clicking it.
     * @class INTF_BLK_manualClickBlock
     */
    new CLS_interface("INTF_BLK_manualClickBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Type of parameter used for config.
         * @memberof INTF_BLK_manualClickBlock
         * @instance
         */
        manualClickCfgTp: "boolean",
        /**
         * <PARAM>: Change this if you have a button to click.
         * @memberof INTF_BLK_manualClickBlock
         * @instance
         */
        skipTapConfig: false,


      }),


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class INTF_B_manualClickBlock
     */
    new CLS_interface("INTF_B_manualClickBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_manualClickBlock
         * @instance
         */
        manualClickFrac: 0.0,


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
       * Called whenever this building is configured.
       * <br> <LATER>
       * @memberof INTF_B_manualClickBlock
       * @instance
       * @param {any} val
       * @return {void}
       */
      ex_onManualClickConfigured: function(val) {

      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_manualClickBlock
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
       * Call this to apply one single click.
       * @memberof INTF_B_manualClickBlock
       * @instance
       * @return {void}
       */
      ex_configureClick: function() {
        comp_ex_configureClick(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
