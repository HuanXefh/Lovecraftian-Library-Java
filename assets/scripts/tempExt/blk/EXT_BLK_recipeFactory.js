/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Variant of {@link BLK_recipeFactory} for other mods.
     * @class EXT_BLK_recipeFactory
     * @extends BLK_recipeFactory
     */
    newClass().extendClass(PARENT[0], "EXT_BLK_recipeFactory").initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({


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


    })
    .setMethod({}),


    /**
     * @class EXT_B_recipeFactory
     * @extends B_recipeFactory
     */
    newClass().extendClass(PARENT[1], "EXT_B_recipeFactory").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
