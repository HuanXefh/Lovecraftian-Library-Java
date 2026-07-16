/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidRouter");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = true;
  };


  function comp_load(blk) {
    blk.sideReg1 = fetchRegion(blk, "-side1", "-side");
    blk.sideReg2 = fetchRegion(blk, "-side2", "-side");
  };


  function comp_draw(b) {
    LCDrawf.side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg2, b.rotation);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Liquid router with rotation, so that it supports pressure transportation.
     * @class BLK_directionalFluidRouter
     * @extends BLK_fluidRouter
     */
    newClass().extendClass(PARENT[0], "BLK_directionalFluidRouter").implement(INTF[0]).initClass()
    .setParent(LiquidRouter)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_directionalFluidRouter
       * @instance
       */
      sideReg1: null,
      /**
       * <INTERNAL>
       * @memberof BLK_directionalFluidRouter
       * @instance
       */
      sideReg2: null,
      /**
      * <INTERNAL>
      * @override
      * @memberof BLK_directionalFluidRouter
      * @instance
      */
      isPresRouter: true,
      /**
      * <INTERNAL>
      * @override
      * @memberof BLK_directionalFluidRouter
      * @instance
      */
      noPresExplode: true,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      /**
       * @override
       * @memberof BLK_directionalFluidRouter
       * @instance
       * @return {boolean}
       */
      ex_isGateBlk: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_directionalFluidRouter
     * @extends B_fluidRouter
     */
    newClass().extendClass(PARENT[1], "B_directionalFluidRouter").implement(INTF[1]).initClass()
    .setParent(LiquidRouter.LiquidRouterBuild)
    .setParam({})
    .setMethod({


      acceptLiquid: function(b_f, liq) {
        return LCGeometry.accept(b_f, this, MDL_cond._isFluidRouter(b_f.block), false);
      }
      .setProp({
        boolMode: "and",
      }),


      draw: function() {
        comp_draw(this);
      },


    }),


  ];
