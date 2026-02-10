/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {BLK_recipeFactory} for other mods.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0], "EXT_BLK_recipeFactory").initClass()
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
    newClass().extendClass(PARENT[1], "EXT_BLK_recipeFactory").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
