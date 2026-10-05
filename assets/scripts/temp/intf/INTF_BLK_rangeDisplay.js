/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_rangeDisplay>} INTFBLKRangeDisplay
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_rangeDisplay>} INTFBRangeDisplay
     * @prop {INTFBLKRangeDisplay} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKRangeDisplay} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        blk.delegee.useP3dRange ?
            LCDrawP3D.roomFade(tx.toFCoord(blk.size), ty.toFCoord(blk.size), 1.0, blk.delegee.blkR.toRectW(blk.size), blk.delegee.blkR.toRectW(blk.size), blk.self.ex_getBlkRColor(valid)) :
            LCDrawf.rectPlace(blk, tx, ty, blk.delegee.blkR, true, blk.self.ex_getBlkRColor(valid));
    };


    /**
     * @private
     * @param {INTFBRangeDisplay} b
     * @return {void}
     */
    function comp_draw(b) {
        if(!b.isPayload() && b.block.delegee.useP3dRange && LCCheck.checkPosHoveredRect(b.x, b.y, 0, b.block.size)) {
            processZ(GLB_var.layer.p3dRange);
            LCDrawP3D.roomFade(b.x, b.y, 1.0, b.block.delegee.blkR.toRectW(b.block.size), b.block.delegee.blkR.toRectW(b.block.size), b.block.self.ex_getBlkRColor(true));
            processZ();
        };
    };


    /**
     * @private
     * @param {INTFBRangeDisplay} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(!b.block.delegee.useP3dRange) {
            LCDrawf.rectSelect(b, b.block.delegee.blkR, true, b.block.self.ex_getBlkRColor(true));
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles rectangular range display.
         * No stat is added.
         * @class INTF_BLK_rangeDisplay
         */
        new CLS_interface("INTF_BLK_rangeDisplay", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Range (in blocks) to show.
                     * @memberof INTF_BLK_rangeDisplay
                     * @instance
                     * @type {number}
                     */
                    blkR: 5,
                    /**
                     * `PARAM`: See {@link INTF_BLK_radiusDisplay#useP3dRange}.
                     * @memberof INTF_BLK_rangeDisplay
                     * @instance
                     * @param {boolean}
                     */
                    useP3dRange: true,


                };
            },


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


            /**
             * `LATER`
             * @memberof INTF_BLK_rangeDisplay
             * @instance
             * @func
             * @param {boolean} valid
             * @return {Color}
             */
            ex_getBlkRColor: function(valid) {
                return valid ? Pal.accent : Pal.remove;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


        /**
         * @class INTF_B_rangeDisplay
         */
        new CLS_interface("INTF_B_rangeDisplay", {


            draw: function() {
                comp_draw(this);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


        }),


    ];
