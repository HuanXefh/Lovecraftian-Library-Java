/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Toggable liquid junction.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidJunction");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    blk.config(JAVA.boolean, (b, bool) => {
      b.delegee.isOn = bool;
      Sounds.click.at(b);
    });
  };


  function comp_load(blk) {
    blk.onReg = fetchRegion(blk, "-on");
  };


  function comp_getLiquidDestination(b, b_f, liq) {
    return !b.enabled || b.isOn || MDL_cond._isAuxiliaryFluid(liq) ?
      b :
      b.super$getLiquidDestination(b_f, liq);
  };


  function comp_configTapped(b) {
    b.configure(!b.isOn);
    return false;
  };


  function comp_draw(b) {
    if(b.isOn) Draw.rect(b.block.delegee.onReg, b.x, b.y, b.drawrot());
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(LiquidJunction)
    .setTags("blk-liq", "blk-gate")
    .setParam({
      onReg: null,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(LiquidJunction.LiquidJunctionBuild)
    .setParam({
      isOn: false,
    })
    .setMethod({


      getLiquidDestination: function(b_f, liq) {
        return comp_getLiquidDestination(this, b_f, liq);
      }.setProp({
        noSuper: true,
        override: true,
      }),


      configTapped: function() {
        return comp_configTapped(this);
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      write: function(wr) {
        let LCRevi = processRevision(wr);
        wr.bool(this.isOn);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.isOn = rd.bool();
      },


    }),


  ];
