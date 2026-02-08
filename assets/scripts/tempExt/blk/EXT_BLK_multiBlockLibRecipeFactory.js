/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {BLK_multiBlockLibRecipeFactory} for other mods.
   * You should require MultiBlockLib as a dependency for your mod, or use {runWithDependency} method to optionally load related CT files.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({
      skipOutlineSetup: true,
      noLoot: true,
      noReac: true,
      skipFacilityMethod: true,
    })
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
