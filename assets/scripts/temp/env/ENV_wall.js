/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Most common terrain walls.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.flrParent = MDL_content._ct(blk.flrParent, "blk");
    if(blk.flrParent != null) {
      if(blk.flrParent.wall === Blocks.air) blk.flrParent.wall = blk;
      MDL_content.rename(
        blk,
        blk.flrParent.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "wall") + ")",
      );
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "ENV_wall").initClass()
  .setParent(StaticWall)
  .setTags("blk-env")
  .setParam({
    // @PARAM: Parent floor of the wall.
    flrParent: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
