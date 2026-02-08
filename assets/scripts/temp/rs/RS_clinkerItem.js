/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: clinker.
   * Produced by roasting blend items.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateItem");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-clinker")
  .setParam({
    recolorRegStr: "lovec-gen-clinker-item",
  })
  .setMethod({


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-clinker");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
