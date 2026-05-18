/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


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


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof EXT_BLK_recipeFactory
         * @instance
         */
        skipOutlineSetup: true,
        /**
         * <INTERNAL>
         * @memberof EXT_BLK_recipeFactory
         * @instance
         */
        noLoot: true,
        /**
         * <INTERNAL>
         * @memberof EXT_BLK_recipeFactory
         * @instance
         */
        noReac: true,
        /**
         * <INTERNAL>
         * @memberof EXT_BLK_recipeFactory
         * @instance
         */
        skipFacilityMethod: true,


      }),


    }),


    /**
     * @class INTF_B_vanillaLikeBlock
     */
    new CLS_interface("INTF_B_vanillaLikeBlock", {}),


  ];
