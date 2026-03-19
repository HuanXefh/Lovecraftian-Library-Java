/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");


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


    /**
     * Just vanilla liquid junction.
     * Does not transport auxiliary fluid.
     * <br> <SINGLESIZE>
     * @class BLK_fluidJunction
     * @extends BLK_baseFluidDistributor
     */
    newClass().extendClass(PARENT[0], "BLK_fluidJunction").initClass()
    .setParent(LiquidJunction)
    .setTags("blk-liq", "blk-gate")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


      /**
       * @override
       * @memberof BLK_fluidJunction
       * @instance
       * @return {boolean}
       */
      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_fluidJunction
     * @extends B_baseFluidDistributor
     */
    newClass().extendClass(PARENT[1], "B_fluidJunction").initClass()
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


      /**
       * @override
       * @memberof B_fluidJunction
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        // Do nothing
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


  ];
