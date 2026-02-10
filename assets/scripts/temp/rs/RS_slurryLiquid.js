/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: slurry.
   * Fluid with insolubles as the products.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_solutionFluid");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_slurryLiquid").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-slur")
  .setParam({
    recolorRegStr: "lovec-gen-slurry-liquid",
  })
  .setMethod({


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-slurry" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
