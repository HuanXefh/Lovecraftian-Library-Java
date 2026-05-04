/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_turbineFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_manualTimerBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Turbine that can be charged by clicks.
     * @class BLK_manualTurbine
     * @extends BLK_turbineFactory
     * @extends INTF_BLK_manualTimerBlock
     */
    newClass().extendClass(PARENT[0], "BLK_manualTurbine").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags()
    .setParam({})
    .setMethod({}),


    /**
     * @class B_manualTurbine
     * @extends B_turbineFactory
     * @extends INTF_B_manualTimerBlock
     */
    newClass().extendClass(PARENT[1], "B_manualTurbine").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({}),


  ];
