/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: diluted slurry.
   * Slurry that should be thickened before further processing.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_slurryLiquid");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-slur0dil")
  .setParam({
    recolorRegStr: "lovec-gen-diluted-slurry-liquid",
  })
  .setMethod({


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-diluted-slurry" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
