/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_updateOverrider>} INTFBLKOverrider
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_updateOverrider>} INTFBUpdateOverrider
     * @prop {INTFBLKOverrider} block
     */


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Implement this interface to override `updateTile` methods from previous templates.
         * <br> For internal use only.
         * @class INTF_BLK_updateOverrider
         */
        new CLS_interface("INTF_BLK_updateOverrider", {}),


        /**
         * @class INTF_B_updateOverrider
         */
        new CLS_interface("INTF_B_updateOverrider", {


            updateTile: function() {
                // Do nothing
            }
            .setProp({
                override: true,
            }),


        }),


    ];
