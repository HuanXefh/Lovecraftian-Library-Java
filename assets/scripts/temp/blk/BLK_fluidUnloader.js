/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidRouter");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentSelector");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = true;
  };


  function comp_load(blk) {
    blk.sideReg1 = fetchRegion(blk, "-side1", "-side");
    blk.sideReg2 = fetchRegion(blk, "-side2", "-side");
  };


  function comp_onProximityUpdate(b) {
    b.unloadTg = b.back();
    if(b.unloadTg == null || b.unloadTg.liquids == null || MDL_cond._isFluidConduit(b.unloadTg.block) || MDL_cond._isGate(b.unloadTg.block)) {
      b.unloadTg = null;
    };
  };


  function comp_updateTile(b) {
    if(b.unloadTg != null && b.ctTg != null) {
      FRAG_fluid.transLiquid(b.unloadTg, b, b.ctTg, 2.0, true);
    };
  };


  function comp_draw(b) {
    LCDrawf.side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg2, b.rotation);
  };


  function comp_drawSelect(b) {
    b.ex_drawSelected();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * @class BLK_fluidUnloader
     * @extends BLK_fluidRouter
     */
    newClass().extendClass(PARENT[0], "BLK_fluidUnloader").implement(INTF[0]).initClass()
    .setParent(LiquidRouter)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_fluidUnloader
       * @instance
       */
      sideReg1: null,
      /**
       * <INTERNAL>
       * @memberof BLK_fluidUnloader
       * @instance
       */
      sideReg2: null,
      /**
      * <INTERNAL>
      * @override
      * @memberof BLK_fluidUnloader
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
       * @memberof BLK_fluidUnloader
       * @instance
       * @return {Array<Liquid>}
       */
      ex_findSelectionTgs: function() {
        return VARGEN.nonAuxs;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof BLK_fluidUnloader
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


      /**
       * @override
       * @memberof BLK_fluidUnloader
       * @instance
       * @return {boolean}
       */
      ex_noSideOutput: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_fluidUnloader
     * @extends B_fluidRouter
     */
    newClass().extendClass(PARENT[1], "B_fluidUnloader").implement(INTF[1]).initClass()
    .setParent(LiquidRouter.LiquidRouterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_fluidUnloader
       * @instance
       */
      unloadTg: null,


    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      acceptLiquid: function(b_f, liq) {
        return false;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      canDumpLiquid: function(b_t, liq) {
        return this.relativeTo(b_t) === this.rotation;
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      draw: function() {
        comp_draw(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


      ex_onSelectorUpdate: function() {
        this.liquids.clear();
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
