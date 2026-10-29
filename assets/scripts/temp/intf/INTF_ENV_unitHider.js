/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<OverlayFloor, INTF_ENV_unitHider>} INTFENVUnitHider
     */


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    /**
     * For blocks that can hide units, like trees.
     * @class INTF_ENV_unitHider
     */
    module.exports = new CLS_interface("INTF_ENV_unitHider", {


        __paramObjM__: function() {
            return {


                /**
                 * `PARAM`: Whether this block can hide units.
                 * @memberof INTF_ENV_unitHider
                 * @instance
                 * @type {boolean}
                 */
                hidable: false,


            };
        },


        /**
         * @memberof INTF_ENV_unitHider
         * @instance
         * @func
         * @param {number} tx
         * @param {number} ty
         * @return {boolean}
         */
        ex_checkHidable: function(tx, ty) {
            return this.delegee.hidable;
        }
        .setProp({
            noSuper: true,
            argLen: 2,
        }),


        /**
         * `LATER`
         * @memberof INTF_ENV_unitHider
         * @instance
         * @func
         * @param {number} tx
         * @param {number} ty
         * @return {number}
         */
        ex_getHideRad: function(tx, ty) {
            return 0.0;
        }
        .setProp({
            noSuper: true,
            argLen: 2,
        }),


    });
