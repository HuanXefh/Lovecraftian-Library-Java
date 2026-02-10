/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: suspension.
   * Like slurry but not that thick, usually processed in a different separator.
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


  module.exports = newClass().extendClass(PARENT, "RS_suspensionLiquid").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-susp")
  .setParam({
    recolorRegStr: "lovec-gen-suspension-liquid",
  })
  .setMethod({


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-suspension" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
