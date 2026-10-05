/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_rangeAttributeBlock>} INTFBLKRangeAttributeBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_rangeAttributeBlock>} INTFBRangeAttributeBlock
     * @prop {INTFBLKRangeAttributeBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKRangeAttributeBlock} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @return {number}
     */
    const comp_ex_getAttrSum = function thisFun(blk, tx, ty, rot) {
        let t = GLB_var.world.tile(tx, ty);
        if(t == null) return;
        if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, rot)) {
            thisFun.tmpSum = MDL_attr.calcSumRect(t, blk.attrR, blk.size, blk.self.ex_getAttrTarget(), blk.delegee.attrMode) + blk.self.ex_getAttrTarget().env();
        };
        return thisFun.tmpSum;
    }
    .setProp({
        /**
         * @memberof comp_ex_getAttrSum
         * @type {[Block, Tile, number]}
         */
        tmpTup: [],
        /**
         * @memberof comp_ex_getAttrSum
         * @type {number}
         */
        tmpSum: 0.0,
    });


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


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Range in blocks for attribute calculation.
                     * @memberof INTF_BLK_rangeAttributeBlock
                     * @instance
                     * @type {number}
                     */
                    attrR: 5,
                    /**
                     * `PARAM`: See {@link INTF_BLK_dynamicAttributeBlock#attrMode}.
                     * @memberof INTF_BLK_rangeAttributeBlock
                     * @instance
                     * @type {ENumber}
                     */
                    attrMode: AttrModes.FLOOR,
                    /**
                     * `PARAM`: See {@link INTF_BLK_dynamicAttributeBlock#attrRcType}.
                     * @memberof INTF_BLK_rangeAttributeBlock
                     * @instance
                     * @type {ENumber}
                     */
                    attrRcType: AttrRecipeTypes.FLOOR,


                };
            },


            sumAttribute: function(attr, tx, ty) {
                return this.self.ex_getAttrSum(tx, ty, 0);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Calculates attribute sum in a rectangular range.
             * @memberof INTF_BLK_rangeAttributeBlock
             * @instance
             * @func
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
             * Gets actual attribute used by this block.
             * <br> `LATER`
             * @memberof INTF_BLK_rangeAttributeBlock
             * @instance
             * @func
             * @return {Attribute}
             */
            ex_getAttrTarget: function() {
                return this.attribute;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Expected production type used in TMI.
             * <br> `LATER`
             * @memberof INTF_BLK_rangeAttributeBlock
             * @instance
             * @func
             * @return {String|null}
             */
            ex_getRangeAttrProdTypeStr: function() {
                return null;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_rangeAttributeBlock
         */
        new CLS_interface("INTF_B_rangeAttributeBlock", {}),


    ];
