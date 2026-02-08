/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla region parts.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/part/PART_basePart");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(RegionPart)
  .setTags()
  .setParam({
    // For convenience
    suffix: "",
    mirror: false,
    outline: true,
    blending: Blending.normal,
    moveX: 0.0,
    moveY: 0.0,
    growX: 0.0,
    growY: 0.0,
    moveRot: 0.0,
    color: null,
    colorTo: null,
    mixColor: null,
    mixColorTo: null,
    heatColor: prov(() => Pal.turretHeat.cpy()),
    progress: DrawPart.PartProgress.warmup,
    growProgress: DrawPart.PartProgress.warmup,
    heatProgress: DrawPart.PartProgress.heat,
    children: prov(() => []),
    moves: prov(() => []),
  })
  .setParamAlias([
    "nm", "name", null,
    "offX", "x", 0.0,
    "offY", "y", 0.0,
    "oriX", "originX", 0.0,
    "oriY", "originY", 0.0,
    "sclX", "xScl", 1.0,
    "sclY", "yScl", 1.0,
    "z", "layer", -1.0,
    "offZ", "layerOffset", 0.0,
    "heatZ", "turretHeatLayer", Layer.turretHeat,
    "heatOffZ", "heatLayerOffset", 1.0,
    "outlineOffZ", "outlineLayerOffset", -0.001,
    "rot", "rotation", 0.0,
    "shouldClampProg", "clampProgress", true,
    "shouldDrawReg", "drawRegion", true,
    "shouldDrawLight", "heatLight", false,
    "lightA", "heatLightOpacity", 0.3,
  ])
  .setParamParser([
    "children", function(val) {
      return prov(() => val.get().toSeq());
    },
    "moves", function(val) {
      return prov(() => val.get().toSeq());
    },
  ])
  .setMethod({});
