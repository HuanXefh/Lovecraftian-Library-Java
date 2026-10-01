/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_radiusDisplay>} INTFBLKRadiusDisplay
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_radiusDisplay>} INTFBRadiusDisplay
     * @prop {INTFBLKRadiusDisplay} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKRadiusDisplay} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        blk.useP3dRange ?
            LCDrawP3D.cylinderFade(tx.toFCoord(blk.size), ty.toFCoord(blk.size), 1.0, blk.blkRad, blk.ex_getBlkRadColor(valid)) :
            LCDrawf.circlePlace(blk, tx, ty, blk.blkRad, true, blk.ex_getBlkRadColor(valid));
    };


    /**
     * @private
     * @param {INTFBRadiusDisplay} b
     * @return {void}
     */
    function comp_draw(b) {
        if(!b.isPayload() && b.block.delegee.useP3dRange && LCCheck.checkPosHoveredRect(b.x, b.y, 0, b.block.size)) {
            processZ(GLB_var.layer.p3dRange);
            LCDrawP3D.cylinderFade(b.x, b.y, 1.0, b.block.delegee.blkRad, b.block.ex_getBlkRadColor(true));
            processZ();
        };
    };


    /**
     * @private
     * @param {INTFBRadiusDisplay} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(!b.block.delegee.useP3dRange) {
            LCDrawf.circleSelect(b, b.block.delegee.blkRad, true, b.block.ex_getBlkRadColor(true));
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles circular range display.
         * No stat is added.
         * @class INTF_BLK_radiusDisplay
         */
        new CLS_interface("INTF_BLK_radiusDisplay", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Range (in world units) to show.
                     * @memberof INTF_BLK_radiusDisplay
                     * @instance
                     * @type {number}
                     */
                    blkRad: 40.0,
                    /**
                     * `PARAM`: Whether to draw pseudo-3D range instead of vanilla dashed circle.
                     * @memberof INTF_BLK_radiusDisplay
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
            ex_getBlkRadColor: function(valid) {
                return valid ? Pal.accent : Pal.remove;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


        /**
         * @class INTF_B_radiusDisplay
         */
        new CLS_interface("INTF_B_radiusDisplay", {


            draw: function() {
                comp_draw(this);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


        }),


    ];
