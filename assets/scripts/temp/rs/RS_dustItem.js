/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: dust.
   * Produced from a pulverizer.
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
      if(itm.explosiveness < 0.0001) itm.explosiveness = itm.intmdParent.explosiveness * 1.5;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_dustItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-dust")
  .setParam({
    recolorRegStr: "lovec-gen-dust-item",
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-dust");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
