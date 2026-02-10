/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Unbreakable sea bush.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseEnvBlock");


  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.breakable = false;
    blk.unitMoveBreakable = false;
    blk.solid = false;
    blk.alwaysReplace = false;
    blk.placeableLiquid = true;

    // Bypass vanilla shadow due to hard-coded alpha value
    blk.hasShadow = false;
    blk.customShadow = true;

    MDL_event._c_onLoad(() => {
      if(!Vars.headless && !blk.customShadowRegion.found()) LOG_HANDLER.log("noCustomShadowRegionFound", blk.name);
    });
  };


  function comp_drawBase(blk, t) {
    if(!blk.customShadowRegion.found()) return;

    let z = Draw.z();
    Draw.z(Layer.block - 0.1);
    Draw.rect(blk.customShadowRegion, t.worldx(), t.worldy());
    Draw.z(z);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "ENV_grass").initClass()
  .setParent(SeaBush)
  .setTags("blk-env")
  .setParam({})
  .setParamAlias([
    "layGrass", "layer", Layer.groundUnit - 1.2,
  ])
  .setMethod({


    init: function() {
      comp_init(this);
    },


    drawBase: function(t) {
      comp_drawBase(this, t);
    },


  });
