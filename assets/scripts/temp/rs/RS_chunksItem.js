/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: chunks.
   * Produced from a crusher.
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
      if(itm.flammability < 0.0001) itm.flammability = itm.intmdParent.flammability * 1.25;
      if(itm.explosiveness < 0.0001) itm.explosiveness = itm.intmdParent.explosiveness * 1.25;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_chunksItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-chunks")
  .setParam({
    recolorRegStr: "lovec-gen-chunks-item",
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-chunks");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
