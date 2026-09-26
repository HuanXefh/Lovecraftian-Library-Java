/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_fluidTypeFilter>} INTFBLKFluidTypeFilter
     */


     /**
      * @typedef {TemplateInstance<Building, INTF_B_fluidTypeFilter>} INTFBFluidTypeFilter
      * @prop {INTFBLKFluidTypeFilter} block
      */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBFluidTypeFilter} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {boolean}
     */
    function comp_acceptLiquid(b, b_f, liq) {
        switch(b.block.delegee.fldType) {
            case "liquid" : return !liq.gas && !liq.willBoil();
            case "gas" : return liq.gas || liq.willBoil();
        };
        return true;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles fluid type restriction.
         * @class INTF_BLK_fluidTypeFilter
         */
        new CLS_interface("INTF_BLK_fluidTypeFilter", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Type of fluid that this block accepts.
                     * <br> `VALS`: "liquid", "gas", "any".
                     * @memberof INTF_BLK_fluidTypeFilter
                     * @instance
                     * @type {string}
                     */
                    fldType: "any",


                };
            },


        }),


        /**
         * @class INTF_B_fluidTypeFilter
         */
        new CLS_interface("INTF_B_fluidTypeFilter", {


            acceptLiquid: function(b_f, liq) {
                return comp_acceptLiquid(this, b_f, liq);
            }
            .setProp({
                boolMode: "and",
            }),


        }),


    ];
