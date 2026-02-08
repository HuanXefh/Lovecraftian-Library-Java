/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Underground ore that is only mineable by certain drills, and requires scanning.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseOverlay");
  const INTF = require("lovec/temp/intf/INTF_ENV_depthOverlay");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.playerUnmineable = true;

    if(blk.itemDrop == null) ERROR_HANDLER.throw("noItemDrop", blk.name);
    MDL_content.rename(
      blk,
      blk.itemDrop.localizedName + MDL_text._space() + "(" + blk.ex_getDepthName() + ")",
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).implement(INTF).initClass()
  .setParent(OverlayFloor)
  .setTags("blk-env", "blk-dpore")
  .setParam({})
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
