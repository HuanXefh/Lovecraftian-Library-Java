/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods related to ore scanner check.
   * To make a building check nearby scanners, simply set {b.requiresScanner} to {true}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(b.requiresScanner && TIMER.effc) {
      b.scannerCur = MDL_pos._b_scan(b.x, b.y, b.team);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.requiresScanner) b.efficiency *= b.scannerCur == null ? 0.0 : b.scannerCur.ex_getScanFrac();
  };


  function comp_drawSelect(b) {
    if(!b.requiresScanner) return;

    b.scannerCur == null ?
      MDL_draw._d_textSelect(b, MDL_bundle._info("lovec", "text-no-scanner"), false, b.block.delegee.noScannerTextOffTy) :
      MDL_draw._d_conArea(b, b.scannerCur);
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
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
        // @PARAM: Offset for the text displayed when no scanner is found.
        noScannerTextOffTy: 0,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        requiresScanner: false,
        scannerCur: null,
      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
