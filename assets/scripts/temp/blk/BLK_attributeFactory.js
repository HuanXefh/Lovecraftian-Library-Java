/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla attribute crafter.
   * To be honest I don't like this as a pure factory.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_attributeFactory").initClass()
    .setParent(AttributeCrafter)
    .setTags("blk-fac")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1], "BLK_attributeFactory").initClass()
    .setParent(AttributeCrafter.AttributeCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
