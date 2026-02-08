/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A pump that charges when you clicks it.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_liquidPump");
  const INTF = require("lovec/temp/intf/INTF_BLK_manualTimerBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(Pump)
    .setTags("blk-pump")
    .setParam({
      manualTimerCfgTp: "string",
    })
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(Pump.PumpBuild)
    .setParam({})
    .setMethod({}),


  ];
