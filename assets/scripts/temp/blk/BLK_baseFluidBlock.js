/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Base template for all fluid blocks.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  const MDL_cond = require("lovec/mdl/MDL_cond");


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


    // Block
    newClass().extendClass(PARENT[0], "BLK_baseFluidBlock").initClass()
    .setParent(null)
    .setTags()
    .setParam({
      // @PARAM: Whether abstract fluid is allowed in this fluid block. Do not try this unless you know what you are doing.
      allowAux: false,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_baseFluidBlock").initClass()
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
