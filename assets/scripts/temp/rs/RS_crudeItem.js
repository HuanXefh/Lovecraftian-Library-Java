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
   * Items produced by chemical reactors or gathering, that need to be refined.
   * <br> <NAMEGEN>
   * @class RS_crudeItem
   * @extends RS_intermediateItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_crudeItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-crd")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_crudeItem
     * @instance
     */
    recolorRegStr: "lovec-gen-crude-item",


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    /**
     * @override
     * @memberof RS_crudeItem
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-crude");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
