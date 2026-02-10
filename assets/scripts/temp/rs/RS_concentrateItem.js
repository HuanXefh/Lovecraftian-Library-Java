/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: concentrate.
   * Produced by sintering purified dust items.
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


  function comp_init(itm) {
    if(itm.intmdParent != null) {
      if(itm.flammability < 0.0001) itm.flammability = itm.intmdParent.flammability * 1.5;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_concentrateItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-ore0conc")
  .setParam({
    recolorRegStr: "lovec-gen-concentrate-item",
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-concentrate");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
