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
   * Dust items after T1 purification.
   * <br> <NAMEGEN>
   * @class RS_p1DustItem
   * @extends RS_dustItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_p1DustItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-dust", "rs-p1")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_p1DustItem
     * @instance
     */
    recolorRegStr: "lovec-gen-p1-dust-item",

    
  })
  .setMethod({


    /**
     * @override
     * @memberof RS_p1DustItem
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-p1-dust");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
