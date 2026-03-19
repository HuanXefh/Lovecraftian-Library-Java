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
      if(itm.flammability < 0.0001) itm.flammability = itm.intmdParent.flammability * 1.25;
      if(itm.explosiveness < 0.0001) itm.explosiveness = itm.intmdParent.explosiveness * 1.25;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Items produced by rock crushers.
   * <br> <NAMEGEN>
   * @class RS_chunksItem
   * @extends RS_intermediateItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_chunksItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-chunks")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_chunksItem
     * @instance
     */
    recolorRegStr: "lovec-gen-chunks-item",

    
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    /**
     * @override
     * @memberof RS_chunksItem
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-chunks");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
