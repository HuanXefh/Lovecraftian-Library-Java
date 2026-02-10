/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: P2 dust.
   * Dust after T2 purification.
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


  module.exports = newClass().extendClass(PARENT, "RS_p2DustItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-dust", "rs-p2")
  .setParam({
    recolorRegStr: "lovec-gen-p2-dust-item",
  })
  .setMethod({


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-p2-dust");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
