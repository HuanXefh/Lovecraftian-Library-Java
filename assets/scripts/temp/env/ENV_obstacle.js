/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");


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


  /**
   * Unbreakable props.
   * @class ENV_obstacle
   * @extends ENV_baseProp
   */
  module.exports = newClass().extendClass(PARENT, "ENV_obstacle").initClass()
  .setParent(Prop)
  .setTags("blk-env")
  .setParam({})
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
