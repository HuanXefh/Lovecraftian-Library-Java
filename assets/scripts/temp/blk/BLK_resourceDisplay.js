/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A block that displays icon of the selected resource.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentSelector");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.none;
    blk.priority = TargetPriority.base;
    if(blk.overwriteVanillaProp) {
      blk.solid = false;
      blk.underBullets = true;
    };

    blk.ex_addLogicGetter(LAccess.config, b => b.delegee.ctTg);
    blk.ex_addLogicControl(LAccess.config, (b, param1) => {
      if(param1 instanceof UnlockableContent || typeof param1 === "string") b.configure(param1);
    });
  };


  function comp_load(blk) {
    blk.topReg = fetchRegion(blk, "-top");
  };


  function comp_draw(b) {
    MDL_draw.comp_draw_baseBuilding(b);

    LCDraw.content(b.x, b.y, b.ctTg, b.block.size - b.block.delegee.rsRegPad / Vars.tilesize);
    Draw.rect(b.block.delegee.topReg, b.x, b.y);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_resourceDisplay").implement(INTF[0]).initClass()
    .setParent(Wall)
    .setTags("blk-log")
    .setParam({
      // @PARAM: Space between resource icon and the edge.
      rsRegPad: 2.0,

      topReg: null,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      ex_findSelectionTgs: function() {
        return Vars.content.items().toArray().concat(Vars.content.liquids().toArray());
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_resourceDisplay").implement(INTF[1]).initClass()
    .setParent(Wall.WallBuild)
    .setParam({})
    .setMethod({


      draw: function() {
        comp_draw(this);
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);
      },


    }),


  ];
