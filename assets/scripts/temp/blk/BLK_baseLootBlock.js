/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_lootHandler");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Base template for all loot-related blocks.
     * @class BLK_baseLootBlock
     * @extends BLK_baseItemBlock
     * @extends INTF_BLK_lootHandler
     */
    newClass().extendClass(PARENT[0], "BLK_baseLootBlock").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags()
    .setParam({})
    .setMethod({}),


    /**
     * @class B_baseLootBlock
     * @extends B_baseItemBlock
     * @extends INTF_B_lootHandler
     */
    newClass().extendClass(PARENT[1], "B_baseLootBlock").implement(INTF[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
