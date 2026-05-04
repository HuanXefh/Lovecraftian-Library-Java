/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_turbineFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_terrainHandler");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Turbine that is only placeable on certain tiles.
     * @class BLK_terrainTurbine
     * @extends BLK_turbineFactory
     * @extends INTF_BLK_terrainHandler
     */
    newClass().extendClass(PARENT[0], "BLK_terrainTurbine").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags()
    .setParam({})
    .setMethod({}),


    /**
     * @class B_terrainTurbine
     * @extends B_turbineFactory
     * @extends INTF_B_terrainHandler
     */
    newClass().extendClass(PARENT[1], "B_terrainTurbine").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
