/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_configTurret");
  const INTF = require("lovec/temp/intf/INTF_BLK_posConfigBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Turrets that has their target position as config.
     * @class BLK_posConfigTurret
     * @extends BLK_configTurret
     * @extends INTF_BLK_posConfigBlock
     */
    newClass().extendClass(PARENT[0], "BLK_posConfigTurret").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags("blk-tur")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_posConfigTurret
     * @extends B_configTurret
     * @extends INTF_B_posConfigBlock
     */
    newClass().extendClass(PARENT[1], "B_posConfigTurret").implement(INTF[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
