/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Parent of all item transportation gates.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.remove(fetchStat("lovec", "blk0itm-unloadable"));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_baseItemGate").initClass()
    .setParent(null)
    .setTags("blk-dis", "blk-gate")
    .setParam({})
    .setMethod({


      setStats: function() {
        comp_setStats(this);
      },


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_baseItemGate").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
