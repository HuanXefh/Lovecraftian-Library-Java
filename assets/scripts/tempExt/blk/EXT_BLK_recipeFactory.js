/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_vanillaLikeBlock");


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
     * @extends INTF_BLK_vanillaLikeBlock
     */
    newClass().extendClass(PARENT[0], "EXT_BLK_recipeFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setParam({})
    .setMethod({}),


    /**
     * @class EXT_B_recipeFactory
     * @extends B_recipeFactory
     * @extends INTF_B_vanillaLikeBlock
     */
    newClass().extendClass(PARENT[1], "EXT_B_recipeFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
