/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  const comp_ex_getAttrSum = function thisFun(blk, tx, ty, rot) {
    let t = Vars.world.tile(tx, ty);
    if(t == null) return;

    if(checkTupChange(thisFun.tmpTup, true, blk, t, rot)) {
      thisFun.tmpTup[3] = MDL_attr._sumRect(t, blk.attrR, blk.size, blk.ex_getAttrTg(), blk.delegee.attrMode);
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


    /**
     * Handles attribute calculation in a rectangular range.
     * Does not affect stats or range display.
     * @class INTF_BLK_rangeAttributeBlock
     */
    new CLS_interface("INTF_BLK_rangeAttributeBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Range in blocks for attribute calculation.
         * @memberof INTF_BLK_rangeAttributeBlock
         * @instance
         */
        attrR: 5,
        /**
         * <PARAM>: Selections mode of attribute.
         * @memberof INTF_BLK_rangeAttributeBlock
         * @instance
         */
        attrMode: MDL_attr.AttrModes.FLOOR,


      }),


      sumAttribute: function(attr, tx, ty) {
        return this.ex_getAttrSum(tx, ty, 0);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_BLK_rangeAttributeBlock
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @param {number} rot
       * @return {number}
       */
      ex_getAttrSum: function(tx, ty, rot) {
        return comp_ex_getAttrSum(this, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @memberof INTF_BLK_rangeAttributeBlock
       * @instance
       * @return {number}
       */
      ex_getAttrLimit: function() {
        return comp_ex_getAttrLimit(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * Gets actual attribute used by this block.
       * <br> <LATER>
       * @memberof INTF_BLK_rangeAttributeBlock
       * @instance
       * @return {Attribute}
       */
      ex_getAttrTg: function() {
        return this.attribute;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class INTF_B_rangeAttributeBlock
     */
    new CLS_interface("INTF_B_rangeAttributeBlock", {}),


  ];
