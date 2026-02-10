/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: crude.
   * Produced by chemical reactors or gathering.
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


  module.exports = newClass().extendClass(PARENT, "RS_crudeItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-crd")
  .setParam({
    recolorRegStr: "lovec-gen-crude-item",
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-crude");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
