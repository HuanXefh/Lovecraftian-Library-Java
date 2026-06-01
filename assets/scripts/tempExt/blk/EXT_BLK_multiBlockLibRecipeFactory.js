/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_multiBlockLibRecipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_vanillaLikeBlock");


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
     * @extends INTF_BLK_vanillaLikeBlock
     */
    newClass().extendClass(PARENT[0], "EXT_BLK_multiBlockLibRecipeFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-rc0fac")
    .setParam({})
    .setMethod({}),


    /**
     * @class EXT_B_multiBlockLibRecipeFactory
     * @extends B_multiBlockLibRecipeFactory
     * @extends INTF_B_vanillaLikeBlock
     */
    newClass().extendClass(PARENT[1], "EXT_B_multiBlockLibRecipeFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
