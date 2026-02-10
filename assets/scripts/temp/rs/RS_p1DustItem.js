/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: P1 dust.
   * Dust after T1 purification.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_dustItem");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_p1DustItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-dust", "rs-p1")
  .setParam({
    recolorRegStr: "lovec-gen-p1-dust-item",
  })
  .setMethod({


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-p1-dust");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
