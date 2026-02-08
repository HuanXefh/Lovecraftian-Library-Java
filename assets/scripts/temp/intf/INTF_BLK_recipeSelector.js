/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles recipe selection, should be implemented before {INTF_BLK_recipeHandler}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_table = require("lovec/mdl/MDL_table");


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
    MDL_table.setSelector_recipe(
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


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        useConfigStr: true,
      }),


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    new CLS_interface({


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


      /* ----------------------------------------
       * NOTE:
       *
       * Used to add extra buttons to the recipe selector table.
       *
       * Example:
       * return [
       *   tb => tb.button("A", () => print("ohno")),
       *   tb => tb.button("B", () => print("ohyes")),
       * ];
       * ---------------------------------------- */
      ex_getSelectorExtraBtnSetters: function() {
        return [];
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
