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
   * Items produced by roasting blend items.
   * <br> <NAMEGEN>
   * @class RS_clinkerItem
   * @extends RS_intermediateItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_clinkerItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-clinker")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_clinkerItem
     * @instance
     */
    recolorRegStr: "lovec-gen-clinker-item",


  })
  .setMethod({


    /**
     * @override
     * @memberof RS_clinkerItem
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-clinker");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
