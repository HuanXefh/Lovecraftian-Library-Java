/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent of all item distribution blocks.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.transportation;
    blk.priority = TargetPriority.transport;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(null)
    .setTags("blk-dis")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
