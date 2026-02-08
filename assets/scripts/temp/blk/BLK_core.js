/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Your core.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseStorageBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_powerProducer");
  const EFF = require("lovec/glb/GLB_eff");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(TIMER.secHalf) {
      b.powProdEff = Mathf.clamp(1.0 - FRAG_faci._cepFracCur(b.team))
    };
    if(b.powProdEff < 0.0001 && Mathf.chanceDelta(0.04)) {
      EFF.powerSpark.at(b);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(CoreBlock)
    .setTags("blk-core")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(CoreBlock.CoreBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
