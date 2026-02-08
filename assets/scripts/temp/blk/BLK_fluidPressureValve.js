/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Not a typical junction, controls pressure/vacuum.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidJunction");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureBlock");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.update = true;
    blk.rotate = true;
    blk.configurable = true;

    blk.config(JAVA.float, (b, f) => {
      b.delegee.presAllowFrac = f;
    });
  };


  function comp_load(blk) {
    blk.dirReg = fetchRegion(blk, "-dir", "-arrow");
  };


  function comp_updateTile(b) {
    b.presExtra = Mathf.lerp(0.0, b.presTmp, 1.0 - b.presAllowFrac);
  };


  function comp_getLiquidDestination(b, b_f, liq) {
    return !b.enabled || MDL_cond._isAuxiliaryFluid(liq) ?
      b :
      tryVal(b.front(), b);
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    tb.table(Styles.black3, tb1 => {
      tb1.left();
      MDL_table.__margin(tb1);
      MDL_table.__sliderCfg(tb1, b, () => "[$1]: [$2]".format(MDL_bundle._term("lovec", b.presTmp < 0.0 ? "vacuum" : "pressure"), b.presAllowFrac.perc(0)), 0.0, 1.0, 0.05, b.presAllowFrac);
    }).left().growX();
  };


  function comp_draw(b) {
    b.drawTeamTop();

    Draw.rect(b.block.region, b.x, b.y);
    Draw.rect(b.block.delegee.dirReg, b.x, b.y, b.drawrot());
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
      dirReg: null,
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
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(LiquidJunction.LiquidJunctionBuild)
    .setParam({
      presAllowFrac: 1.0,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      getLiquidDestination: function(b_f, liq) {
        return comp_getLiquidDestination(this, b_f, liq);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      config: function() {
        return this.presAllowFrac;
      }
      .setProp({
        noSuper: true,
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
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


      write: function(wr) {
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
        wr.f(this.presAllowFrac);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);
        this.presAllowFrac = rd.f();
      },


      ex_getPresTransScl: function(b_t) {
        return this.presAllowFrac;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


  ];
