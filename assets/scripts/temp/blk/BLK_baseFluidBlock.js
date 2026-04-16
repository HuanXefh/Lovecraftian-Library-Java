/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.liquids;
  };


  function comp_acceptLiquid(b, b_f, liq) {
    return !(!b.block.delegee.allowAux && MDL_cond._isAuxiliaryFluid(liq));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Base template for all fluid blocks.
     * Fluid blocks won't accept abstract fluids by default.
     * @class BLK_baseFluidBlock
     * @extends BLK_baseBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseFluidBlock").initClass()
    .setParent(null)
    .setTags()
    .setParam({


      /**
       * <PARAM>: Whether abstract fluid is allowed in this block.
       * @memberof BLK_baseFluidBlock
       * @instance
       */
      allowAux: false,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_baseFluidBlock
     * @extends B_baseBlock
     */
    newClass().extendClass(PARENT[1], "B_baseFluidBlock").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
