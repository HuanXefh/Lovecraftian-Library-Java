/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_terrainHandler");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Factories affected by terrain type.
     * Terrain type at a tile is determined by surrounding blocks.
     * See {@link MDL_terrain}.
     * @class BLK_terrainFactory
     * @extends BLK_baseFactory
     * @extends INTF_BLK_terrainHandler
     */
    newClass().extendClass(PARENT[0], "BLK_terrainFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_terrainFactory
     * @extends B_baseFactory
     * @extends INTF_B_terrainHandler
     */
    newClass().extendClass(PARENT[1], "B_terrainFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
