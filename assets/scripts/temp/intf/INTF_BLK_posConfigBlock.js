/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_posConfigBlock>} INTFBLKPosConfigBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_posConfigBlock>} INTFBPosConfigBlock
     * @prop {INTFBLKPosConfigBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKPosConfigBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.configurable = true;

        blk.config(Vec2, (b, vec2) => {
            b.delegee.posConfigVec2.set(vec2);
            b.delegee.posConfigT = GLB_var.world.tileWorld(vec2.x, vec2.y);
            b.delegee.posConfigB = GLB_var.world.buildWorld(vec2.x, vec2.y);
        });
    };


    /**
     * @private
     * @param {INTFBPosConfigBlock} b
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    function comp_onConfigureTapped(b, x, y) {
        if(Mathf.dst(b.x, b.y, x, y) <= b.ex_getPosConfigRad() && b.ex_checkPosConfigValid(x, y)) {
            b.configure(Tmp.v1.set(x, y));
            return true;
        };
        return false;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles position config that can be set by tapping somewhere.
         * @todo Untested.
         * @class INTF_BLK_posConfigBlock
         */
        new CLS_interface("INTF_BLK_posConfigBlock", {


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class INTF_B_posConfigBlock
         */
        new CLS_interface("INTF_B_posConfigBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Last config position.
                     * @memberof INTF_B_posConfigBlock
                     * @instance
                     * @type {TDynamic<Vec2>}
                     */
                    posConfigVec2: tprov(() => new Vec2()),
                    /**
                     * `INTERNAL`: Tile for config position.
                     * @memberof INTF_B_posConfigBlock
                     * @instance
                     * @type {Tile|null}
                     */
                    posConfigT: null,
                    /**
                     * `INTERNAL`: Building for config position.
                     * @memberof INTF_B_posConfigBlock
                     * @instance
                     * @type {Building|null}
                     */
                    posConfigB: null,


                };
            },


            onConfigureTapped: function(x, y) {
                return comp_onConfigureTapped(this, x, y);
            },


            /**
             * Position selection radius.
             * <br> `LATER`
             * @memberof INTF_B_posConfigBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_getPosConfigRad: function() {
                return Number.n12;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Used to check whether a position is valid to be used.
             * <br> `LATER`
             * @memberof INTF_B_posConfigBlock
             * @instance
             * @func
             * @param {number} x
             * @param {number} y
             * @return {boolean}
             */
            ex_checkPosConfigValid: function(x, y) {
                return true;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
