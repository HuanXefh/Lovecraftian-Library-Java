/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateItem");


  /* <---------- component ----------> */


  function comp_init(itm) {
    if(itm.intmdParent != null) {
      if(itm.flammability < 0.0001) itm.flammability = itm.intmdParent.flammability * 1.5;
      if(itm.explosiveness < 0.0001) itm.explosiveness = itm.intmdParent.explosiveness * 1.5;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Items produced by pulverizers.
   * <br> <NAMEGEN>
   * @class RS_dustItem
   * @extends RS_intermediateItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_dustItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-dust")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_dustItem
     * @instance
     */
    recolorRegStr: "lovec-gen-dust-item",


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    /**
     * @override
     * @memberof RS_dustItem
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-dust");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
