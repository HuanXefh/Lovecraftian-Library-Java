/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidRouter");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureBlock");


  /* <---------- auxiliary ----------> */


  /**
   * Due to how fluids are transported, this value should be lower than 1.0.
   */
  const FULL_THRESHOLD = 0.9;


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = true;
  };


  function comp_load(blk) {
    blk.sideReg1 = fetchRegion(blk, "-side1", "-side");
    blk.sideReg2 = fetchRegion(blk, "-side2", "-side");
  };


  function comp_updateTile(b) {
    if(TIMER.liq) {
      let ob = b.nearby(b.rotation), liq = b.liquids.current();
      b.isFrontFull = ob == null || ob.liquids == null || !ob.acceptLiquid(b, liq) || ob.liquids.get(liq) / ob.block.liquidCapacity >= FULL_THRESHOLD;
    };
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
     * @class BLK_fluidOverflowGate
     * @extends BLK_fluidRouter
     */
    newClass().extendClass(PARENT[0], "BLK_fluidOverflowGate").implement(INTF[0]).initClass()
    .setParent(LiquidRouter)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_fluidOverflowGate
       * @instance
       */
      sideReg1: null,
      /**
       * <INTERNAL>
       * @memberof BLK_fluidOverflowGate
       * @instance
       */
      sideReg2: null,
      /**
      * <INTERNAL>
      * @override
      * @memberof BLK_fluidOverflowGate
      * @instance
      */
      isPresRouter: false,
      /**
      * <INTERNAL>
      * @override
      * @memberof BLK_fluidOverflowGate
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
       * @memberof BLK_fluidOverflowGate
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
     * @class B_fluidOverflowGate
     * @extends B_fluidRouter
     */
    newClass().extendClass(PARENT[1], "B_fluidOverflowGate").implement(INTF[1]).initClass()
    .setParent(LiquidRouter.LiquidRouterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_fluidOverflowGate
       * @instance
       */
      isFrontFull: false,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      acceptLiquid: function(b_f, liq) {
        return LCGeometry.accept(b_f, this, MDL_cond._isFluidRouter(b_f.block), false);
      }
      .setProp({
        boolMode: "and",
      }),


      canDumpLiquid: function(b_t, liq) {
        return !this.isFrontFull ?
          this.relativeTo(b_t) === this.rotation :
          Mathf.mod(this.relativeTo(b_t) + this.rotation, 2) !== 0;
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      draw: function() {
        comp_draw(this);
      },


    }),


  ];
