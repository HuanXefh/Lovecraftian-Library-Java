/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_dustItem");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Dust items after T2 purification.
   * <br> <NAMEGEN>
   * @class RS_p2DustItem
   * @extends RS_dustItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_p2DustItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-dust", "rs-p2")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_p2DustItem
     * @instance
     */
    recolorRegStr: "lovec-gen-p2-dust-item",

    
  })
  .setMethod({


    /**
     * @override
     * @memberof RS_p2DustItem
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-p2-dust");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
