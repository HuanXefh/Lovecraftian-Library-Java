/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Just vanilla liquid junction.
   * Does not transport auxiliary fluid.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.solid = false;
      blk.underBullets = true;
    };
  };


  function comp_getLiquidDestination(b, b_f, liq) {
    return !b.enabled || MDL_cond._isAuxiliaryFluid(liq) ?
      b :
      b.super$getLiquidDestination(b_f, liq);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_fluidJunction").initClass()
    .setParent(LiquidJunction)
    .setTags("blk-liq", "blk-gate")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_fluidJunction").initClass()
    .setParent(LiquidJunction.LiquidJunctionBuild)
    .setParam({})
    .setMethod({


      getLiquidDestination: function(b_f, liq) {
        return comp_getLiquidDestination(this, b_f, liq);
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        // Do nothing
      }
      .setProp({
        override: true,
      }),


      read: function(rd, revi) {
        // Do nothing
      }
      .setProp({
        override: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        // Do nothing
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 2,
      }),


    }),


  ];
