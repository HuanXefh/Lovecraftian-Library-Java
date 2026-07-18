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


      __paramObjSetter__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @override
         * @memberof EXT_BLK_recipeFactory
         * @instance
         */
        skipOutlineSetup: true,
        /**
         * `INTERNAL`
         * @override
         * @memberof EXT_BLK_recipeFactory
         * @instance
         */
        noLoot: true,
        /**
         * `INTERNAL`
         * @override
         * @memberof EXT_BLK_recipeFactory
         * @instance
         */
        noReac: true,
        /**
         * `INTERNAL`
         * @override
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
