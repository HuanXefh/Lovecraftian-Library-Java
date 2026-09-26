/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_transportBlockSideDisplay>} INTFBLKTransportBlockSideDisplay
     */


     /**
      * @typedef {TemplateInstance<Building, INTF_B_transportBlockSideDisplay>} INTFBTransportBlockSideDisplay
      * @prop {INTFBLKFluidTypeFilter} block
      */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKTransportBlockSideDisplay} blk
     * @return {void}
     */
    function comp_load(blk) {
        if(blk.noTransSideReg) return;
        blk.transSideReg1 = fetchRegionOrNull(blk, "-side1", "-side");
        blk.transSideReg2 = fetchRegionOrNull(blk, "-side2", "-side");
    };


    /**
     * @private
     * @param {INTFBTransportBlockSideDisplay} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        if(b.block.delegee.noTransSideReg) return;
        b.shouldDrawTransSide1 = LCGeometry.showBackSide(b);
        b.shouldDrawTransSide2 = LCGeometry.showFrontSide(b);
    };


    /**
     * @private
     * @param {INTFBTransportBlockSideDisplay} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        if(b.block.delegee.noTransSideReg) return;
        // Is it even possible to see the payload???
        b.shouldDrawTransSide1 = b.shouldDrawTransSide2 = true;
    };


    /**
     * @private
     * @param {INTFBTransportBlockSideDisplay} b
     * @return {void}
     */
    function comp_draw(b) {
        if(b.block.delegee.noTransSideReg) return;
        if(b.shouldDrawTransSide1) {
            LCDrawf.side(b.x, b.y, b.block.delegee.transSideReg1, b.rotation, Color.white, 1.0, b.block.delegee.transSideRegZ);
        };
        if(b.shouldDrawTransSide2) {
            LCDrawf.side(b.x, b.y, b.block.delegee.transSideReg2, b.rotation + 2, Color.white, 1.0, b.block.delegee.transSideRegZ);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Used to draw side regions for conveyors and ducts.
         * @class INTF_BLK_transportBlockSideDisplay
         */
        new CLS_interface("INTF_BLK_transportBlockSideDisplay", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Whether side regions are NOT used.
                     * @memberof INTF_BLK_transportBlockSideDisplay
                     * @instance
                     * @type {boolean}
                     */
                    noTransSideReg: false,
                    /**
                     * `PARAM`: Layer for side regions.
                     * @memberof INTF_BLK_transportBlockSideDisplay
                     * @instance
                     * @type {number}
                     */
                    transSideRegZ: -1,


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_BLK_transportBlockSideDisplay
                     * @instance
                     * @type {TextureRegion|null}
                     */
                    transSideReg1: null,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_BLK_transportBlockSideDisplay
                     * @instance
                     * @type {TextureRegion|null}
                     */
                    transSideReg2: null,


                };
            },


            load: function() {
                comp_load(this);
            },


            /**
             * `LATER`
             * @memberof INTF_BLK_transportBlockSideDisplay
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_shouldBlendBackSide: function(ob) {
                return true;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * `LATER`
             * @memberof INTF_BLK_transportBlockSideDisplay
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_shouldBlendFlankSide: function(ob) {
                return true;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * `LATER`
             * @memberof INTF_BLK_transportBlockSideDisplay
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_shouldBlendFrontSide: function(ob) {
                return true;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


        /**
         * @class INTF_B_transportBlockSideDisplay
         */
        new CLS_interface("INTF_B_transportBlockSideDisplay", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_transportBlockSideDisplay
                     * @instance
                     * @type {boolean}
                     */
                    shouldDrawTransSide1: false,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_transportBlockSideDisplay
                     * @instance
                     * @type {boolean}
                     */
                    shouldDrawTransSide2: false,


                };
            },


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            draw: function() {
                comp_draw(this);
            },


        }),


    ];
