/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: morbid solution.
   * Solution with unwanted insolubles.
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


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-morbid")
  .setParam({
    recolorRegStr: "lovec-gen-morbid-solution-liquid",
  })
  .setMethod({


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-morbid-solution" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
