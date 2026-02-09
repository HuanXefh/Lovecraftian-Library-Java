/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Unlike item filter gate, fluid filter has no side output since it's meant for blocks with multiple fluid outputs.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidJunction");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentSelector");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_io = require("lovec/mdl/MDL_io");


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


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(LiquidJunction)
    .setTags("blk-liq", "blk-gate")
    .setParam({
      topReg: null,
    })
    .setMethod({


      load: function() {
        comp_load(this);
      },


      ex_findSelectionTgs: function() {
        return Vars.content.liquids().select(liq => !MDL_cond._isAuxiliaryFluid(liq)).toArray();
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
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
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
        MDL_io._wr_ct(wr, this.ctTg);
      }
      .setProp({
        override: true,
      }),


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);
        this.ctTg = MDL_io._rd_ct(rd);
      }
      .setProp({
        override: true,
      }),


    }),


  ];
