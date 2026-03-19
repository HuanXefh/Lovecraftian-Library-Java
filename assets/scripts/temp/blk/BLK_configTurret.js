/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseTurret");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Turrets that target based on their config.
     * @class BLK_configTurret
     * @extends BLK_baseTurret
     */
    newClass().extendClass(PARENT[0], "BLK_configTurret").initClass()
    .setParent(null)
    .setTags("blk-tur")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_configTurret
     * @extends B_baseTurret
     */
    newClass().extendClass(PARENT[1], "B_configTurret").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
