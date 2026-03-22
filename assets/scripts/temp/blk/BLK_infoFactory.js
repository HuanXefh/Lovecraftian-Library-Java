/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");


  /* <---------- component ----------> */


  function comp_craft(b) {
    if(b.block.delegee.infoGetterTup != null) {
      b.infoCur = b.block.delegee.infoGetterTup[0](b);
    };
  };


  function comp_drawSelect(b) {
    MDL_draw._d_textSelect(b, b.infoCur, b.efficiency > 0.0001, b.block.infoOffTy);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A crafter that updates some information every time it crafts.
     * @class BLK_infoFactory
     * @extends BLK_baseFactory
     */
    newClass().extendClass(PARENT[0], "BLK_infoFactory").initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({


      /**
       * <PARAM>: Gets information to display.
       * <br> <ARGS>: b.
       * @memberof BLK_infoFactory
       * @instance
       */
      infoGetterTup: null,
      /**
       * <PARAM>: Integer offset for information text.
       * @memberof BLK_infoFactory
       * @instance
       */
      infoOffTy: 0,


    })
    .setMethod({}),


    /**
     * @class B_infoFactory
     * @extends B_baseFactory
     */
    newClass().extendClass(PARENT[1], "B_infoFactory").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_infoFactory
       * @instance
       */
      infoCur: null,


    })
    .setMethod({


      craft: function() {
        comp_craft(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


    }),


  ];
