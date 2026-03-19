/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateItem");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Items produced by mixers or ball mills.
   * <br> <NAMEGEN>
   * @class RS_blendItem
   * @extends RS_intermediateItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_blendItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-blend")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_blendItem
     * @instance
     */
    recolorRegStr: "lovec-gen-blend-item",


  })
  .setMethod({


    /**
     * @override
     * @memberof RS_blendItem
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-blend");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
