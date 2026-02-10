/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Similar to {ENV_depthOre}, but for liquid.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseOverlay");
  const INTF = require("lovec/temp/intf/INTF_ENV_depthOverlay");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- auxiliary ----------> */


  const dynaAttrMap = DB_item.db["map"]["attr"]["dpliq"];


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rsDrop = MDL_attr._dynaAttrRs(dynaAttrMap, blk);
    if(blk.rsDrop == null) ERROR_HANDLER.throw("noLiquidDrop", blk.name);
    MDL_content.rename(
      blk,
      blk.rsDrop.localizedName + MDL_text._space() + "(" + blk.ex_getDepthName() + ")",
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "ENV_depthLiquid").implement(INTF).initClass()
  .setParent(OverlayFloor)
  .setTags("blk-env", "blk-dpliq")
  .setParam({
    rsDrop: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    ex_getRsDrop: function() {
      return this.rsDrop;
    }
    .setProp({
      noSuper: true,
    }),


  });
