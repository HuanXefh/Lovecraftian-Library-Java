/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_ENV_largeBlock>} INTFENVLargeBlock
     */


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @param {INTFENVLargeBlock} blk
     * @param {number} rx
     * @param {number} ry
     * @return {boolean}
     */
    function checkLarge(blk, rx, ry) {
        return rx < getWorldWidth() - 1 && ry < getWorldHeight() - 1
            && (
                blk instanceof OverlayFloor ?
                    (
                        GLB_var.world.tile(rx + 1, ry).overlay() === blk
                            && GLB_var.world.tile(rx, ry + 1).overlay() === blk
                            && GLB_var.world.tile(rx, ry).overlay() === blk
                            && GLB_var.world.tile(rx + 1, ry + 1).overlay() === blk
                    ) :
                    (
                        GLB_var.world.tile(rx + 1, ry).block() === blk
                            && GLB_var.world.tile(rx, ry + 1).block() === blk
                            && GLB_var.world.tile(rx, ry).block() === blk
                            && GLB_var.world.tile(rx + 1, ry + 1).block() === blk
                    )
            );
    };


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFENVLargeBlock} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.largeReg = fetchRegion(blk, "-large");
        let w = blk.delegee.largeReg.width / 2;
        blk.delegee.largeSplitRegs = blk.delegee.largeReg.split(w, w);
        if(blk.delegee.largeSplitRegs != null) {
            let
                i,
                iCap,
                j = 0,
                jCap = blk.delegee.largeSplitRegs.iCap();
            while(j < jCap) {
                i = 0;
                iCap = blk.delegee.largeSplitRegs[i].iCap();
                while(i < iCap) {
                    blk.delegee.largeSplitRegs[j][i].scale = blk.region.scale;
                    i++;
                };
                j++;
            };
        };
    };


    /**
     * @private
     * @param {INTFENVLargeBlock} blk
     * @param {number} tx
     * @param {number} ty
     * @return {boolean}
     */
    function comp_ex_drawLarge(blk, tx, ty) {
        let
            rx = Math.floor(tx / 2.0) * 2.0,
            ry = Math.floor(ty / 2.0) * 2.0;
        if(!blk.delegee.largeReg.found() || !checkLarge(blk, rx, ry) || Mathf.randomSeed(Point2.pack(rx, ry)) >= blk.delegee.largeThr) return false;
        Draw.rect(
            blk.delegee.largeSplitRegs[tx % 2][1 - ty % 2],
            tx.toFCoord(),
            ty.toFCoord(),
        );
        return true;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    /**
     * Handles "-large" variant for some blocks, just like {@link StaticWall}.
     * <br> Do not implement this interface for floor blocks!
     * @class INTF_ENV_largeBlock
     */
    module.exports = new CLS_interface("INTF_ENV_largeBlock", {


        __paramObjM__: function() {
            return {


                /**
                 * `PARAM`: Larger value leads to more large variant drawn. Normalized.
                 * @memberof INTF_ENV_largeBlock
                 * @instance
                 * @type {number}
                 * @default 0.5
                 */
                largeThr: 0.5,


                /* <------------------------------ internal ------------------------------> */


                /**
                 * `INTERNAL`
                 * @memberof INTF_ENV_largeBlock
                 * @instance
                 * @type {TextureRegion}
                 */
                largeReg: null,
                /**
                 * `INTERNAL`
                 * @memberof INTF_ENV_largeBlock
                 * @instance
                 * @type {D2Array<TextureRegion>}
                 */
                largeSplitRegs: null,


            };
        },


        load: function() {
            comp_load(this);
        },


        /**
         * @memberof INTF_ENV_largeBlock
         * @instance
         * @func
         * @param {number} tx
         * @param {number} ty
         * @return {boolean}
         */
        ex_drawLarge: function(tx, ty) {
            return comp_ex_drawLarge(this, tx, ty);
        }
        .setProp({
            noSuper: true,
            boolMode: "and",
            argLen: 2,
        }),


    });
