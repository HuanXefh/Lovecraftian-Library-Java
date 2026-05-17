/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.breakable = false;
    blk.unitMoveBreakable = false;
    blk.solid = false;
    blk.alwaysReplace = false;
    blk.floating = true;
    blk.placeableLiquid = true;

    // Bypass vanilla shadow due to hard-coded alpha value
    blk.hasShadow = false;
    blk.customShadow = true;

    if(!Vars.headless) {
      MDL_event._c_onLoad(() => {
        if(!blk.customShadowRegion.found()) LOG_HANDLER.log("noCustomShadowRegionFound", blk.name);
        if(blk.variantShadowRegions != null) {
          blk.variantShadowRegions.forEachFast(shaReg => {
            if(!shaReg.found()) shaReg.set(blk.customShadowRegion);
          });
        };
      });
    };
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


  /**
   * Parent of shorter plants. These props are part of map decoration and thus being unbreakable.
   * @class ENV_baseGrass
   * @extends ENV_baseProp
   */
  module.exports = newClass().extendClass(PARENT, "ENV_baseGrass").initClass()
  .setParent(null)
  .setTags("blk-env")
  .setParam({})
  .setParamAlias([
    /**
     * <PARAM>: Z-layer of the grass.
     * @type {number} layGrass
     * @memberof ENV_baseGrass
     * @instance
     */
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
