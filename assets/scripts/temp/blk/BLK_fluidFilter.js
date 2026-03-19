/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidJunction");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentSelector");


  /* <---------- component ----------> */


  function comp_load(blk) {
    blk.topReg = fetchRegion(blk, "-top");
  };


  function comp_getLiquidDestination(b, b_f, liq) {
    return !b.enabled || liq !== b.ctTg || MDL_cond._isAuxiliaryFluid(liq) ?
      b :
      b.super$getLiquidDestination(b_f, liq);
  };


  function comp_draw(b) {
    b.drawTeamTop();

    Draw.rect(b.block.region, b.x, b.y);
    if(b.ctTg != null) {
      LiquidBlock.drawTiledFrames(b.block.size, b.x, b.y, 1.0, 1.0, 1.0, 1.0, b.ctTg, 1.0);
    };
    Draw.rect(b.block.delegee.topReg, b.x, b.y);
  };


  function comp_drawSelect(b) {
    LCDraw.contentIcon(b.x, b.y, b.ctTg, b.block.size);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Fluid junction that only allows selected fluid to go through.
     * Unlike item filter gate, this has no side output since no need.
     * <br> <SINGLESIZE>
     * @class BLK_fluidFilter
     * @extends BLK_fluidJunction
     * @extends INTF_BLK_contentSelector
     */
    newClass().extendClass(PARENT[0], "BLK_fluidFilter").implement(INTF[0]).initClass()
    .setParent(LiquidJunction)
    .setTags("blk-liq", "blk-gate")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_fluidFilter
       * @instance
       */
      topReg: null,


    })
    .setMethod({


      load: function() {
        comp_load(this);
      },


      /**
       * @override
       * @memberof BLK_fluidFilter
       * @instance
       * @return {Array<Liquid>}
       */
      ex_findSelectionTgs: function() {
        return Vars.content.liquids().select(liq => !MDL_cond._isAuxiliaryFluid(liq)).toArray();
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_fluidFilter
     * @extends B_fluidJunction
     * @extends INTF_B_contentSelector
     */
    newClass().extendClass(PARENT[1], "B_fluidFilter").implement(INTF[1]).initClass()
    .setParent(LiquidJunction.LiquidJunctionBuild)
    .setParam({})
    .setMethod({


      getLiquidDestination: function(b_f, liq) {
        return comp_getLiquidDestination(this, b_f, liq);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      config: function() {
        return this.ctTg;
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      }
      .setProp({
        noSuper: true,
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      },


      write: function(wr) {
        this.ex_processData(wr);
        MDL_io._wr_ct(wr, this.ctTg);
      }
      .setProp({
        override: true,
      }),


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
        this.ctTg = MDL_io._rd_ct(rd);
      }
      .setProp({
        override: true,
      }),


    }),


  ];
