/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_vanillaLikeBlock>} INTFBLKVanillaLikeBlock
     */


     /**
      * @typedef {TemplateInstance<Building, INTF_B_vanillaLikeBlock>} INTFBVanillaLikeBlock
      * @prop {INTFBLKVanillaLikeBlock} block
      */


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Implement this interface to disable some mechanics used in ProjReind.
         * @class INTF_BLK_vanillaLikeBlock
         */
        new CLS_interface("INTF_BLK_vanillaLikeBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * <br> `REALIZED`
                     * @override
                     * @memberof EXT_BLK_recipeFactory
                     * @instance
                     * @type {boolean}
                     */
                    skipOutlineSetup: true,
                    /**
                     * `INTERNAL`
                     * <br> `REALIZED`
                     * @override
                     * @memberof EXT_BLK_recipeFactory
                     * @instance
                     * @type {boolean}
                     */
                    noLoot: true,
                    /**
                     * `INTERNAL`
                     * <br> `REALIZED`
                     * @override
                     * @memberof EXT_BLK_recipeFactory
                     * @instance
                     * @type {boolean}
                     */
                    noReac: true,
                    /**
                     * `INTERNAL`
                     * @override
                     * @memberof EXT_BLK_recipeFactory
                     * @instance
                     * @type {boolean}
                     */
                    skipFacilityMethod: true,


                };
            },


        }),


        /**
         * @class INTF_B_vanillaLikeBlock
         */
        new CLS_interface("INTF_B_vanillaLikeBlock", {}),


    ];
