/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateItem");


  /* <---------- component ----------> */


  function comp_init(item) {
    if(item.intmdParent != null) {
      if(item.flammability < 0.0001) item.flammability = item.intmdParent.flammability * 1.5;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Items produced by sintering purified dust items.
   * <br> `NAMEGEN`
   * @class RS_concentrateItem
   * @extends RS_intermediateItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_concentrateItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-ore0conc")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * `INTERNAL`
     * @override
     * @memberof RS_concentrateItem
     * @instance
     */
    recolorRegStr: "lovec-gen-concentrate-item",


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    /**
     * @override
     * @memberof RS_concentrateItem
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle.getTerm("common", "intmd-concentrate");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
