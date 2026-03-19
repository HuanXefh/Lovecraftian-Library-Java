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


    /**
     * Vanilla attribute crafter.
     * To be honest I don't like this as a pure factory.
     * @class BLK_attributeFactory
     * @extends BLK_baseFactory
     */
    newClass().extendClass(PARENT[0], "BLK_attributeFactory").initClass()
    .setParent(AttributeCrafter)
    .setTags("blk-fac")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_attributeFactory
     * @extends B_baseFactory
     */
    newClass().extendClass(PARENT[1], "B_attributeFactory").initClass()
    .setParent(AttributeCrafter.AttributeCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
