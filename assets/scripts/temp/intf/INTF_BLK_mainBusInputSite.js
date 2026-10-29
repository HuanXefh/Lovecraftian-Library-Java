/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_mainBusInputSite>} INTFBLKMainBusInputSite
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_mainBusInputSite>} INTFBMainBusInputSite
     * @prop {INTFBLKMainBusInputSite} block
     */


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * This block can be input site for main bus stack conveyor.
         * @class INTF_BLK_mainBusInputSite
         */
        new CLS_interface("INTF_BLK_mainBusInputSite", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Whether this block can push items into a main bus. See {@link BLK_stackConveyor#isMainBus}.
                     * @memberof INTF_BLK_mainBusInputSite
                     * @instance
                     * @type {boolean}
                     */
                    isMainBusInputSite: true,


                };
            },


        }),


        /**
         * @class INTF_B_mainBusInputSite
         */
        new CLS_interface("INTF_B_mainBusInputSite", {


            /**
             * @memberof INTF_B_mainBusInputSite
             * @instance
             * @func
             * @param {BStackConveyor} b_t
             * @return {boolean}
             */
            ex_checkMainBusInputValid: function(b_t) {
                return this.block.delegee.isMainBusInputSite;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
