/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = false;

    blk.ex_addConfigCaller("rcHeader", (b, val) => b.delegee.rcHeader = val);

    blk.ex_addLogicGetter(LAccess.config, b => b.delegee.rcHeader);
    blk.ex_addLogicControl(LAccess.config, (b, param1) => {
      if(typeof param1 === "string" && param1 !== b.delegee.rcHeader && MDL_recipe._hasHeader(blk.rcMdl, param1)) b.configure(param1);
    });
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    MDL_table._s_rc(
      tb, b,
      () => b.rcHeader, val => b.configure(val),
      b.ex_getSelectorExtraBtnSetters(),
      false, b.block.selectionColumns,
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles recipe selection, must be implemented before {@link INTF_BLK_recipeHandler}.
     * @class INTF_BLK_recipeSelector
     */
    new CLS_interface("INTF_BLK_recipeSelector", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_recipeSelector
         * @instance
         */
        useConfigStr: true,


      }),


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class INTF_B_recipeSelector
     */
    new CLS_interface("INTF_B_recipeSelector", {


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb)
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return this.rcHeader;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof INTF_B_recipeSelector
       * @instance
       * @param {string} str
       * @return {void}
       */
      ex_handleConfigStrDef: function(str) {
        this.ex_updateRcParam(this.block.delegee.rcMdl, str, true);
        this.ex_resetRcParam();
        this.delegee.rcHeader = str;
        this.ex_showRcChangeEff();
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * Used to add extra buttons to recipe selector table (tiny buttons over selection menu).
       * @memberof INTF_B_recipeSelector
       * @instance
       * @return {Array<function(Table): void>}
       * @example
       * // Adds two buttons ("A" and "B") to print something to console
       * return [
       *   tb => tb.button("A", () => print("ohno")),
       *   tb => tb.button("B", () => print("ohyes")),
       * ];
       */
      ex_getSelectorExtraBtnSetters: function() {
        return [];
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
