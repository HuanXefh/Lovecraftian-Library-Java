/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_multiBlockLibRecipeFactory");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Variant of {@link BLK_multiBlockLibRecipeFactory} for other mods.
     * You should require MultiBlockLib as a dependency for your mod, or use `runWithDependency` to optionally load related CT files.
     * @class EXT_BLK_multiBlockLibRecipeFactory
     * @extends BLK_multiBlockLibRecipeFactory
     */
    newClass().extendClass(PARENT[0], "EXT_BLK_multiBlockLibRecipeFactory").initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof EXT_BLK_multiBlockLibRecipeFactory
       * @instance
       */
      skipOutlineSetup: true,
      /**
       * <INTERNAL>
       * @memberof EXT_BLK_multiBlockLibRecipeFactory
       * @instance
       */
      noLoot: true,
      /**
       * <INTERNAL>
       * @memberof EXT_BLK_multiBlockLibRecipeFactory
       * @instance
       */
      noReac: true,
      /**
       * <INTERNAL>
       * @memberof EXT_BLK_multiBlockLibRecipeFactory
       * @instance
       */
      skipFacilityMethod: true,


    })
    .setMethod({}),


    /**
     * @class EXT_B_multiBlockLibRecipeFactory
     * @extends B_multiBlockLibRecipeFactory
     */
    newClass().extendClass(PARENT[1], "EXT_B_multiBlockLibRecipeFactory").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
