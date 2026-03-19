/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseOverlay");
  const INTF = require("lovec/temp/intf/INTF_ENV_depthOverlay");


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


  /**
   * Similar to {@link ENV_depthOre}, but for liquid.
   * <br> <NAMEGEN>
   * @class ENV_depthLiquid
   * @extends ENV_baseOverlay
   * @extends INTF_ENV_depthOverlay
   */
  module.exports = newClass().extendClass(PARENT, "ENV_depthLiquid").implement(INTF).initClass()
  .setParent(OverlayFloor)
  .setTags("blk-env", "blk-dpliq")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof ENV_depthLiquid
     * @instance
     */
    rsDrop: null,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    /**
     * @memberof ENV_depthLiquid
     * @instance
     * @return {Liquid}
     */
    ex_getRsDrop: function() {
      return this.rsDrop;
    }
    .setProp({
      noSuper: true,
    }),


  });
