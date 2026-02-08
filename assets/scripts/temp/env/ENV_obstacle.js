/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Unbreakable props.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");


  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.solid = true;
    blk.breakable = false;
    blk.unitMoveBreakable = false;
    blk.alwaysReplace = false;
    blk.placeableLiquid = true;

    if(blk.customShadow) {
      MDL_event._c_onLoad(() => {
        if(!Vars.headless && !blk.customShadowRegion.found()) LOG_HANDLER.log("noCustomShadowRegionFound", blk.name);
      });
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Prop)
  .setTags("blk-env")
  .setParam({})
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
