/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Turrets that has their target position as config.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0], "BLK_posConfigTurret").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags("blk-tur")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1], "BLK_posConfigTurret").implement(INTF[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
