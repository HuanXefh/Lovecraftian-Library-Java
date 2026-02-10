/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Router.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemGate");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_onProximityUpdate(b) {
    b.nextToRouter = b.proximity.find(ob => MDL_cond._isRouter(ob.block)) != null;
  };


  function comp_pickedUp(b) {
    b.nextToRouter = false;
  };


  function comp_updateTile(b) {
    if(TIMER.rsCur) b.lastRs = b.items.first();
  };


  function comp_acceptItem(b, b_f, itm) {
    b.lastRs = itm;
    return true;
  };


  function comp_draw(b) {
    if(PARAM.drawRouterHeresy && b.nextToRouter) {
      b.proximity.each(ob => {
        if(MDL_cond._isRouter(ob.block)) MDL_draw._d_areaShrink(ob.tile, ob.block.size, false);
      });
    };
  };


  function comp_drawSelect(b) {
    LCDraw.contentIcon(b.x, b.y, b.lastRs, b.block.size);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_router").initClass()
    .setParent(Router)
    .setTags("blk-dis", "blk-gate", "blk-router")
    .setParam({})
    .setMethod({


      ex_isSingleSized: function() {
        return false;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_router").initClass()
    .setParent(Router.RouterBuild)
    .setParam({
      lastRs: null,
      nextToRouter: false,
    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      acceptItem: function(b_f, itm) {
        return comp_acceptItem(this, b_f, itm);
      }
      .setProp({
        boolMode: "and",
      }),


      draw: function() {
        comp_draw(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


    }),


  ];
