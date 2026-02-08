/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Turrets that target based on their config.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(null)
    .setTags("blk-tur")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
