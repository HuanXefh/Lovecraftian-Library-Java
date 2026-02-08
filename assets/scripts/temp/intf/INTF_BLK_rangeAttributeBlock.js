/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles attribute calculation in a rectangular range.
   * Does not affect stats or range display.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const MDL_attr = require("lovec/mdl/MDL_attr");


  /* <---------- component ----------> */


  const comp_ex_getAttrSum = function thisFun(blk, tx, ty, rot) {
    let t = Vars.world.tile(tx, ty);
    if(t == null) return;

    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, rot)) {
      thisFun.tmpTup[3] = MDL_attr._sum_rect(t, blk.attrR, blk.size, blk.ex_getAttrTg(), blk.delegee.attrMode);
    };

    return thisFun.tmpTup[3];
  }
  .setProp({
    tmpTup: [],
  });


  function comp_ex_getAttrLimit(blk) {
    return Math.pow(blk.attrR * 2 + blk.size, 2);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Range for attribute calculation.
        attrR: 5,
        // @PARAM: Selection mode of attribute. See {MDL_attr._sum_ts}.
        attrMode: "floor",
      }),


      sumAttribute: function(attr, tx, ty) {
        return this.ex_getAttrSum(tx, ty, 0);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getAttrSum: function(tx, ty, rot) {
        return comp_ex_getAttrSum(this, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_getAttrLimit: function() {
        return comp_ex_getAttrLimit(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * The actual attribute used by this block.
       * ---------------------------------------- */
      ex_getAttrTg: function() {
        return this.attribute;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    new CLS_interface({}),


  ];
