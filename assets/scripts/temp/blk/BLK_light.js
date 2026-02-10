/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Light block but actually a factory.
   * The range and lightness are determined by efficiency.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.emitLight = true;

    blk.ex_addLogicGetter(LAccess.range, b => blk.lightRad * b.delegee.lightProg / Vars.tilesize);
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.lightRad / Vars.tilesize, StatUnit.blocks);
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    Drawf.dashCircle(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.lightRad, valid ? Pal.accent : Pal.remove);
  };


  function comp_updateTile(b) {
    b.lightProg = Mathf.approachDelta(b.lightProg, Mathf.clamp(b.efficiency), 0.004);
  };


  function comp_drawSelect(b) {
    Drawf.dashCircle(b.x, b.y, b.block.delegee.lightRad * b.lightProg, Pal.accent);
  };


  function comp_drawLight(b) {
    MDL_draw._l_disk(
      b.x, b.y, b.lightProg,
      b.block.delegee.lightRad * b.lightProg * 0.6,
      b.block.size, null,
      b.block.delegee.lightA * Interp.pow3In.apply(b.lightProg),
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_light").initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-li")
    .setParam({
      // @PARAM: Light radius of this block at efficiency of 1.0.
      lightRad: 200.0,
      // @PARAM: Lightness of this block.
      lightA: 0.65,
    })
    .setParamParser([
      "lightRad", function(val) {
        this["lightClipSize"] = val * 3.0;
        return val;
      },
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_light").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({
      lightProg: 0.0,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


      drawLight: function() {
        comp_drawLight(this);
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
        wr.f(this.lightProg);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);
        this.lightProg = rd.f();
      },


      ex_processData: function(wr0rd, LCRevi) {
        // Do nothing
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
