/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Source of Lovec heat, with a slider to adjust the temperature.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseHeatBlock");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = true;
    blk.update = true;
    blk.group = BlockGroup.none;
    blk.priority = TargetPriority.base;
    blk.buildVisibility = BuildVisibility.sandboxOnly;

    blk.configurable = true;

    blk.config(JAVA.float, (b, f) => {
      b.delegee.tempSet = f;
    });
  };


  function comp_load(blk) {
    blk.sideReg1 = fetchRegion(blk, "-side1", "-side");
    blk.sideReg2 = fetchRegion(blk, "-side2", "-side");
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    tb.table(Styles.black3, tb1 => {
      tb1.left();
      MDL_table.__margin(tb1);
      MDL_table.__sliderCfg(tb1, b, () => "[$1]: [$2]".format(MDL_bundle._term("lovec", "temperature"), b.tempSet + " " + fetchStatUnit("lovec", "heatunits").localized()), b.block.delegee.tempMin, b.block.delegee.tempMax, 50.0, b.tempSet);
    }).left().growX();
  };


  function comp_draw(b) {
    b.drawTeamTop();

    Draw.rect(b.block.region, b.x, b.y);
    MDL_draw._reg_side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg2, b.rotation);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_heatSource").initClass()
    .setParent(Wall)
    .setTags()
    .setParam({
      // @PARAM: Minimum temperature.
      tempMin: 0.0,
      // @PARAM: Maximum temperature.
      tempMax: 3000.0,

      heatTransRate: 0.008,
      skipHeatFetch: true,
      skipHeatTrans: true,
      sideReg1: null,
      sideReg2: null,
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
    newClass().extendClass(PARENT[1], "BLK_heatSource").initClass()
    .setParent(Wall.WallBuild)
    .setParam({
      tempSet: 0.0,
    })
    .setMethod({


      config: function() {
        return this.tempSet;
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


      ex_calcTempTg: function() {
        return this.tempSet;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_getHeatSupplied: function() {
        return this.tempCur;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      write: function(wr) {
        let LCRevi = processRevision(wr);
        wr.f(this.tempSet);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.tempSet = rd.f();
      },


    }),


  ];
